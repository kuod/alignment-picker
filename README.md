# Alignment Picker

A single-page tool for building DNA and RNA-seq alignment commands.

Choose your experiment type, sequencing platform, and aligner — get a ready-to-run shell command with pros/cons analysis updated as you make selections.

**[Try it → kuod.github.io/alignment-picker](https://kuod.github.io/alignment-picker)**

## Supported aligners

| Aligner | Data type |
|---|---|
| BWA-MEM2 | DNA short reads |
| DRAGEN | DNA short reads (WGS/WES; commercial, Illumina hardware/cloud) |
| DRAGMAP | DNA short reads (open-source DRAGEN mapper, commodity CPUs) |
| BWA-MEM | DNA short + long reads |
| Strobealign | DNA short reads (fast, on-the-fly indexing) |
| Bowtie2 | DNA short reads |
| Bismark | DNA methylation — bisulfite / EM-seq (WGBS, RRBS, PBAT), Illumina |
| bwa-meth | DNA methylation — bisulfite / EM-seq (directional WGBS, RRBS), Illumina |
| Minimap2 | DNA long reads (PacBio, ONT) |
| pbmm2 | PacBio long reads — DNA (HiFi, CLR) and Iso-Seq RNA; reads unaligned BAM natively |
| STAR | RNA-seq short reads; small RNA / miRNA-seq (ENCODE settings) |
| HISAT2 | RNA-seq short reads |
| Salmon | RNA-seq quantification |
| Kallisto | RNA-seq quantification |
| STARsolo | Single-cell / single-nucleus RNA-seq (10x 3′ v2/v3/v4, 5′) |
| alevin-fry (simpleaf) | Single-cell / single-nucleus RNA-seq (10x 3′ v2/v3/v4, 5′) |
| kallisto \| bustools (kb) | Single-cell / single-nucleus RNA-seq (10x 3′ v2/v3/v4, 5′) |
| Minimap2 | Long-read RNA-seq |
| Bowtie (v1) | Small RNA / miRNA-seq |
| vg giraffe | Pangenome / graph genome — DNA, Illumina short reads |
| GraphAligner | Pangenome / graph genome — DNA, PacBio + ONT long reads |
| Winnowmap2 | DNA long reads (PacBio, ONT) — repeat-aware, T2T references |

Short-read options also apply to Element AVITI and MGI/DNBSEQ data (same commands; set the read-group platform accordingly).

## Long-read input

For PacBio, ONT and long-read RNA, the reads can be given as FASTQ or as an **unaligned BAM** (dorado / Revio output). With uBAM input, minimap2-based commands stream `samtools fastq -T MM,ML,MN reads.bam | minimap2 -y ...` so the base-modification tags needed by `modkit` / `pb-CpG-tools` reach the aligned BAM; pbmm2 reads the uBAM directly.

## Post-processing

For BAM-producing aligners, step 5 adds optional coordinate sorting, indexing, duplicate marking (`samtools markdup`), alignment QC (`samtools flagstat`, `samtools stats`, `mosdepth` coverage with an optional target BED), and a BAM vs CRAM output selector. CRAM output requires the exact reference FASTA to decode later.

## Single-cell RNA-seq

The *Single-cell (10x / droplet)* RNA technology builds STARsolo, `simpleaf` (alevin-fry) or `kb` (kallisto | bustools) commands for a chosen 10x chemistry, barcode whitelist and an optional single-nucleus mode (STARsolo `GeneFull`, alevin-fry USA counts, kb `--workflow nac`). R1 is the barcode + UMI read and R2 the cDNA read. Output is a cell × gene count matrix, so BAM post-processing is skipped (STARsolo can optionally also write a CB/UB-tagged BAM), and the QC step runs FastQC only — trimming barcode reads breaks cell/UMI assignment.

For bisulfite / EM-seq data (DNA → "Bisulfite / EM-seq"), choose WGBS vs RRBS and the library type (directional, non-directional, PBAT). The QC tab switches to Trim Galore (`--rrbs` for RRBS), and step 5 adds deduplication (WGBS only) and methylation extraction: `deduplicate_bismark` + `bismark_methylation_extractor` for Bismark, `samtools markdup` + MethylDackel for bwa-meth.

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
