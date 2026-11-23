# Aura Script — version history

## 2.8.0 — live voice, search by meaning, AI answers you can trust
- **Live dictation**: new optional model **Nemotron 3.5 ASR streaming** (NVIDIA, OpenMDW 1.1, 40 languages, ≈ 682 MB,
  pinned hashes). Words appear while you speak (560 ms blocks): audio is fed continuously into a sherpa-onnx "online"
  stream, never the same sample twice. Canary stays built in and works with no download.
- **Search by meaning**: search across all documents becomes hybrid. The brain's lexical ranking (BM25) is fused with
  a meaning-based ranking (Qwen3 Embedding 0.6B), then the top of the list is re-ranked (Qwen3 Reranker 0.6B). A
  document about a "signed agreement" is found with "contract". Two Apache 2.0 models (≈ 1.28 GB in total), installed
  on request, verified by SHA-256, loaded only during a search; vectors stay on the PC.
- **Constrained JSON outputs**: when Aurora must answer in JSON (action plan), a llama.cpp grammar derived from a schema
  is applied during generation: the model can no longer produce a malformed object or an unknown mode. The existing
  `json` option, previously ignored by the local engine, is now actually applied.
- **New Aurora models** (on request): **Ministral 3 3B** (Mistral AI, Apache 2.0, 2.15 GB) and **Gemma 4 E2B**
  (Google, Apache 2.0, 2.98 GB). Any model with a pinned hash is verified after download and deleted if it differs.
- Tests: dictation 81 (live stream: growing partials, no duplicated sample, native Nemotron engine), app 45, Aurora 413
  (semantic search, vector cache, re-ranker, real node-llama-cpp grammars, catalogue), security 29 + 137 + 28,
  syntax 123/123, analyses 14/14.

## 2.7.1 — stability: built-in dictation, reliable life cycle, verified packages
Corrective release, following the lead reviewer: stability before new features.
- **Dictation built into the app**: the **Canary 180M Flash** model (NVIDIA, CC-BY-4.0, ≈ 207 MB, French/English/
  Spanish/German, native punctuation and capitals) ships in the package. Dictation works right after installation,
  **with nothing to download**. Parakeet v3 and Whisper remain optional.
- **Dictation life cycle** (critical): each start has a session number; stopping during loading **really cancels**
  the start (the microphone is never opened for an abandoned session); stopping **waits for the engine's "done"
  acknowledgement**, sent after the last final segment, so no word is lost.
- **Selection preserved** (critical): selecting a passage then dictating no longer erases it while nothing has been
  recognised; replacement happens in a single, undoable operation.
- **Verified models** (high): every file of every model is **pinned** in the code (name, size, official SHA-256 or
  git blob id, cross-checked on two Hugging Face APIs). A file already present is re-hashed before reuse; an imported
  model that differs is marked "unverified" and only starts with the author's explicit consent.
- **Reliable build** (high): a single `build.js` for Windows **and Linux** (`--linux`, `Construire-Linux.sh`);
  native engine and built-in model **mandatory** (except `--sans-dictee`, explicitly not publishable); every package
  checked by `tools/verifier-paquet.js`.
- **Aurora accelerated by the GPU, automatically and safely**: "auto" mode used to stay on the CPU, detection looked
  for engines in the wrong folder, and no GPU engine was shipped. Now: **Vulkan** engine shipped on x64 (NVIDIA, AMD,
  Intel integrated; ≈ 70 MB); "auto" tries the best installed engine; a **trial log** remembers a driver that crashed
  the engine and falls back to the CPU on the next launch (forgotten after 30 days or a new version); hot fallback to
  the CPU if the model does not load on the GPU or llama.cpp falls back silently; the GPU never causes a model that
  fits in CPU memory to be refused (8 GB PCs).
- **Leaner local AI**: hidden "thinking" of Qwen3.5 models is explicitly capped at 0 tokens by default.
- Tests: dictation 73, real app 45, package checker 15, GPU 17, Aurora 400.

## 2.7.0 — you speak, the editor writes; the AI shows itself
- **Local voice dictation** (microphone button, Ctrl+Shift+D, Insert menu): provisional text appears live at the
  cursor; at each pause the passage is transcribed again then **corrected by the brain** (spoken punctuation, decimal
  numbers, capitals, French non-breaking spaces) and inserted for good. "Undo that" and "stop dictation" commands.
  Known Whisper hallucinations filtered.
- **100 % local**: sherpa-onnx engine (Apache-2.0) in an **isolated process**; models downloaded once (Whisper base /
  small, MIT, or NVIDIA Parakeet TDT 0.6B v3, CC-BY-4.0). If Hugging Face is blocked, the **hf-mirror.com** mirror is
  offered **with explicit consent** (third-party service), or a downloaded folder can be imported.
- **Dictation security**: microphone allowed *only* during a dictation started by the author (audio only, never the
  camera), visible red indicator, stop with Esc, on document change, after 3 min of silence or 1 min with the window
  hidden; no audio recorded; HTTPS to allowed hosts only, SHA-256 checked, bounded size, sanitised file names.
- **AI transparency**: each answer carries "AI-generated" and the engine; **Report** button (reason, comment, e-mail
  prepared in the mail app — nothing is sent automatically); **Help › AI transparency** page.
- **Text provenance**: passages inserted by the AI are marked in the document; what the author types or dictates never
  is. **View › Text provenance** and a numeric report ("an indication, not proof"). HTML and Word exports carry
  machine-readable metadata when AI-generated text is present.
- **Hardened executable** (Electron fuses): `NODE_OPTIONS` and the debugger are ignored by the installed app;
  `file://` without extra privileges.
- Aurora models from China: if Hugging Face is unreachable, hf-mirror.com is offered (explicit consent, never automatic).
- Tests: dictation 65, real app 28, transparency 30.

## 2.6.1 — a fairer brain, a search that finds
- **Strict commands**: a command must cover the whole request. "Make a comparison table of the plans" now goes to the
  AI instead of inserting an empty table. Corpus of 108 real requests in the tests.
- **Questions about the document, without AI**: "When does the contract end?" → the sentence that answers, with
  "Go to passage".
- **Better-fed AI**: for a question about a long document, Aurora or the AI receives the beginning AND the relevant
  passages (chosen locally) instead of the first 2,600 characters.
- **Search across all documents**: content of sheets, slides, code and canvas; accents ignored, completion of the word
  being typed, one typo tolerated, relevance ranking, highlighted excerpt.
- **Info**: document topics and "See also" (documents close in content).
- Fixes: "AI ready" state after switching to the personal AI; stale search cache; cached Revision analysis; correction
  rules compiled once (a 170,000-word document analysed in under a second).

## 2.6.0 — the local brain
- **Local brain** (`cerveau.js`): language, statistics, readability (Kandel-Moles / Flesch), long sentences,
  repetitions, extractive summary (TextRank + MMR), keywords, title ideas, outline, safe rule-based correction.
- **Natural-language commands** in the Assistant panel, in French and English, executed instantly without AI.
- **Offline first, AI as backup**: the brain takes over when Aurora or the personal AI do not answer; when they do, it
  gives them computed cues and checks their proposals (invented numbers, missed topics, repetitions).
- **Revision**: local "Grammar and style" section with one-click fixes. **Sheets**: column analysis, suggested chart.
- **Health**: templates, treatments and vital signs, medical abbreviations, **anonymisation** into a separate copy,
  medical lexicon for the spell checker. Health text is never sent to an online AI without explicit consent.
- Fixes: Excel export rewritten (validated by LibreOffice and openpyxl), PowerPoint export with images, tables, arrows
  and 4:3. Aurora: Qwen3.5 4B added for 16 GB PCs; unmeasured ratings shown as estimated; French benchmark per model.
- Audit: health guard moved to the main process and extended to all outgoing content; IPC *fail closed*.

## 2.5.1 — security
- CSP without `unsafe-inline` for scripts: 256 inline handlers compiled (`gestionnaires.js`).
- MCP connector: authenticated protocol v2 (HMAC, nonce, anti-replay, signed responses), token renewed at each launch,
  randomly named channel, private socket, three-layer argument validation, rate limits.
- Group mode: per-session salt, authenticated context (AAD), anti-replay and anti-reflection.
- Opening from File Explorer ("Open with": Word, PowerPoint, Excel, CSV, PDF, text); new PowerPoint and Excel readers.
- Adaptive toolbars: no hidden or clipped button on medium screens.

## 2.5
Autonomous context (11 subjects), music workshop, API key as main assistant, short halo, one-click MCP connector,
Claude plugin, Linux version.

## 2.4
Presentation / Sheet / PDF / Code / Canvas workspaces, charts, connected AI with tools, local MCP connector, touch.

## 2.2.0
Local writing editor for Windows.

## 1.6 series (summary)
- **1.6 foundations**: redesigned writing interface (readable page, calm editorial palette, simplified main bar);
  native Windows frame; Studio with a canvas (layers, selection, undo, zoom, PNG export) and spreadsheets (safe
  formulas, keyboard navigation, Excel/CSV export); simplified assistant with undoable edits; guided tour on first
  launch; "Open with" association; Aurora in a separate local process with its model downloaded on demand (Qwen3.5 2B,
  Apache 2.0, ≈ 1.2 GB), licence shown first; "Buy me a coffee" section; full spell-check revision with preview.
- **1.6.7 – 1.6.11**: forced save before switching documents; image resizing on insert/paste/import; richer Word
  export; template gallery with previews; canvas grid, handles, duplication; slide backgrounds and PPTX export; XLSX
  export with computed values; colour palette; Focus mode; context menu on the title.
- **1.6.13 universal package**: one package with the app, the AI engine and its model; AI disabled on PCs with 4 GB of
  RAM or less; limits up to 8 GB.
- **1.6.14 – 1.6.18**: "Present the document" reading mode; free font size from 6 to 120 px; immersive full-screen
  Focus; editorial interface (side navigation, document header, formatting bar, Aura side panel).
- **1.6.19 – 1.6.23**: visual fixes (panel width, search, theme contrast); export label fix; two-row application bar;
  Aurora preloads the installed model at launch and may free the context after five minutes of inactivity; Aurora
  status lights (green ready, orange checking/downloading, red unavailable).
