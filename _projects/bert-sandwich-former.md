---
layout: case-study
title: BERT-based SandwichFormer for CoLA and IMDb
description: Coursework (NLP) — custom BERT variant with sandwiched encoder blocks and Longformer attention for grammaticality and sentiment classification.
importance: 2
listed: true
categories:
  - coursework
img: assets/img/projects/bert-sandwich-former.png
github: https://github.com/abeersethia/Sandwich_Former
metrics:
  - label: CoLA MCC
    value: "0.57"
  - label: IMDb accuracy
    value: "88%"
  - label: Course
    value: DSE 4402 · NLP
---

## Summary

Team coursework project (**DSE 4402 — Natural Language Processing**, MIT Manipal, Jan–May 2025) with **Shaurya Singh Rathore**. Built a **SandwichFormer**—a BERT-style encoder with reordered sublayers and **Longformer** sparse attention—trained from scratch for **linguistic acceptability** (CoLA) and **sentiment classification** (IMDb).

## Situation

Transformer models like BERT dominate NLP, but their fixed layer stack and quadratic attention limit adaptability. For this project, two bottlenecks mattered:

- **CoLA (GLUE):** binary grammaticality judgments need strong syntactic signal; generic BERT fine-tuning plateaus around modest Matthews correlation.
- **IMDb:** long movie reviews stress standard BERT’s sequence length and attention cost.

Baseline BERT also uses a rigid **Attention → Add/Norm → FFN → Add/Norm** order that may not be optimal for every downstream task.

## Task

Design and implement a **custom BERT variant** that:

1. Reorders transformer sublayers (sandwiched feed-forward and attention blocks) for better gradient flow and expressivity.
2. Scales to **longer sequences** via sparse attention (Longformer backbone).
3. Trains and evaluates on **CoLA** and **IMDb** with reproducible preprocessing, training, and inference pipelines.
4. **Outperforms a standard BERT baseline** on task-appropriate metrics (MCC on CoLA, accuracy/F1 on IMDb).

## Action

1. **Architecture** — Implemented `CustomEncoderBlock` with modified normalisation and MLP ordering (`Attention → FFN → Add/Norm` in sandwiched blocks vs. standard BERT). Used **Longformer** (Hugging Face) as the backbone for long-document attention; binary classification head with dropout.
2. **Data pipeline** — Modular `dataset.py`: GLUE CoLA loading, tokenisation with custom `[SOS]` / EOS markers, truncation, padding, and attention masks; same pipeline extended to IMDb for sentiment.
3. **Training** — `train.py` + `config.py`: AdamW, linear warmup/decay, 3 epochs, batch size 8, learning rate `2e-5`, max length 512, gradient clipping (`max_norm=1.0`), mixed-precision support; **Weights & Biases** for run tracking. Addressed OOM via gradient checkpointing.
4. **Evaluation** — CoLA: **Matthews correlation coefficient (MCC)** vs. BERT baseline (~0.52); IMDb: accuracy and F1 on held-out reviews.

## Result

| Dataset | Metric | SandwichFormer | Baseline / note |
| :--- | :--- | :--- | :--- |
| **CoLA** | MCC | **~0.57** | BERT ~0.52 (+~5 pts) |
| **CoLA** | Accuracy | **75%** | Grammaticality classification |
| **CoLA** | F1 | **0.86** | Strong acceptability separation |
| **IMDb** | Accuracy | **88%** | Sentiment (positive / negative) |
| **IMDb** | F1 | **0.89** | Long-review sentiment |

Deliverables: end-to-end **PyTorch** codebase (`model.py`, `train.py`, `dataset.py`, `config.py`) with documented preprocessing and inference paths.

## Impact

Shows that **layer reordering** and **sparse long-context attention** can improve both syntactic and sentiment tasks without relying solely on off-the-shelf BERT fine-tuning. The modular design supports swapping datasets and attention configurations for other binary classification problems in NLP coursework and follow-on experiments.
