# Alignment Picker

A single-page tool for building DNA and RNA-seq alignment commands.

Pick an experiment type, sequencing technology and aligner, and the page builds ready-to-run shell commands as you go. Alongside them it shows a pros/cons analysis, notes on your current settings, and a data-flow diagram.

**[Try it → kuod.github.io/alignment-picker](https://kuod.github.io/alignment-picker)**

## Features

- **QC → Index → Align tabs.** Read QC (fastp, FastQC, Trim Galore, NanoStat, depending on the data), the index build, and the alignment with post-processing.
- **Download as `.sh`.** The full pipeline as one script.
- **Shareable links.** All settings are encoded in the URL hash, and the last session is restored from local storage.
- **Advanced options.** Extra flags for each aligner, each with an explanation of when and why to use it.
- **Shared read-group / sample section.** Converted to each aligner's own flag (`-R`, `--rg-id/--rg`, `--outSAMattrRGline`, `--RGID/--RGSM`, …).
- **Reference genome presets.** GRCh38 no-alt / full, T2T-CHM13, GRCm39, with warnings about ALT contigs and a check that the FASTA and GTF match.
- **Notes.** Warnings and tips for the current combination of settings, such as markdup without sort, RRBS deduplication, or long reads given to a short-read aligner.
- **Data-flow diagram.** A Mermaid diagram of each pipeline.

## Supported workflows

### DNA

| Technology | Aligners |
|---|---|
| Illumina short reads (also Element AVITI, MGI/DNBSEQ) | BWA-MEM2, DRAGEN *(commercial)*, DRAGMAP, BWA-MEM, Strobealign, Bowtie2, vg giraffe *(pangenome)* |
| Bisulfite / EM-seq (WGBS, RRBS, PBAT) | Bismark, bwa-meth |
| PacBio long reads | Minimap2, pbmm2, Winnowmap2, BWA-MEM, GraphAligner *(pangenome)* |
| Oxford Nanopore | Minimap2, Winnowmap2, BWA-MEM, GraphAligner *(pangenome)* |

### RNA

| Technology | Aligners |
|---|---|
| Illumina short reads | STAR, HISAT2, Salmon, Kallisto |
| Small RNA / miRNA-seq | Bowtie (v1), STAR (ENCODE small-RNA settings) |
| Long-read RNA (Iso-Seq, ONT cDNA / direct RNA) | Minimap2, pbmm2 (Iso-Seq) |
| Quantification only | Salmon, Kallisto |
| Single-cell (10x 3′ v2/v3/v4, 5′) | STARsolo, alevin-fry (simpleaf), kallisto \| bustools (kb) |

## Workflow details

**Post-processing.** For aligners that write BAM, step 5 offers:
- coordinate sorting
- indexing
- duplicate marking, with `samtools fixmate -m` added automatically for paired-end reads
- alignment QC: `samtools flagstat`, `samtools stats`, and `mosdepth` coverage with an optional target BED
- BAM or CRAM output. CRAM needs the exact reference FASTA to decode later.

DRAGEN and pbmm2 sort and index internally, so they skip the matching samtools steps.

**Long-read input.** PacBio, ONT and long-read RNA reads can be given as FASTQ or as an **unaligned BAM** (dorado / Revio output). With uBAM input, the commands stream `samtools fastq -T MM,ML,MN reads.bam | minimap2 -y …`. Winnowmap uses `-y` the same way and BWA uses `-C`. This keeps the base-modification tags that `modkit` / `pb-CpG-tools` need. pbmm2 reads the uBAM directly. GraphAligner cannot keep these tags, and the page warns about it.

**Methylation.** Under DNA → *Bisulfite / EM-seq*, choose WGBS or RRBS and the library type (directional, non-directional, PBAT).
- QC switches to Trim Galore, with `--rrbs` for RRBS.
- Bismark runs `deduplicate_bismark` (WGBS only) and `bismark_methylation_extractor`.
- bwa-meth uses `samtools markdup` and MethylDackel.

**Single-cell.** Choose a 10x chemistry, a barcode whitelist and, optionally, single-nucleus mode:
- STARsolo `GeneFull`
- alevin-fry USA counts
- kb `--workflow nac`

R1 is the barcode + UMI read and R2 the cDNA read. Output is a cell × gene count matrix, so BAM post-processing is skipped. STARsolo can also write a CB/UB-tagged BAM. QC is FastQC only, because trimming barcode reads breaks cell/UMI assignment.

**Small RNA.** Single-end only. The QC tab trims the small-RNA 3′ adapter and keeps 18–40 nt reads; you then align the trimmed reads.

> Generated commands are a starting point. Check flags against your installed tool versions; several tools have changed index formats or options between releases (e.g. vg giraffe index file names).

## Development

Everything is in `index.html`: HTML, CSS and JavaScript, with no build step and no dependencies apart from Mermaid from a CDN (pinned, with SRI). Run the tests with `node --test`. Open the file in a browser to develop. See [CLAUDE.md](CLAUDE.md) for an overview of the architecture and for how to add an aligner or a technology. The site deploys through GitHub Pages from `main`.

## Citations

If you use this tool to build a pipeline, please cite the underlying aligner:

| Tool | Reference |
|---|---|
| BWA-MEM2 | Vasimuddin et al. IEEE IPDPS 2019. [doi:10.1109/IPDPS.2019.00041](https://doi.org/10.1109/IPDPS.2019.00041) |
| BWA-MEM | Li H. arXiv:1303.3997 (2013). [arxiv:1303.3997](https://arxiv.org/abs/1303.3997) |
| Strobealign | Sahlin K. *Genome Biology* 23:260 (2022). [doi:10.1186/s13059-022-02831-7](https://doi.org/10.1186/s13059-022-02831-7); v0.17.0+: Tolstoganov et al. *Genome Biology* 27:118 (2026). [doi:10.1186/s13059-026-04017-x](https://doi.org/10.1186/s13059-026-04017-x) |
| Bowtie2 | Langmead & Salzberg. *Nature Methods* 9, 357–359 (2012). [doi:10.1038/nmeth.1923](https://doi.org/10.1038/nmeth.1923) |
| Bowtie | Langmead et al. *Genome Biology* 10:R25 (2009). [doi:10.1186/gb-2009-10-3-r25](https://doi.org/10.1186/gb-2009-10-3-r25) |
| Bismark | Krueger & Andrews. *Bioinformatics* 27(11):1571–1572 (2011). [doi:10.1093/bioinformatics/btr167](https://doi.org/10.1093/bioinformatics/btr167) |
| bwa-meth | Pedersen et al. arXiv:1401.1129 (2014). [arxiv:1401.1129](https://arxiv.org/abs/1401.1129) |
| MethylDackel | Ryan DP. Software. [github.com/dpryan79/MethylDackel](https://github.com/dpryan79/MethylDackel) |
| Minimap2 | Li H. *Bioinformatics* 34(18):3094–3100 (2018). [doi:10.1093/bioinformatics/bty191](https://doi.org/10.1093/bioinformatics/bty191) |
| pbmm2 | No paper — cite the repository, [github.com/PacificBiosciences/pbmm2](https://github.com/PacificBiosciences/pbmm2), together with Minimap2 (above), which it wraps |
| STAR | Dobin et al. *Bioinformatics* 29(1):15–21 (2013). [doi:10.1093/bioinformatics/bts635](https://doi.org/10.1093/bioinformatics/bts635) |
| HISAT2 | Kim et al. *Nature Biotechnology* 37, 907–915 (2019). [doi:10.1038/s41587-019-0201-4](https://doi.org/10.1038/s41587-019-0201-4) |
| Salmon | Patro et al. *Nature Methods* 14, 417–419 (2017). [doi:10.1038/nmeth.4197](https://doi.org/10.1038/nmeth.4197) |
| Kallisto | Bray et al. *Nature Biotechnology* 34, 525–527 (2016). [doi:10.1038/nbt.3519](https://doi.org/10.1038/nbt.3519) |
| STARsolo | Kaminow, Yunusov & Dobin. *bioRxiv* (2021). [doi:10.1101/2021.05.05.442755](https://doi.org/10.1101/2021.05.05.442755) |
| alevin-fry / simpleaf | He et al. *Nature Methods* 19, 316–322 (2022). [doi:10.1038/s41592-022-01408-3](https://doi.org/10.1038/s41592-022-01408-3) |
| kallisto \| bustools | Melsted et al. *Nature Biotechnology* 39, 813–818 (2021). [doi:10.1038/s41587-021-00870-2](https://doi.org/10.1038/s41587-021-00870-2) |
| samtools | Danecek et al. *GigaScience* 10(2):giab008 (2021). [doi:10.1093/gigascience/giab008](https://doi.org/10.1093/gigascience/giab008) |
| mosdepth | Pedersen & Quinlan. *Bioinformatics* 34(5):867–868 (2018). [doi:10.1093/bioinformatics/btx699](https://doi.org/10.1093/bioinformatics/btx699) |
| DRAGEN | Behera et al. *Nature Biotechnology* (2024). [doi:10.1038/s41587-024-02382-1](https://doi.org/10.1038/s41587-024-02382-1) |
| DRAGMAP | No dedicated paper — cite the DRAGEN paper above and [github.com/Illumina/DRAGMAP](https://github.com/Illumina/DRAGMAP) with the version used |
| vg / vg giraffe | Sirén et al. *Science* 374(6574):abg8871 (2021). [doi:10.1126/science.abg8871](https://doi.org/10.1126/science.abg8871) |
| GraphAligner | Rautiainen & Marschall. *Genome Biology* 21:253 (2020). [doi:10.1186/s13059-020-02157-2](https://doi.org/10.1186/s13059-020-02157-2) |
| Winnowmap2 | Jain et al. *Nature Methods* 19, 705–710 (2022). [doi:10.1038/s41592-022-01457-8](https://doi.org/10.1038/s41592-022-01457-8); Jain et al. *Bioinformatics* 36(Suppl 1):i111–i118 (2020). [doi:10.1093/bioinformatics/btaa435](https://doi.org/10.1093/bioinformatics/btaa435) |
