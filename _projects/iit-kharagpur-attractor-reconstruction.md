---
layout: case-study
title: Attractor manifold time-series reconstruction
description: KLIV Lab, IIT Kharagpur - recovering the full 3D Lorenz attractor from its X component alone, using Hankel delay embeddings and FNN-regularised autoencoders.
importance: 5
listed: true
categories:
  - research
img: assets/img/projects/iit-kharagpur-attractor-reconstruction.png
metrics:
  - label: Best hidden-Z corr.
    value: "0.944"
  - label: Architectures
    value: "5"
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

Research internship at the KLIV Lab, IIT Kharagpur. I built a pipeline that **reconstructs the full three-dimensional Lorenz attractor when the model's only input is its X coordinate**. The pipeline delay-embeds X into a Hankel matrix and trains an autoencoder with a false-nearest-neighbour (FNN) regulariser, so that its latent space unfolds into a copy of the hidden attractor.

I implemented and compared five encoder–decoder architectures in one modular framework. The best, **EDGeNet, recovered the hidden Y and Z components with correlations of 0.980 and 0.944**.

**Supervision:** [Dr. Debdoot Sheet](https://facweb.iitkgp.ac.in/~debdoot/), with mentoring from [Dr. Dipayan Dewan](https://scholar.google.com/citations?user=nUlXiXoAAAAJ&hl=en) and Dr. Suhita Karmakar.

## Context

Takens' theorem says that delayed copies of a single measured variable can recreate a system's full state space. That reconstruction is the foundation of Convergent Cross Mapping (CCM), which tests for causality in coupled nonlinear systems. The project follows [Gilpin (NeurIPS 2020)](https://arxiv.org/abs/2002.05909) in learning that embedding with a neural network instead of fixing it by hand, and asks which architecture learns it best.

## What I built

{% include figure.liquid
  path="assets/img/projects/iit-kharagpur/pipeline.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="Pipeline: Lorenz system with only X kept, Hankel embedding of shape B by 10 by 512, swappable encoder, latent manifold, decoder, with an FNN regulariser on the latent and a reconstruction loss on the decoder output, and evaluation against the true attractor"
  caption="Pipeline: the model's input is X alone. Its delay embedding is encoded into a latent manifold that the FNN loss keeps unfolded, and that manifold is compared with the true (X, Y, Z) attractor."
%}

1. **Data** - Simulated the Lorenz system and used only the X time series as model input. The true Y and Z serve as the reference for the reconstruction.
2. **Choosing the embedding dimension** - Measured the false-nearest-neighbour rate and forecasting skill (R²) against embedding dimension before any deep learning. This fixed how many delays the input needed (below).
3. **Hankel delay embedding** - Turned X into a 3D Hankel tensor of 10 overlapping windows of 512 samples each, with stride 5, giving an input of shape (B, 10, 512).
4. **Five swappable architectures** - EDGeNet (attention + residual), a lightweight U-Net, a causal autoencoder with dilated convolutions, an MLP and an LSTM, all behind one encoder–latent–decoder interface.
5. **Loss** - Reconstruction loss on the decoded signal plus a differentiable FNN penalty on the latent, which stops the learned attractor from folding onto itself.
6. **Evaluation framework** - Per-component correlation and MSE for X, Y and Z, 3D overlays and 2D projections against the true attractor, error over time, decoder fidelity after lag correction, and sweeps over latent size.

## Results

### Embedding dimension

{% include figure.liquid
  path="assets/img/projects/iit-kharagpur/fnn-embedding-dimension.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="Dual-axis plot: false nearest neighbour rate falls to zero from dimension 3 onwards, while forecast R squared rises and plateaus; a dashed line marks the Takens bound at 7"
  caption="FNN rate (blue) drops to zero by dimension 3, and forecasting skill (green) plateaus soon after. The dashed line is the Takens bound of 2n + 1 = 7 for the 3D Lorenz system."
%}

The attractor unfolds completely at three delays, the system's true dimension, and adding more delays does not improve forecasts. The 10-delay Hankel input therefore sits safely above both the empirical requirement and the Takens bound.

### Reconstructing the hidden attractor (EDGeNet)

{% include figure.liquid
  path="assets/img/projects/iit-kharagpur/edgenet-attractor-side-by-side.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="The original Lorenz attractor in blue next to EDGeNet's reconstruction in red, learned from the X component only after 250 epochs; both lobes are recovered, the right one more roughly"
  caption="Original Lorenz attractor (blue) and EDGeNet's reconstruction from X alone after 250 epochs (red). Both lobes and the switching between them are recovered."
%}

{% include figure.liquid
  path="assets/img/projects/iit-kharagpur/edgenet-attractor-projections.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="X-Y and X-Z projections of original and reconstructed attractors; the reconstruction matches the dense left lobe closely and is rougher on the right lobe"
  caption="X–Y and X–Z projections. The densely visited left lobe is matched closely; the right lobe, with fewer loops in this window, is recovered in shape but with jagged edges."
%}

{% include figure.liquid
  path="assets/img/projects/iit-kharagpur/edgenet-hidden-components.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="Three time-series plots of original versus reconstructed X, Y and Z over 20 time units; the reconstructions track the originals closely, with larger misses at the sharpest peaks"
  caption="Time series for the input X and the hidden Y and Z. The reconstruction tracks the oscillations closely and loses some amplitude at the sharpest spikes, mostly in Z."
%}

| Component    | Correlation |    MSE |
| :----------- | ----------: | -----: |
| X (observed) |       0.984 | 1.5867 |
| Y (hidden)   |   **0.980** | 2.6104 |
| Z (hidden)   |   **0.944** | 5.2954 |

EDGeNet, 2,000-step trajectory, latent of 32 channels × 128 steps. Z is the hardest component to recover; in the Lorenz equations it interacts with X only through nonlinear product terms.

### Comparing the five architectures

{% include figure.liquid
  path="assets/img/projects/iit-kharagpur/decoder-output-x.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="Ten plots of original versus decoded X for Lightweight U-Net, MLP, LSTM, CausalAE and EDGeNet: before lag correction the decoded signal is shifted in time with correlations of 0.26 to 0.30, after lag correction it overlaps the original with correlations of 0.985 to 0.991"
  caption="Decoder output before (top) and after (bottom) lag correction. Every model's raw output is shifted in time; once that lag is removed, all five reproduce the observed X almost perfectly."
%}

| Model             | Params  | Design               | X corr. (raw → aligned) | Reported corr. |
| :---------------- | :------ | :------------------- | ----------------------: | -------------: |
| **EDGeNet**       | 96–169K | Attention + residual |         0.2595 → 0.9877 |       **0.94** |
| Lightweight U-Net | 158K    | Conv encoder–decoder |         0.2590 → 0.9849 |          ≈0.91 |
| CausalAE          | 71K     | Causal dilated convs |     0.2784 → **0.9911** |          ≈0.88 |
| MLP               | 4.2M    | Dense baseline       |         0.2965 → 0.9881 |           0.59 |
| LSTM              | 264K    | Recurrent            |         0.2874 → 0.9886 |           0.32 |

The reported correlation is the summary score from the final review. For EDGeNet it equals the hidden-Z correlation above.

- **Decoders need lag alignment.** Raw outputs are time-shifted (correlation 0.26–0.30); aligning the lag recovers 0.985–0.991 for every model.
- **The hidden manifold is the real test.** Once aligned, all five reconstruct the observed X equally well, but their recovery of the hidden structure ranges from 0.94 down to 0.32.
- **Convolutional models win.** EDGeNet, the U-Net and CausalAE all score 0.88 or higher, while the dense and recurrent baselines fall apart.
- **Size is not the answer.** The 4.2M-parameter MLP scores 0.59, while the 71K-parameter CausalAE reaches about 0.88 with roughly 1/60th of the parameters.

### Latent size

Changing the latent shape trades compression against accuracy. Compression here is input size (10 × 512) divided by latent size (D × L).

{% include figure.liquid
  path="assets/img/projects/iit-kharagpur/latent-size-sweep.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="Six charts over latent combinations D in 16, 32, 64 and L in 64, 128, 256: per-component correlation, reconstruction error, training time, compression ratio, error versus compression, and Y and Z correlation versus compression"
  caption="Sweep over D ∈ {16, 32, 64} and L ∈ {64, 128, 256}: Y stays between 0.96 and 0.98 throughout, while Z (0.88–0.94) is the component that responds to latent size."
%}

| Latent (D × L) |    Y corr. |    Z corr. | Mean error | Compression |
| :------------- | ---------: | ---------: | ---------: | ----------: |
| 8 × 64         |     0.9647 |     0.8717 |     2.2949 |        10.0 |
| **10 × 64**    | **0.9689** | **0.9325** | **1.8683** |         8.0 |
| 12 × 64        |     0.9585 |     0.9005 |     2.1292 |         6.7 |
| 16 × 64        |     0.9719 |     0.9035 |     1.9468 |         5.0 |
| 16 × 128       |     0.9624 |     0.9201 |     1.9590 |         2.5 |
| 16 × 256       |     0.9519 |     0.8306 |     2.3634 |         1.2 |

Selected rows from the D = 8–16 sweep.

- **A small latent is enough.** At 10 × 64 the model compresses the input 8:1 and still gives the best hidden-Z correlation (0.93) and lowest error in this sweep.
- **Longer latents hurt.** For every D from 8 to 16, moving from L = 64 to L = 256 lowered Z correlation, so a tighter bottleneck helps rather than hurts.
- **Training cost is flat.** Each configuration trained in about 150 to 240 seconds.

## Impact

- **A working learned embedding:** a complete system that recovers all three Lorenz coordinates from one observed variable, a learned counterpart to Takens' delay embedding.
- **Architecture-agnostic framework:** five interchangeable backbones with a shared evaluation suite, so new encoders can be benchmarked on hidden-state recovery, not just on reconstructing the input.
- **A clear finding for the lab:** reconstructing the observed signal well says little about recovering the hidden dynamics, so models should be judged on the hidden components.

**Limitations and next steps:** results are on simulated, noise-free Lorenz data; the summary scores are single runs without confidence intervals, and the right lobe is still recovered less cleanly than the left. Next steps are noisy and real signals such as EEG, CCM tests on the learned manifolds to detect coupling between variables, and a systematic λ sweep for the FNN term.

**Stack:** Python · PyTorch · NumPy · Matplotlib · skccm
