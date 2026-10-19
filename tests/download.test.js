const test = require('node:test');
const assert = require('node:assert');
const cp = require('node:child_process');
const { load } = require('./harness');

test('downloaded .sh is valid shell and has no dead variable block', () => {
  const { api, ctx } = load();
  Object.assign(api.S, { expType: 'dna', tech: 'illumina', aligner: 'bwa-mem2' });
  api.downloadScript();
  const script = ctx.blobs.at(-1);
  assert.ok(script.startsWith('#!/usr/bin/env bash'));
  assert.strictEqual(cp.spawnSync('bash', ['-n'], { input: script }).status, 0);
  assert.ok(!/^(THREADS|REF|R1|R2|READS|OUTPUT|TXOME)=/m.test(script), 'unused variables are defined but never referenced');
  assert.match(script, /bwa-mem2 mem -t 8 reference\.fa/);
});
