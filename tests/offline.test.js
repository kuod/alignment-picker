const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./harness');

test('app still loads and builds commands when Mermaid failed to load', () => {
  const { api } = load({ mermaid: false });
  Object.assign(api.S, { expType: 'dna', tech: 'illumina', aligner: 'bwa-mem2' });
  assert.match(api.buildAlignCmd(), /bwa-mem2 mem/);
});

test('Mermaid script is pinned to an exact version with SRI', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const tag = html.match(/<script src="[^"]*mermaid[^"]*"[^>]*>/)[0];
  assert.match(tag, /mermaid@\d+\.\d+\.\d+\//);
  assert.match(tag, /integrity="sha384-/);
});
