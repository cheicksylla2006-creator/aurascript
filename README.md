# Aura Script

<img src=".claude-plugin/icon.png" width="96" alt="Aura Script">

**Aura Script** is a free, independent writing workspace for Windows and Linux: real A4 documents, presentations, spreadsheets, canvas boards, code and PDF, with a local AI. This plugin lets Claude use Aura Script as its **working environment**: Claude can read what you are working on, search your library, and write documents, slides and spreadsheets straight into the app — while every file stays on your computer.

## Download Aura Script

| Platform | Get it |
|---|---|
| **Windows** (x64 and ARM) | [Microsoft Store](https://apps.microsoft.com/detail/9nsqkw8c6xp8) — free, automatic updates |
| **Linux** (x86_64) | [AppImage](https://github.com/cheicksylla2006-creator/aurascript/releases/latest/download/Aura-Script-x86_64.AppImage) (any distribution) · [.deb](https://github.com/cheicksylla2006-creator/aurascript/releases/latest/download/aura-script_amd64.deb) (Ubuntu, Debian, Mint) · [all releases](https://github.com/cheicksylla2006-creator/aurascript/releases) |

On Linux, make the AppImage executable and run it: `chmod +x Aura-Script-x86_64.AppImage && ./Aura-Script-x86_64.AppImage`. This repository contains the Claude plugin and the Linux releases; the application's source code is not published.

## What Aura Script can do

- **Six spaces in one app** — A4 documents with templates, spell-check and equations; presentations with animations and PowerPoint export; spreadsheets with formulas and charts; a canvas for shapes, stickers, mind maps and kanban; a code editor; a PDF reader with annotations.
- **Aurora, a local AI** — summaries, rewrites, outlines and translations that run entirely on your computer, offline, with no subscription.
- **Or your own AI** — connect ChatGPT, Claude, Gemini, Mistral or OpenRouter with your own key; it becomes the main assistant. Every AI change is shown word by word for you to accept or reject.
- **It adapts on its own** — Aura Script recognises what you are writing (music, maths, physics, chemistry, biology, computing, languages, economics, law, screenplay, poetry) and shows the right tools: guitar and piano chord diagrams, chemical equation balancing, toned pinyin, screenplay layout…
- **Group mode** — work together on the same canvas over your local network, end-to-end encrypted, with no server.
- **Private by design** — no account, no ads, no analytics; documents are encrypted on your computer. Available in 6 languages, in violet or Sakura pink, light, dark or paper mode.
- **Works with AI assistants** — a local MCP connector lets Claude, Gemini CLI, Codex, Copilot, Cursor, Windsurf or LM Studio work inside Aura Script (this plugin).

## Install the Claude plugin

```
/plugin marketplace add cheicksylla2006-creator/aurascript
/plugin install aura-script@aura-script
```

Or add it from the Claude directory once it is listed.

## Requirements

- **Aura Script 2.5.0 or later** on Windows ([Microsoft Store](https://apps.microsoft.com/detail/9nsqkw8c6xp8)) or Linux ([releases](https://github.com/cheicksylla2006-creator/aurascript/releases)), free.
- In Aura Script: **Settings › Connectors › Enable the local MCP connector** (or "Connect detected assistants").
- Node.js is used to start the connector (bundled with Claude Desktop; install it for Claude Code).

## How it works

The plugin starts a small local MCP server (`server/aura-mcp.js`, standard library only, no dependencies). It talks to Aura Script through a **local Windows named pipe** protected by a random token stored in your user profile. It opens **no network port** and **contacts no server** — no account, no telemetry.

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

Aura Script and this plugin collect **no personal data**. Your documents are stored only on your PC, encrypted by Windows (DPAPI). The connector communicates only with Aura Script on the same computer, through a local named pipe; it sends nothing to the plugin's author or to any third party. When you use the tools, the content that Claude reads or writes is exchanged between Aura Script and your Claude app, and is then handled under Anthropic's own privacy policy. A short activity log of tool calls (time, assistant, tool name, result) is kept locally in Aura Script and can be cleared at any time. Full policy: https://aura-script.com/confidentialite/

## Support

- E-mail: cheicksylla615@gmail.com
- https://aura-script.com/claude/
- In the app: Help › About.

## License

See [LICENSE](LICENSE).
