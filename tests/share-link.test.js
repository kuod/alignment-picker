const test = require('node:test');
const assert = require('node:assert');
const { load } = require('./harness');

test('share link round-trips non-ASCII values', () => {
  const a = load();
  Object.assign(a.api.S, { expType: 'dna', tech: 'illumina', aligner: 'bwa-mem2', output: 'résumé—日本' });
  a.api.refresh();
  const hash = a.ctx.location.hash;
  assert.ok(hash.length > 10);
  const b = load({ hash });
  assert.strictEqual(b.api.S.output, 'résumé—日本');
  assert.strictEqual(b.api.S.aligner, 'bwa-mem2');
});

test('old ASCII-only share links still load', () => {
  const hash = '#' + Buffer.from(JSON.stringify({ expType: 'dna', tech: 'illumina', aligner: 'bowtie2', output: 'x' })).toString('base64');
  assert.strictEqual(load({ hash }).api.S.aligner, 'bowtie2');
});

test('old Latin-1 (btoa-encoded) share links still load', () => {
  const hash = '#' + Buffer.from(JSON.stringify({ expType: 'dna', tech: 'illumina', aligner: 'bowtie2', output: 'café' }), 'latin1').toString('base64');
  assert.strictEqual(load({ hash }).api.S.output, 'café');
});
