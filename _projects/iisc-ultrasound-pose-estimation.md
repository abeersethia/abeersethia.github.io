---
layout: case-study
title: Trackerless ultrasound pose estimation & 3D reconstruction
description: Self-supervised temporal pose estimation from B-mode sequences for freehand 3D ultrasound—limited pose labels, clinical-style review paths.
importance: 6
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
mid_term_presentation:
  label: Mid-Term Presentation
  file: assets/pdf/iisc-ultrasound-mid-term-presentation.pdf
  alt: "IISc Bangalore — mid-term presentation on trackerless ultrasound pose estimation and 3D reconstruction (UTSAAH Lab)"
---

## Summary
Bachelor thesis at the Indian Institute of Science on self-supervised temporal ultrasound pose estimation for trackerless freehand 3D ultrasound reconstruction. The work focuses on learning probe motion directly from B-mode ultrasound sequences under limited pose supervision, with the goal of reducing dependence on external electromagnetic or optical tracking systems while keeping motion estimation temporally consistent.

## Context
**Setting:** Conventional freehand 3D ultrasound reconstruction requires external tracking devices to spatially register each 2D frame. These systems work, but they add hardware cost, calibration overhead, and workflow complexity that limits their use in portable and point-of-care settings.

**Collaborators:** [Dr. Manish Arora](https://dm.iisc.ac.in/utsaah/dr-manish-arora/) and [Ms. Saladi Pravallika (PMRF)](https://dm.iisc.ac.in/utsaah/saladi-pravallika/), UTSAAH Lab, IISc Bangalore.

## Challenge
Ultrasound images contain speckle noise, low-texture regions, inconsistent anatomical landmarks, and only partial spatial observations. Frame-to-frame motion estimation is unreliable under these conditions, and small rotational or translational errors compound over long sequences, causing trajectory drift and degraded 3D reconstructions.

The task was to build a trackerless framework that learns temporally consistent, geometry-aware representations from ultrasound sequences, estimates relative probe motion accurately with minimal labeled pose data, and produces stable volumetric reconstructions.

## Approach
1. **Self-supervised temporal learning** - Learn robust frame representations from unlabeled B-mode sequences using temporal consistency objectives and auxiliary sequence-based supervision.
2. **Sequence-based motion estimation** - Predict relative probe translation and rotation from consecutive frames using temporal modeling architectures.
3. **Geometry-aware pose modeling** - Represent motion using rigid-body transformations and quaternion-based rotational parameterization for stability and mathematical consistency.
4. **Temporal consistency constraints** - Apply geometric and temporal motion consistency losses to reduce long-term trajectory drift.
5. **Reconstruction pipeline integration** - Chain predicted relative motions into continuous probe trajectories for trackerless volumetric reconstruction.
6. **Evaluation** - Assess pose stability, temporal consistency, and reconstruction continuity on held-out acquisitions using qualitative and quantitative protocols.

## Results
- End-to-end pipeline from sequence ingestion to pose estimation to 3D reconstruction, with versioned configs and logged runs.
- Qualitative and quantitative evaluation on held-out acquisitions (pose stability, reconstruction continuity); metrics reported per experiment release in the thesis repository when public.

## Impact
The framework is a reproducible research stack for comparing learned probe trajectories against externally tracked baselines when ground-truth pose data is available. More broadly, it is a step toward 3D ultrasound reconstruction that does not require dedicated tracking hardware, which matters most in portable and point-of-care settings where that hardware is the bottleneck.
