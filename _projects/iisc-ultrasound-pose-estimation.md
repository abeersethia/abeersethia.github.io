---
layout: case-study
title: Trackerless ultrasound pose estimation & 3D reconstruction
description: B.Tech thesis at IISc - self-supervised, geometry-aware probe pose estimation that reconstructs freehand 3D ultrasound trajectories from B-mode images alone, with no external tracker.
importance: 6
listed: true
categories:
  - research
  - coursework
img: assets/img/projects/iisc-ultrasound-3d-reconstruction.png
metrics:
  - label: Phantom frames
    value: "23,376"
  - label: Period
    value: Dec 2025 – Jul 2026
mid_term_presentation:
  label: Mid-Term Presentation
  file: assets/pdf/iisc-ultrasound-mid-term-presentation.pdf
  alt: "IISc Bangalore — mid-term presentation on trackerless ultrasound pose estimation and 3D reconstruction (UTSAAH Lab)"
---

## Summary

Bachelor thesis, _3D Freehand Ultrasound Pose Estimation for Trackerless Trajectory Reconstruction_, carried out as a Research Intern (AI) at the UTSAAH Lab, Department of Design and Manufacturing, IISc Bangalore. The system estimates 6-DoF probe motion directly from B-mode image sequences, so a freehand sweep can be turned into a 3D trajectory **without an electromagnetic or optical tracker at inference time**.

It combines self-supervised contrastive pretraining (SimCLR / NT-Xent), an ultrasound-pretrained ResNet-18 encoder (USCL), a BiLSTM + multi-head attention temporal model, and quaternion-based SE(3) pose regression. On a tracked phantom dataset, the best configuration reached a **median final drift of 89.7 mm and a Final Drift Ratio (FDR) of 24.0%**. I designed, implemented and ran the full pipeline as an individual research effort.

> **Bachelor thesis project.** This work was completed for my B.Tech degree (Dec 2025 – Jul 2026) as a proof of concept. The results come from phantom data and a preliminary TUS-REC check, so the framework is still open to further research, tuning and clinical testing before any of its findings can be treated as final.

{% include figure.liquid
  path="assets/img/projects/iisc-ultrasound/pipeline-overview.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  alt="A stack of 2D ultrasound frames passes through an algorithm and becomes a 3D trajectory of positioned frames"
  caption="Freehand reconstruction: a sequence of 2D B-mode frames is placed in 3D by estimating the probe pose for every frame."
%}

## Context

**Problem:** Freehand ultrasound is cheap, portable, real-time and radiation-free, but each frame is 2D. Building a 3D volume needs the probe pose for every frame, which conventional systems get from EM or optical trackers. Those trackers add hardware cost, calibration overhead and workflow complexity, so they are rarely available outside specialised clinical settings.

**Supervision:** [Prof. Manish Arora](https://dm.iisc.ac.in/utsaah/dr-manish-arora/) and [Ms. Saladi Pravallika (PMRF)](https://dm.iisc.ac.in/utsaah/saladi-pravallika/), UTSAAH Lab, IISc Bangalore. Internal guide: Dr. Sanjana Mallikarjun Kavatagi, School of Computer Engineering, MIT Manipal.

## Challenge

Recovering motion from the images alone is hard. Ultrasound has strong speckle noise, low contrast, artefacts and very little out-of-plane information, so consecutive frames can look almost identical even when the probe has moved. Every relative pose is chained into the trajectory, so small per-frame errors **accumulate into drift** over long sweeps.

Prior trackerless work (Prevost et al., Guo et al., Li et al., Dou et al.) improved the models but always fixed the choice of _which frame pair_ supervises the relative pose. The thesis treats that choice as an explicit design factor and measures it separately from the encoder and the training strategy.

## Approach

{% include figure.liquid
  path="assets/img/projects/iisc-ultrasound/methodology.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  alt="Pipeline diagram: ultrasound sequence, feature extraction, temporal windows, temporal learning with consistency constraints, pose output and trajectory reconstruction"
  caption="Two-stage pipeline: (self-)supervised feature extraction, temporal windows, temporal learning with consistency constraints, then relative poses integrated into a trajectory."
%}

1. **Data ingestion and pose alignment** - Registered PNG frames against 4×4 tracker transforms stored in `.mha` files, converted them to grayscale, centre-cropped to 224×224, and built either time-correlated pairs (pretraining) or fixed-length pose windows (regression).
2. **Self-supervised pretraining** - A SimCLR-style NT-Xent objective treats temporally close frames as positives and distant frames as negatives, so the encoder learns ultrasound-specific features with no pose labels.
3. **Encoder** - ResNet-18 initialised from Ultrasound Contrastive Learning (USCL) weights, chosen over ImageNet ResNet-50 and EfficientNet-B1 after ablations.
4. **Temporal motion estimator** - A BiLSTM followed by multi-head attention pools features across the whole window, then regresses translation plus a normalised, sign-canonicalised unit quaternion. This outperformed endpoint-only fusion.
5. **Geometry-aware losses** - MSE on translation and quaternion geodesic distance on rotation, with optional cycle-consistency and composite-transformation-consistency (se(3) twist) terms.
6. **Trajectory integration and evaluation** - Relative SE(3) transforms are composed from an identity pose into an origin-aligned trajectory and scored with final drift (mm) and Final Drift Ratio (drift ÷ ground-truth path length).
7. **Reproducibility** - Every run is a self-contained directory with config, checkpoints, training history, evaluation summaries and per-sequence trajectory predictions.

{% include figure.liquid
  path="assets/img/projects/iisc-ultrasound/preprocessing.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  alt="Original 624x1146 ultrasound frame, cropped 586x790 input, and 224x224 centre crop"
  caption="Preprocessing: the raw 624×1146 scanner frame is cropped to remove overlays, then centre-cropped to a 224×224 encoder input."
%}

### Temporal contrastive signal

{% include figure.liquid
  path="assets/img/projects/iisc-ultrasound/adjacent-frames.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  alt="Two temporally adjacent fetal phantom ultrasound frames that look nearly identical"
  caption="Adjacent frames (130 and 131) share anatomy and speckle almost exactly, which is why near neighbours are used as positive pairs."
%}

{% include figure.liquid
  path="assets/img/projects/iisc-ultrasound/gap-similarity.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  alt="Line chart of mean cosine similarity against temporal gap for latent z, backbone h, and pixels"
  caption="Mean cosine similarity against temporal gap. Pixel similarity stays near 0.95, while the learned latent (z) falls steadily towards 0, so the encoder captures probe motion that raw intensities miss."
%}

### Pose-label protocols

The protocol defines which frame pair inside a window supervises the relative pose, and it sets the stride used to integrate the trajectory. I implemented four of them. Each is a different regression target, so **results are only comparable within the same protocol**.

{% include figure.liquid
  path="assets/img/projects/iisc-ultrasound/pose-protocols.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  alt="Diagram of the Window-Endpoints, Center-Pair, Last-Pair and Middle-Pair pose-label protocols with their integration strides"
  caption="Window-Endpoints (first→last, stride N−1), Center-Pair (gap 2, stride 2), Last-Pair (final adjacent pair, stride 1), and Middle-Pair (central adjacent pair, stride 1)."
%}

## Data

| Dataset                | Contents                                                                                                            | Use                                                        |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------- |
| Tracked fetal phantom  | 72 sweeps (5–30 s, 3 operators × 4 directions), **23,376 frames**, per-frame tracker transforms                     | Primary training and evaluation                            |
| Vertical-sweep phantom | 12 additional sequences                                                                                             | Added to the main split                                    |
| **Split**              | 83 sequences → 59 train / 8 val / 16 test (1,465 pose windows), split by sequence to avoid frame leakage            | Fixed across all experiments                               |
| TUS-REC 2025           | Public in-vivo forearm benchmark: 170 rotating-protocol scans, ~1,500 frames each, 20 fps, EfficientNet-B1 baseline | Preliminary generalisation check (no comparable score yet) |

Training ran on a single NVIDIA RTX 4500 Ada GPU (PyTorch 2.2, CUDA 12.1), at about 11 to 28 minutes per epoch depending on the configuration.

## Results

| Experiment           | Protocol         | Median drift (mm) | Median FDR (%) |
| :------------------- | :--------------- | ----------------: | -------------: |
| SSL + USCL           | Window Endpoints |        **91.785** |     **26.780** |
| Supervised + USCL    | Window Endpoints |           100.211 |         28.542 |
| Supervised + USCL    | Last Pair        |            89.993 |         26.921 |
| SSL (frozen encoder) | Last Pair        |           122.228 |         39.303 |
| Supervised + USCL    | Middle Pair      |        **89.685** |     **24.028** |

- **Self-supervised pretraining helps under a matched protocol.** With Window Endpoints, SSL + USCL cut median drift from 100.2 to 91.8 mm (−8.4%) and FDR from 28.5% to 26.8% compared with the identical supervised baseline.
- **Best overall:** supervised USCL with the Middle Pair protocol, at 89.7 mm drift and 24.0% FDR.
- **Best single sequences:** 29.1 mm drift / 8.5% FDR (SSL + USCL) and 35.6 mm / 10.4% FDR (supervised Middle Pair).

These are phantom-dataset numbers measured at the last frame of each sweep. They are **not comparable to TUS-REC leaderboard scores**; see [Benchmark context](#benchmark-context-tus-rec) below.

{% include figure.liquid
  path="assets/img/projects/iisc-ultrasound/traj-best-ssl.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  alt="3D plot of predicted versus ground-truth probe trajectory closely overlapping, final drift 29.087 mm, FDR 8.49%"
  caption="Best SSL + USCL (Window Endpoints) sequence: the prediction (blue) tracks the tracker ground truth (red) over a ~340 mm sweep, with 29.1 mm final drift and 8.5% FDR."
%}

{% include figure.liquid
  path="assets/img/projects/iisc-ultrasound/traj-best-sup.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  alt="3D plot of predicted versus ground-truth trajectory, final drift 35.55 mm, FDR 10.38%"
  caption="Best supervised USCL (Middle Pair) sequence, with 35.6 mm final drift and 10.4% FDR."
%}

Failure cases are shown alongside, so drift accumulation is visible rather than hidden:

{% include figure.liquid
  path="assets/img/projects/iisc-ultrasound/traj-worst-ssl.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  alt="3D plot where the predicted trajectory diverges from ground truth, final drift 275.9 mm, FDR 67.4%"
  caption="Worst SSL + USCL sequence (vertical sweep): accumulated errors drift the trajectory off course, with 275.9 mm drift and 67.4% FDR."
%}

{% include figure.liquid
  path="assets/img/projects/iisc-ultrasound/traj-worst-sup.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  alt="3D plot where predicted trajectory under-shoots ground truth, final drift 241.7 mm, FDR 75.1%"
  caption="Worst supervised USCL sequence (5 s scan): local pose errors compound into 241.7 mm drift and 75.1% FDR."
%}

### Ablations

Each ablation changes one factor and holds everything else fixed.

| Factor                  | Change (A → B)                                | Median drift (mm)   | Median FDR (%)    |
| :---------------------- | :-------------------------------------------- | :------------------ | :---------------- |
| Backbone                | ResNet-50 (ImageNet) → **ResNet-18 (USCL)**   | 133.45 → **97.65**  | 35.74 → **27.57** |
| Contrastive pretraining | Supervised only → **NT-Xent SSL + fine-tune** | 100.21 → **91.78**  | 28.54 → **26.78** |
| Encoder update          | SSL objective only → **end-to-end pose loss** | 121.86 → **91.78**  | 37.14 → **26.78** |
| Early stopping          | Val pose loss → **val trajectory drift**      | 100.56 → **89.99**  | 27.13 → **26.92** |
| NT-Xent temporal gap    | 1 frame → **3 frames**                        | 125.19 → **105.68** | 39.77 → **33.10** |
| Consistency losses      | **λ = 0** → λ = 0.5                           | **100.21** → 201.04 | **28.54** → 57.72 |

**Takeaways**

- Domain-specific pretraining matters more than model size: the smaller USCL ResNet-18 cut drift by 27% compared with ImageNet ResNet-50.
- The encoder has to adapt end-to-end. Restricting it to the SSL objective raised drift by roughly 33%.
- Selecting checkpoints by trajectory drift instead of per-window pose loss saved another 10.6 mm, because good pairwise poses do not guarantee a good trajectory.
- Wider temporal gaps in contrastive pretraining expose the encoder to more realistic motion and steadily reduce drift.
- At λ = 0.5 the consistency losses fought the pose objective and doubled drift. This is reported as a weighting problem to tune, not as proof that geometric constraints do not work.

## Benchmark context: TUS-REC

[TUS-REC](https://github.com/UCL/tus-rec-challenge) (MICCAI 2024 and 2025) is the public benchmark for trackerless freehand ultrasound reconstruction. I reviewed its data, metrics and published results to place this work, and the conclusion is that **the numbers on this page cannot be ranked against TUS-REC scores**.

|                   | This thesis                                                | TUS-REC2024                                                             | TUS-REC2025                                     |
| :---------------- | :--------------------------------------------------------- | :---------------------------------------------------------------------- | :---------------------------------------------- |
| Data              | Fetal phantom, 83 sweeps                                   | In-vivo forearms, 85 volunteers, 2,040 scans, ~1.03M frames             | In-vivo forearms, 170 scans of ~1,500 frames    |
| Scan protocol     | Freehand sweeps, 5–30 s, 4 directions                      | Straight, C- and S-shaped sweeps, both directions                       | Fanning and rocking, then a ~90° probe rotation |
| Trajectory length | ~320–410 mm for the four plotted test sweeps (drift ÷ FDR) | ~120–275 mm per test scan, most ~160–230 mm                             | Not published as a length statistic             |
| Headline metric   | Final drift (mm) and FDR (%) at the **last frame**         | GPE / GLE / LPE / LLE: mean pixel or landmark error **over all frames** | Same four metrics                               |
| Reported range    | Median 89.7 mm, 24.0% FDR (best)                           | GPE 5.97–12.09 mm across ranked teams; baseline 12.49 mm                | GPE 9.25 mm (1st) to 26.11 mm (baseline)        |

**Why the metrics do not line up**

- **Different quantity.** FDR is one endpoint error divided by path length. GPE averages the error of every pixel in every frame, so it is pulled down by the early, low-drift part of each scan. The challenge organisers deliberately left final drift out of the evaluation.
- **Different data.** A static phantom and live forearms differ in anatomy, speckle, deformation and motion. Phantom sweeps here are also longer, and error grows with scan length; the TUS-REC paper reports this trend for every team.
- **Different protocol.** TUS-REC2025 scans add probe rotation, which my four label protocols were not designed around.
- **Literature scale.** The TUS-REC2024 paper summarises prior work as 1–20 mm final drift on small phantoms or constrained sweeps, 30–96 mm on larger datasets, and 5–15% drift rate in typical cases, exceeding 20% for unconstrained freehand trajectories. These ranges come from many different datasets, so they show scale, not a ranking.

A fair comparison needs this pipeline to output TUS-REC's four displacement fields (GP, GL, LP, LL) on the official splits and be scored by the challenge evaluator. That is the first item in the next steps below.

Sources: [TUS-REC2024 challenge paper (arXiv 2506.21765)](https://arxiv.org/abs/2506.21765) · [TUS-REC2025 leaderboard](https://github.com/UCL/tus-rec-challenge/blob/main/leaderboard.md) · [TUS-REC2025 baseline and dataset](https://github.com/QiLi111/TUS-REC2025-Challenge_baseline)

## Impact

- **Proof of concept** that 6-DoF probe trajectories can be recovered from B-mode images alone, removing the external tracker from 3D freehand reconstruction at inference time.
- **New design axis:** shows that the pose-label protocol affects trajectory accuracy as much as the learning paradigm, a factor earlier trackerless methods left implicit.
- **Reusable research stack:** a reproducible framework spanning ingestion, pose protocols, SSL, temporal modelling, integration and evaluation. It came with a knowledge-transfer document for the lab and a reviewed integration path into the TUS-REC 2025 benchmark.

**Limitations and next steps:** The results are descriptive medians on phantom data; no significance testing was run, and the TUS-REC evaluation is preliminary. Next steps are the full TUS-REC metrics (GPE, GLE, LPE, LLE), tuned consistency-loss schedules, transformer and state-space temporal models (TimeSformer, Video Swin, Mamba), per-sequence statistics with confidence intervals, and real-time, uncertainty-aware guidance.

**Stack:** Python 3.12 · PyTorch 2.2 · CUDA 12.1 · torchvision · NumPy · OpenCV · Pillow · Matplotlib · Plotly · 3D Slicer
