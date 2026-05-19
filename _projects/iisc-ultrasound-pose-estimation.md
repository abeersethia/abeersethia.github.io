---
layout: case-study
title: Trackerless ultrasound pose estimation & 3D reconstruction
description: Self-supervised temporal pose estimation from B-mode sequences for freehand 3D ultrasound—limited pose labels, clinical-style review paths.
importance: 5
listed: true
categories: 
    - research
    - coursework
img: assets/img/projects/iisc-ultrasound-3d-reconstruction.png
metrics:
  - label: Role
    value: Research Intern · AI
  - label: Org
    value: IISc Bangalore
  - label: Period
    value: Dec 2025 – Present
---

## Summary

Bachelor thesis work at the Indian Institute of Science on **self-supervised temporal ultrasound pose estimation** under limited pose supervision, aimed at **trackerless freehand 3D reconstruction** from B-mode image sequences—reducing reliance on external tracking hardware while keeping reconstruction quality auditable for research use.

## Context

**Setting:** Freehand 3D ultrasound depends on knowing how the probe moves between frames. Optical or electromagnetic trackers add cost, calibration burden, and workflow friction in point-of-care settings.

**Collaborators:** [Dr. Manish Arora](https://dm.iisc.ac.in/utsaah/dr-manish-arora/) and [Ms. Saladi Pravallika (PMRF)](https://dm.iisc.ac.in/utsaah/saladi-pravallika/), Department of Computational and Data Sciences, IISc Bangalore.

## Challenge

**Situation:** Pose labels are sparse or noisy in real acquisition logs; naive supervised pose networks overfit to scanner-specific appearance and fail when domain shifts.

**Task:** Learn temporal structure in B-mode streams so pose can be inferred with **minimal explicit pose supervision**, then feed stable pose estimates into a 3D compounding / reconstruction pipeline with clear validation—not a regulatory product claim, but a reproducible research stack.

## Approach

1. **Data & acquisition** — Curate B-mode sequences with synchronized metadata; standardize preprocessing (spacing, intensity normalization) and document train/val splits by subject where possible.
2. **Self-supervised learning** — Temporal consistency objectives and auxiliary signals so the model exploits frame-to-frame geometry without dense pose labels on every frame.
3. **Reconstruction track** — Integrate predicted poses into volume reconstruction; compare against tracker-based or slice-stacking baselines on held-out scans.
4. **Tooling** — PyTorch training, OpenCV preprocessing, 3D Slicer for visualization, Weights & Biases for experiment tracking.

## Results

- End-to-end pipeline from **sequence ingestion → pose estimation → 3D reconstruction** with versioned configs and logged runs.
- Qualitative and quantitative checks on held-out acquisitions (pose stability, reconstruction continuity)—metrics reported per experiment release in the thesis repository when public.

## Impact

Supports **trackerless** 3D ultrasound research at IISc: lower hardware friction for studies that still need volumetric review, with a path to compare learned poses against external tracking when ground truth exists.

## Links

- Thesis and code links will be added when the repository is public.
