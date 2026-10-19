// Loads the inline <script> of index.html in a vm with a minimal DOM stub.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function load({ hash = '', storage = {}, mermaid = true } = {}) {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  if (!m) throw new Error('inline script not found');
  const el = () => {
    const e = new Proxy(function () {}, {
      get(t, k) {
        if (k === 'classList') return { add() {}, remove() {}, toggle() { return true; }, contains() { return false; } };
        if (k === 'style') return {};
        if (k === 'querySelectorAll') return () => [];
        if (k === 'querySelector' || k === 'closest') return () => null;
        if (k in t && k !== 'name' && k !== 'length') return t[k];
        return t[k];
      },
      set(t, k, v) { t[k] = v; return true; },
      apply() { return el(); },
    });
    return e;
  };
  const els = {};
  const store = Object.assign({}, storage);
  const ctx = {
    console,
    document: {
      getElementById: (id) => els[id] || (els[id] = el()),
      querySelector: () => null,
      querySelectorAll: () => [],
      createElement: () => ({ click() {} }),
    },
    location: { hash },
    history: { replaceState(_, __, h) { ctx.location.hash = h; } },
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
    },
    navigator: {},
    setTimeout: () => 0,
    clearTimeout() {},
    btoa, atob, URL, Blob: class extends Blob { constructor(p, o) { super(p, o); ctx.blobs.push(p.join('')); } }, blobs: [], TextEncoder, TextDecoder, Uint8Array,
  };
  if (mermaid) ctx.mermaid = { initialize() {}, render: async () => ({ svg: '' }) };
  ctx.window = ctx;
  vm.createContext(ctx);
  // make top-level const/let (S, ALIGNERS, ...) reachable from the outside
  const names = ['S','ALIGNERS','TECH_OPTIONS','buildQCCmd','buildIndexCmd','buildAlignCmd','buildNotes','buildDiagram','highlight','refresh','migrateState','migrateVOpts','esc','renderParams','encodeState','decodeState','downloadScript'];
  const src = m[1] + '\n;globalThis.__api = {' + names.map(n => `${n}: typeof ${n} === 'undefined' ? undefined : ${n}`).join(',') + '};';
  vm.runInContext(src, ctx);
  return { api: ctx.__api, ctx, store };
}

module.exports = { load };
