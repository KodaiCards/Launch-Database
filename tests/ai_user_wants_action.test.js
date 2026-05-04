// Unit tests for the userWantsAction classifier in routes/ai.js.
//
// This is the function that decides whether to send tool_choice='any'
// (forcing Claude to actually call a tool) vs 'auto' (model's choice).
// It's the root-cause fix for the "AI says it's about to do something
// and never does" bug — if this misclassifies, the bug comes back.
//
// Pure function, no DB or Anthropic SDK calls — tests run instantly.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { userWantsAction } = require('../routes/ai');

test('userWantsAction is exported', () => {
  assert.equal(typeof userWantsAction, 'function');
});

test('returns false for empty / null / non-array input', () => {
  assert.equal(userWantsAction([]), false);
  assert.equal(userWantsAction(null), false);
  assert.equal(userWantsAction(undefined), false);
});

test('returns false when the last message is from the assistant', () => {
  // Even if the assistant claims to take action, we can't force a tool
  // on the next call — we only key off user intent.
  assert.equal(userWantsAction([{ role: 'assistant', content: 'I created the project' }]), false);
});

test('returns false for chitchat / questions with no action verb', () => {
  assert.equal(userWantsAction([{ role: 'user', content: 'how is the weather' }]), false);
  assert.equal(userWantsAction([{ role: 'user', content: 'what time is it?' }]), false);
  assert.equal(userWantsAction([{ role: 'user', content: 'how are you' }]), false);
  assert.equal(userWantsAction([{ role: 'user', content: 'thanks' }]), false);
});

test('matches confirmation phrases anchored to start', () => {
  // These are the phrases users type when confirming a previously-
  // proposed action. The model promised to do something; the user
  // says "go ahead"; we force a tool call.
  for (const phrase of ['yes', 'yeah', 'yep', 'yup', 'ok', 'okay', 'sure',
    'do it', 'go ahead', 'proceed', 'confirmed', 'approve', 'approved',
    'please do', "let's do it", 'y']) {
    assert.equal(
      userWantsAction([{ role: 'user', content: phrase }]),
      true,
      `expected confirmation phrase "${phrase}" to match`
    );
  }
});

test('does NOT match confirmation words mid-sentence', () => {
  // "I yes prefer that" should NOT match — the regex is anchored.
  assert.equal(userWantsAction([{ role: 'user', content: 'I yes prefer that approach' }]), false);
  assert.equal(userWantsAction([{ role: 'user', content: 'maybe ok later' }]), false);
});

test('matches action verbs anywhere in the message', () => {
  for (const phrase of [
    'create a project Foo',
    'please update the WO# to 1234',
    'log 8 hours for Jane today',
    'delete that contract',
    'add a new client called COX',
    'mark the project completed',
    'advance to the next stage',
    'import the timecards',
    'remove the duplicate',
  ]) {
    assert.equal(
      userWantsAction([{ role: 'user', content: phrase }]),
      true,
      `expected action verb in "${phrase}" to match`
    );
  }
});

test('handles array-form content (text + image blocks)', () => {
  // Anthropic API accepts content as an array of blocks. We pull text
  // from the first text block.
  assert.equal(
    userWantsAction([{ role: 'user', content: [{ type: 'text', text: 'create a client for me' }] }]),
    true
  );
  assert.equal(
    userWantsAction([{ role: 'user', content: [{ type: 'text', text: 'how does this work' }] }]),
    false
  );
});

test('uses the LAST user message, not the first', () => {
  // Multi-turn conversation: only the most recent user message matters.
  const messages = [
    { role: 'user', content: 'how does billing work?' },
    { role: 'assistant', content: 'It works like X.' },
    { role: 'user', content: 'create a project for me' },
  ];
  assert.equal(userWantsAction(messages), true);
});

test('returns false when last message is empty / whitespace-only', () => {
  assert.equal(userWantsAction([{ role: 'user', content: '' }]), false);
  assert.equal(userWantsAction([{ role: 'user', content: '   ' }]), false);
});
