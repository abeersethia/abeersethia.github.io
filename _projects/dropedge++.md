---
layout: case-study
title: DropEdge++ with Johnson–Lindenstrauss Projection
description: Minor project — structure-aware graph regularization and dimensionality reduction for scalable deep GCNs on citation networks.
importance: 3
listed: true
categories:
  - coursework
img: assets/img/projects/dropedge-plusplus.png
metrics:
  - label: Accuracy
    value: "86.2%"
  - label: AUC
    value: "0.9789"
  - label: Feature Reduction
    value: "2.8×"
---

## Summary
Research project on improving the scalability and robustness of deep Graph Convolutional Networks (GCNs) for node classification on citation graph benchmarks (Cora, Citeseer, PubMed). The work combines structure-aware graph regularization with dimensionality reduction to address oversmoothing in deeper GCN architectures.

## Challenge
Deep GCNs suffer from oversmoothing: repeated neighborhood aggregation causes node embeddings from different classes to converge, degrading classification accuracy as depth increases. High-dimensional sparse node features compound this by raising computational and memory costs during message passing.

The objective was a framework that preserves meaningful graph structure during propagation, trains stably at greater depth, reduces feature dimensionality without distorting graph geometry, and holds classification performance while cutting runtime and memory usage.

## Process
1. **Feature compression with JL projection** - Applied Johnson-Lindenstrauss random projection to compress sparse node features while approximately preserving pairwise distances and neighborhood geometry. Feature dimensions were reduced from 1433 to 512.
2. **Structure-aware DropEdge++** - Extended standard DropEdge with layer-dependent edge dropping schedules and feature-aware edge retention based on cosine similarity in the projected feature space. This kept semantically informative connections while reducing graph smoothing in deeper layers.
3. **Residual deep GCN training** - Trained residual GCN architectures with dropout, Adam optimization, and early stopping on validation loss. Multiple depths and JL dimensions were evaluated to map out stable performance tradeoffs.

## Results
- Accuracy: 86.2%
- AUC: 0.9789
- Loss: 0.625
- Feature compression: ~2.8x reduction (1433 -> 512 dimensions)

This outperformed the classical GCN baseline (~81.5%) while cutting runtime and memory through dimensionality reduction. Structure-aware edge retention improved convergence stability and kept GCN stacks up to 32 layers trainable without severe oversmoothing.

## Impact
Combining geometry-preserving random projections with adaptive graph regularization improved both scalability and generalization without adding significant complexity. The more interesting finding was a practical tradeoff that is easy to overlook: on homophilous citation networks, how aggressively you sparsify edges matters as much as how you compress features.