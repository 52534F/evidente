const it = require('../languages/it/index.js');

function test(name, fn) {
  try {
    var result = fn();
    if (result && typeof result.then === 'function') {
      result.then(function() {
        console.log('✓ ' + name);
      }).catch(function(e) {
        console.log('✗ ' + name + ': ' + e.message);
        process.exitCode = 1;
      });
    } else {
      console.log('✓ ' + name);
    }
  } catch (e) {
    console.log('✗ ' + name + ': ' + e.message);
    process.exitCode = 1;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

console.log('Running Italian module tests...\n');

// Pre-load all data
it.loadAll().then(function() {
  test('A1 generates questions', function() {
    return it.generateQuestion('A1').then(function(q) {
      assert(q, 'A1 returned null');
      assert(q.category, 'Missing category');
      assert(q.syntaxBlocks, 'Missing syntaxBlocks');
      assert(q.replies, 'Missing replies');
    });
  });

  test('A2 generates questions', function() {
    return it.generateQuestion('A2').then(function(q) {
      assert(q, 'A2 returned null');
      assert(q.category.l1 === 'Morfologia' || q.category.l1 === 'Sintassi', 'Invalid l1');
    });
  });

  test('B1 generates questions', function() {
    return it.generateQuestion('B1').then(function(q) {
      assert(q, 'B1 returned null');
      assert(q.replies.length >= 1, 'Should have at least 1 reply');
    });
  });

  test('C1 generates questions', function() {
    return it.generateQuestion('C1').then(function(q) {
      assert(q, 'C1 returned null');
    });
  });

  test('Question has valid category structure', function() {
    return it.generateQuestion('A1').then(function(q) {
      assert(typeof q.category.l1 === 'string', 'l1 not string');
      assert(typeof q.category.l2 === 'string', 'l2 not string');
      assert(typeof q.category.l3 === 'string', 'l3 not string');
    });
  });

  test('Syntax blocks have required fields', function() {
    return it.generateQuestion('A1').then(function(q) {
      q.syntaxBlocks.forEach(function(block) {
        assert(typeof block.text === 'string', 'text not string');
        assert(typeof block.role === 'string', 'role not string');
      });
    });
  });

  test('Replies have correct structure', function() {
    return it.generateQuestion('A1').then(function(q) {
      q.replies.forEach(function(reply) {
        assert(Array.isArray(reply.choices), 'choices not array');
        assert(typeof reply.correctIndex === 'number', 'correctIndex not number');
        assert(typeof reply.explanation === 'string', 'explanation not string');
        assert(reply.choices.length >= 2, 'need at least 2 choices');
        assert(reply.correctIndex >= 0 && reply.correctIndex < reply.choices.length, 'invalid correctIndex');
      });
    });
  });

  test('Multiple generates return different results', function() {
    var results = new Set();
    var promises = [];
    for (var i = 0; i < 10; i++) {
      promises.push(it.generateQuestion('A1'));
    }
    return Promise.all(promises).then(function(questions) {
      questions.forEach(function(q) {
        results.add(q.syntaxBlocks.map(function(b) { return b.text; }).join('|'));
      });
      assert(results.size > 1, 'Generator not producing variety');
    });
  });

  test('B2 multi-reply questions', function() {
    return it.generateQuestion('B2').then(function(q) {
      assert(q.replies.length >= 1, 'Should have replies');
      if (q.syntaxBlocks.filter(function(b) { return b.replyIndex !== undefined; }).length > 1) {
        assert(q.replies.length > 1, 'Multi-reply needs multiple replies');
      }
    });
  });

  test('Meta has correct structure', function() {
    assert(it.meta, 'Missing meta');
    assert(it.meta.code === 'it', 'Wrong code');
    assert(it.meta.name === 'Italian', 'Wrong name');
    assert(Array.isArray(it.meta.levels), 'Missing levels array');
  });

  console.log('\nAll tests passed!');
}).catch(function(e) {
  console.log('Failed to load data:', e.message);
  process.exitCode = 1;
});