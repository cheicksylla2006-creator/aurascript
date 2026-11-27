# Aura Script

<img src=".claude-plugin/icon.png" width="96" alt="Aura Script">

**Aura Script** is an independent writing workspace for Windows and Linux: real A4 documents, presentations, spreadsheets, canvas boards, code and PDF, with a local AI. This plugin lets Claude use Aura Script as its **working environment**: Claude can read what you are working on, search your library, and write documents, slides and spreadsheets straight into the app — while Aura Script keeps its document library on your computer by default. Content shared with an external assistant is processed according to that provider's terms.

Start with the free edition. **Aura Script Pro** is priced at **US$15 per year as an individual subscription for up to four devices (automatic annual renewal until canceled)** (applicable taxes may vary by location). Sales are not yet open. See the [official website](https://www.aura-script.com/#offres) for the offer and launch status.

## Download Aura Script

| Platform | Get it |
|---|---|
| **Windows** (x64 and ARM) | [Microsoft Store](https://apps.microsoft.com/detail/9nsqkw8c6xp8) — automatic updates |
| **Linux** (x86_64) | [AppImage and .deb — [check available release assets](https://github.com/cheicksylla2006-creator/aurascript/releases) |

On Linux, make the AppImage executable and run it: `chmod +x Aura-Script-x86_64.AppImage && ./Aura-Script-x86_64.AppImage`. This repository contains the Claude plugin and the Linux releases; the application's source code is not published.

**Quick links:** [Official website](https://www.aura-script.com/) · [Windows download](https://apps.microsoft.com/detail/9nsqkw8c6xp8) · [Linux releases](https://github.com/cheicksylla2006-creator/aurascript/releases) · [Report feedback](https://github.com/cheicksylla2006-creator/aurascript/issues) · [Support development](https://www.aura-script.com/#soutenir).

## Development update — AuraScript 3.0 series

The latest Windows candidate has been submitted to the Microsoft Store for certification. Availability is not yet confirmed. Use the Microsoft Store or published GitHub releases for the currently available version.

Planned free additions:

- **Canvas redesign:** print and social-media frames, pen and shape tools, gradients, brand kit, precise positioning, PNG/PDF/SVG export.
- **Batch processing:** document selection, preview, history, cancellation and undo.
- **Workflows:** reusable sequences, portable JSON import/export and built-in templates.
- **Export presets:** PDF, Word, Markdown, HTML and text, with naming patterns.
- **Versioned encrypted backups:** a destination chosen by the user, retention and restoration previews.
- **Aurora:** additional in-app tools for design and automation. The public MCP connector retains its existing 13 tools.

The proposed Pro edition adds advanced document analysis and side-by-side document/version comparison. The four new automation and backup features remain free. The price is set at US$15 per year for an individual subscription covering up to four devices, renewing annually until canceled. AuraScript Web access is planned for active Pro subscribers, but is not yet available. Purchase availability will be announced after release validation.

Windows certification is pending; check published release assets for Linux availability. Follow [release notes](https://www.aura-script.com/versions) or [CHANGELOG.md](CHANGELOG.md) for updates.

## What Aura Script can do

- **Six spaces in one app** — A4 documents with templates, spell-check and equations; presentations with animations and PowerPoint export; spreadsheets with formulas and charts; a canvas for shapes, stickers, mind maps and kanban; a code editor; a PDF reader with annotations.
- **Aurora, a local AI** — summaries, rewrites, outlines and translations that run entirely on your computer, offline.
- **A brain, even without AI** — summary, keywords, outline, readability, proofreading and natural-language commands (“insert a 3x4 table”, “analyse the sheet”) work instantly with no model and no connection; AI comes as reinforcement and its suggestions are checked.
- **Health** — templates for consultation reports, medication schedules, health diaries and care handovers; extraction of medications and vital signs, medical abbreviations, de-identification. Health text is never sent to an online AI without your consent.
- **Or your own AI** — connect ChatGPT, Claude, Gemini, Mistral or OpenRouter with your own key; it becomes the main assistant. Text changes can be reviewed and accepted or rejected; connector edits follow your chosen permissions.
- **It adapts on its own** — Aura Script recognises what you are writing (music, maths, physics, chemistry, biology, computing, languages, economics, law, screenplay, poetry) and shows the right tools: guitar and piano chord diagrams, chemical equation balancing, toned pinyin, screenplay layout…
- **Group mode** — work together on the same canvas over your local network, end-to-end encrypted, with no server.
- **Private by design** — no account, no ads, no analytics; local data protection varies by platform; see the privacy policy. Available in 6 languages, in violet or Sakura pink, light, dark or paper mode.
- **Works with AI assistants** — a local MCP connector lets Claude, Gemini CLI, Codex, Copilot, Cursor, Windsurf or LM Studio work inside Aura Script (this plugin).

## Install the Claude plugin

```
/plugin marketplace add cheicksylla2006-creator/aurascript
/plugin install aura-script@aura-script
```

These commands are for Claude Code and compatible plugin environments. See the [Claude connector guide](https://www.aura-script.com/claude/) for setup. Directory listing is not assumed.

## Requirements

- **Aura Script 2.6.0 or later** on Windows ([Microsoft Store](https://apps.microsoft.com/detail/9nsqkw8c6xp8)) or Linux ([releases](https://github.com/cheicksylla2006-creator/aurascript/releases)).
- In Aura Script: **Settings › Connectors › Enable the local MCP connector** (or "Connect detected assistants").
- Node.js is used to start the connector (bundled with Claude Desktop; install it for Claude Code).

## How it works

The plugin starts a small local MCP server (`server/aura-mcp.js`, standard library only, no dependencies). It talks to Aura Script through a **local channel with a random name** (named pipe on Windows, private 0600 socket on Linux). Every request is **signed (HMAC-SHA256) with a one-time nonce** and every reply is signed by Aura Script: replayed, modified or stale messages are rejected, and the secret key — renewed at every launch — never travels. It opens **no network port** and **contacts no server** — no account, no telemetry. See [SECURITY.md](SECURITY.md).

- **Aura Script open:** all tools, with the permissions you set in the app (shared documents only, or the whole library; ask before every change, allow, or forbid changes).
- **Aura Script closed:** read-only access to the documents you shared; a new document is queued and offered to you next time you open the app.

## Tools

| Tool | Title | Annotation |
|---|---|---|
| get_workspace | Get open workspace | read-only |
| list_documents | List documents | read-only |
| read_document | Read document | read-only |
| search_documents | Search documents | read-only |
| open_document | Open document in Aura Script | read-only |
| sheet_read | Read spreadsheet | read-only |
| edit_text | Edit text document | destructive (asks you first) |
| sheet_write | Write spreadsheet cells | destructive (asks you first) |
| slides_edit | Edit presentation | destructive (asks you first) |
| canvas_add | Add canvas object | destructive (asks you first) |
| code_write_file | Write code file | destructive (asks you first) |
| create_chart | Create chart | destructive (asks you first) |
| create_document | Create document | destructive (asks you first) |

Prompts: `rediger_document`, `resumer_document`, `document_en_presentation`, `tableau_depuis_texte`.

## Examples

### Example 1 — Write a report into Aura Script
> "Write a two-page report on renewable energy in West Africa and put it in Aura Script."

Claude drafts the report and calls `create_document` (type `texte`, Markdown). The document opens in Aura Script as a formatted A4 page; you approve it there.

### Example 2 — Turn my notes into slides
> "Take my document 'Biology notes' in Aura Script and make a 6-slide presentation from it."

Claude calls `search_documents` → `read_document`, then `create_document` (type `slides`, one "# Title" per slide). The presentation opens in Aura Script's slide editor.

### Example 3 — Fix the open spreadsheet
> "Look at the budget I have open in Aura Script and add a total row with formulas."

Claude calls `get_workspace` and `sheet_read`, then `sheet_write` with `=SUM(...)` formulas. Aura Script shows the change for approval before applying it.

### Example 4 — Polish a chapter
> "Proofread the selected chapter in Aura Script and keep my style."

Claude reads the document, then calls `edit_text`; Aura Script shows a word-by-word diff that you accept (Enter) or refuse (Esc).

## Privacy Policy

Aura Script is designed for local-first document storage, without an obligatory account. Its Windows edition uses operating-system protection for locally stored data; see the current privacy policy for platform-specific details. The connector communicates with Aura Script on the same computer via a local channel (named pipe on Windows or socket on Linux); it sends nothing to the plugin's author or to any third party. When you use the tools, the content that Claude reads or writes is exchanged between Aura Script and your Claude app, and is then handled under Anthropic's own privacy policy. A short activity log of tool calls (time, assistant, tool name, result) is kept locally in Aura Script and can be cleared at any time. Full policy: https://www.aura-script.com/confidentialite/

## Support independent development

Aura Script is an independent project developed by SyllaBora. If the application or its free connector helps you, you can voluntarily support its maintenance, compatibility testing, documentation and future development.

**[Support Aura Script on Buy Me a Coffee](https://www.buymeacoffee.com/cheick)**

Support is optional, separate from the Pro subscription, and does not unlock paid features or confer ownership, equity, or financial returns. You can also help at no cost by reporting reproducible issues, sharing the project, or providing feedback.

## Support

- E-mail: cheicksylla615@gmail.com
- https://www.aura-script.com/
- https://www.aura-script.com/claude/
- In the app: Help › About.

## License

See [LICENSE](LICENSE).
