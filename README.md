# Alignment Picker

A single-page tool for building DNA and RNA-seq alignment commands.

Choose your experiment type, sequencing platform, and aligner — get a ready-to-run shell command with pros/cons analysis updated as you make selections.

**[Try it → kuod.github.io/alignment-picker](https://kuod.github.io/alignment-picker)**

## Supported aligners

| Aligner | Data type |
|---|---|
| BWA-MEM2 | DNA short reads |
| DRAGEN | DNA short reads (WGS/WES; commercial, Illumina hardware/cloud) |
| BWA-MEM | DNA short + long reads |
| Bowtie2 | DNA short reads |
| Minimap2 | DNA long reads (PacBio, ONT) |
| STAR | RNA-seq short reads |
| HISAT2 | RNA-seq short reads |
| Salmon | RNA-seq quantification |
| Kallisto | RNA-seq quantification |
| STARsolo | Single-cell / single-nucleus RNA-seq (10x 3′ v2/v3/v4, 5′) |
| alevin-fry (simpleaf) | Single-cell / single-nucleus RNA-seq (10x 3′ v2/v3/v4, 5′) |
| kallisto \| bustools (kb) | Single-cell / single-nucleus RNA-seq (10x 3′ v2/v3/v4, 5′) |
| Minimap2 | Long-read RNA-seq |
| vg giraffe | Pangenome / graph genome — DNA, Illumina short reads |
| GraphAligner | Pangenome / graph genome — DNA, PacBio + ONT long reads |

## Post-processing

For BAM-producing aligners, step 5 adds optional coordinate sorting, indexing, duplicate marking (`samtools markdup`), alignment QC (`samtools flagstat`, `samtools stats`, `mosdepth` coverage with an optional target BED), and a BAM vs CRAM output selector. CRAM output requires the exact reference FASTA to decode later.

## Single-cell RNA-seq

The *Single-cell (10x / droplet)* RNA technology builds STARsolo, `simpleaf` (alevin-fry) or `kb` (kallisto | bustools) commands for a chosen 10x chemistry, barcode whitelist and an optional single-nucleus mode (STARsolo `GeneFull`, alevin-fry USA counts, kb `--workflow nac`). R1 is the barcode + UMI read and R2 the cDNA read. Output is a cell × gene count matrix, so BAM post-processing is skipped (STARsolo can optionally also write a CB/UB-tagged BAM), and the QC step runs FastQC only — trimming barcode reads breaks cell/UMI assignment.

## Citations

If you use this tool to build a pipeline, please cite the underlying aligner:

| Tool | Reference |
|---|---|
| BWA-MEM2 | Vasimuddin et al. IEEE IPDPS 2019. [doi:10.1109/IPDPS.2019.00041](https://doi.org/10.1109/IPDPS.2019.00041) |
| BWA-MEM | Li H. arXiv:1303.3997 (2013). [arxiv:1303.3997](https://arxiv.org/abs/1303.3997) |
| Bowtie2 | Langmead & Salzberg. *Nature Methods* 9, 357–359 (2012). [doi:10.1038/nmeth.1923](https://doi.org/10.1038/nmeth.1923) |
| Minimap2 | Li H. *Bioinformatics* 34(18):3094–3100 (2018). [doi:10.1093/bioinformatics/bty191](https://doi.org/10.1093/bioinformatics/bty191) |
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
| vg / vg giraffe | Sirén et al. *Science* 374(6574):abg8871 (2021). [doi:10.1126/science.abg8871](https://doi.org/10.1126/science.abg8871) |
| GraphAligner | Rautiainen & Marschall. *Genome Biology* 21:253 (2020). [doi:10.1186/s13059-020-02157-2](https://doi.org/10.1186/s13059-020-02157-2) |
