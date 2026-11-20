---
name: aura-script
description: Work inside Aura Script (the user's local Windows writing app) — read, search, create and edit their documents, presentations, spreadsheets, canvas and code through the aura-script tools. Use when the user mentions Aura Script, "my document", "my slides" or asks to write something into their workspace.
---

# Working in Aura Script

Aura Script is the user's own workspace on their PC. Treat it as the place where finished work lives.

## Always start by looking

1. Call `get_workspace` to see what is open (document type, title, selection).
2. Use `list_documents` or `search_documents` before asking the user which file they mean.
3. Read with `read_document` (or `sheet_read`) before proposing any change.

## Writing back

- Text documents: `edit_text` with Markdown (# titles, lists, **bold**, | tables |, $$ LaTeX $$).
- New work: `create_document` — `texte` (Markdown), `slides` (one "# Title" per slide, 3–6 bullets), `sheet` (CSV with a header row), `code`.
- Spreadsheets: `sheet_write` from a start cell; formulas start with "=".
- Charts: `create_chart`. Canvas: `canvas_add`.

Every write is shown to the user for approval inside Aura Script (unless they allowed it). Say what you are about to change, keep edits focused, and never rewrite a whole document when a section is enough.

## When Aura Script is closed

Only documents the user chose to share are readable, and `create_document` is queued: the user sees the proposal next time they open the app. Tell them so.

## Respect the context

Aura Script detects the subject of a document (music, maths, chemistry, screenplay, poetry…). Keep its conventions: chords stay in place in songs, equations stay in LaTeX, chemical equations are balanced, screenplays keep INT./EXT. headings.
