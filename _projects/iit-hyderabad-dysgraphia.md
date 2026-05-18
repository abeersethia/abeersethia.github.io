---
layout: case-study
title: Dysgraphia handwriting analysis pipeline
description: Computer-vision and ML pipeline for handwriting-based dysgraphia screening—CfHE summer project, IIT Hyderabad.
importance: 2
listed: true
category: research
img: assets/img/projects/iit-hyderabad-dysgraphia.png
metrics:
  - label: Role
    value: Summer Project Intern
  - label: Org
    value: CfHE · IIT Hyderabad
  - label: Period
    value: Jun – Jul 2025
---

## Summary

Summer project at the **Center for Healthcare Entrepreneurship (CfHE), IIT Hyderabad**, designing a **dysgraphia handwriting analysis pipeline** that uses computer vision and machine learning to extract writing features useful for screening and research—not a diagnostic device, but a structured path from scan → features → model outputs.

## Context

**Setting:** Dysgraphia assessment often relies on expert review of handwriting samples. Automated feature extraction can support triage, longitudinal tracking, and research cohorts if the pipeline is transparent and robust to capture conditions.

## Challenge

**Situation:** Handwriting images vary in paper, pen pressure, scanning quality, and writer age; brittle heuristics fail across sites.

**Task:** Build an end-to-end pipeline—**ingestion, preprocessing, feature extraction, and ML scoring**—with documented assumptions so clinicians or researchers can audit what the model sees.

## Approach

1. **Data handling** — Standardize scans (deskew, crop, contrast); define inclusion rules and holdout splits.
2. **Feature engineering & learning** — Classical CV descriptors plus learned representations where appropriate; compare interpretable baselines to stronger models.
3. **Validation** — Report metrics with confidence intervals where sample size allows; error analysis by acquisition condition.
4. **Handoff** — Notebooks or scripts with fixed configs so CfHE collaborators can rerun without environment drift.

## Results

- Working prototype pipeline from raw handwriting images to **feature tables and model scores**.
- Documentation of preprocessing choices and failure modes (blur, partial strokes, layout clutter).

## Impact

Gives CfHE a **reusable analysis stack** for dysgraphia-oriented studies—faster iteration on cohorts while keeping human review in the loop for any clinical decision.

## Links

- Add CfHE or repository link when available for public release.
