# Alignment Picker

A single-page tool for building DNA and RNA-seq alignment commands.

Choose your experiment type, sequencing platform, and aligner — get a ready-to-run shell command with pros/cons analysis updated as you make selections.

**[Try it → kuod.github.io/alignment-picker](https://kuod.github.io/alignment-picker)**

## Supported aligners

| Aligner | Data type |
|---|---|
| BWA-MEM2 | DNA short reads |
| BWA-MEM | DNA short + long reads |
| Bowtie2 | DNA short reads |
| Minimap2 | DNA long reads (PacBio, ONT) |
| STAR | RNA-seq short reads |
| HISAT2 | RNA-seq short reads |
| Salmon | RNA-seq quantification |
| Kallisto | RNA-seq quantification |
| Minimap2 | Long-read RNA-seq |

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
| samtools | Danecek et al. *GigaScience* 10(2):giab008 (2021). [doi:10.1093/gigascience/giab008](https://doi.org/10.1093/gigascience/giab008) |
