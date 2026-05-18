---
layout: case-study
title: Hippocampal volume quantification in Alzheimer's progression
description: End-to-end AI pipeline from curated MRI to automated hippocampal volumetry, with a path to DICOM-based clinical workflows.
importance: 1
category: personal
img: assets/img/1.jpg
github: https://github.com/abeersethia/Hippocampal_Volume_Quantification_in_Alzheimers_Progression
metrics:
  - label: Dice (mean)
    value: "0.916"
  - label: Dataset
    value: Medical Decathlon (260 vol.)
  - label: Stack
    value: PyTorch · DICOM
---

## Summary

End-to-end system: segment the hippocampus on T2 MRI (cropped hippocampus regions), derive volume from 3D masks, and route outputs toward clinical-style review—including a DICOM-oriented integration track (Orthanc / OHIF-style workflow) for deployment experiments.

## Challenge

**Situation:** Alzheimer's progression often shows hippocampal atrophy. MRI volumetry helps, but manual slice-by-slice segmentation is slow, rater-dependent, and hard to scale for longitudinal monitoring.

**Task:** Build a reproducible pipeline that (1) curates and validates imaging data, (2) trains a 3D-aware segmentation model with strong overlap to reference masks, and (3) shows how automated outputs could flow into a PACS-like environment with structured reporting—without claiming regulatory clearance, but demonstrating a credible research-to-integration path.

## Process

1. **Data curation** — EDA and cleaning on the Medical Decathlon hippocampus task; standardized NIFTI volumes and masks (anterior / posterior labels); outlier handling to **260** training volumes.
2. **Modeling** — **Recursive U-Net** with skip connections; **64×64** 2D patches; Adam, cross-entropy; 10 epochs; experiment logging for iteration.
3. **Clinical integration track** — DICOM ingestion, inference, and report-oriented outputs; scripts to simulate study send/receive with **Orthanc** and **OHIF** for viewer-based review.

## Results

- **Segmentation:** mean **Dice 0.916**, mean **Jaccard 0.846**; per-volume Dice typically **0.85–0.95** on held-out evaluation.
- **Deliverables:** three stages—curated data + EDA, trained model + `results.json`, Section-3 path with sample report artifacts and deploy scripts for end-to-end testing.

## Impact

Automated volumetry shortens the path from scan to **consistent, repeatable** hippocampal measurements for research cohorts and future multi-site validation—while keeping expert review in the loop.

## Links

- [Code on GitHub](https://github.com/abeersethia/Hippocampal_Volume_Quantification_in_Alzheimers_Progression)
