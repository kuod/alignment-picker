// Run with: node --test
const test = require('node:test');
const assert = require('node:assert');
const cp = require('node:child_process');
const { load } = require('./harness');

test('every aligner/technology combination yields valid shell with no undefined/NaN', () => {
  const { api } = load();
  const { S, ALIGNERS, TECH_OPTIONS } = api;
  let count = 0;
  for (const exp of ['dna', 'rna']) for (const t of TECH_OPTIONS[exp]) for (const [k, a] of Object.entries(ALIGNERS)) {
    if (!a[exp] || !a.techs.includes(t.val)) continue;
    for (const paired of [true, false]) for (const sortBam of [true, false]) for (const markDups of [true, false]) for (const outFmt of ['bam', 'cram']) for (const verboseMode of [false, true]) {
      Object.assign(S, { expType: exp, tech: t.val, aligner: k, paired, sortBam, markDups, outFmt, verboseMode });
      for (const f of ['buildQCCmd', 'buildIndexCmd', 'buildAlignCmd']) {
        const c = api[f]();
        if (!c) continue;
        count++;
        const id = `${exp}/${t.val}/${k}/${f}`;
        assert.ok(!/undefined|\bNaN\b|\[object/.test(c), `${id} contains a bad value:\n${c}`);
        const r = cp.spawnSync('bash', ['-n'], { input: c });
        assert.strictEqual(r.status, 0, `${id} is not valid shell: ${r.stderr}\n${c}`);
      }
      api.buildNotes(); api.buildDiagram();
    }
  }
  assert.ok(count > 1000);
});
