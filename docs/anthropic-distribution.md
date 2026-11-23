# Anthropic distribution plan

Status: preparation only. No submission has been sent to Anthropic and no listing or partnership is implied.

## 1. Claude Code plugin directory

Aura Script already has a Claude Code plugin layout:

- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `.mcp.json`
- `skills/aura-script/SKILL.md`
- `server/aura-mcp.js`

The existing custom marketplace installation is:

```text
/plugin marketplace add cheicksylla2006-creator/aurascript
/plugin install aura-script@aura-script
```

Anthropic's current third-party plugin directory process is managed through:

https://claude.ai/directory/manage

Do not submit a pull request to `anthropics/claude-plugins-official` for a third-party plugin. Anthropic's repository README says third-party submissions are now handled through the directory manager and that pull requests there are not monitored.

### Submission package to prepare

- Public repository and stable tagged release.
- Accurate plugin metadata, homepage, support and security contact.
- English installation and troubleshooting instructions.
- Short product demo showing a real Claude Code session using Aura Script.
- Clear description of every MCP tool and its read/write effect.
- Privacy explanation: MCP transport is local, but content read by Claude is sent to the selected Anthropic model.
- Security policy and vulnerability contact.
- Screenshots and a concise use-case description.

Suggested directory description:

> Aura Script connects Claude Code to a user's local creative workspace on Windows and Linux. Through a local, authenticated MCP channel, Claude can discover user-shared documents, read and search content, create documents, edit text, work with spreadsheets and presentations, and interact with canvas and code workspaces. Aura Script keeps the application workspace on the user's computer and applies its own tool permissions and approval settings. Content that Claude reads is processed by Anthropic under the user's applicable Claude terms and settings.

## 2. Claude Desktop Extensions Directory

Claude Desktop has a separate directory for local MCP desktop extensions. Anthropic's help center describes the `.mcpb` package format and a submission route for the directory.

Official information:
https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop

Aura Script currently has a stdio MCP server, but this repository does not yet contain a verified `.mcpb` desktop-extension bundle. Before applying, build and test the bundle on supported operating systems, validate the manifest and configuration fields, and test clean install, upgrade, uninstall, logs and error handling. Do not claim a one-click Claude Desktop install until those tests pass.

## 3. MCP Registry (vendor-neutral)

The official MCP Registry is a separate ecosystem-wide directory, not an Anthropic-only marketplace:

https://registry.modelcontextprotocol.io/

It requires a valid `server.json`, an authenticated namespace and a package location from a supported public package registry. A GitHub repository alone is not sufficient for every registry distribution path. Aura Script's current server is a local stdio process, so first choose and publish a supported installable package (for example, an npm package) and verify its install instructions before attempting registry publication.

## 4. What must be verified before submission

- [ ] Real Claude Code install from the custom marketplace.
- [ ] Claude Code can start the stdio server on Windows and Linux.
- [ ] Real end-to-end read and write flows with Aura Script 2.8.0.
- [ ] Permission prompts and user approval behave as documented.
- [ ] No duplicate server entry when users enable automatic assistant detection.
- [ ] Package and plugin versions match the supported Aura Script release.
- [ ] No unsupported claim that documents never leave the computer: when Claude reads a document, its contents are sent to Claude.
- [ ] A support contact and privacy/security page are publicly accessible.
- [ ] Demo video and screenshots are ready.

## 5. Contact and application strategy

First submit through the official product directory workflow. This is a product-distribution request, not a strategic partnership application. After a working public listing and real user evidence exist, approach Anthropic's developer relations or partnerships channels with concrete adoption data and a specific technical collaboration proposal.

No direct email address is guessed or invented here.
