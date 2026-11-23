# Modèles d'Aurora — référence unique (v2.8)

Ce fichier fait foi pour l'application. Détails techniques et mesures : `aurora/docs/MODEL.md`.
Source dans le code : `aurora/src/core/modelRegistry.ts` (`MODEL_CATALOG`, `defaultModelId()`).

## Choix par défaut

| Mémoire du PC | Modèle proposé | Taille (GGUF) | Licence |
|---|---|---|---|
| jusqu'à 10 Gio | Qwen3.5 2B compact (`qwen3.5-2b-leger`, IQ4_XS) | ≈ 1,17 Go | Apache 2.0 |
| plus de 10 Gio | Qwen3.5 2B (`qwen3.5-2b`, Q4_K_M) | ≈ 1,28 Go | Apache 2.0 |

Qwen3.5 (Alibaba, 2026) : 201 langues, raisonnement, appel d'outils. Son architecture
(`qwen35`) est reconnue par le moteur llama.cpp embarqué.

`engine.model` est vide par défaut : Aurora choisit selon la RAM. Quand l'utilisateur choisit
un modèle dans Aura Script, il est téléchargé **puis enregistré comme modèle actif**
(`aurora models use <id>`) et le moteur redémarre.

## Autres modèles proposés

| Identifiant | Taille ≈ | Licence | Pour qui |
|---|---|---|---|
| `qwen3.5-4b` | 2,48 Go | Apache 2.0 | PC de 16 Go : deux fois plus de paramètres que la 2B ; gain à mesurer avec `Banc-Modeles.bat` |
| `ministral3-3b` | 2,15 Go | Apache 2.0 | 2.8 — Mistral AI, conçu en France ; PC de 12 à 16 Go ; empreinte SHA-256 vérifiée |
| `gemma4-e2b` | 2,98 Go | Apache 2.0 | 2.8 — Google, multilingue ; PC de 16 Go ; empreinte SHA-256 vérifiée |
| `qwen3-1.7b` | 1,28 Go | Apache 2.0 | ancien défaut, éprouvé |
| `smollm3-3b` | 1,92 Go | Apache 2.0 | PC de 16 Go |
| `phi4-mini` | 2,49 Go | MIT | PC de 16 Go, raisonnement et maths |
| `llama3.2-1b` | 0,81 Go | Llama 3.2 Community License (Meta) | très petites machines |

Les anciens modèles (Qwen2.5 1.5B, Llama 3.2 1B Q5 et 3B, SmolLM2, Phi-3.5 mini, Gemma 2)
ne sont plus proposés mais continuent de fonctionner s'ils sont déjà installés.
Gemma 4 E2B est proposé en IQ4_XS (2,98 Go), la plus légère quantification qui garde la qualité et tient sous le plafond mémoire d'Aurora (4 Gio).

Aucun modèle n'est inclus dans l'installateur : il est téléchargé à la demande, avec
affichage de sa licence avant le téléchargement.

## Redistribution

Apache 2.0 et MIT : redistribution libre avec mention de la licence. Llama 3.2 impose ses
conditions propres : Aura Script ne le redistribue pas, il le fait télécharger depuis sa
source après affichage de la licence.

## Notes des modèles : mesurées ou estimées
Une note n'est présentée comme établie que si le modèle a été téléchargé et mesuré sur une vraie machine (`measured: true` dans le catalogue). Sinon l'application affiche « estimée ». Qwen3.5 2B et 4B ne sont pas encore mesurés : lancer `Banc-Modeles.bat` (mêmes exercices français pour les deux, rapports dans `aurora/docs/QUALITY-FR-<modèle>.md`), puis ajuster les notes d'après les rapports. Le rapport historique `QUALITY-FR.md` porte sur Llama 3.2 1B (9 contrôles sur 16).

## Recherche par le sens (2.8)

| Identifiant | Rôle | Taille | Licence |
|---|---|---|---|
| `qwen3-embedding-0.6b` | vecteurs de sens des passages | 639 Mo | Apache 2.0 |
| `qwen3-reranker-0.6b` | reclassement des meilleurs résultats | 639 Mo | Apache 2.0 |

Installés sur demande (fenêtre « Modèle d'Aurora »), dans `<données Aurora>/models-recherche`, vérifiés par SHA-256.
Chargés uniquement pendant une recherche, libérés après 90 s. Les vecteurs des documents restent sur le PC
(`<données Aurora>/recherche/vecteurs.jsonl`).

## Dictée (rappel)
Canary 180M Flash est intégré au paquet. En option : Parakeet v3, Whisper small/base et, depuis la 2.8,
**Nemotron 3.5 en direct** (OpenMDW 1.1, ≈ 682 Mo) pour voir les mots s'afficher pendant qu'on parle.

