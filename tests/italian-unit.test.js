const it = require('../packages/it/index.js');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (e) {
    console.log(`✗ ${name}: ${e.message}`);
    process.exitCode = 1;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

console.log('Running Italian module tests...\n');

test('A1 generates questions', () => {
  const q = it.generateQuestion('A1');
  assert(q, 'A1 returned null');
  assert(q.category, 'Missing category');
  assert(q.syntaxBlocks, 'Missing syntaxBlocks');
  assert(q.replies, 'Missing replies');
});

test('A2 generates questions', () => {
  const q = it.generateQuestion('A2');
  assert(q, 'A2 returned null');
  assert(q.category.l1 === 'Morfologia' || q.category.l1 === 'Sintassi', 'Invalid l1');
});

test('B1 generates questions', () => {
  const q = it.generateQuestion('B1');
  assert(q, 'B1 returned null');
  assert(q.replies.length >= 1, 'Should have at least 1 reply');
});

test('C1 generates questions', () => {
  const q = it.generateQuestion('C1');
  assert(q, 'C1 returned null');
});

test('Question has valid category structure', () => {
  const q = it.generateQuestion('A1');
  assert(typeof q.category.l1 === 'string', 'l1 not string');
  assert(typeof q.category.l2 === 'string', 'l2 not string');
  assert(typeof q.category.l3 === 'string', 'l3 not string');
});

test('Syntax blocks have required fields', () => {
  const q = it.generateQuestion('A1');
  q.syntaxBlocks.forEach(block => {
    assert(typeof block.text === 'string', 'text not string');
    assert(typeof block.role === 'string', 'role not string');
  });
});

test('Replies have correct structure', () => {
  const q = it.generateQuestion('A1');
  q.replies.forEach(reply => {
    assert(Array.isArray(reply.choices), 'choices not array');
    assert(typeof reply.correctIndex === 'number', 'correctIndex not number');
    assert(typeof reply.explanation === 'string', 'explanation not string');
    assert(reply.choices.length >= 2, 'need at least 2 choices');
    assert(reply.correctIndex >= 0 && reply.correctIndex < reply.choices.length, 'invalid correctIndex');
  });
});

test('Multiple generates return different results', () => {
  const results = new Set();
  for (let i = 0; i < 10; i++) {
    const q = it.generateQuestion('A1');
    results.add(q.syntaxBlocks.map(b => b.text).join('|'));
  }
  assert(results.size > 1, 'Generator not producing variety');
});

test('B2 multi-reply questions', () => {
  const q = it.generateQuestion('B2');
  assert(q.replies.length >= 1, 'Should have replies');
  if (q.syntaxBlocks.filter(b => b.replyIndex !== undefined).length > 1) {
    assert(q.replies.length > 1, 'Multi-reply needs multiple replies');
  }
});

test('Meta has correct structure', () => {
  assert(it.meta, 'Missing meta');
  assert(it.meta.code === 'it', 'Wrong code');
  assert(it.meta.name === 'Italian', 'Wrong name');
  assert(Array.isArray(it.meta.levels), 'Missing levels array');
});

console.log('\nAll tests passed!');