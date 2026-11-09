---
layout: case-study
title: DropEdge++ with Johnson–Lindenstrauss Projection
description: Social Network Analysis project - structure-aware edge dropping plus Johnson–Lindenstrauss feature compression for deeper, cheaper GCNs on the Cora citation network.
importance: 3
listed: true
categories:
  - coursework
img: assets/img/projects/dropedge-plusplus.png
metrics:
  - label: Cora accuracy
    value: "86.2%"
  - label: AUC
    value: "0.9789"
  - label: Feature reduction
    value: "2.8×"
---

## Summary

Course project for Social Network Analysis (B.Tech DSE, Semester 7, November 2025), done with Shaurya Singh Rathore. We combined two ideas to make Graph Convolutional Networks (GCNs) deeper and cheaper:

- **Johnson–Lindenstrauss (JL) random projection** compresses node features from 1,433 to 512 dimensions.
- **Structure-aware DropEdge (DropEdge++)** removes edges layer by layer, choosing which ones by how similar their endpoints are.

On the Cora citation network the combined model reached **86.2% accuracy and 0.9789 AUC**, against about 81.5% for a classical GCN. Residual stacks up to 32 layers still trained without collapsing.

**My part:** the implementation details and the literature review. Shaurya integrated JL with the GCN and ran the data analysis, and we wrote the report together.

## Problem

A GCN layer averages each node with its neighbours, which works like a low-pass filter on the graph. Stacking many layers repeats that averaging until nodes from different classes look the same. This is **oversmoothing**, and it is why most GCNs stop at two or three layers. Wide, sparse node features add a second cost, because every message-passing step scales with the feature dimension.

The goal was a model that stays accurate as it gets deeper, while doing less work per layer.

## What we built

{% include figure.liquid
  path="assets/img/projects/dropedge/method.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="Method diagram: Cora features are compressed by a JL projection to 512 dimensions, edges are scored by cosine similarity in the projected space, and a residual GCN of 8 to 32 layers runs each layer on its own sampled graph. Below, three example layers keep 9, 7 and 5 of 10 edges, with low-similarity edges between different topics dropped first."
  caption="Features are compressed once with JL; edges are scored by similarity in that cheaper space; each GCN layer then runs on its own sampled graph, dropping more edges with depth and low-similarity edges first."
%}

1. **JL feature compression** - Multiplied the feature matrix by a fixed Gaussian random matrix (Z = XR, with entries drawn from N(0, 1/m)), projecting 1,433 dimensions down to m = 512. The JL lemma guarantees that pairwise distances survive within a small error, and each message-passing layer now scales with the number of edges times 512 rather than times 1,433.
2. **Layer-dependent drop schedule** - The share of edges dropped changes with depth. Shallow layers keep most edges to gather local evidence, and deeper layers drop more to stop features from over-mixing.
3. **Similarity-aware retention** - Each edge is scored by the cosine similarity of its two endpoints in the projected space. On a homophilous graph like Cora, similar papers usually share a topic, so those edges are kept and dissimilar ones go first. Scoring in 512 dimensions instead of 1,433 keeps this cheap.
4. **Residual GCN training** - Residual GCN blocks with dropout, cross-entropy on the labelled nodes, Adam with weight decay, and early stopping on validation loss.
5. **Sweeps** - Tried JL dimensions of 256, 512 and 1,024 (plus 128 in ablations), at depths of 8, 16 and 32 layers.

## Data

{% include figure.liquid
  path="assets/img/projects/dropedge/cora-network.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="Node-link drawing of the Cora citation network, with dense coloured clusters of papers by topic and sparse grey strands linking them"
  caption="The Cora citation network. Papers cluster tightly by research area, which is why keeping high-similarity edges helps."
%}

We used the standard Planetoid benchmarks (Cora, Citeseer and PubMed) in the transductive setting, with the standard splits of 20 labelled nodes per class. Each node is a paper described by a sparse bag-of-words vector, and each edge is a citation. Features were row-normalised, self-loops added, and the adjacency matrix symmetrically normalised. Reported results are for Cora: 2,708 papers, 1,433 features and 7 topics.

## Results

| Model                     | Cora accuracy |    AUC | Feature dim. |
| :------------------------ | ------------: | -----: | -----------: |
| Classical GCN (baseline)  |        ~81.5% |      - |        1,433 |
| **DropEdge++ + JL (512)** |     **86.2%** | 0.9789 |      **512** |

Loss for the final configuration was 0.625.

- **+4.7 points over a classical GCN** with features 2.8× smaller, which also lowered runtime and memory.
- **512 dimensions was the sweet spot.** Going down to 128 cost some accuracy, while 512 and 1,024 matched each other within normal run-to-run variance.
- **Depth stayed trainable.** With the drop schedule, 32-layer residual stacks still trained. Without it, the same depth oversmoothed unless edges were dropped so aggressively that the graph started to fall apart.
- **Similarity beats random.** At the same expected number of dropped edges, similarity-aware dropping edged out uniform DropEdge, especially at greater depth, and converged more smoothly.

## Takeaways

The two parts help each other. JL makes features cheap enough to compare, and those comparisons are what let DropEdge++ decide which edges matter. On homophilous graphs, which edges you drop matters as much as how small you make the features.

**Limitations and next steps:** results are from Cora only, without multiple seeds or confidence intervals. Next steps are learnable projections with an orthogonality penalty, curriculum schedules for the drop rate, heterophilous and temporal graphs, larger OGB benchmarks, and robustness tests under deliberate edge corruption.

**References:** [Kipf & Welling, GCN (ICLR 2017)](https://arxiv.org/abs/1609.02907) · [Rong et al., DropEdge (ICLR 2020)](https://arxiv.org/abs/1907.10903) · Han et al., Structure-Aware DropEdge (IEEE TNNLS 2023)
