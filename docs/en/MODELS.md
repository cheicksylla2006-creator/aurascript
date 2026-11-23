# Aurora and dictation models — single reference (v2.8)

This file is the reference for the application. Code source of truth: `aurora/src/core/modelRegistry.ts`
(`MODEL_CATALOG`, `defaultModelId()`), `aurora/src/core/semantic.ts` (`SEARCH_MODELS`) and `dictee-modeles.js`.

No AI model is included in the installer, except the dictation model Canary 180M Flash. Every other model is
downloaded on request, with its licence shown first.

## Aurora — default choice

| PC memory | Proposed model | Size (GGUF) | Licence |
|---|---|---|---|
| up to 10 GiB | Qwen3.5 2B compact (`qwen3.5-2b-leger`, IQ4_XS) | ≈ 1.17 GB | Apache 2.0 |
| more than 10 GiB | Qwen3.5 2B (`qwen3.5-2b`, Q4_K_M) | ≈ 1.28 GB | Apache 2.0 |

Qwen3.5 (Alibaba, 2026): 201 languages, reasoning, tool calling. `engine.model` is empty by default: Aurora chooses
according to RAM. When the user picks a model, it is downloaded **then set as the active model** and the engine restarts.

## Aurora — other models (on request)

| Id | Size ≈ | Licence | For whom |
|---|---|---|---|
| `qwen3.5-4b` | 2.48 GB | Apache 2.0 | 16 GB PCs |
| `ministral3-3b` | 2.15 GB | Apache 2.0 | 2.8 — Mistral AI, designed in France; 12 to 16 GB PCs; SHA-256 verified |
| `gemma4-e2b` | 2.98 GB | Apache 2.0 | 2.8 — Google, multilingual; 16 GB PCs; SHA-256 verified |
| `qwen3-1.7b` | 1.28 GB | Apache 2.0 | former default, proven |
| `smollm3-3b` | 1.92 GB | Apache 2.0 | 16 GB PCs |
| `phi4-mini` | 2.49 GB | MIT | 16 GB PCs, reasoning and maths |
| `llama3.2-1b` | 0.81 GB | Llama 3.2 Community License (Meta) | very small machines |

Aurora respects a 4 GiB memory ceiling and checks before loading that the model fits. Older models (Qwen2.5 1.5B,
Llama 3.2 1B Q5 and 3B, SmolLM2, Phi-3.5 mini, Gemma 2) are no longer offered but keep working if installed.

## Search by meaning (2.8)

| Id | Role | Size | Licence |
|---|---|---|---|
| `qwen3-embedding-0.6b` | meaning vectors of passages | 639 MB | Apache 2.0 |
| `qwen3-reranker-0.6b` | re-ranking of the best results | 639 MB | Apache 2.0 |

Installed on request ("Aurora model" window), in `<Aurora data>/models-recherche`, verified by SHA-256. Loaded only
during a search, released after 90 s. Document vectors stay on the PC (`<Aurora data>/recherche/vecteurs.jsonl`).

## Dictation

| Model | Size | Licence | Status |
|---|---|---|---|
| Canary 180M Flash (NVIDIA, int8) | ≈ 207 MB | CC-BY-4.0 | built into the package |
| Nemotron 3.5 ASR streaming (NVIDIA, int8, 560 ms) | ≈ 682 MB | OpenMDW 1.1 | optional — live dictation (2.8) |
| Parakeet TDT 0.6B v3 (NVIDIA) | ≈ 671 MB | CC-BY-4.0 | optional — maximum quality |
| Whisper small / base (OpenAI) | ≈ 376 / 161 MB | MIT | optional — other languages |

Every dictation file is pinned (name, exact size, official hash).

## Redistribution
Apache 2.0, MIT and CC-BY-4.0: free redistribution with licence notice (attributions are shown in "About").
OpenMDW 1.1: commercial use allowed; Aura Script does not redistribute Nemotron, it is downloaded from its source.
Llama 3.2 has its own terms: Aura Script does not redistribute it; it is downloaded from its source after the licence
is shown.

## Ratings: measured or estimated
A rating is presented as established only if the model was downloaded and measured on a real machine
(`measured: true` in the catalogue). Otherwise the application shows "estimated". Run `Banc-Modeles.bat` (same French
exercises for every model, reports in `aurora/docs/QUALITY-FR-<model>.md`) to measure.
