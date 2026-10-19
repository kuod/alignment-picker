const test = require('node:test');
const assert = require('node:assert');
const { load } = require('./harness');

const hashOf = (o) => '#' + Buffer.from(JSON.stringify(o)).toString('base64');

test('esc() escapes attribute-breaking and HTML characters', () => {
  const { api } = load();
  assert.strictEqual(api.esc('a"b<c>&d'), 'a&quot;b&lt;c&gt;&amp;d');
  assert.strictEqual(api.esc(null), '');
});

test('a crafted threads value in the URL hash cannot break out of the input attribute', () => {
  const evil = '1" autofocus onfocus="alert(1)';
  const { ctx } = load({ hash: hashOf({ expType: 'dna', tech: 'illumina', aligner: 'bwa-mem2', threads: evil }) });
  const html = ctx.document.getElementById('params-body').innerHTML;
  assert.ok(html.includes('value="1&quot; autofocus'), html.match(/<input type="number"[^>]*>/)[0]);
});

test('user paths echoed into the notes panel are HTML-escaped', () => {
  const evil = '<img src=x onerror=alert(1)>';
  const { api } = load({ hash: hashOf({ expType: 'dna', tech: 'ont', aligner: 'minimap2-ont', ref: evil, reads: evil, lrInput: 'bam' }) });
  const notes = api.buildNotes().map(n => n.text).join('\n');
  assert.ok(notes.includes('dorado aligner'), 'expected the dorado note to be shown');
  assert.ok(!notes.includes('<img'), notes);
});
