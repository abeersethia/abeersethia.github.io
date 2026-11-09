---
layout: case-study
title: Expert-guided liver lesion segmentation in CT
description: Philips Medical Imaging Research Suite, Bangalore - AI-assisted liver lesion masks from nnU-Net, MedSAM and MedSAM2, refined under radiologist supervision into a clinically annotated CT dataset.
importance: 4
listed: true
categories:
  - industry
img: assets/img/projects/philips-liver-segmentation.png
metrics:
  - label: Role
    value: Technical Intern
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

Industrial training project, _Expert-Guided Automated Segmentation of Liver Lesions in CT Imaging_, carried out as a Technical Intern at the Philips Medical Imaging Research Suite (MIRS), Bangalore. The goal was a **clinically validated liver lesion dataset**: AI models produce first-pass lesion masks, and those masks are corrected under radiologist supervision into expert-approved ground truth with clinical metadata attached.

I compared three segmentation models (nnU-Net, MedSAM and MedSAM2) on public CT collections, refined their outputs in ITK-SNAP and 3D Slicer with radiology guidance, and built the evaluation scripts that scored every model before and after refinement. **MedSAM2 gave the best first-pass masks (Dice 0.80), and expert refinement raised Dice to 0.92**, while the AI-first workflow cut annotation time by roughly 40%.

> **Internship project.** The work was done over four months on public datasets with a small set of refined cases. The numbers below are from that internal evaluation and are meant to show the value of the workflow, not to make a clinical or regulatory claim.

## Context

**Problem:** Liver lesions such as hepatocellular carcinoma (HCC) and colorectal metastases need accurate 3D delineation for treatment planning and follow-up. Manual contouring is slow and varies between readers, and most public datasets (LiTS, MSD-Liver) were annotated without radiologist review and carry no clinical metadata. Models trained on them inherit those gaps.

**Supervision:** Mr. Manjunath Maiya (RD, Operations, Philips) as project guide; [Dr. Rajagopal KV](https://www.manipal.edu/kmc-manipal/department-faculty/faculty-list/rajagopal-kv/_jcr_content.html), Head of Radiology at Kasturba Medical College, for clinical review; and [Dr. Dinesh Mysore Siddu](https://www.linkedin.com/in/dinesh-mysore-siddu-4119113/) and Mr. Saptakatha Adak from Philips Clinical Diagnostics.

## Challenge

Off-the-shelf models each fail in different ways on liver CT. 2D models lose context between slices, prompt-based models depend on where the box is drawn, and all of them struggle with **small, low-contrast or irregular lesions** and with blurred boundaries. The task was to use these models to speed up annotation without letting their errors leak into the ground truth, so every mask in the final dataset had to be expert-approved.

## Approach

{% include figure.liquid
  path="assets/img/projects/philips-liver/methodology.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="Pipeline diagram: dataset acquisition, preprocessing, preliminary segmentation by tools and pretrained models, expert-guided refinement, dataset generation, quality assessment, optional model adaptation, visualisation and evaluation, and review by the Philips team"
  caption="Workflow: acquire and preprocess CT, generate preliminary masks, refine them with experts, attach clinical metadata, then compare AI masks against the expert ground truth before Philips review."
%}

1. **Data acquisition** - Downloaded the HCC-TACE-SEG, Colorectal Liver Metastases and TCGA-LIHC collections from The Cancer Imaging Archive and organised the DICOM series patient by patient, following each dataset's licence.
2. **Preprocessing** - Converted DICOM to NIfTI with `dcm2niix`, applied a liver soft-tissue window of **−125 to 275 HU**, normalised intensities, reduced noise with Gaussian filtering, and resampled volumes to a uniform voxel spacing.
3. **AI-assisted first pass** - Generated preliminary lesion masks with three models: nnU-Net as the automated baseline, MedSAM for box-prompted 2D slices, and MedSAM2 for 3D propagation through the volume (architectures below).
4. **Expert-guided refinement** - Corrected lesion boundaries and removed false positives in ITK-SNAP and 3D Slicer under radiologist supervision. Ambiguous cases were reviewed jointly, and ROI cropping sped up the corrections.
5. **Clinical metadata** - Recorded lesion type, diameter, texture (homogeneous or heterogeneous) and free-text notes for every lesion, linked to the masks in a CSV.
6. **Quality control** - A per-case QC checklist, automated mask checks (missing labels, volume sanity), version control for annotations, and patient-level train, validation and test splits to avoid leakage.
7. **Evaluation** - Scripts computing Dice, precision and recall for every model, before and after refinement, with side-by-side visual comparisons.

## Model architectures

The three models cover the main options for this task: a fully automatic CNN, a promptable 2D foundation model, and a promptable model that tracks a lesion through the volume.

### nnU-Net

[nnU-Net](https://www.nature.com/articles/s41592-020-01008-z) is not a single network but a recipe that configures a U-Net from the dataset itself. It reads a fingerprint of the data (voxel spacing, image sizes, intensity statistics), sets the preprocessing, patch size and network depth by rule, trains 2D, 3D and cascade variants, and keeps whichever cross-validates best. It needs no prompts, which made it the automated baseline.

{% include figure.liquid
  path="assets/img/projects/philips-liver/arch-nnunet.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="nnU-Net diagram: dataset fingerprint to rule-based parameters to training of 2D and 3D configurations to empirical selection, above a U-Net with five encoder stages, a bottleneck, five decoder stages, skip connections and deep supervision outputs"
  caption="nnU-Net: (A) self-configuration from the dataset fingerprint; (B) the U-Net it trains, with skip connections and deep-supervision losses at lower resolutions."
%}

### MedSAM

[MedSAM](https://www.nature.com/articles/s41467-024-44824-z) adapts Meta's Segment Anything Model to medical images by fine-tuning it on 1.57M image–mask pairs. A ViT image encoder turns each slice into an embedding, a bounding box says which structure to segment, and a lightweight decoder returns the mask. It works one 2D slice at a time.

{% include figure.liquid
  path="assets/img/projects/philips-liver/arch-medsam.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="MedSAM diagram: a CT slice passes through a ViT image encoder to an image embedding, a bounding box passes through a frozen prompt encoder, and both feed a mask decoder that outputs the lesion mask"
  caption="MedSAM: ViT image encoder and mask decoder fine-tuned from SAM; the box prompt encoder is kept frozen."
%}

{% include figure.liquid
  path="assets/img/projects/philips-liver/medsam-box-prompt.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="Axial liver CT slice with a blue bounding box around a lesion, and the same slice with MedSAM's yellow segmentation inside the box"
  caption="MedSAM in practice: a manually drawn box around the lesion (left) and the resulting mask (right)."
%}

### MedSAM2

[MedSAM2](https://arxiv.org/abs/2504.03600) builds on SAM 2, which was designed for video. It treats a CT volume as a sequence of slices: one box on a key slice starts the segmentation, and a memory bank of earlier masks carries the lesion forward and backward through the volume. That memory is what keeps the mask continuous between slices.

{% include figure.liquid
  path="assets/img/projects/philips-liver/arch-medsam2.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="MedSAM2 diagram: CT slices pass one at a time through a Hiera image encoder, memory attention and a mask decoder; each predicted mask goes through a memory encoder into a memory bank that conditions the next slice"
  caption="MedSAM2: each slice is conditioned on memories of the prompted key slice and its neighbours, so a single prompt segments the whole lesion in 3D."
%}

## Data

| Dataset                     | Description                                  | Modality | Patients | Lesions              |
| :-------------------------- | :------------------------------------------- | :------- | -------: | :------------------- |
| HCC-TACE-SEG                | Liver tumours after chemoembolisation (TACE) | CT       |      105 | Hepatocellular (HCC) |
| Colorectal Liver Metastases | Secondary tumour segmentation                | CT       |      126 | Metastatic           |
| TCGA-LIHC                   | Liver hepatocellular carcinoma               | CT / MRI |       50 | Primary liver cancer |

Experiments ran on an NVIDIA T4 GPU (Google Colab) with PyTorch 2.0. Where models were adapted, training used 128 × 128 × 64 patches, Dice + cross-entropy loss, the Adam optimiser, batch size 2, and 50–100 epochs.

## Results

| Model        | Dice (before refinement) | Dice (after refinement) | Precision |   Recall |
| :----------- | -----------------------: | ----------------------: | --------: | -------: |
| nnU-Net (2D) |                     0.71 |                    0.82 |      0.84 |     0.80 |
| MedSAM (2D)  |                     0.76 |                    0.88 |      0.89 |     0.86 |
| MedSAM2 (3D) |                 **0.80** |                **0.92** |  **0.93** | **0.91** |

- **Expert refinement helped every model**, raising Dice by 0.11 to 0.12, about 15–18% in relative terms.
- **MedSAM2 was the strongest starting point.** Its 3D memory kept lesions continuous across slices and handled heterogeneous lesions best.
- **MedSAM** gave cleaner edges than nnU-Net on irregular lesions but depended on the box; a loose box over-segmented.
- **nnU-Net (2D)** worked for large lesions but missed small, low-contrast ones and needed post-processing to remove false positives.
- The AI-first workflow **reduced annotation time by about 40%** compared with contouring from scratch.

{% include figure.liquid
  path="assets/img/projects/philips-liver/prediction-vs-ground-truth.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="Four panels: abdominal CT slice, predicted lesion mask, ground-truth mask, and the prediction overlaid in red on the CT slice"
  caption="Evaluation view for a small lesion: original slice, predicted mask, expert ground truth, and overlay."
%}

{% include figure.liquid
  path="assets/img/projects/philips-liver/itk-snap-refinement.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="Two ITK-SNAP windows showing the same axial CT slice: the original lesion label in red and the revised label in yellow after correction with the paintbrush tool"
  caption="Expert-guided refinement in ITK-SNAP: the preliminary label (left, red) and the revised lesion label after correction (right, yellow)."
%}

{% include figure.liquid
  path="assets/img/projects/philips-liver/clinical-metadata.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  zoomable=true
  alt="Spreadsheet of annotated lesions with columns for patient, annotator, lesion type, texture, status, lesion diameter and comments"
  caption="Clinical metadata recorded per lesion: type (HCC, cyst), texture, review status, diameter and notes such as 'treated HCC' or 'partially exophytic'."
%}

### Deviations and fixes

| Issue                       | Cause                               | Fix                     |
| :-------------------------- | :---------------------------------- | :---------------------- |
| Poor boundaries in noisy CT | Beam-hardening artefacts            | Contrast enhancement    |
| Over-segmentation by MedSAM | Sensitive to bounding-box placement | Expert re-annotation    |
| Slow nnU-Net processing     | 3D patch-extraction overhead        | GPU-based preprocessing |

## Impact

- **Expert-verified dataset:** NIfTI lesion masks approved by radiology mentors, each linked to lesion type, diameter and texture, ready for training and benchmarking new models.
- **Multi-model inference tool:** I built an internal application that runs nnU-Net, MedSAM and MedSAM2 from one interface, with batch processing of CT volumes and built-in result comparison. It made mask generation faster and more consistent for the rest of the project. Implementation details are covered by an NDA.
- **Reusable pipeline:** documented preprocessing, annotation guidelines, QC checklist and evaluation scripts that the next annotation round can reuse.
- **Main lesson:** AI works best here as a first draft for experts, not a replacement. The models did the bulk of the contouring and the radiologists made it trustworthy.

**Limitations and next steps:** The evaluation covers a modest number of refined cases from public data, with no significance testing. Next steps from the report are multi-centre and multi-phase CT, transformer-based 3D models with automatic lesion counting and volume measurement, a web-based assistant for radiologists, and extending the dataset to lesion classification and treatment-response analysis.

**Stack:** Python · PyTorch 2.0 · Google Colab (T4) · nnU-Net · MedSAM · MedSAM2 · dcm2niix · SimpleITK · ITK-SNAP · 3D Slicer
