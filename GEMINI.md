# Aura Script — Gemini CLI extension context

Aura Script is the user's local creative workspace. This extension exposes its tools through a local MCP server.

## Safe working sequence

1. Start by calling `get_workspace` to understand the active document and selection.
2. When the user refers to an existing document, use `list_documents` or `search_documents` before asking which file they mean.
3. Read the relevant content with `read_document` or `sheet_read` before proposing edits.
4. Make focused changes. Do not replace an entire document when a section-level edit is sufficient.
5. Only call write tools when the user has asked for the change. Explain the intended change before a consequential edit.
6. The Aura Script application applies its own permission checks and approval flow. Never claim a change was applied until the app has accepted it.
7. If Aura Script is closed, only user-shared documents are readable. A new document may be queued for the next app launch; tell the user that it is pending rather than claiming it is already open.

## Content conventions

- Text documents use Markdown.
- Presentations use one `# Heading` per slide, with concise supporting points.
- Spreadsheets use CSV content for new sheets and formulas beginning with `=` when writing cells.
- Preserve the document's language, tone, structure and domain-specific notation.
- Avoid sending sensitive content to an online model unless the user has explicitly requested that workflow. Remember that content read by Gemini is provided to the selected Gemini model and is subject to Google's applicable terms and privacy settings.

## Available workspaces

Aura Script supports text documents, presentations, spreadsheets, canvas boards, code and PDF workflows. Use only tools exposed by the MCP server; do not assume an unsupported operation exists.
