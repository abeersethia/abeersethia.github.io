---
layout: case-study
title: Attractor manifold time-series reconstruction
description: Reconstructing nonlinear dynamical time series from attractor embeddings using temporal convolutional networks—KLIV Lab, IIT Kharagpur.
importance: 4
listed: true
categories:
  - research
img: assets/img/projects/iit-kharagpur-attractor-reconstruction.png
metrics:
  - label: Role
    value: Research Intern
  - label: Org
    value: KLIV Lab · IIT KGP
  - label: Period
    value: Apr – Oct 2025
certificate:
  label: Certificate
  file: assets/pdf/kliv-iit-kharagpur-certificate.pdf
  alt: "KLIV Lab, IIT Kharagpur internship certificate — Reconstruction of Time Series Data from Attractor Manifold using Temporal Convolutional Neural Network"
ppt:
  label: PPT
  file: assets/pdf/kliv-project-summary.pdf
  alt: "KLIV Lab project summary — attractor manifold time-series reconstruction (IIT Kharagpur)"
---

## Summary

Research internship at the **KLIV Lab, IIT Kharagpur**, on reconstructing **time series from attractor manifolds** using **temporal convolutional networks (TCNs)**—connecting nonlinear dynamics, signal processing, and deep learning for faithful recovery of system trajectories from embedded states.

## Context

**Setting:** Many physiological and engineered systems exhibit low-dimensional structure in reconstructed phase space (delay embedding / attractor views). Recovering the original time domain from manifold representations is useful for forecasting, denoising, and comparing models against dynamical systems theory.

**Supervisors:** [Dr. Debdoot Sheet](https://facweb.iitkgp.ac.in/~debdoot/) and [Mr. Dipayan Dewan](https://scholar.google.com/citations?user=nUlXiXoAAAAJ&hl=en).

## Challenge

**Situation:** Manifold embeddings discard some temporal ordering cues; naive decoders can smear dynamics or violate topology.

**Task:** Design a **TCN-based reconstruction** pipeline that maps attractor samples back to consistent time-series segments, with losses that preserve dynamical structure where possible (including topology-aware objectives explored in the project).

## Approach

1. **Embedding & preprocessing** — Build attractor representations from multivariate series; fix windowing, delay parameters, and normalization per dataset release.
2. **Model** — Temporal CNN stacks with receptive fields matched to the intrinsic timescale of each benchmark system.
3. **Training objectives** — Combine reconstruction error with constraints informed by nonlinear dynamics (e.g., topology-preserving terms where applicable).
4. **Evaluation** — Compare against baselines on held-out trajectories; report error in time domain and stability under noise.

## Results

- Reproducible training and evaluation scripts with logged hyperparameters and checkpoint selection rules.
- Demonstrated recovery of key dynamical features on project benchmarks—quantitative tables versioned with each model release.

## Impact

Bridges **dynamical systems** thinking and **deep sequence models** at KLIV: a template for asking whether reconstructed series remain physically plausible, not only low MSE.

## Links

- **Certificate** — internship completion letter (Apr–Oct 2025).
- **PPT** — project summary presentation (PDF).
