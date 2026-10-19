const test = require('node:test');
const assert = require('node:assert');
const { load } = require('./harness');

function setup(extra = {}) {
  const { api } = load();
  Object.assign(api.S, { expType: 'dna', tech: 'illumina', aligner: 'bwa-mem2' }, extra);
  return api;
}

test('blank path fields fall back to defaults instead of producing empty arguments', () => {
  const api = setup({ ref: '', r1: '   ', r2: '', output: '' });
  const c = api.buildAlignCmd();
  assert.match(c, /bwa-mem2 mem -t 8 reference\.fa sample_R1\.fastq\.gz sample_R2\.fastq\.gz/);
  assert.match(c, /-o output\.bam/);
});

test('invalid thread counts fall back to the default', () => {
  for (const t of ['0', '-4', '', 'abc', '8; echo pwn', '1.5']) {
    const api = setup({ threads: t });
    const c = api.buildAlignCmd();
    assert.match(c, /-t 8 /, `threads=${JSON.stringify(t)}`);
    assert.ok(!c.includes('pwn'));
  }
  assert.match(setup({ threads: '16' }).buildAlignCmd(), /-t 16 /);
});

test('user state is not mutated by building commands', () => {
  const api = setup({ ref: '' });
  api.buildAlignCmd();
  assert.strictEqual(api.S.ref, '');
});
