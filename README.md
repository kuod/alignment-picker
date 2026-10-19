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
| Minimap2 | DNA long reads (PacBio, ONT) |
| STAR | RNA-seq short reads; small RNA / miRNA-seq (ENCODE settings) |
| HISAT2 | RNA-seq short reads |
| Salmon | RNA-seq quantification |
| Kallisto | RNA-seq quantification |
| Minimap2 | Long-read RNA-seq |
| Bowtie (v1) | Small RNA / miRNA-seq |
| vg giraffe | Pangenome / graph genome — DNA, Illumina short reads |
| GraphAligner | Pangenome / graph genome — DNA, PacBio + ONT long reads |
| Winnowmap2 | DNA long reads (PacBio, ONT) — repeat-aware, T2T references |

Short-read options also apply to Element AVITI and MGI/DNBSEQ data (same commands; set the read-group platform accordingly).

## Post-processing

For BAM-producing aligners, step 5 adds optional coordinate sorting, indexing, duplicate marking (`samtools markdup`), alignment QC (`samtools flagstat`, `samtools stats`, `mosdepth` coverage with an optional target BED), and a BAM vs CRAM output selector. CRAM output requires the exact reference FASTA to decode later.

## Citations

If you use this tool to build a pipeline, please cite the underlying aligner:

| Tool | Reference |
|---|---|
| BWA-MEM2 | Vasimuddin et al. IEEE IPDPS 2019. [doi:10.1109/IPDPS.2019.00041](https://doi.org/10.1109/IPDPS.2019.00041) |
| BWA-MEM | Li H. arXiv:1303.3997 (2013). [arxiv:1303.3997](https://arxiv.org/abs/1303.3997) |
| Strobealign | Sahlin K. *Genome Biology* 23:260 (2022). [doi:10.1186/s13059-022-02831-7](https://doi.org/10.1186/s13059-022-02831-7); v0.17.0+: Tolstoganov et al. *Genome Biology* 27:118 (2026). [doi:10.1186/s13059-026-04017-x](https://doi.org/10.1186/s13059-026-04017-x) |
| Bowtie2 | Langmead & Salzberg. *Nature Methods* 9, 357–359 (2012). [doi:10.1038/nmeth.1923](https://doi.org/10.1038/nmeth.1923) |
| Bowtie | Langmead et al. *Genome Biology* 10:R25 (2009). [doi:10.1186/gb-2009-10-3-r25](https://doi.org/10.1186/gb-2009-10-3-r25) |
| Minimap2 | Li H. *Bioinformatics* 34(18):3094–3100 (2018). [doi:10.1093/bioinformatics/bty191](https://doi.org/10.1093/bioinformatics/bty191) |
| STAR | Dobin et al. *Bioinformatics* 29(1):15–21 (2013). [doi:10.1093/bioinformatics/bts635](https://doi.org/10.1093/bioinformatics/bts635) |
| HISAT2 | Kim et al. *Nature Biotechnology* 37, 907–915 (2019). [doi:10.1038/s41587-019-0201-4](https://doi.org/10.1038/s41587-019-0201-4) |
| Salmon | Patro et al. *Nature Methods* 14, 417–419 (2017). [doi:10.1038/nmeth.4197](https://doi.org/10.1038/nmeth.4197) |
| Kallisto | Bray et al. *Nature Biotechnology* 34, 525–527 (2016). [doi:10.1038/nbt.3519](https://doi.org/10.1038/nbt.3519) |
| samtools | Danecek et al. *GigaScience* 10(2):giab008 (2021). [doi:10.1093/gigascience/giab008](https://doi.org/10.1093/gigascience/giab008) |
| mosdepth | Pedersen & Quinlan. *Bioinformatics* 34(5):867–868 (2018). [doi:10.1093/bioinformatics/btx699](https://doi.org/10.1093/bioinformatics/btx699) |
| DRAGEN | Behera et al. *Nature Biotechnology* (2024). [doi:10.1038/s41587-024-02382-1](https://doi.org/10.1038/s41587-024-02382-1) |
| DRAGMAP | No dedicated paper — cite the DRAGEN paper above and [github.com/Illumina/DRAGMAP](https://github.com/Illumina/DRAGMAP) with the version used |
| vg / vg giraffe | Sirén et al. *Science* 374(6574):abg8871 (2021). [doi:10.1126/science.abg8871](https://doi.org/10.1126/science.abg8871) |
| GraphAligner | Rautiainen & Marschall. *Genome Biology* 21:253 (2020). [doi:10.1186/s13059-020-02157-2](https://doi.org/10.1186/s13059-020-02157-2) |
| Winnowmap2 | Jain et al. *Nature Methods* 19, 705–710 (2022). [doi:10.1038/s41592-022-01457-8](https://doi.org/10.1038/s41592-022-01457-8); Jain et al. *Bioinformatics* 36(Suppl 1):i111–i118 (2020). [doi:10.1093/bioinformatics/btaa435](https://doi.org/10.1093/bioinformatics/btaa435) |
