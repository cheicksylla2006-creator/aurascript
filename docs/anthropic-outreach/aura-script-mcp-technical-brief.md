# Aura Script 2.8.0 — Claude / MCP technical brief

**Status:** Technical overview for preliminary discussion; not a security certification or a completed directory submission.  
**Project:** Aura Script by SyllaBora  
**Release:** https://github.com/cheicksylla2006-creator/aurascript/releases/tag/v2.8.0  
**Connector repository:** https://github.com/cheicksylla2006-creator/aurascript

## 1. Architecture

The Claude integration is based on a local stdio MCP server.

1. Claude Code starts the connector process over standard input/output.
2. The connector communicates with the Aura Script desktop application over a local IPC channel.
3. The local channel is a named pipe on Windows and a private Unix socket on supported Linux builds.
4. The connector uses authenticated request/response messages with HMAC-SHA256, one-time nonces and timestamps.
5. The application applies its own tool allow-list, argument validation, read scope and write-permission settings before dispatching operations.

The connector does not expose a public TCP listener and does not require an Aura Script cloud account.

## 2. Available MCP capabilities

The connector currently exposes 13 purpose-built tools:

| Tool | Purpose | Access |
|---|---|---|
| get_workspace | Inspect the active workspace | Read |
| list_documents | List documents in the configured read scope | Read |
| read_document | Read permitted document content | Read |
| search_documents | Search permitted document titles and content | Read |
| open_document | Open a document in Aura Script | Read / UI action |
| sheet_read | Read spreadsheet values and formulas | Read |
| edit_text | Edit text documents | Write |
| sheet_write | Write spreadsheet cells and formulas | Write |
| slides_edit | Add, update or delete presentation slides | Write |
| canvas_add | Add objects to a canvas | Write |
| code_write_file | Write a file in the active code project | Write |
| create_chart | Create a chart in a supported workspace | Write |
| create_document | Create a document, spreadsheet, presentation or code file | Write |

Four reusable MCP prompts are also exposed for document drafting, summarization, document-to-presentation conversion and spreadsheet creation.

## 3. Permission and lifecycle behaviour

- The connector is disabled until the user enables it in Aura Script.
- The user chooses which documents are available to assistants; the default scope is user-shared documents.
- Write behaviour is controlled by Aura Script settings. The default workflow asks the user to approve each modification; users can choose a different permission setting.
- When Aura Script is closed, the connector can read only the documents the user has explicitly shared. A new-document request can be queued and presented to the user when the application is opened again.

## 4. Data-flow and privacy boundary

The local connector transport does not send document contents to a server operated by SyllaBora. However, **when Claude reads a document, its contents are provided to Claude** and are processed under the user's applicable Anthropic terms and privacy settings. Local MCP transport must not be confused with local model inference.

Aura Script does not currently provide a remote MCP endpoint for Claude web or mobile. A remote connector would be a separate product and security design, not part of the current 2.8.0 integration.

## 5. Security posture and limitations

The public connector documentation describes:
- Local IPC rather than a public network listener.
- HMAC-SHA256 authentication, one-time nonces and timestamp checks.
- Argument validation at connector and application layers.
- User-configurable document scope and write permissions.
- Automated adversarial tests for protocol and input-validation cases.

Limitations:
- The desktop application's source code is not public.
- No independent third-party security audit or certification is claimed.
- Automated connector tests do not replace end-to-end testing with a real Claude Code or Claude Desktop installation on each supported OS.
- The Claude Code plugin is currently distributed through a community/custom marketplace, not an Anthropic-curated directory.
- A Claude Desktop MCPB package has not yet been published and validated.

Security policy and reporting contact: https://github.com/cheicksylla2006-creator/aurascript/blob/feat/gemini-cli-extension/SECURITY.md

## 6. Validation status

The repository contains protocol smoke tests and a GitHub Actions validation workflow. The Gemini extension and Claude plugin packaging changes are in an open pull request; they are not merged. Real-client end-to-end validation remains outstanding and is not represented as completed.

Pull request: https://github.com/cheicksylla2006-creator/aurascript/pull/2

## 7. Suggested discussion with Anthropic

We would appreciate feedback on:
1. Whether the existing local MCP connector is best distributed as a Claude Code plugin, a Claude Desktop Extension (MCPB), or both.
2. Required security, documentation and testing expectations for official directory review.
3. Whether a developer-relations contact could review the integration design before formal directory submission.

**Project contact:** cheicksylla615@gmail.com  
**Website:** https://aura-script.com
