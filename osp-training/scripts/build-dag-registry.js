#!/usr/bin/env node
/**
 * build-dag-registry.js
 * Walks all lessons under osp-training/src/lessons/T*\/L*.jsx.
 * Extracts vocabulary_introduced and vocabulary_assumed arrays.
 * Cross-checks every vocabulary_assumed entry against vocabulary_introduced.
 * Writes audit-output/dag-registry.json.
 *
 * Usage:
 *   node osp-training/scripts/build-dag-registry.js
 *   node osp-training/scripts/build-dag-registry.js --topic T04   # single topic
 *
 * Output JSON shape:
 * {
 *   "generated_at": "ISO timestamp",
 *   "lesson_count": N,
 *   "vocabulary_introduced_by_lesson": {
 *     "T01.L02": ["sag", "span", ...], ...
 *   },
 *   "all_vocabulary_introduced": {
 *     "sag": ["T01.L02"],           // which lesson(s) first introduce it
 *     "span": ["T01.L02"], ...
 *   },
 *   "duplicate_introductions": [
 *     { "term": "conduit", "introduced_by": ["T01.L02", "T05.L04"] }, ...
 *   ],
 *   "vocabulary_assumed_pointers": [
 *     {
 *       "from_lesson": "T07.L02",
 *       "term": "contour",
 *       "claimed_source": "T04.L03",
 *       "verified": false,
 *       "reason": "T04.L03 does not introduce 'contour'"
 *     }, ...
 *   ],
 *   "verified_pointers_count": N,
 *   "broken_pointers_count": M,
 *   "missing_source_lesson_pointers": [
 *     { "from_lesson": "T07.L02", "term": "foo", "claimed_source": "T01.L99",
 *       "reason": "Source lesson T01.L99 not found in curriculum" }
 *   ],
 *   "lessons_with_no_vocabulary_assumed": ["T02.L01", ...],
 *   "vocabulary_assumed_without_source_id": [
 *     { "from_lesson": "...", "term": "..." }
 *   ]
 * }
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LESSONS_ROOT = path.resolve(__dirname, '..', 'src', 'lessons');
const OUTPUT_PATH = path.resolve(__dirname, '..', '..', 'audit-output', 'dag-registry.json');

// ── Extraction helpers ────────────────────────────────────────────────────────

/**
 * Extract a JS array literal starting at index `startIdx` in `src`.
 * Handles nested brackets, strings (including template literals), and escaped chars.
 */
function extractArrayText(src, startIdx) {
  if (src[startIdx] !== '[') return null;
  let depth = 0;
  let inStr = false;
  let strChar = '';
  let escaped = false;
  for (let i = startIdx; i < src.length; i++) {
    const c = src[i];
    if (escaped) { escaped = false; continue; }
    if (c === '\\') { escaped = true; continue; }
    if (inStr) { if (c === strChar) inStr = false; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; strChar = c; continue; }
    if (c === '[') depth++;
    if (c === ']') { depth--; if (depth === 0) return src.slice(startIdx, i + 1); }
  }
  return null;
}

/**
 * Extract a JS object starting at index `startIdx`.
 */
function extractObjectText(src, startIdx) {
  if (src[startIdx] !== '{') return null;
  let depth = 0;
  let inStr = false;
  let strChar = '';
  let escaped = false;
  for (let i = startIdx; i < src.length; i++) {
    const c = src[i];
    if (escaped) { escaped = false; continue; }
    if (c === '\\') { escaped = true; continue; }
    if (inStr) { if (c === strChar) inStr = false; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; strChar = c; continue; }
    if (c === '{') depth++;
    if (c === '}') { depth--; if (depth === 0) return src.slice(startIdx, i + 1); }
  }
  return null;
}

/**
 * Extract string values from a top-level string array ['foo', 'bar', 'baz'].
 */
function extractStringArray(arrayText) {
  const results = [];
  const inner = arrayText.slice(1, -1);
  const re = /(['"`])([^'"`\\]|\\.)*\1/g;
  let m;
  while ((m = re.exec(inner)) !== null) {
    const val = m[0].slice(1, -1).replace(/\\(.)/g, '$1');
    if (val.trim()) results.push(val);
  }
  return results;
}

/**
 * Extract term strings from vocabulary_assumed: [ { term: '...', source_lesson_id: '...' }, ... ]
 * Returns array of { term, source_lesson_id } objects.
 */
function extractVocabAssumed(arrayText) {
  const results = [];
  const objRe = /\{/g;
  let m;
  while ((m = objRe.exec(arrayText)) !== null) {
    const objText = extractObjectText(arrayText, m.index);
    if (!objText) continue;
    // Skip nested objects by checking depth
    const termMatch = objText.match(/\bterm\s*:\s*(['"`])([^'"`\\]|\\.)*\1/);
    const srcMatch = objText.match(/\bsource_lesson_id\s*:\s*(['"`])([^'"`\\]|\\.)*\1/);
    if (termMatch) {
      const term = termMatch[0].match(/(['"`])([^'"`\\]|\\.)*\1$/)[0].slice(1, -1).replace(/\\(.)/g, '$1');
      const src = srcMatch ? srcMatch[0].match(/(['"`])([^'"`\\]|\\.)*\1$/)[0].slice(1, -1).replace(/\\(.)/g, '$1') : null;
      results.push({ term, source_lesson_id: src });
    }
  }
  return results;
}

/**
 * Parse a single lesson file. Returns:
 * { lessonId, vocabIntroduced: string[], vocabAssumed: [{term, source_lesson_id}][] }
 */
function parseLesson(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');

  // 1. Extract lesson ID from meta
  const idMatch = src.match(/\bid\s*:\s*['"`]([^'"`]+)['"`]/);
  const lessonId = idMatch ? idMatch[1] : null;

  // 2. Extract vocabulary_introduced
  // Could be in meta OR as top-level export
  let vocabIntroduced = [];

  // Try meta first
  const metaStart = src.indexOf('export const meta');
  if (metaStart !== -1) {
    const metaBrace = src.indexOf('{', metaStart);
    if (metaBrace !== -1) {
      const metaText = extractObjectText(src, metaBrace);
      if (metaText) {
        const viIdx = metaText.indexOf('vocabulary_introduced');
        if (viIdx !== -1) {
          const bracket = metaText.indexOf('[', viIdx);
          if (bracket !== -1) {
            const arrText = extractArrayText(metaText, bracket);
            if (arrText) {
              // vocabulary_introduced is always a string array
              vocabIntroduced = extractStringArray(arrText);
            }
          }
        }
      }
    }
  }

  // Fallback: top-level export const vocabulary_introduced = [...]
  if (vocabIntroduced.length === 0) {
    const tlMatch = src.match(/export\s+const\s+vocabulary_introduced\s*=\s*\[/);
    if (tlMatch) {
      const bracket = src.indexOf('[', tlMatch.index);
      const arrText = extractArrayText(src, bracket);
      if (arrText) {
        vocabIntroduced = extractStringArray(arrText);
      }
    }
  }

  // 3. Extract vocabulary_assumed
  let vocabAssumed = [];

  // Try meta first
  if (metaStart !== -1) {
    const metaBrace = src.indexOf('{', metaStart);
    if (metaBrace !== -1) {
      const metaText = extractObjectText(src, metaBrace);
      if (metaText) {
        const vaIdx = metaText.indexOf('vocabulary_assumed');
        if (vaIdx !== -1) {
          const bracket = metaText.indexOf('[', vaIdx);
          if (bracket !== -1) {
            const arrText = extractArrayText(metaText, bracket);
            if (arrText) {
              vocabAssumed = extractVocabAssumed(arrText);
            }
          }
        }
      }
    }
  }

  // Fallback: top-level export const vocabulary_assumed = [...]
  if (vocabAssumed.length === 0) {
    const tlMatch = src.match(/export\s+const\s+vocabulary_assumed\s*=\s*\[/);
    if (tlMatch) {
      const bracket = src.indexOf('[', tlMatch.index);
      const arrText = extractArrayText(src, bracket);
      if (arrText) {
        vocabAssumed = extractVocabAssumed(arrText);
      }
    }
  }

  return { lessonId, vocabIntroduced, vocabAssumed };
}

// ── Main ─────────────────────────────────────────────────────────────────────

function run() {
  const args = process.argv.slice(2);
  const topicFilter = args.includes('--topic') ? args[args.indexOf('--topic') + 1] : null;

  const topicDirs = fs.readdirSync(LESSONS_ROOT)
    .filter(d => /^T\d+$/.test(d))
    .filter(d => !topicFilter || d === topicFilter)
    .sort();

  // Phase 1: collect all lesson data
  const lessons = []; // { lessonId, topicId, filePath, vocabIntroduced, vocabAssumed }

  for (const topicId of topicDirs) {
    const topicPath = path.join(LESSONS_ROOT, topicId);
    const lessonFiles = fs.readdirSync(topicPath)
      .filter(f => f.endsWith('.jsx'))
      .sort();

    for (const lessonFile of lessonFiles) {
      const filePath = path.join(topicPath, lessonFile);
      const parsed = parseLesson(filePath);
      if (parsed.lessonId) {
        lessons.push({
          lessonId: parsed.lessonId,
          topicId,
          filePath,
          vocabIntroduced: parsed.vocabIntroduced,
          vocabAssumed: parsed.vocabAssumed,
        });
      }
    }
  }

  // Phase 2: build introduced-by map
  const vocabIntroducedByLesson = {}; // lessonId -> string[]
  const allVocabIntroduced = {};       // term -> [lessonId, ...]
  const duplicateIntroductions = [];

  for (const lesson of lessons) {
    vocabIntroducedByLesson[lesson.lessonId] = lesson.vocabIntroduced;
    for (const term of lesson.vocabIntroduced) {
      const normalized = term.toLowerCase().trim();
      if (!allVocabIntroduced[normalized]) {
        allVocabIntroduced[normalized] = [];
      }
      allVocabIntroduced[normalized].push(lesson.lessonId);
    }
  }

  for (const [term, introducers] of Object.entries(allVocabIntroduced)) {
    if (introducers.length > 1) {
      duplicateIntroductions.push({ term, introduced_by: introducers });
    }
  }

  // Build a set of all known lesson IDs
  const allLessonIds = new Set(lessons.map(l => l.lessonId));

  // Phase 3: cross-check vocabulary_assumed pointers
  const vocabAssumedPointers = [];
  let verifiedCount = 0;
  let brokenCount = 0;
  const missingSourceLessonPointers = [];
  const lessonsWithNoVocabAssumed = [];
  const vocabAssumedWithoutSourceId = [];

  for (const lesson of lessons) {
    if (lesson.vocabAssumed.length === 0) {
      lessonsWithNoVocabAssumed.push(lesson.lessonId);
    }

    for (const { term, source_lesson_id } of lesson.vocabAssumed) {
      if (!source_lesson_id) {
        vocabAssumedWithoutSourceId.push({ from_lesson: lesson.lessonId, term });
        continue;
      }

      // Check if source lesson exists
      if (!allLessonIds.has(source_lesson_id)) {
        missingSourceLessonPointers.push({
          from_lesson: lesson.lessonId,
          term,
          claimed_source: source_lesson_id,
          reason: `Source lesson ${source_lesson_id} not found in curriculum`,
        });
        brokenCount++;
        continue;
      }

      // Check if the source lesson actually introduces this term
      const sourceLesson = lessons.find(l => l.lessonId === source_lesson_id);
      const normalizedTerm = term.toLowerCase().trim();
      const sourceIntroduced = (sourceLesson?.vocabIntroduced || []).map(t => t.toLowerCase().trim());
      const verified = sourceIntroduced.includes(normalizedTerm);

      const entry = {
        from_lesson: lesson.lessonId,
        term,
        claimed_source: source_lesson_id,
        verified,
      };

      if (!verified) {
        // Check if any other lesson introduces this term
        const actualIntroducers = allVocabIntroduced[normalizedTerm] || [];
        entry.reason = actualIntroducers.length > 0
          ? `'${term}' is introduced by ${actualIntroducers.join(', ')}, not ${source_lesson_id}`
          : `'${term}' is not introduced by any lesson in the curriculum`;
        brokenCount++;
      } else {
        verifiedCount++;
      }

      vocabAssumedPointers.push(entry);
    }
  }

  // Phase 4: build output
  const registry = {
    generated_at: new Date().toISOString(),
    lesson_count: lessons.length,
    vocabulary_introduced_by_lesson: vocabIntroducedByLesson,
    all_vocabulary_introduced: allVocabIntroduced,
    duplicate_introductions: duplicateIntroductions,
    vocabulary_assumed_pointers: vocabAssumedPointers,
    verified_pointers_count: verifiedCount,
    broken_pointers_count: brokenCount,
    missing_source_lesson_pointers: missingSourceLessonPointers,
    lessons_with_no_vocabulary_assumed: lessonsWithNoVocabAssumed,
    vocabulary_assumed_without_source_id: vocabAssumedWithoutSourceId,
  };

  // Write output
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(registry, null, 2), 'utf8');

  // Console summary
  console.log(`DAG Registry built: ${OUTPUT_PATH}`);
  console.log(`  Lessons processed     : ${lessons.length}`);
  console.log(`  Unique terms introduced: ${Object.keys(allVocabIntroduced).length}`);
  console.log(`  Duplicate introductions: ${duplicateIntroductions.length}`);
  console.log(`  Assumed pointers total : ${vocabAssumedPointers.length}`);
  console.log(`  Verified pointers      : ${verifiedCount}`);
  console.log(`  Broken pointers        : ${brokenCount}`);
  console.log(`  Missing source lessons : ${missingSourceLessonPointers.length}`);
  console.log(`  Without source_lesson_id: ${vocabAssumedWithoutSourceId.length}`);

  if (brokenCount > 0) {
    console.log('\n── Broken DAG Pointers ─────────────────────────────────────────');
    for (const p of vocabAssumedPointers.filter(p => !p.verified)) {
      console.log(`  BROKEN  ${p.from_lesson} → "${p.term}" (claimed: ${p.claimed_source})`);
      if (p.reason) console.log(`          ${p.reason}`);
    }
  }

  if (missingSourceLessonPointers.length > 0) {
    console.log('\n── Missing Source Lessons ──────────────────────────────────────');
    for (const p of missingSourceLessonPointers) {
      console.log(`  MISSING ${p.from_lesson} → "${p.term}" claims source ${p.claimed_source} — NOT FOUND`);
    }
  }

  if (duplicateIntroductions.length > 0) {
    console.log('\n── Duplicate Introductions ────────────────────────────────────');
    for (const d of duplicateIntroductions) {
      console.log(`  DUPE  "${d.term}" introduced by: ${d.introduced_by.join(', ')}`);
    }
  }

  process.exit(brokenCount > 0 || missingSourceLessonPointers.length > 0 ? 1 : 0);
}

run();
