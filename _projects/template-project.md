---
layout: case-study
title: DropEdge++ with Johnson–Lindenstrauss Projection
description: **Minor Project:** Structure-aware graph regularization and dimensionality reduction for scalable deep GCNs on citation networks.
importance: 6
listed: true
categories:
  - research
img: assets/img/projects/iit-kharagpur-attractor-reconstruction.png
metrics:
  - label: Accuracy
    value: "86.2%"
  - label: AUC
    value: "0.9789"
  - label: Feature Reduction
    value: "2.8×"
---

## Context

Research project focused on improving the scalability and robustness of deep Graph Convolutional Networks (GCNs) for node classification on citation graph benchmarks such as Cora, Citeseer, and PubMed. The work explored how structure-aware graph regularization and dimensionality reduction could be combined to address oversmoothing in deeper GCN architectures while improving computational efficiency.

## Challenge

Deep GCNs often suffer from **oversmoothing**, where repeated neighborhood aggregation causes node embeddings from different classes to become increasingly similar. This degrades classification performance as network depth increases. At the same time, high-dimensional sparse node features increase computational and memory costs during message passing.

The objective was to design a framework that:
- Preserves meaningful graph structure during propagation,
- Enables stable training of deeper GCN architectures,
- Reduces feature dimensionality without significantly harming graph geometry,
- Improves runtime and memory efficiency while maintaining strong classification performance.

## Approach

1. **Feature Compression with JL Projection**  
   Applied Johnson–Lindenstrauss (JL) random projection to compress sparse node features while approximately preserving pairwise distances and neighborhood geometry. Feature dimensions were reduced from 1433 to lower-dimensional embeddings such as 512.

2. **Structure-Aware DropEdge++**  
   Extended standard DropEdge regularization using:
   - Layer-dependent edge dropping schedules,
   - Feature-aware edge retention based on cosine similarity in projected feature space.  
   
   This adaptive strategy retained semantically informative connections while preventing excessive graph smoothing in deeper layers. 

3. **Residual Deep GCN Training**  
   Trained residual GCN architectures with dropout, Adam optimization, and early stopping on validation loss. Multiple depths and JL dimensions were evaluated to identify stable performance tradeoffs.

## Results

- **Accuracy:** 86.2%
- **AUC:** 0.9789
- **Loss:** 0.625
- **Feature Compression:** ~2.8× reduction (1433 → 512 dimensions)

The proposed framework outperformed the classical GCN baseline (~81.5%) while reducing runtime and memory usage through dimensionality reduction. Structure-aware edge retention improved convergence stability and enabled deeper GCN stacks (up to 32 layers) to remain trainable without severe oversmoothing. 

## Impact

This work demonstrates how combining geometry-preserving random projections with adaptive graph regularization can improve both the scalability and generalization of deep graph neural networks. The framework provides a lightweight and computationally efficient alternative for large-scale graph learning tasks while maintaining competitive node classification performance.

The project also highlights the practical importance of balancing structural sparsification and feature preservation in modern GNN pipelines, particularly for homophilous citation networks.
