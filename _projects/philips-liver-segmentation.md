---
layout: case-study
title: Expert-guided liver lesion segmentation (CT/MRI)
description: Clinical-style 3D segmentation of liver lesions in CT and MRI with radiology-guided labels—Philips Innovation Campus, Bangalore.
importance: 3
listed: true
categories:
  - industry
img: assets/img/projects/philips-liver-segmentation.png
metrics:
  - label: Role
    value: Project Intern
  - label: Org
    value: Philips · Bangalore
  - label: Period
    value: Apr – Jul 2025
certificate:
  label: Certificate
  file: assets/img/certificates/philips-internship-certificate.png
  alt: "Philips internship certificate — Expert-Guided Automated Segmentation of Liver Lesions in CT Imaging"
---

## Summary

Clinical diagnostics internship at **Philips Innovation Campus, Bangalore**, on **expert-guided automated segmentations of liver lesions** in **CT and MRI**—building hospital-aware 3D pipelines with radiologist-in-the-loop labels, ITK-SNAP / 3D Slicer review, and PyTorch training aimed at deployment-minded quality gates.

## Context

**Setting:** Liver lesion measurement and monitoring depend on consistent 3D delineations across phases and modalities. Manual contouring is slow and variable; automation must respect protocol differences and expert corrections.

**Mentors:** [Dr. Rajagopal KV](https://www.manipal.edu/kmc-manipal/department-faculty/faculty-list/rajagopal-kv/_jcr_content.html) and [Dr. Dinesh Mysore Siddu](https://www.linkedin.com/in/dinesh-mysore-siddu-4119113/).

## Challenge

**Situation:** Lesion appearance shifts with contrast phase, slice thickness, and vendor reconstructions; models trained on one site often fail silently on another.

**Task:** Deliver **reproducible 3D segmentation** workflows with frozen label definitions, expert-reviewed corrections, and validation artifacts Philips collaborators can trace—without over-claiming regulatory clearance.

## Approach

1. **Labeling protocol** — Expert-guided annotations in **ITK-SNAP** and **3D Slicer**; versioned label maps and QC checklists per release.
2. **Preprocessing** — DICOM / NIfTI normalization, resampling, and intensity handling documented per modality (CT vs MRI).
3. **Modeling** — PyTorch 3D segmentation with augmentations matched to acquisition variability; early stopping on holdouts that mirror deployment geography when possible.
4. **Review loop** — Side-by-side overlays and error buckets (under-segmentation, leakage into vessels, phase confusion) before any “production” handoff discussion.

## Results

- Structured validation tables (Dice / surface metrics where applicable) tied to each checkpoint.
- Containerized or scripted inference notes plus sample manifests for internal rerun.

## Impact

Shortens the loop between **ML and clinical stakeholders** at Philips—clear what changed between runs when scanner protocols or label guidelines evolve.
