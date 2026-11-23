# Aura Script — local MCP connector (no server)

The **MCP** protocol (Model Context Protocol) lets a desktop AI assistant use "tools" provided by another program.
Aura Script provides one, **without any server**: no account, no hosting, no open network port, nothing running online.

## How it works

```
Claude Desktop, Claude Code, Gemini CLI, Codex CLI, GitHub Copilot (VS Code), Cursor, Windsurf, LM Studio
        │  launched by the assistant itself, locally (stdio)
        ▼
Documents\Aura Script\Connecteur\aura-mcp.js     ← run by Aura Script.exe
        │                                          (ELECTRON_RUN_AS_NODE=1, no Node needed)
        ├── Aura Script OPEN    → randomly named local channel (named pipe / 0600 socket) + HMAC authentication
        │                         → all tools, live, with your permissions
        └── Aura Script CLOSED  → "share" folder (documents YOU shared)
                                  → read-only; a creation is put "on hold"
                                    and offered to you at the next launch
```

* **Protocol**: JSON-RPC 2.0, one line per message, over standard input/output (MCP `stdio` transport). Methods:
  `initialize`, `ping`, `tools/list`, `tools/call`, `resources/list`, `resources/read`, `prompts/list`, `prompts/get`.
  Accepted versions: 2025-11-25, 2025-06-18, 2025-03-26, 2024-11-05.
* **Between connector and app**: Windows named pipe (no TCP), JSON lines. Protocol v2: `{v:2, body, mac}` with
  `mac = HMAC-SHA256(token, "req|"+body)`, unique nonce and timestamp in the body; signed responses. The token
  (256 bits, renewed at each launch) is in `connexion.json` and never travels. Details and tests: `SECURITY.md`.

## One-click connection
1. **Settings › Connectors › "Connect detected assistants"**: Aura Script finds the assistants installed on the PC,
   enables the connector and adds itself to each one (a `.avant-aura-script` backup copy is made). Then restart the
   assistant.
2. The first time an assistant is detected but not yet linked, a notification offers **"Link"** (once).
3. **"Install in Claude Desktop"** creates the `Aura Script.mcpb` extension (MCP Bundle, `manifest_version` 0.3) and
   opens it: Claude Desktop shows its installation window and provides Node.js itself.

The extension finds the app through a copy of the connection file at a fixed place,
`%USERPROFILE%\.aura-script\connexion.json`. The token stays specific to your Windows account: **nothing is tied to an
e-mail address, an account or a server.**

Each tool declares a title and its safety annotations (`readOnlyHint` / `destructiveHint`, `openWorldHint: false`).
For the Claude directory, the connector is published as a **plugin** (`plugin/aura-script/`); the application's own
source code is not published.

### Ready-made prompts (MCP prompts)

| Prompt | What it does |
|---|---|
| `rediger_document` | writes a document on a topic and creates it in Aura Script |
| `resumer_document` | finds a document, summarises it in 5 points and proposes 3 improvements |
| `document_en_presentation` | turns a document into a presentation |
| `tableau_depuis_texte` | organises data into a spreadsheet |

## Permissions (Settings › Connectors)

| Setting | Values | Default |
|---|---|---|
| What assistants can read | Shared documents only · The whole library | Shared only |
| Changes | Ask me every time · Allow · Forbid | Ask me |
| Shared documents | one box per document | none |

* When a change is requested, a card appears in Aura Script's assistant panel: **Allow / Refuse**. No answer within
  5 minutes: refused.
* Every AI change can be undone ("Undo these changes" button, Ctrl+Z).
* "Disable" stops the pipe and **empties the share folder**.

## The tools

They are **the same** for the built-in AI (API key) and for external assistants (MCP): one definition
(`ia-outils.js`), one permission policy.

| Tool | Role | Writes? |
|---|---|---|
| `get_workspace` | open document, selection, number of documents | no |
| `list_documents` | list (id, type, title, date) | no |
| `read_document` | text (numbered paragraphs), sheet (cells + formulas), slides, code files, canvas objects | no |
| `search_documents` | searches text across all allowed documents | no |
| `open_document` | opens a document in its workspace | no |
| `sheet_read` | reads a range of the open sheet | no |
| `edit_text` | appends, inserts, replaces (selection, paragraph, find/replace, all) — Markdown | yes |
| `sheet_write` | writes a table of values/formulas, new tab possible | yes |
| `slides_edit` | adds / edits / deletes a slide | yes |
| `canvas_add` | adds text, sticky note, rectangle, ellipse | yes |
| `code_write_file` | creates or replaces a project file | yes |
| `create_chart` | chart (bars, line, pie, scatter, function f(x)…) in the document, slide or sheet | yes |
| `create_document` | new text, sheet, presentation, code or canvas | yes |

App closed: `list_documents`, `read_document`, `search_documents` (shared documents) and `create_document` (on hold).

## Supported assistants

| Assistant | Configuration file | Works |
|---|---|---|
| **Claude Desktop** (Anthropic) | `%APPDATA%\Claude\claude_desktop_config.json` | yes, stdio |
| **Gemini CLI** (Google) | `%USERPROFILE%\.gemini\settings.json` | yes, stdio |
| **Codex CLI** (OpenAI) | `%USERPROFILE%\.codex\config.toml` | yes, stdio |
| **GitHub Copilot** (VS Code, Copilot CLI) | `%USERPROFILE%\.copilot\mcp-config.json` | yes, stdio |
| **Claude Code** (Anthropic) | `%USERPROFILE%\.claude.json` | yes, stdio |
| **Cursor** | `%USERPROFILE%\.cursor\mcp.json` | yes, stdio |
| **Windsurf** (Codeium) | `%USERPROFILE%\.codeium\windsurf\mcp_config.json` | yes, stdio |
| **LM Studio** (local AIs) | `%USERPROFILE%\.lmstudio\mcp.json` | yes, stdio |
| ChatGPT (app), Le Chat, Perplexity | — | no: they only accept **online** connectors |

**Microsoft Store version (MSIX)**: Windows forbids other apps from launching an executable in the WindowsApps folder.
The connector then uses `node` (Node.js installed once from nodejs.org). The app detects this and says so in the tab.

## Why no remote server
A remote server only serves one purpose: letting a **cloud** assistant reach the documents when the computer is off.
It is not needed, and local operation is never sacrificed: if an online relay is ever added, it will be **optional**,
off by default, end-to-end encrypted, and the local connector will remain the main path.
