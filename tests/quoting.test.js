// Shell quoting of user values (#31). Run with: node --test
const test = require('node:test');
const assert = require('node:assert');
const cp = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { load } = require('./harness');

const NASTY = {
  space: 'my data/ref genome.fa',
  squote: "it's/ref.fa",
  dquote: 'a"b.fa',
  semicolon: 'x.fa; touch PWNED1',
  subshell: '$(touch PWNED2).fa',
  backtick: '`touch PWNED3`.fa',
  newline: 'x.fa\ntouch PWNED4\n# ',
  amp: 'x.fa && touch PWNED5 || touch PWNED6 | touch PWNED7 > PWNED8',
  backslash: 'a\\b $HOME ${HOME} *.fa',
};

// bash echoes back exactly one argument, byte for byte
const roundTrip = (q) => cp.spawnSync('/bin/bash', ['-c', `printf %s ${q}`], { env: { PATH: '/nonexistent', HOME: '/h' } }).stdout.toString();

test('shq leaves plain safe tokens bare and quotes the rest', () => {
  const { api: { shq } } = load();
  for (const s of ['ref.fa', 'output', '/data/ref-1.0/genome.fa.gz', 'a_b+c=d:e,f@g%h']) assert.strictEqual(shq(s), s);
  assert.strictEqual(shq(''), "''");
  assert.strictEqual(shq('my ref.fa'), "'my ref.fa'");
  assert.strictEqual(shq("it's"), "'it'\\''s'");
  assert.strictEqual(shq('~/ref dir/g.fa'), "~/'ref dir/g.fa'");   // tilde stays expandable
});

test('shq round-trips through bash for hostile values', () => {
  const { api: { shq } } = load();
  for (const [name, v] of Object.entries({ ...NASTY, tab: 'a\tb', cr: 'a\rb', tilde: '~/x y' })) {
    const expect = v.startsWith('~/') ? '/h/' + v.slice(2) : v;
    assert.strictEqual(roundTrip(shq(v)), expect, name);
    assert.ok(!/[\n\r]/.test(shq(v)), `${name}: quoted form must stay on one line (comments!)`);
  }
  assert.strictEqual(roundTrip("''"), '');
});

test('hostile values cannot inject commands, in any aligner/technology', () => {
  const { api } = load();
  const { S, ALIGNERS, TECH_OPTIONS } = api;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ap-quote-'));
  const log = path.join(dir, 'log');
  const keys = ['ref','refIdx','genomeDir','txomeFa','salmonIdx','kallistoIdx','r1','r2','reads','output','vcfFile','vgIdxPrefix','graphFile',
    'dragenRefDir','dragmapRefDir','bismarkGenome','afIdx','kbIdx','kbT2g','mosdepthBed','scWhitelist','bt2Preset','libType'];
  let n = 0;
  for (const [name, evil] of Object.entries(NASTY)) {
    for (const exp of ['dna', 'rna']) for (const t of TECH_OPTIONS[exp]) for (const [k, a] of Object.entries(ALIGNERS)) {
      if (!a[exp] || !a.techs.includes(t.val)) continue;
      const bad = Object.fromEntries(keys.map(key => [key, evil]));
      Object.assign(S, { expType: exp, tech: t.val, aligner: k, paired: true, sortBam: true, markDups: true,
        outFmt: name === 'space' ? 'cram' : 'bam', mosdepth: true, flagstat: true, samStats: true, indexBam: true,
        bsExtract: true, verboseMode: false, lrInput: 'fastq' }, bad);
      for (const f of ['buildQCCmd', 'buildIndexCmd', 'buildAlignCmd']) {
        const c = api[f]();
        if (!c) continue;
        n++;
        const id = `${name}/${exp}/${t.val}/${k}/${f}`;
        assert.strictEqual(cp.spawnSync('/bin/bash', ['-n'], { input: c }).status, 0, `${id} is not valid shell:\n${c}`);
        // run it with every command "not found": the handler logs the command name instead of running it
        fs.writeFileSync(log, '');
        cp.spawnSync('/bin/bash', ['-c', `command_not_found_handle() { echo "$1" >> "${log}"; return 0; }\n${c}`],
          { cwd: dir, env: { PATH: '/nonexistent', HOME: '/h' }, timeout: 20000 });
        const ran = fs.readFileSync(log, 'utf8');
        assert.ok(!/touch|PWNED/.test(ran), `${id} ran an injected command: ${ran}\n${c}`);
        assert.deepStrictEqual(fs.readdirSync(dir).filter(x => /^PWNED/.test(x)), [], `${id} created an injected file\n${c}`);
      }
    }
  }
  assert.ok(n > 300, String(n));
  fs.rmSync(dir, { recursive: true, force: true });
});

test('paths with spaces and quotes stay one argument', () => {
  const { api } = load();
  const { S } = api;
  Object.assign(S, { expType: 'dna', tech: 'illumina', aligner: 'bwa-mem2', paired: true, sortBam: true, ref: 'my data/ref genome.fa', r1: "it's R1.fq.gz", r2: 'R2.fq.gz', output: 'out' });
  assert.ok(api.buildIndexCmd().includes("bwa-mem2 index 'my data/ref genome.fa'"));
  const a = api.buildAlignCmd();
  assert.ok(a.includes("'my data/ref genome.fa' 'it'\\''s R1.fq.gz' R2.fq.gz"), a);
});

test('user-edited verbose option values are quoted', () => {
  const { api } = load();
  const { S } = api;
  Object.assign(S, { expType: 'rna', tech: 'longrna', aligner: 'minimap2-rna', verboseMode: true, reads: 'r.fq', vOpts: { 'minimap2-rna': { junc: 'a b.bed; touch PWNED' } } });
  const c = api.buildAlignCmd();
  assert.ok(c.includes("--junc-bed 'a b.bed; touch PWNED'"), c);
});
