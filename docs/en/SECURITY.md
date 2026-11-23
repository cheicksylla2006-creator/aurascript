# Aura Script — security (version 2.8.0)

This document describes the protections in place. Every statement below is covered by an automated test that attacks the real code; these tests run before every release (they are not published, like the source code).

## 1. Interface (renderer process)

| Protection | Detail | Test |
|---|---|---|
| CSP without `unsafe-inline` or `unsafe-eval` for scripts | `script-src 'self' 'wasm-unsafe-eval'`; the 256 former `onclick="…"` are compiled into functions in `gestionnaires.js` | `<script>`, `onerror`, `onclick`, `setAttribute('onclick')`, `iframe srcdoc`, `javascript:` injections: all blocked |
| `object-src`, `base-uri`, `form-action` set to `'none'` | — | test-securite |
| Sanitised documents (DOMPurify) | handlers, `javascript:` links and `data-h-*` attributes removed; a `data-h-*` pasted into the editor is never wired | test-securite-ui §2 |
| Isolation | `contextIsolation`, no Node.js in the page, frozen `window.aura` bridge; arbitrary windows and navigations refused | test-securite-ui §4, test-securite |
| IPC guard | every call must come from the main window, its main frame and the Aura Script page | code review (`trustedRenderer`) |

`style-src` keeps `'unsafe-inline'`: inline styles cannot execute code.

## 2. MCP connector (AI assistants)

**Local channel**
- Its name is **random at each launch**.
- Linux/macOS: `0600` socket in a `0700` folder. Windows: named pipe, write access reserved by Windows to the owner
  and administrators.
- No network port.

**Mutual authentication (protocol v2)**
- The **token (256 bits, renewed at each launch) never travels**.
- Each request is signed with HMAC-SHA256, with a 128-bit nonce and the time. A replayed, modified or more than
  5-minute-old request is refused.
- Each response is signed: a program impersonating the channel can neither steal the token nor pose as Aura Script.
- Connection cut after 3 failures.

**Three-layer validation**
1. Client (`mcp/aura-mcp.js`): structure, size (4 MB), full schema in offline mode.
2. Main process (`mcp/securite-serveur.js`): allow-list of the 13 tools; `__proto__`, `constructor` and `prototype`
   refused; depth 8, 20,000 nodes, 5 MB line at most; 4 requests per connection and 16 in total at once.
3. Window (`AuraOutils.valider`), strictly per tool: types, required fields, allowed values, sizes; formats (cells,
   colours, identifiers, file names without `..` or absolute path); any unexpected argument refused.

**Permissions**
- Read shared documents only, or the whole library. Write: asked every time, allowed or forbidden.
- MCP annotations (`readOnlyHint` / `destructiveHint`) inform the assistant. **They do not replace** these checks.

## 3. Group mode (local network)
- Public addresses are refused: local network only.
- **AES-256-GCM key** derived by HKDF-SHA256 from a **random 128-bit secret** (`crypto.randomBytes`) in the
  invitation, with a session-specific salt. The secret is not a human password: Argon2 or scrypt would add nothing
  against 2^128 possibilities.
- 96-bit GCM nonce, random for each message; the key changes at each session.
- **Authenticated context** (AAD) and **anti-replay**: sender id, strictly increasing counter, timestamp (2 minutes
  at most). A message sent back to its sender is refused.
- 5 failures block for 10 minutes; 40 failures close the session. Malformed WebSocket frames are refused and each
  received message is validated.

## 4. Data
- Documents and PDFs encrypted by the system (DPAPI on Windows).
- Migration to encryption replaces a PDF only **after a verified round trip**: on power loss each file is either
  readable or encrypted, never lost (test-securite-ui §5).
- API keys encrypted on the PC, sent only to the chosen provider, never written to logs or page storage.

## 5. Known limits (honestly)
- No external audit or third-party penetration test.
- Malware already running **under the same Windows account** can read the user's files, token included. No desktop
  application can protect itself from that alone.
- The Windows named pipe ACL is not customised (Node.js does not allow it). Mutual authentication covers this point.
- Interface tests run on Linux: DPAPI encryption is verified on a Windows PC.

## 6. Reporting a vulnerability
cheicksylla615@gmail.com — please do not publish the vulnerability before it is fixed.

## Health data (2.6.0)
- The brain's health tools (treatments and vital signs, glossary, anonymisation) run only inside the app: no network
  request.
- Confidentiality guard **in the main process** (`garde-sante.js`): before any call to an **online** personal AI, on
  both channels, ALL outgoing content is analysed — system prompt, full history, message, tool calls and results —,
  each piece separately then the whole. Health content without session consent ⇒ call refused by the main process,
  whatever path the page took. A local AI (`localhost`) is not affected.
- Anonymisation never changes the original: it creates a copy. It is an aid, not a guarantee: the copy must be
  reviewed before sharing.
- Tested: `tools/test-garde-sante.js`, `tools/test-cerveau.js`, `tools/test-cerveau-app.js`.

## IPC "fail closed" (2.6.0)
Each IPC handler checks that the call comes from the main window AND its main frame. Since 2.6.0 a missing sender
frame, missing main frame or an exception during the check result in a **refusal** (previously: allowed).

## Voice dictation (2.7.0)
| Protection | Detail | Test |
|---|---|---|
| Microphone under control | The permission handler refuses everything except **audio-only** `media` requested by the main window, its main frame and `aura://app/`, **during a dictation started** by the author. Camera and audio+video always refused. Refused again after stopping. | test-dictee-app |
| Isolated engine | sherpa-onnx (native) runs in a `utilityProcess`: a crash or corrupted model reaches neither the window nor the main process. Audio arrives over validated IPC (`Float32Array`, 2 s max per block, ignored outside dictation); nothing written to disk or sent. | test-dictee, test-dictee-app |
| Confined paths | Model files must be inside the model folder and exist before the native call. | test-dictee |
| Download | None without a click; HTTPS only; allowed hosts `huggingface.co`, `*.hf.co`, and `hf-mirror.com` **only if the user accepts that third-party mirror**; redirects checked **before** connecting; SHA-256 checked; maximum size; sanitised names; `.part` then rename. | test-dictee (simulated network) |
| Recognised text | Inserted as **text** (never interpreted as HTML); provisional text never saved. | test-dictee-app |
| Package | Only the native binary of the built architecture is shipped; MSIX `microphone` capability declared. | `build.js` review |

## Hardened executable (2.7.0)
Electron fuses set by `build-config.js`: `EnableNodeOptionsEnvironmentVariable`, `EnableNodeCliInspectArguments` and
`GrantFileProtocolExtraPrivileges` **disabled**. `RunAsNode` stays enabled because Aurora (separate process) and the
MCP connector launched by assistants use the executable in Node mode; known limit: a program already running under
the user's account could use it as an ordinary Node.js (it could launch its own anyway).
Check: `npx @electron/fuses read --app <executable>`.

## AI transparency (2.7.0)
- Reporting: an e-mail is **prepared** (`mailto:`); the author reviews and sends it. Document content is never attached.
- Aurora models: `HF_ENDPOINT` (mirror) is passed only with explicit consent; an inherited value is ignored.
- Provenance: local marking in the document (`<span class="aura-ia" data-ia="…">`), no data sent. An indication,
  not proof.

## 2.7.1 — trust in models and packages
| Protection | Detail | Test |
|---|---|---|
| Pinned hashes | Name, size and official hash (LFS SHA-256 or git blob) of every file of every model are in `dictee-modeles.js`. Authenticity no longer depends on the server. | test-dictee |
| Reuse | A file already present is never reused without re-hashing. | test-dictee |
| Import | Exact file names only; different hash → "unverified", start refused without explicit consent; file modified after verification → unverified again. | test-dictee |
| Built-in model | Canary 180M Flash copied into the package by `build.js` after verification, checked again by `tools/verifier-paquet.js`. | test-verifier-paquet |
| Life cycle | Numbered session; microphone never allowed for a cancelled start; stop confirmed by the engine's "done" acknowledgement; no text written into another document than the starting one. | test-dictee-app |
| Packages | Automatic check after each target: version, essential files, engine of the right architecture and no other, built-in model hashes, Aurora, hardened fuses, no cache and no personal address. | test-verifier-paquet |
| GPU acceleration | GPU trial logged before initialisation; a never-confirmed trial (driver crash) is skipped at the next launch; hot CPU fallback; no network access; only the Vulkan engine is shipped. | aurora/tests/gpu.test.ts |

## 2.8.0 — new features, same guarantees
| Protection | Detail | Test |
|---|---|---|
| Search by meaning | Documents sent to Aurora (local process) only during a search, bounded text (300 documents × 5,000 characters) validated on both sides; vectors in Aurora's data folder; models verified by SHA-256; no network access during search. | aurora/tests/semantic.test.ts |
| Constrained JSON outputs | llama.cpp grammar derived from a closed schema (enumerations, `additionalProperties: false`); the answer is still validated by `sanitizePlan`; a grammar is never reused after an instance change (GPU → CPU fallback). | aurora/tests/semantic.test.ts |
| Live dictation | Same isolated process as dictation; audio never written; Nemotron hashes pinned; simulation mode reserved for tests. | tools/test-dictee.js |
| Pinned Aurora models | Ministral 3 3B and Gemma 4 E2B: SHA-256 checked after download, file deleted if it differs. | aurora/tests/semantic.test.ts |
