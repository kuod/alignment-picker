const test = require('node:test');
const assert = require('node:assert');
const { load } = require('./harness');

const hashOf = (o) => '#' + Buffer.from(JSON.stringify(o)).toString('base64');
const base = { expType: 'dna', tech: 'illumina', aligner: 'bwa-mem2' };

for (const [name, saved] of Object.entries({
  'proto expType': { expType: '__proto__' },
  'constructor expType': { expType: 'constructor' },
  'constructor aligner': { ...base, aligner: 'constructor' },
  'string where boolean expected': { ...base, paired: 'no' },
  'number where string expected': { ...base, rgSample: 5, r1: null, output: 7 },
  'vOpts not an object': { ...base, vOpts: 5, verboseMode: true },
  'unknown keys ignored': { ...base, evil: 'x', __proto__: { polluted: 1 } },
})) {
  test(`bad saved state does not throw: ${name}`, () => {
    const { api } = load({ hash: hashOf(saved) });
    api.buildQCCmd(); api.buildIndexCmd(); api.buildAlignCmd(); api.buildNotes();
    assert.strictEqual({}.polluted, undefined);
  });
}

test('bad localStorage state does not throw', () => {
  const { api } = load({ storage: { ap_state: JSON.stringify({ ...base, paired: 'no', sortBam: 1 }) } });
  api.buildAlignCmd();
});

test('valid state still restores', () => {
  const { api } = load({ hash: hashOf({ ...base, threads: '16' }) });
  assert.strictEqual(api.S.aligner, 'bwa-mem2');
  assert.match(api.buildAlignCmd(), /-t 16 /);
});
