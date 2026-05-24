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
mid_term_presentation:
  label: Mid-Term Presentation
  file: assets/pdf/iisc-ultrasound-mid-term-presentation.pdf
  alt: "IISc Bangalore — mid-term presentation on trackerless ultrasound pose estimation and 3D reconstruction (UTSAAH Lab)"
---

## Summary

Bachelor thesis work at the Indian Institute of Science on self-supervised temporal ultrasound pose estimation for **trackerless freehand 3D ultrasound reconstruction**, focused on learning probe motion directly from B-mode ultrasound sequences under limited pose supervision. The work aims to reduce dependence on external electromagnetic or optical tracking systems while maintaining temporally consistent motion estimation and reconstruction quality for research-oriented volumetric imaging.

## Context

**Setting:** Conventional freehand 3D ultrasound reconstruction requires external tracking devices to estimate the spatial pose of each 2D ultrasound frame. Although effective, these systems introduce additional hardware cost, calibration overhead, and workflow complexity, limiting scalability in portable and point-of-care imaging environments.

**Collaborators:** [Dr. Manish Arora](https://dm.iisc.ac.in/utsaah/dr-manish-arora/) and [Ms. Saladi Pravallika (PMRF)](https://dm.iisc.ac.in/utsaah/saladi-pravallika/), Department of Computational and Data Sciences, IISc Bangalore.

## Challenge

**Situation:** Ultrasound images contain speckle noise, low-texture regions, inconsistent anatomical landmarks, and only partial spatial observations, making reliable frame-to-frame motion estimation difficult. Small rotational or translational prediction errors accumulate over long sequences, leading to trajectory drift and degraded 3D reconstructions.

**Task:** Develop a trackerless framework capable of learning temporally consistent and geometry-aware representations from ultrasound frame sequences, enabling accurate relative probe motion estimation with minimal labeled pose data for stable volumetric reconstruction.

## Approach

1. **Self-supervised temporal learning** - Learn robust frame representations from unlabeled B-mode ultrasound sequences using temporal consistency objectives and auxiliary sequence-based supervision.
2. **Sequence-based motion estimation** - Predict relative probe translation and rotation from consecutive ultrasound frames using temporal modeling architectures.
3. **Geometry-aware pose modeling** - Represent motion using rigid-body transformations and quaternion-based rotational parameterization to improve stability and mathematical consistency.
4. **Temporal consistency constraints** - Incorporate geometric and temporal motion consistency losses to reduce long-term trajectory drift and improve physically plausible motion estimation.
5. **Reconstruction pipeline integration** - Integrate predicted relative motions into continuous probe trajectories for trackerless volumetric freehand ultrasound reconstruction.
6. **Evaluation & validation** - Assess pose stability, temporal consistency, and reconstruction continuity on held-out acquisitions using qualitative and quantitative evaluation protocols.

## Results

- End-to-end pipeline from **sequence ingestion → pose estimation → 3D reconstruction** with versioned configs and logged runs.
- Qualitative and quantitative checks on held-out acquisitions (pose stability, reconstruction continuity)—metrics reported per experiment release in the thesis repository when public.

## Impact

Contributes toward **scalable and lower-cost trackerless 3D ultrasound research**, supporting portable and point-of-care volumetric imaging workflows without reliance on dedicated tracking hardware. The framework provides a reproducible research stack for comparing learned probe trajectories against externally tracked baselines when ground-truth pose data is available.
