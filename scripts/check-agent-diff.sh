#!/bin/bash
# check-agent-diff — scope-validate an agent branch before merging
# Usage: scripts/check-agent-diff.sh agent/<branch-name> [allowed-path-patterns...]
# Returns 0 if all changed files match allowed patterns; 1 if violations found.

BRANCH="${1:?Usage: $0 agent/<branch-name> [allowed-patterns...]}"
shift
ALLOWED=("$@")

if ! git rev-parse --verify "origin/$BRANCH" >/dev/null 2>&1 && ! git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
    echo "ERROR: Branch $BRANCH not found"; exit 1
fi

REF="origin/$BRANCH"
git rev-parse --verify "$REF" >/dev/null 2>&1 || REF="$BRANCH"

echo "=== Agent branch: $BRANCH ==="
echo
echo "Commits (vs main):"
git log --oneline "origin/main..$REF" | head -20
echo
echo "Files changed:"
CHANGED=$(git diff --name-only "origin/main..$REF")
echo "$CHANGED"
echo
echo "Diff stat:"
git diff --stat "origin/main..$REF"
echo

# Orchestrator-reserved files — never allowed from agents
RESERVED=("CLAUDE.md" "RESUME_HERE.md" ".git/hooks/" "~/.claude/")
VIOLATIONS=()

for f in $CHANGED; do
    # Check reserved files
    for r in "${RESERVED[@]}"; do
        if [[ "$f" == "$r"* ]] || [[ "$f" == "$r" ]]; then
            VIOLATIONS+=("RESERVED: $f")
        fi
    done
    # Check against allowed patterns if provided
    if [ ${#ALLOWED[@]} -gt 0 ]; then
        MATCH=false
        for p in "${ALLOWED[@]}"; do
            if [[ "$f" == $p* ]] || [[ "$f" == $p ]]; then MATCH=true; break; fi
        done
        if [ "$MATCH" = false ]; then
            # Check if it's in a reserved list already
            ALREADY=false
            for v in "${VIOLATIONS[@]}"; do
                if [[ "$v" == *"$f"* ]]; then ALREADY=true; break; fi
            done
            [ "$ALREADY" = false ] && VIOLATIONS+=("OUT-OF-SCOPE: $f")
        fi
    fi
done

# Check commit messages for orchestrator: prefix (impersonation)
ORCH_PREFIX=$(git log "origin/main..$REF" --format=%s | grep -i "^orchestrator:" | head -5)
if [ -n "$ORCH_PREFIX" ]; then
    VIOLATIONS+=("ORCHESTRATOR-IMPERSONATION: agent commit uses 'orchestrator:' prefix")
fi

# Check for CLAUDE.md edits in commits
CLAUDE_EDITS=$(git log "origin/main..$REF" --name-only --format= | grep -c "CLAUDE.md\|RESUME_HERE.md")
if [ "$CLAUDE_EDITS" -gt 0 ]; then
    VIOLATIONS+=("CLAUDE.MD-EDIT: agent touched orchestrator-reserved file ($CLAUDE_EDITS times)")
fi

if [ ${#VIOLATIONS[@]} -gt 0 ]; then
    echo "=== VIOLATIONS ==="
    for v in "${VIOLATIONS[@]}"; do echo "  ✗ $v"; done
    echo
    echo "VERDICT: BLOCK — do NOT merge"
    exit 1
fi

echo "=== CLEAN ==="
echo "VERDICT: SAFE — review diff content + merge with: git checkout main && git merge --ff-only $REF"
exit 0
