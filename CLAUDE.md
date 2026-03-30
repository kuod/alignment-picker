# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-file GitHub Pages app (`index.html`) that walks users through choosing a DNA or RNA-seq aligner and builds a copyable shell command in real time, with a live pros/cons analysis panel.

No build step, no dependencies, no package manager. Open `index.html` directly in a browser to develop.

## Architecture

Everything lives in `index.html` in three sections:

**CSS (`<style>`)** — CSS custom properties define the design tokens (`--primary`, `--bg`, `--card`, etc.). Layout is a two-column CSS Grid: `.wizard` (left, scrollable steps) and `.sidebar` (right, sticky). Cards use `.locked` to disable interaction until a prior step is completed.

**HTML** — Five `.card` wizard steps rendered statically. The choice grids inside steps 2–5 are populated by JS. The sidebar contains `.cmd-card` (dark code block) and `.analysis-card` (pros/cons).

**JavaScript (inline `<script>`)** — All state lives in the `S` object. The data model is `ALIGNERS` (keyed by aligner ID) and `TECH_OPTIONS` (keyed by experiment type). The flow is:

1. `pick(field, val, btn)` — handles all three selection steps; calls the appropriate render functions and then `refresh()`
2. `renderTech()` / `renderAligners()` — populate choice grids from `TECH_OPTIONS` / `ALIGNERS` filtered by current state
3. `renderParams()` / `renderPostProc()` — build parameter input HTML dynamically from state; inputs use inline `oninput`/`onchange` to mutate `S` and call `refresh()`
4. `buildCommand()` — pure function over `S`; returns a multi-line shell command string with `#` comments
5. `highlight(raw)` — simple regex-based syntax coloring applied to the command string before injecting into `.cmd-body`
6. `buildNotes()` — returns contextual warning/info notes based on the current state combination (e.g., markdup without sort, BWA-MEM for long reads)
7. `refresh()` — calls `buildCommand()`, `highlight()`, `buildNotes()`, and updates both sidebar panels

## Adding a new aligner

1. Add an entry to the `ALIGNERS` object with: `label`, `tags`, `dna`/`rna` booleans, `quantOnly`, `techs` array (must match keys in `TECH_OPTIONS`), `desc`, `pros`, `cons`, `best`.
2. Add a `case` in the `buildCommand()` switch that constructs the command lines array. Use the `pipe()` helper for commands that stream into samtools.
3. Add the aligner ID to the `TOOLS` array in `highlight()` so the tool name gets amber syntax coloring.

## Adding a new technology / platform

Add an entry to `TECH_OPTIONS.dna` or `TECH_OPTIONS.rna`, then set `techs` on the relevant aligners to include the new key.

## Deployment

GitHub Pages — push to `main`, source set to root `/`. No CI needed.
