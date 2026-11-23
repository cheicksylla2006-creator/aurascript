# Aura Script — Product overview for Anthropic

**Version:** 2.8.0  
**Developer / publisher:** SyllaBora — independent developer project  
**Website:** https://aura-script.com  
**Public connector repository:** https://github.com/cheicksylla2006-creator/aurascript  
**Windows:** https://apps.microsoft.com/detail/9nsqkw8c6xp8  
**Linux:** https://github.com/cheicksylla2006-creator/aurascript/releases/tag/v2.8.0

## Executive summary

Aura Script is a free desktop workspace for Windows and Linux that brings together A4 documents, presentations, spreadsheets, canvas boards, code editing and PDF reading. It includes Aurora, an AI assistant designed to run locally, and can also connect to user-selected external AI providers using the user's own credentials.

The goal of the Claude integration is to let Claude move from advice to controlled work in the user's desktop workspace: discover and search user-authorized documents, read content, create or edit documents, update spreadsheets and presentations, and work with code and canvas content through a local Model Context Protocol (MCP) connector.

Aura Script is intended to complement Claude's reasoning and tool-use capabilities, not replace Claude or compete with Anthropic's models.

## Current product and distribution

- Aura Script 2.8.0 is published as a Windows application through the Microsoft Store and as Linux x86_64 AppImage and Debian packages.
- The application is free to use.
- The desktop application's source code is not published in the public connector repository.
- The public GitHub repository contains the MCP connector, Claude Code plugin materials, Gemini CLI extension work, documentation and Linux release assets.

## Claude integration status

- A Claude Code plugin is present in the public repository and can currently be installed through a community/custom marketplace.
- This custom marketplace installation is not an Anthropic-curated directory listing or an endorsement.
- The local MCP server uses stdio between Claude Code and the connector, then communicates with Aura Script over a local authenticated IPC channel.
- A one-click Claude Desktop MCPB package has not yet been published or validated.
- No remote MCP service is currently offered for Claude web or mobile. The current integration is local-first.

## Development story

Aura Script was developed with substantial AI coding assistance. The developer estimates that approximately **60–65% of the codebase / implementation work** involved AI-generated or AI-assisted code. **Claude Opus 5.5 was the primary model**, with **Fable 5.2 used as a secondary model**.

This is the developer's own retrospective estimate, not a formal code-attribution measurement. It is shared as context about a real-world development workflow involving Claude, not as a claim that Anthropic developed, endorsed or certified Aura Script.

## What we would welcome from Anthropic

1. Routing to the appropriate Claude Platform Developer Relations, connectors or ecosystem contact.
2. Technical feedback on the local MCP integration and the best-supported packaging path for Claude Code and Claude Desktop.
3. Guidance on the appropriate official directory submission process. No directory submission is being made through this outreach email.
4. If there is a fit, an exploratory conversation about a small developer collaboration or pilot.

## Important boundaries

Aura Script is an independent project, not a registered company or an existing Anthropic partner. No commercial arrangement, endorsement, official listing or partnership is claimed. The user remains in control of which documents are shared with an assistant and how write operations are approved. When Claude reads document content, that content is transmitted to Claude and handled under the user's applicable Anthropic terms and privacy settings.

## Contact

**Developer:** SyllaBora  
**Support / project contact:** cheicksylla615@gmail.com  
**Website:** https://aura-script.com
