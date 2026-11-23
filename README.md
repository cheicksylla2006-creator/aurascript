# Aura Script

**A free, independent creative workspace for Windows and Linux**, with local AI and a local MCP connector.

[Official website](https://aura-script.com) · [Microsoft Store](https://apps.microsoft.com/detail/9nsqkw8c6xp8) · [Linux downloads](https://github.com/cheicksylla2006-creator/aurascript/releases) · [YouTube](https://www.youtube.com/@aurascriptapp)

This repository publishes the **Aura Script MCP connector**, the Claude plugin and the Gemini CLI extension. The Aura Script desktop application's source code is not published here.

## What is Aura Script?

Aura Script brings several creative workspaces together:

- A4 documents, templates, equations and proofreading.
- Presentations with animations and PowerPoint export.
- Spreadsheets with formulas and charts.
- Canvas boards, mind maps and kanban.
- Code editing and PDF reading with annotations.
- **Aurora**, an AI that can run locally on the computer.
- Local voice dictation, semantic document search and AI text provenance.

Aura Script is free to use. The desktop application is distributed separately:

| Platform | Download |
|---|---|
| Windows x64 / ARM64 | [Microsoft Store](https://apps.microsoft.com/detail/9nsqkw8c6xp8) |
| Linux x86_64 | [AppImage, .deb and checksums](https://github.com/cheicksylla2006-creator/aurascript/releases) |

## Connect Gemini CLI

This repository is installable as a **Gemini CLI extension**. It provides a local MCP server and an Aura Script-specific context file and skill.

### Requirements

- Aura Script **2.7.1 or later** installed and launched at least once.
- Gemini CLI installed.
- Git available on PATH (required by Gemini CLI when installing from GitHub).
- Node.js available on PATH to run the MCP server.

### Install

1. Open Aura Script and go to **Settings → Connectors**.
2. Enable **the local MCP connector**. Do not also use “Connect detected assistants” for Gemini when you install this extension; that option writes a separate direct MCP entry and may cause the same server to be loaded twice.
3. In a terminal, install the extension:

   ```bash
   gemini extensions install https://github.com/cheicksylla2006-creator/aurascript
   ```

4. Restart Gemini CLI. Check that the extension is listed:

   ```text
   /extensions list
   ```

5. Ask Gemini to inspect the workspace or list the documents you have shared with Aura Script.

To update the extension after a new release:

```bash
gemini extensions update aurascript
```

The extension manifest is **gemini-extension.json**. It launches **server/aura-mcp.js** through Gemini CLI's supported `extensionPath` variable and loads **GEMINI.md** as extension context. The bundled Aura Script skill is under **skills/aura-script/**.

## Connect Claude

### Claude Code

The repository includes a Claude Code plugin. You can install it from this custom marketplace:

```text
/plugin marketplace add cheicksylla2006-creator/aurascript
/plugin install aura-script@aura-script
```

This is a community/custom marketplace installation. It is separate from Anthropic's curated plugin directory; third-party submissions to that directory are now handled through [Claude's plugin directory manager](https://claude.ai/directory/manage), not pull requests to Anthropic's `claude-plugins-official` repository.

### Claude Desktop

Claude Desktop supports local MCP servers and desktop extensions. The Aura Script connector currently provides a stdio MCP server; use the local MCP configuration documented by Aura Script. A single-click `.mcpb` desktop-extension package and submission to Anthropic's desktop extensions directory are separate packaging/review steps and are not claimed to be available yet.

See [Anthropic distribution notes](docs/anthropic-distribution.md) for the current routes and preparation checklist.

## How the connector works

The MCP server uses **stdio** between the AI client and the connector. The connector then communicates with Aura Script through a local, randomly named channel:

- A named pipe on Windows.
- A private Unix socket on Linux.

Requests and responses are authenticated with HMAC-SHA256. The connector does not open a network port or require an Aura Script cloud account.

- **When Aura Script is open:** the assistant can use the tools allowed in Aura Script's connector settings. Changes are subject to the app's approval settings.
- **When Aura Script is closed:** only documents explicitly shared by the user are available for reading. A new document can be queued and presented when Aura Script is opened again.

### Available tools

| Tool | Purpose |
|---|---|
| `get_workspace` | Inspect the active workspace |
| `list_documents` | List documents available to the assistant |
| `read_document` | Read a permitted document |
| `search_documents` | Search permitted documents |
| `open_document` | Open a document in Aura Script |
| `sheet_read` | Read spreadsheet cells |
| `edit_text` | Edit a text document |
| `sheet_write` | Write spreadsheet cells |
| `slides_edit` | Edit a presentation |
| `canvas_add` | Add an object to the canvas |
| `code_write_file` | Write a project code file |
| `create_chart` | Create a chart |
| `create_document` | Create a document, sheet, presentation or code file |

The server also exposes four reusable MCP prompts.

## Privacy and security

Aura Script's connector is local-first: it does not send documents to a server operated by SyllaBora. The user chooses which documents an assistant may access and how edits are approved.

**Important:** when an assistant reads document content, that content is provided to the assistant. If Gemini or another cloud-hosted model is selected, the content it receives is processed under that provider's terms and privacy settings. Local MCP transport does not make a cloud model local.

See [SECURITY.md](SECURITY.md) for the security policy and vulnerability reporting instructions. The desktop application's source code is not published in this repository; there has not yet been an independent third-party security audit.

## Development and validation

The MCP connector has no third-party runtime dependencies. Basic protocol smoke tests can be run with Node.js:

```bash
node --check server/aura-mcp.js
node --test tests/*.test.js
```

These tests validate the connector's JSON-RPC startup and disconnected/read-only tool listing. They do **not** replace end-to-end testing with a real Gemini CLI installation and a running Aura Script app.

## Support

- Website: https://aura-script.com
- Support: cheicksylla615@gmail.com
- Security reports: see [SECURITY.md](SECURITY.md)

---

## Français

**Aura Script est un environnement de création gratuit et indépendant pour Windows et Linux**, avec une IA locale et un connecteur MCP local.

Ce dépôt publie le **connecteur MCP**, le plugin Claude et l'extension Gemini CLI. Le code source de l'application de bureau Aura Script n'est pas publié dans ce dépôt.

### Installer avec Gemini CLI

**Prérequis :** Aura Script 2.7.1 ou ultérieur, Gemini CLI, Git et Node.js accessibles depuis le terminal.

1. Ouvre Aura Script, puis va dans **Paramètres → Connecteurs** et active le connecteur MCP local.
2. Pour cette méthode, n'utilise pas simultanément « Connecter les assistants détectés » pour Gemini : cette option écrit une seconde configuration MCP directe et peut charger deux fois le même serveur.
3. Dans un terminal :

   ```bash
   gemini extensions install https://github.com/cheicksylla2006-creator/aurascript
   ```

4. Redémarre Gemini CLI et vérifie l'installation avec `/extensions list`.

Pour mettre à jour l'extension :

```bash
gemini extensions update aurascript
```

### Installer avec Claude Code

```text
/plugin marketplace add cheicksylla2006-creator/aurascript
/plugin install aura-script@aura-script
```

### Fonctionnement et confidentialité

Le serveur MCP communique avec Aura Script uniquement par un canal local : tube nommé sous Windows ou socket Unix privé sous Linux. Les échanges sont authentifiés par HMAC-SHA256. Aucun port réseau n'est ouvert par le connecteur.

Lorsque l'application est fermée, seuls les documents explicitement partagés sont accessibles en lecture ; une création peut être mise en attente jusqu'à la prochaine ouverture.

Les contenus lus par un assistant lui sont transmis. Avec Gemini ou un autre modèle hébergé dans le cloud, les données reçues sont traitées selon les conditions et paramètres de confidentialité du fournisseur choisi. Un transport MCP local ne rend pas un modèle cloud local.

- [Télécharger Aura Script](https://github.com/cheicksylla2006-creator/aurascript/releases)
- [Site officiel](https://aura-script.com)
- [Politique de sécurité](SECURITY.md)
