# Aura Script 2.8.0 — English documentation

Aura Script is a **free, independent and local** creative suite for Windows (Microsoft Store) and Linux:
documents (true A4 pages), presentations, spreadsheets, code, a free-form canvas and PDF, assisted by
**Aurora**, an AI that runs on the computer itself, or by the author's own online AI (optional API key).

Documents stay on the device and are encrypted by Windows (DPAPI). No account is required. Publisher: SyllaBora.
Contact: cheicksylla615@gmail.com · Windows: <https://apps.microsoft.com/detail/9nsqkw8c6xp8>

## Documents in this folder

| File | Contents | French version |
|---|---|---|
| `README.md` | This overview | `../fr/PRESENTATION.md` |
| `CHANGELOG.md` | Version history, 1.6 → 2.8.0 | `../fr/HISTORIQUE.md` |
| `SECURITY.md` | Protections in place and how each one is tested | `../fr/SECURITE.md` |
| `MODELS.md` | Aurora models, dictation models, search models, licences | `../fr/MODELES.md` |
| `MCP-CONNECTOR.md` | Local MCP connector for AI assistants (no server) | `../fr/CONNECTEUR-MCP.md` |

## What's new in 2.8
- **Live dictation**: optional Nemotron 3.5 model (NVIDIA, 40 languages); words appear while you speak.
- **Search by meaning**: finds a document by its topic even without its exact words (Qwen3 Embedding and
  Reranker 0.6B, Apache 2.0, on the PC, installed on request).
- **Safe JSON answers**: Aurora's structured outputs are enforced by a grammar during generation.
- **New Aurora models**: Ministral 3 3B and Gemma 4 E2B (Apache 2.0), checked by SHA-256 after download.

## What's new in 2.7
- **2.7.1**: dictation is **built into the app** (Canary 180M Flash model in the package, nothing to download);
  dictation life cycle and selection handling made reliable; models checked against pinned official hashes;
  every package verified before release; Linux built by the same script; automatic, protected GPU acceleration.
- **Local voice dictation**: you speak, the editor writes and corrects in real time (spoken punctuation,
  capital letters, French spacing, "undo that"). Recognition on the computer (sherpa-onnx, isolated process).
- **AI transparency**: "AI-generated" label with the engine (local or online), **Report** button,
  **Help › AI transparency** page.
- **Text provenance**: passages inserted by the AI are marked, with a view and a report; "AI-generated
  content" metadata in HTML and Word exports.

## What's new in 2.6
- **2.6.1**: strict commands (a content request goes to the AI, never mistaken for a command), questions about
  the document answered without AI ("Go to passage"), targeted context for the AI on long documents, search
  across all documents (sheets, slides, code and canvas included).
- **Local brain** (`cerveau.js`): without AI or network, Aura Script summarises, extracts keywords, proposes an
  outline and titles, measures readability, corrects with safe rules, shortens and clarifies. The Assistant
  panel understands **natural-language commands** ("insert a 3x4 table", "export to PDF"...).
- **Offline first, AI as backup**: when Aurora or the personal AI do not answer, the brain takes over; when they
  do, it gives them cues and checks their proposals.
- **Health**: templates (consultation report, treatment plan, health journal, care handover), extraction of
  treatments and vital signs, medical abbreviations, anonymisation into a separate copy. **Confidentiality guard
  in the main process**: health content is never sent to an online AI without explicit consent.
- **IPC security**: sender-frame check *fail closed*. **Exports**: Excel rewritten (valid file, all tabs),
  PowerPoint with images, tables, arrows and 4:3 format.

## Version 2.5 (summary)
Companion suggestions; diff preview for every AI edit (Accept / Reject); automatic subject detection (music,
maths, physics, chemistry, biology, computing, languages, economics, law, screenplay, poetry) adapting the toolbar
and the AI; music workshop (guitar and piano chord diagrams, transposition, ChordPro); chemical equation balancing;
an API key becomes the main assistant; one-click MCP connector and Claude Desktop extension; canvas library and
local-network **group mode**; first-launch tour; Auto, Night and Paper themes; two visual identities, **Violet
Aura** (default) and **Sakura**; six interface languages; context menus per workspace; offline read-aloud;
end-to-end encrypted group mode (AES-256-GCM); Qwen3.5 2B as default local model.

## Architecture in one paragraph
Electron 44 application in three sealed layers: the window displays and edits (strict CSP, no Node access); the
preload bridge exposes a closed list of functions; the main process alone does system work (files, exports,
permissions, health guard, `aura://` protocol, hardened fuses). Heavy or sensitive components each run in their
own process: Aurora (node-llama-cpp), dictation (sherpa-onnx), the MCP connector. Only the optional personal AI
leaves the computer.
