# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-file GitHub Pages app (`index.html`) that walks users through choosing a DNA or RNA-seq aligner and builds a copyable shell command in real time, with a live pros/cons analysis panel.

No build step, no dependencies, no package manager (Mermaid is loaded from a pinned CDN URL with SRI and is optional: without it only the diagram is lost). Open `index.html` directly in a browser to develop.

## Tests

`node --test` (Node 20+, no install). `tests/harness.js` loads the inline script under a DOM stub; the tests check that every aligner/technology/option combination produces valid shell (`bash -n`), plus state restore, share-link, escaping and input-fallback regressions. Run them before committing.

## Architecture

Everything lives in `index.html` in three sections:

**CSS (`<style>`)** — CSS custom properties define the design tokens (`--primary`, `--bg`, `--card`, etc.). Layout is a two-column CSS Grid: `.wizard` (left, scrollable steps) and `.sidebar` (right, sticky). Cards use `.locked` to disable interaction until a prior step is completed.

**HTML** — Five `.card` wizard steps rendered statically. The choice grids inside steps 2–5 are populated by JS. The sidebar contains `.cmd-card` (dark code block) and `.analysis-card` (pros/cons).

**JavaScript (inline `<script>`)** — All state lives in the `S` object. The data model is `ALIGNERS` (keyed by aligner ID) and `TECH_OPTIONS` (keyed by experiment type). The flow is:

1. `pick(field, val, btn)` — handles all three selection steps; calls the appropriate render functions and then `refresh()`
2. `renderTech()` / `renderAligners()` — populate choice grids from `TECH_OPTIONS` / `ALIGNERS` filtered by current state
3. `renderParams()` / `renderPostProc()` — build parameter input HTML dynamically from state; inputs use inline `oninput`/`onchange` to mutate `S` and call `refresh()`
4. `buildQCCmd()` / `buildIndexCmd()` / `buildAlignCmd()` — one per sidebar tab (QC, Index, Align). Each is a thin wrapper that calls `_buildXCmd(effectiveState())`: the real builder takes the state as a parameter named `S` (shadowing the global) where blank paths and invalid thread counts have already fallen back to defaults. Returns a multi-line shell string with `#` comments.
5. `highlight(raw)` — simple regex-based syntax coloring applied to the command string before injecting into `.cmd-body` (it HTML-escapes first)
6. `buildNotes()` — returns contextual warning/info notes based on the current state combination (e.g., markdup without sort, BWA-MEM for long reads). Notes are injected as HTML, so escape user-controlled values with `esc()`.
7. `refresh()` — rebuilds the three command panes, `buildNotes()` and the analysis panel, and persists state to localStorage and the URL hash (`encodeState`, base64 of UTF-8 JSON)

State restored from the hash or localStorage goes through `sanitizeSaved()` (known keys, matching types only) and `migrateState()`; keep both in step when adding fields to `S`.

## Adding a new aligner

1. Add an entry to the `ALIGNERS` object with: `label`, `tags`, `dna`/`rna` booleans, `quantOnly`, `techs` array (must match keys in `TECH_OPTIONS`), `desc`, `pros`, `cons`, `best`.
2. Add a `case` in the `_buildAlignCmd()` switch (and `_buildIndexCmd()` / `_buildQCCmd()` if needed) that constructs the command lines array. Use the `pipe()` helper for commands that stream into samtools, and `rgf()`/`rgfml()` for read groups (add the ID to `RG_VARIANT` or `RG_NONE`).
3. Add the executable names to the `TOOLS` array (top level, above `highlight()`) so the tool name gets amber syntax coloring.
4. Add any advanced flags to `VERBOSE_OPTS` and, if it should appear in the data-flow diagram, a case in `buildDiagram()`.
5. Run `node --test`.

## Adding a new technology / platform

Add an entry to `TECH_OPTIONS.dna` or `TECH_OPTIONS.rna`, then set `techs` on the relevant aligners to include the new key.

## Deployment

GitHub Pages — push to `main`, source set to root `/`. No CI needed.
