# Aura Script — Release notes

## 3.0.0 — November 27, 2026

**Linux:** AppImage and .deb (x86_64) are available in [GitHub releases](https://github.com/cheicksylla2006-creator/aurascript/releases/tag/v3.0.0).
**Windows:** distributed through the [Microsoft Store](https://apps.microsoft.com/detail/9nsqkw8c6xp8); the 3.0 update reaches the Store after Windows validation and certification.

### Free
- Canvas: preset print and social frames, pen, shapes, brand kit, resizing, precise alignment and PNG/PDF/SVG export. Exports work on a snapshot of the scene, name substituted fonts, and report the effective resolution of image PDFs.
- Batch processing: preview, document selection, stop, error log, per-document history and undo for the latest batch, including after a restart.
- Workflows: reusable, versioned JSON action chains with built-in examples and launch-time settings.
- Export presets: formats, naming, optional watermarks and AI provenance.
- Encrypted versioned backup: user-selected folder, retention, size estimate before encryption, incomplete backups flagged, restore preview with search and duplicate choices.
- Aurora: new internal Canvas and automation tools.

### Reliability
- AI batch edits never cut a character, word, link or formatting in two (emoji, accents, Chinese, Arabic); a block the checks reject is left intact and reported.
- Typing during a batch is never overwritten: the document is reported as a conflict instead.
- Stopping a batch waits for the current step; a late AI answer changes nothing.
- Save and Ctrl+S report "Saved" only after the write is confirmed.
- Restoring the open document refreshes the editor; restoring is refused while a batch runs.

### Security
- Regular expressions from users, imported workflows or AI are tried in an isolated, time-limited worker first (no freeze).
- AI tools that write files ask for approval like other changes.
- Restored versions and AI undo are sanitized like imported documents; documents cannot contain forms.
- Canvas images are limited to embedded image data; Windows reserved file names are neutralized on export.
- Backup files: authenticated header, bounded key-derivation parameters and decompression size.

### Pro — not on sale
- Advanced document analysis and side-by-side document/version comparison (formatting, tables, lists) with HTML export; the comparison is labelled non-exhaustive.
- Limited previews without a license. Price: US$15, one-time individual license for up to three devices; sales are not yet open.

### Unchanged
- The external MCP tool set (13 tools); internal Aurora tools are not exposed. Connector 3.0.0 is compatible with Aura Script 2.6.0 and later.
- The application's source code is not published.

## 2.8 — Public release series

Local documents, presentations, spreadsheets, Canvas, code and PDF; dictation, semantic search, local models and the MCP connector.

Official downloads: [Microsoft Store](https://apps.microsoft.com/detail/9nsqkw8c6xp8) · [GitHub releases](https://github.com/cheicksylla2006-creator/aurascript/releases) · [website](https://www.aura-script.com/versions).
