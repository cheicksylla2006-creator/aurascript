# Gemini CLI setup

Aura Script can be installed as a Gemini CLI extension directly from this GitHub repository.

## Requirements

- Aura Script 2.7.1 or later, installed and launched at least once.
- Gemini CLI.
- Git available on PATH for installation from GitHub.
- Node.js available on PATH to launch the local MCP server.

## Install

1. Open Aura Script.
2. In **Settings → Connectors**, enable the local MCP connector.
3. Do not also choose **Connect detected assistants** for Gemini when using this extension. That feature writes a direct MCP entry to Gemini's settings file and can create a duplicate connection.
4. Run:

   ```bash
   gemini extensions install https://github.com/cheicksylla2006-creator/aurascript
   ```

5. Restart Gemini CLI.
6. Check the installed extension with `/extensions list`.

## Update and remove

Update:

```bash
gemini extensions update aurascript
```

Uninstall:

```bash
gemini extensions uninstall aurascript
```

## First test

With Aura Script open and its local MCP connector enabled, ask Gemini:

> Inspect my Aura Script workspace and list the documents that I have allowed you to access.

Then test a read-only action before trying a change. Write operations remain subject to Aura Script's own permissions and approval flow.

## Troubleshooting

- **Extension not listed:** restart Gemini CLI and verify that the repository installed successfully.
- **MCP server fails to start:** check that `node` and `git` are available in the terminal environment.
- **Aura Script is not connected:** launch Aura Script and enable the local MCP connector in Settings → Connectors.
- **Duplicate tools:** use either this Gemini extension or Aura Script's automatic direct configuration for Gemini, not both. If the direct configuration already exists in Gemini's settings, remove that duplicate entry before testing this extension.
- **Application closed:** only documents explicitly shared by the user are available for reading. New documents are queued for the next app launch.

## Privacy note

The connector-to-app channel is local and authenticated. However, when Gemini reads a document, its content is provided to the selected Gemini model and is subject to Google's applicable terms and privacy settings. A local MCP transport does not make a cloud-hosted model local.
