---
layout: case-study
title: RAG-based Chatbot for Research Papers
description: RAG pipeline that indexes PDF research papers and answers questions with source citations via Streamlit and CLI.
importance: 2
listed: true
category: personal
img: assets/img/projects/rag-chatbot-research-papers.png
github: https://github.com/abeersethia/chatbot-for-research
metrics:
  - label: LLM
    value: Qwen2.5-7B
  - label: Retrieval
    value: Top-5 semantic
  - label: Interface
    value: Streamlit + CLI
---

## Summary
Built a retrieval-augmented generation (RAG) chatbot that lets users ask natural-language questions about research papers. PDFs are parsed into sections, chunked and embedded with HuggingFace, stored in Pinecone, and queried through a Qwen instruct model. Answers include section-level citations with relevance scores. Includes a Streamlit web UI and an interactive CLI.

## Situation
Reading long research papers end-to-end to answer specific questions (methods, results, limitations) is slow, especially when comparing findings across sections. Generic LLMs can hallucinate paper details without grounding in the source text. The goal was a lightweight system that indexes a PDF once and returns answers tied to retrieved passages.

## Task
Design an end-to-end pipeline that:
1. Extracts structured text from PDFs with automatic section detection (Abstract, Introduction, Methods, etc.).
2. Chunks and embeds content for semantic search over a vector store.
3. Retrieves the most relevant passages for a user query and generates a grounded answer.
4. Surfaces source citations (section names and relevance scores) alongside each response.
5. Exposes both a web UI and a command-line interface for querying.

## Action
1. **PDF ingestion** - PyMuPDF extracts text and groups it into sections; recursive chunking (1000 characters, 200 overlap) preserves context across boundaries.
2. **Embeddings & storage** - `sentence-transformers/all-MiniLM-L6-v2` produces 384-dimensional vectors; chunks and metadata are uploaded to a Pinecone index.
3. **Retrieval & generation** - User queries are embedded and matched against stored chunks (top-5); retrieved context and the question are sent to `Qwen/Qwen2.5-7B-Instruct` for answer synthesis.
4. **Interfaces** - Streamlit app (`app.py`) for browser-based chat; CLI (`chat_interface.py`) with history, sources, and help commands.
5. **Indexing CLI** - `main.py` indexes bundled sample papers (YOLO, Medical) or custom PDFs via `--pdf` and `--name` flags.

{% include figure.liquid
  path="assets/img/projects/rag-chatbot-research-papers-demo.png"
  figure_class="case-study-figure"
  class="case-study-figure__img"
  alt="Streamlit chat interface for the RAG research paper chatbot"
  caption="Streamlit UI - Answer on YOLO architecture with expandable source citations."
%}

## Result

| Component | Choice | Role |
| :--- | :--- | :--- |
| Embeddings | all-MiniLM-L6-v2 | 384-dim semantic vectors |
| Vector store | Pinecone | Similarity search over chunks |
| LLM | Qwen2.5-7B-Instruct | Grounded answer generation |
| Top-K | 5 | Retrieved passages per query |
| UI | Streamlit + CLI | Web and terminal access |

Example query: *"What are the key results of the YOLO paper?"* — the chatbot returns numbered findings (mAP on VOC 2012, error types vs. Fast R-CNN, speed) each tagged with `[Source N, Relevance: score]`.

## Impact
Demonstrates a full RAG stack from PDF to cited answers using open embedding and LLM APIs, suitable as a template for literature review assistants or domain-specific Q&A over technical documents. Modular design (`pdf_extractor`, `text_chunker`, `embedding_generator`, `vector_store`, `chatbot`) makes it straightforward to swap models, indexes, or add multi-document support.
