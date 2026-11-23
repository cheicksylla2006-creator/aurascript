# Security policy — Aura Script

*Version 2.6.0. Français ci-dessous.*

## Supported versions

| Version | Supported |
|---|---|
| 2.6.0 and later | ✅ |
| 2.5.0 and earlier | ❌ — please update (Microsoft Store / Linux releases) |

## How the local MCP connector is protected

**Local channel only**
- Named pipe on Windows, private socket on Linux (`0600` in a `0700` folder), with a random name at each launch.
- No network port, no server, no account, no telemetry.

**Mutual authentication**
- Each request is signed with HMAC-SHA256 over a 128-bit one-time nonce and a timestamp.
- Replayed, modified or requests older than 5 minutes are rejected.
- Replies are signed by Aura Script, so an impostor cannot read the key nor answer in its place.
- The 256-bit key is renewed at every launch and never sent.
- The connection is closed after 3 failed attempts, and requests already queued on that connection are discarded.

**Three-layer argument validation**
1. The connector (this plugin's `server/aura-mcp.js`).
2. The Aura Script main process: tool allow-list, prototype-pollution guard, depth, size and concurrency limits.
3. The tool itself: strict schema with types, required fields, allowed values, sizes and formats. File names containing `..` or absolute paths are refused, and unexpected arguments are refused.

**User control**
- The connector is off by default.
- You choose which documents are readable; every change is approved in Aura Script unless you allow it.
- A local log of calls can be cleared at any time.

**Inside the app**
- Content-Security-Policy with no inline or eval scripts.
- Imported documents are sanitized.
- Documents are encrypted at rest by the operating system.
- Group mode is restricted to the local network, AES-256-GCM encrypted with per-session keys and replay protection.

Tool annotations (`readOnlyHint` / `destructiveHint`) inform the assistant; they are **not** the security boundary — the checks above are.

These protections are verified by an automated adversarial test suite, run before every release: forged and replayed requests, channel impersonation, malformed arguments, script injection, and tampered encrypted messages. The application's source code is not public.

## Known limits
- No third-party audit yet.
- Malware already running under the same user account can read that user's files; no desktop app can fully defend against this.

## Reporting a vulnerability

E-mail **cheicksylla615@gmail.com** with the details and steps to reproduce. Please do not disclose publicly before a fix is released. You will get an answer within 7 days.

---

## Français

Le connecteur n'utilise qu'un canal local, sans port réseau ni serveur.
- **Échanges signés** : chaque échange est signé (HMAC-SHA256, code à usage unique, réponses signées). La clé, renouvelée à chaque lancement, ne circule jamais.
- **Vérifications** : les arguments sont vérifiés à trois niveaux.
- **Vos choix** : vous choisissez ce que l'assistant peut lire et vous approuvez chaque modification.

Pour signaler une faille : **cheicksylla615@gmail.com**, sans publication avant correction.
