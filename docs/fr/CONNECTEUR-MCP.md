# Aura Script — Connecteur MCP local (sans serveur)

Le protocole **MCP** (Model Context Protocol) permet à un assistant IA de bureau d'utiliser
des « outils » fournis par un autre logiciel. Aura Script en fournit un, **sans aucun serveur** :
pas de compte, pas d'hébergement, pas de port réseau ouvert, rien qui tourne en ligne.

## Comment ça marche

```
Claude Desktop, Claude Code, Gemini CLI, Codex CLI, GitHub Copilot (VS Code), Cursor, Windsurf, LM Studio
        │  lance lui-même, en local (stdio)
        ▼
Documents\Aura Script\Connecteur\aura-mcp.js     ← exécuté par Aura Script.exe
        │                                          (ELECTRON_RUN_AS_NODE=1, pas besoin de Node)
        ├── Aura Script OUVERT  → canal local à nom aléatoire (tube nommé / socket 0600) + authentification HMAC
        │                         → tous les outils, en direct, avec vos autorisations
        └── Aura Script FERMÉ   → dossier « partage » (documents que VOUS avez partagés)
                                  → lecture seule ; une création est mise « en attente »
                                    et vous est proposée à la prochaine ouverture
```

* **Protocole de communication** : JSON-RPC 2.0, une ligne par message, sur l'entrée/sortie
  standard (transport `stdio` de MCP). Méthodes : `initialize`, `ping`, `tools/list`,
  `tools/call`, `resources/list`, `resources/read`, `prompts/list`, `prompts/get`. Versions acceptées : 2025-11-25,
  2025-06-18, 2025-03-26, 2024-11-05.
* **Entre le connecteur et l'application** : tube nommé Windows (pas de TCP), lignes JSON
  Protocole v2 (2.5.1) : `{v:2, corps, mac}` avec `mac = HMAC-SHA256(jeton, "req|"+corps)`, nonce
  unique et horodatage dans le corps ; réponses signées. Le jeton (256 bits, renouvelé à chaque
  lancement) est dans `connexion.json` et ne circule jamais. Détails et tests : `SECURITE.md`.

## Connexion en un clic (2.5)

Personne n'a à ouvrir un fichier de configuration :

1. **Paramètres › Connecteurs › « Connecter les assistants détectés »** : Aura Script repère
   les assistants installés sur le PC (dossiers de Claude, Gemini CLI, Codex, Copilot, Cursor,
   Windsurf, LM Studio, Claude Code), active le connecteur et s'ajoute à chacun (une copie de
   sauvegarde `.avant-aura-script` est faite). Il suffit ensuite de redémarrer l'assistant.
2. Au premier démarrage où un assistant est détecté mais pas encore relié, une notification
   propose **« Relier »** (une seule fois).
3. **« Installer dans Claude Desktop »** crée l'extension `Aura Script.mcpb` (format MCP Bundle,
   `manifest_version` 0.3 : `manifest.json` + `server/aura-mcp.js` + `icon.png`) et l'ouvre :
   Claude Desktop affiche sa fenêtre d'installation. Claude Desktop fournit Node.js lui-même :
   rien d'autre à installer. Si l'ouverture échoue, le fichier est montré dans l'Explorateur
   (à glisser dans Claude Desktop › Paramètres › Extensions).

L'extension retrouve l'application grâce à une copie du fichier de connexion placée à un
endroit fixe, `%USERPROFILE%\.aura-script\connexion.json` (variable `AURA_CONNEXION` du
manifeste). Le jeton reste propre à votre compte Windows : rien n'est lié à une adresse e-mail,
à un compte ou à un serveur.

Chaque outil déclare un titre et ses annotations de sécurité (`readOnlyHint` /
`destructiveHint`, `openWorldHint: false`). Pour l’annuaire Claude, le connecteur est publié dans
un **plugin** : c'est le contenu de ce dépôt.

### Invites prêtes à l'emploi (prompts MCP)

| Invite | Ce qu'elle fait |
|---|---|
| `rediger_document` | rédige un document sur un sujet et le crée dans Aura Script |
| `resumer_document` | trouve un document, le résume en 5 points et propose 3 améliorations |
| `document_en_presentation` | transforme un document en présentation |
| `tableau_depuis_texte` | organise des données en feuille de calcul |

## Autorisations (Paramètres › Connecteurs)

| Réglage | Valeurs | Défaut |
|---|---|---|
| Ce que les assistants peuvent lire | Documents partagés seulement · Toute la bibliothèque | Partagés seulement |
| Modifications | Me demander à chaque fois · Autoriser · Interdire | Me demander |
| Documents partagés | une case par document | aucun |

* Quand une modification est demandée, une carte apparaît dans le panneau de l'assistant
  d'Aura Script : **Autoriser / Refuser**. Sans réponse en 5 minutes : refus.
* Chaque modification d'une IA est annulable (bouton « Annuler ces modifications », Ctrl+Z).
* « Désactiver » le connecteur arrête le tube et **vide le dossier partage**.

## Les outils (fonctions appelables par les IA)

Ce sont **les mêmes** pour l'IA intégrée (clé API) et pour les assistants externes (MCP) :
une seule définition (`ia-outils.js`), une seule politique d'autorisation.

| Outil | Rôle | Écrit ? |
|---|---|---|
| `get_workspace` | document ouvert, sélection, nombre de documents | non |
| `list_documents` | liste (id, type, titre, date) | non |
| `read_document` | texte (paragraphes numérotés), feuille (cellules + formules), diapositives, fichiers de code, objets du canvas | non |
| `search_documents` | cherche un texte dans tous les documents autorisés | non |
| `open_document` | ouvre un document dans son espace | non |
| `sheet_read` | lit une plage de la feuille ouverte | non |
| `edit_text` | ajoute, insère, remplace (sélection, paragraphe, rechercher/remplacer, tout) — Markdown | oui |
| `sheet_write` | écrit un tableau de valeurs/formules, nouvel onglet possible | oui |
| `slides_edit` | ajoute / modifie / supprime une diapositive | oui |
| `canvas_add` | ajoute texte, post-it, rectangle, ellipse | oui |
| `code_write_file` | crée ou remplace un fichier du projet | oui |
| `create_chart` | graphique (barres, courbe, secteurs, nuage, fonction f(x)…) dans le document, la diapositive ou la feuille | oui |
| `create_document` | nouveau texte, feuille, présentation, code ou canvas | oui |

Application fermée : `list_documents`, `read_document`, `search_documents` (documents partagés)
et `create_document` (mis en attente).

## Connecteurs par fournisseur

| Assistant | Fichier de configuration | Fonctionne |
|---|---|---|
| **Claude Desktop** (Anthropic) | `%APPDATA%\Claude\claude_desktop_config.json` | oui, stdio |
| **Gemini CLI** (Google) | `%USERPROFILE%\.gemini\settings.json` | oui, stdio |
| **Codex CLI** (OpenAI) | `%USERPROFILE%\.codex\config.toml` | oui, stdio |
| **GitHub Copilot** (VS Code, Copilot CLI) | `%USERPROFILE%\.copilot\mcp-config.json` (ou `%COPILOT_HOME%`) | oui, stdio |
| **Claude Code** (Anthropic) | `%USERPROFILE%\.claude.json` | oui, stdio |
| **Cursor** | `%USERPROFILE%\.cursor\mcp.json` | oui, stdio |
| **Windsurf** (Codeium) | `%USERPROFILE%\.codeium\windsurf\mcp_config.json` | oui, stdio |
| **LM Studio** (IA locales) | `%USERPROFILE%\.lmstudio\mcp.json` | oui, stdio |
| ChatGPT (application), Le Chat, Perplexity | — | non : n'acceptent que des connecteurs **en ligne** ; pour OpenAI, utiliser Codex CLI |

Le bouton **Relier** ajoute l'entrée `aura-script` au bon fichier (copie de sauvegarde
`*.avant-aura-script` faite avant). **Retirer** l'enlève. « Copier la config » donne le texte
à coller à la main.

Entrée type (tous sauf Codex, au format `mcpServers`) :

```json
{ "mcpServers": { "aura-script": {
    "command": "C:\\Users\\…\\Programs\\aura-script\\Aura Script.exe",
    "args": ["C:\\Users\\…\\Documents\\Aura Script\\Connecteur\\aura-mcp.js"],
    "env": { "ELECTRON_RUN_AS_NODE": "1" } } } }
```

**Version Microsoft Store (MSIX)** : Windows interdit aux autres applications de lancer un
exécutable du dossier WindowsApps. Le connecteur utilise alors `node` (Node.js à installer une
fois depuis nodejs.org). L'application le détecte et l'indique dans l'onglet.

## Pourquoi pas de serveur distant (et quand il en faudra un)

Un serveur distant ne sert qu'à une chose : permettre à un assistant **dans le cloud**
(ChatGPT web, Claude.ai web) d'accéder aux documents quand l'ordinateur est éteint.
Ce n'est pas nécessaire aujourd'hui, et le fonctionnement local n'est jamais sacrifié :
si un jour un relais en ligne est ajouté, il sera **facultatif**, désactivé par défaut,
chiffré de bout en bout, et le connecteur local restera la voie principale.
