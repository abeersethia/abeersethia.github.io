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
Team coursework project (DSE 4402: Natural Language Processing, MIT Manipal, Jan-May 2025) with Shaurya Singh Rathore. Built a SandwichFormer, a BERT-style encoder with reordered sublayers and Longformer sparse attention, trained from scratch on linguistic acceptability (CoLA) and sentiment classification (IMDb).

## Situation
Transformer models like BERT use a fixed Attention -> Add/Norm -> FFN -> Add/Norm layer stack and quadratic attention, which creates two concrete problems for this project. CoLA requires strong syntactic signal, and standard BERT fine-tuning plateaus around modest Matthews correlation. IMDb reviews are long enough that BERT's sequence length cap and attention cost become real constraints. The question was whether reordering sublayers and swapping in sparse attention could improve on both.

## Task
Design and implement a custom BERT variant that:
1. Reorders transformer sublayers (sandwiched FFN and attention blocks) for better gradient flow.
2. Scales to longer sequences via sparse attention (Longformer backbone).
3. Trains and evaluates on CoLA and IMDb with reproducible preprocessing, training, and inference pipelines.
4. Outperforms a standard BERT baseline on MCC for CoLA and accuracy/F1 for IMDb.

## Action
1. **Architecture** - Implemented `CustomEncoderBlock` with modified normalisation and MLP ordering (`Attention -> FFN -> Add/Norm` in sandwiched blocks vs. standard BERT). Used Longformer (Hugging Face) as the backbone for long-document attention; binary classification head with dropout.
2. **Data pipeline** - Modular `dataset.py`: GLUE CoLA loading, tokenisation with custom `[SOS]`/EOS markers, truncation, padding, and attention masks; same pipeline extended to IMDb.
3. **Training** - `train.py` + `config.py`: AdamW, linear warmup/decay, 3 epochs, batch size 8, learning rate `2e-5`, max length 512, gradient clipping (`max_norm=1.0`), mixed-precision support; Weights & Biases for run tracking. OOM resolved via gradient checkpointing.
4. **Evaluation** - CoLA: Matthews correlation coefficient (MCC) vs. BERT baseline (~0.52); IMDb: accuracy and F1 on held-out reviews.

## Result

| Dataset | Metric | SandwichFormer | Baseline / note |
| :--- | :--- | :--- | :--- |
| CoLA | MCC | ~0.57 | BERT ~0.52 (+~5 pts) |
| CoLA | Accuracy | 75% | Grammaticality classification |
| CoLA | F1 | 0.86 | Strong acceptability separation |
| IMDb | Accuracy | 88% | Sentiment (positive / negative) |
| IMDb | F1 | 0.89 | Long-review sentiment |

Deliverables: end-to-end PyTorch codebase (`model.py`, `train.py`, `dataset.py`, `config.py`) with documented preprocessing and inference paths.

## Impact
Layer reordering and sparse long-context attention improved both syntactic and sentiment tasks without relying on off-the-shelf BERT fine-tuning. The modular design makes it straightforward to swap in other datasets or attention configurations for binary classification problems, which proved useful for follow-on coursework experiments.