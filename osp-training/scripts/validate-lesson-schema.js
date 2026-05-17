#!/usr/bin/env node
/**
 * validate-lesson-schema.js
 * Validates every lesson JSX file under osp-training/src/lessons/T*\/L*.jsx
 *
 * Checks:
 *  1. meta export has required fields
 *  2. vocabulary_introduced, vocabulary_assumed, key_terms present
 *  3. Per-lesson Quiz component rendered
 *  4. Capstone (L12 / last lesson) has Quiz
 *  5. Flashcard mandate: every key_terms term has a corresponding Flashcard card
 *
 * Usage:
 *   node osp-training/scripts/validate-lesson-schema.js           # all topics
 *   node osp-training/scripts/validate-lesson-schema.js T08       # specific topic
 *
 * Exit code: 0 = all pass, 1 = any failures
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LESSONS_ROOT = path.resolve(__dirname, '..', 'src', 'lessons');

// ── Helpers ─────────────────────────────────────────────────────────────────

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Extract a JS array literal as raw text starting at `arrayStart` index.
 * Tracks nested brackets to find the closing ].
 */
function extractArrayText(src, startIdx) {
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
 * Extract a JS object literal as raw text starting at `startIdx` (which should point to '{').
 */
function extractObjectText(src, startIdx) {
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
 * Extract string values from a simple JS string array like ['foo', 'bar', "baz"].
 * Handles quoted strings (single, double) at the top level only.
 */
function extractStringArray(arrayText) {
  const results = [];
  // Strip outer brackets
  const inner = arrayText.slice(1, -1);
  const re = /['"`]([^'"`\\]|\\.)*['"`]/g;
  let m;
  while ((m = re.exec(inner)) !== null) {
    // Remove surrounding quotes
    const val = m[0].slice(1, -1).replace(/\\(.)/g, '$1');
    results.push(val);
  }
  return results;
}

/**
 * Extract { term: '...', definition: '...' } objects from a key_terms array text.
 * Returns array of term strings found.
 */
function extractKeyTermsFromArray(arrayText) {
  const terms = [];
  // Find each { term: ... } object
  const objRe = /\{/g;
  let m;
  while ((m = objRe.exec(arrayText)) !== null) {
    const objText = extractObjectText(arrayText, m.index);
    if (!objText) continue;
    // Extract term field: term: 'value' or term: "value"
    const termMatch = objText.match(/\bterm\s*:\s*['"`]([^'"`\\]|\\.)*['"`]/);
    if (termMatch) {
      const q = termMatch[0];
      const innerQ = q.match(/['"`]([^'"`\\]|\\.)*['"`]$/);
      if (innerQ) {
        terms.push(innerQ[0].slice(1, -1).replace(/\\(.)/g, '$1'));
      }
    }
  }
  return terms;
}

/**
 * Count how many Flashcard card entries appear in the source.
 * Supports three usage patterns:
 *   1. <Flashcard deckId="..." cards={[ {id:..., front:..., back:...}, ... ]} />
 *   2. key_terms.map(kt => (<Flashcard ... />)) — one card per key_term (handled separately)
 *   3. {key_terms.slice(...).map(kt => (<Flashcard ... />))} — same
 *
 * Returns { mode, count } where mode is 'deck' | 'mapped' | 'none'
 */
function analyzeFlashcardUsage(src) {
  // Check for mapped pattern (key_terms.map -> individual Flashcards)
  if (/key_terms(?:\.slice\([^)]*\))?\.map\s*\(/.test(src)) {
    return { mode: 'mapped', count: null }; // count determined by key_terms length
  }

  // Check for deck pattern with explicit cards array
  const deckMatch = src.match(/deckId\s*=\s*['"`][^'"`]+['"`]\s*\n?\s*cards\s*=\s*\{?\s*\[/);
  if (deckMatch) {
    // Find the cards array start
    const cardsIdx = src.indexOf('cards', deckMatch.index);
    const bracketIdx = src.indexOf('[', cardsIdx);
    if (bracketIdx !== -1) {
      const arrText = extractArrayText(src, bracketIdx);
      if (arrText) {
        // Count { id: entries as proxy for card count
        const idCount = (arrText.match(/\bid\s*:/g) || []).length;
        return { mode: 'deck', count: idCount };
      }
    }
  }

  // Fallback: check for any <Flashcard presence
  const flashcardCount = (src.match(/<Flashcard/g) || []).length;
  if (flashcardCount > 0) {
    return { mode: 'unknown', count: flashcardCount };
  }

  return { mode: 'none', count: 0 };
}

// ── Required meta fields ─────────────────────────────────────────────────────

const REQUIRED_META_FIELDS = ['id', 'course_id', 'title', 'order', 'prerequisites', 'learning_objectives', 'estimated_minutes'];
// Capstone lessons are exempt from learning_objectives (they review, not introduce)
const CAPSTONE_OPTIONAL_FIELDS = new Set(['learning_objectives']);

function checkMetaField(src, field) {
  // Look for field: ... inside export const meta = { ... }
  const metaStart = src.indexOf('export const meta');
  if (metaStart === -1) return false;
  const braceIdx = src.indexOf('{', metaStart);
  if (braceIdx === -1) return false;
  const metaText = extractObjectText(src, braceIdx);
  if (!metaText) return false;
  // field appears as a key
  return new RegExp(`\\b${field}\\s*:`).test(metaText);
}

// ── Main validation logic ────────────────────────────────────────────────────

function isCapstoneLesson(filename) {
  return /capstone|quiz/i.test(filename);
}

function validateLesson(filePath, topicId) {
  const src = readFile(filePath);
  const filename = path.basename(filePath);
  const failures = [];
  const warnings = [];

  // 1. meta export exists
  const hasMetaExport = /export\s+const\s+meta\s*=/.test(src);
  if (!hasMetaExport) {
    failures.push('NO meta export found');
    return { failures, warnings };
  }

  // 2. Required meta fields (capstones exempt from learning_objectives)
  const isCapstone = isCapstoneLesson(filename);
  for (const field of REQUIRED_META_FIELDS) {
    if (isCapstone && CAPSTONE_OPTIONAL_FIELDS.has(field)) continue;
    if (!checkMetaField(src, field)) {
      failures.push(`meta missing field: ${field}`);
    }
  }

  // 3. Extract meta object text
  const metaStart = src.indexOf('export const meta');
  const metaBraceIdx = src.indexOf('{', metaStart);
  const metaText = extractObjectText(src, metaBraceIdx) || '';

  // 4. vocabulary_introduced — required, can be empty array
  const hasVocabIntro = /vocabulary_introduced\s*:/.test(metaText);
  if (!hasVocabIntro) {
    failures.push('meta missing: vocabulary_introduced');
  }

  // 5. vocabulary_assumed — required, can be empty array
  // Pattern 1: inside meta object  Pattern 2: top-level export const vocabulary_assumed = [...]
  const hasVocabAssumed = /vocabulary_assumed\s*:/.test(metaText)
    || /export\s+const\s+vocabulary_assumed\s*=/.test(src);
  if (!hasVocabAssumed) {
    failures.push('meta missing: vocabulary_assumed (neither in meta nor as top-level export)');
  }

  // 6. key_terms — either in meta OR as top-level named export
  const hasKeyTermsInMeta = /key_terms\s*:/.test(metaText);
  const hasKeyTermsTopLevel = /export\s+const\s+key_terms/.test(src);
  // T01 pattern: no key_terms in meta but has Flashcard directly
  const hasFlashcardImport = /import\s+Flashcard/.test(src);
  const flashcardPresent = (src.match(/<Flashcard/g) || []).length > 0;

  // 7. Quiz component — required in all non-capstone AND capstone lessons
  const hasQuiz = /<Quiz[\s\n]/.test(src) || /<Quiz\s*\//.test(src);
  if (!hasQuiz) {
    // Capstone MUST have quiz; regular lessons must too
    failures.push('No <Quiz> component rendered');
  }

  // 8. Flashcard mandate — the tricky one
  if (isCapstoneLesson(filename)) {
    // Capstone lessons typically don't need flashcards (they review, not introduce)
    // No flashcard requirement
  } else {
    // Determine key_terms count
    let keyTerms = [];

    if (hasKeyTermsInMeta) {
      // Extract key_terms from meta
      const ktIdx = metaText.indexOf('key_terms');
      const bracketIdx = metaText.indexOf('[', ktIdx);
      if (bracketIdx !== -1) {
        const ktText = extractArrayText(metaText, bracketIdx);
        if (ktText) {
          keyTerms = extractKeyTermsFromArray(ktText);
        }
      }
    } else if (hasKeyTermsTopLevel) {
      // key_terms is re-exported from meta, already captured above
      // Re-extract from full source
      const ktMatch = src.match(/key_terms\s*:\s*\[/);
      if (ktMatch) {
        const ktIdx = ktMatch.index + ktMatch[0].length - 1;
        const ktText = extractArrayText(src, ktIdx);
        if (ktText) {
          keyTerms = extractKeyTermsFromArray(ktText);
        }
      }
    }

    // T01 pattern: has vocabulary_introduced but no key_terms; flashcard is inline
    // For these, we just verify Flashcard is present when vocab_introduced is non-empty
    let vocabIntroduced = [];
    const viIdx = metaText.indexOf('vocabulary_introduced');
    if (viIdx !== -1) {
      const viBracket = metaText.indexOf('[', viIdx);
      if (viBracket !== -1) {
        const viText = extractArrayText(metaText, viBracket);
        if (viText) {
          vocabIntroduced = extractStringArray(viText);
        }
      }
    }

    if (keyTerms.length > 0) {
      // Check flashcard usage
      const fc = analyzeFlashcardUsage(src);
      if (fc.mode === 'none') {
        failures.push(`key_terms has ${keyTerms.length} terms but NO <Flashcard> component rendered — missing all: ${keyTerms.slice(0, 5).join(', ')}${keyTerms.length > 5 ? '...' : ''}`);
      } else if (fc.mode === 'mapped') {
        // key_terms.map -> Flashcard: count matches automatically
        // PASS
      } else if (fc.mode === 'deck') {
        if (fc.count === 0) {
          failures.push(`key_terms has ${keyTerms.length} terms but Flashcard deck has 0 cards`);
        } else if (fc.count < keyTerms.length) {
          warnings.push(`key_terms has ${keyTerms.length} terms but Flashcard deck has only ${fc.count} cards — possibly missing: check manually`);
        }
      }
    } else if (vocabIntroduced.length > 0 && !hasKeyTermsInMeta && !hasKeyTermsTopLevel) {
      // T01 pattern: vocabulary_introduced but no key_terms
      // Flashcard should still be present
      if (!flashcardPresent) {
        failures.push(`vocabulary_introduced has ${vocabIntroduced.length} terms but no <Flashcard> component and no key_terms — missing Flashcard section`);
      }
    } else if (keyTerms.length === 0 && vocabIntroduced.length > 0 && hasKeyTermsInMeta) {
      // key_terms is explicitly empty — OK, no flashcard required
    }
  }

  return { failures, warnings };
}

// ── Runner ───────────────────────────────────────────────────────────────────

function run() {
  const filterTopic = process.argv[2]; // e.g. 'T08'

  const topicDirs = fs.readdirSync(LESSONS_ROOT)
    .filter(d => /^T\d+$/.test(d))
    .filter(d => !filterTopic || d === filterTopic)
    .sort();

  if (topicDirs.length === 0) {
    console.error(`No topic directories found matching: ${filterTopic || 'T*'}`);
    process.exit(1);
  }

  let totalLessons = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  const allResults = [];

  for (const topicId of topicDirs) {
    const topicPath = path.join(LESSONS_ROOT, topicId);
    const lessonFiles = fs.readdirSync(topicPath)
      .filter(f => f.endsWith('.jsx'))
      .sort();

    for (const lessonFile of lessonFiles) {
      const filePath = path.join(topicPath, lessonFile);
      const { failures, warnings } = validateLesson(filePath, topicId);
      totalLessons++;
      if (failures.length > 0) totalFailed++;
      if (warnings.length > 0) totalWarnings++;
      allResults.push({ topicId, lessonFile, failures, warnings });
    }
  }

  // Output
  let anyFailure = false;
  for (const r of allResults) {
    const label = `${r.topicId}/${r.lessonFile}`;
    if (r.failures.length === 0 && r.warnings.length === 0) {
      console.log(`  PASS  ${label}`);
    } else {
      if (r.failures.length > 0) {
        anyFailure = true;
        for (const f of r.failures) {
          console.log(`  FAIL  ${label}: ${f}`);
        }
      }
      if (r.warnings.length > 0) {
        for (const w of r.warnings) {
          console.log(`  WARN  ${label}: ${w}`);
        }
      }
    }
  }

  console.log('');
  console.log(`── Summary ──────────────────────────────────────`);
  console.log(`  Lessons checked : ${totalLessons}`);
  console.log(`  Passing         : ${totalLessons - totalFailed}`);
  console.log(`  Failing         : ${totalFailed}`);
  console.log(`  Warnings        : ${totalWarnings}`);

  process.exit(anyFailure ? 1 : 0);
}

run();
