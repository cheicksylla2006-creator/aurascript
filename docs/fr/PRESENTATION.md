# Aura Script 2.8.0

Aura Script est un espace de création **gratuit, indépendant et local** pour Windows : documents (format A4 réel), présentations, feuilles de calcul, code, canvas et PDF, accompagnés par **Aurora**, une IA qui tourne sur l'ordinateur, ou par l'IA de son choix (OpenAI, Anthropic, Google, OpenRouter) avec sa propre clé.

Les documents restent sur l'appareil et sont chiffrés par Windows (DPAPI). Aucun compte n'est nécessaire.

## Nouveautés de la version 2.8
- **Dictée en direct** : modèle facultatif Nemotron 3.5 (NVIDIA, 40 langues) ; les mots s'affichent pendant qu'on parle.
- **Recherche par le sens** : retrouve un document par son sujet, même sans ses mots exacts (Qwen3 Embedding et Reranker 0.6B, Apache 2.0, sur le PC, installés sur demande).
- **Réponses JSON sûres** : les sorties structurées d'Aurora sont imposées par grammaire pendant la génération.
- **Nouveaux modèles Aurora** : Ministral 3 3B et Gemma 4 E2B (Apache 2.0), vérifiés par SHA-256 après téléchargement.
- English documentation: `docs-en/`.

## Nouveautés de la version 2.7
- **2.7.1** : la dictée est **intégrée au logiciel** (modèle Canary 180M Flash dans le paquet, rien à télécharger), cycle de vie et sélection fiabilisés, modèles vérifiés par empreintes officielles épinglées, chaque paquet contrôlé avant publication, construction Linux dans le même script (voir `LINUX.md`).
- **Dictée vocale locale** : on parle, l'éditeur écrit et corrige en temps réel (ponctuation dictée, majuscules, espaces françaises, « annule ça »). Reconnaissance sur l'ordinateur (sherpa-onnx, processus isolé), modèles Whisper ou Parakeet v3 téléchargés à la demande (Hugging Face ; miroir hf-mirror proposé, sur accord, si le site est bloqué), micro autorisé seulement pendant la dictée.
- **Transparence de l'IA** : étiquette « Généré par IA » avec le moteur (local ou en ligne), bouton **Signaler**, page **Aide › Transparence de l'IA**.
- **Provenance du texte** : passages insérés par l'IA marqués, vue et rapport, métadonnées « contenu généré par IA » à l'export HTML et Word.

## Nouveautés de la version 2.6
- **2.6.1** : commandes strictes (une demande de contenu part à l'IA, jamais prise pour une commande), questions sur le document sans IA (« Aller au passage »), contexte ciblé pour l'IA sur les longs documents, recherche dans tous les documents (feuilles, présentations, code ; accents, fautes, extraits), « Voir aussi » dans Infos.
- **Cerveau local** (`cerveau.js`) : sans IA ni réseau, Aura Script résume, extrait les mots-clés, propose un plan et des titres, mesure la lisibilité, corrige par règles sûres, raccourcit et clarifie. Le panneau Assistant comprend des **commandes en langage naturel** (« insère un tableau 3x4 », « remplace chat par chien », « exporte en PDF », « analyse la feuille »… ; « aide » pour la liste).
- **Hors ligne d'abord, IA en renfort** : quand Aurora ou l'IA personnelle ne répondent pas, le cerveau prend le relais ; quand elles répondent, il leur fournit des repères et vérifie leurs propositions.
- **Santé** : modèles (compte rendu, plan de traitement, journal de santé, transmissions), relevé des traitements et des constantes, abréviations médicales, anonymisation en copie séparée. **Garde de confidentialité dans le processus principal** : tout ce qui part vers une IA en ligne (consigne, historique, message, résultats d'outils) est analysé ; un contenu de santé n'est envoyé qu'avec l'accord explicite de l'auteur (`garde-sante.js`, `tools/test-garde-sante.js`).
- **Sécurité IPC** : vérification du cadre émetteur en *fail closed* (cadre absent, inconnu ou erreur ⇒ refus).
- **Exports** : Excel réécrit (fichier valide, tous les onglets), PowerPoint avec images, tableaux, flèches et format 4:3.
- **Modèles** : Qwen3.5 4B en option pour les PC de 16 Go ; les notes non mesurées sont affichées comme **estimées**. `Banc-Modeles.bat` lance le même banc de rédaction française sur Qwen3.5 2B et 4B.
- Détail complet : `HISTORIQUE.md`.

## Version 2.5
- **Compagnon** : suggestions locales au bon moment (reprendre où l'on s'était arrêté, plan pour un long texte, pause, graphique, diapositive trop chargée, mode Nuit le soir, sauvegarde), bilan du jour et série de jours d'écriture.
- **IA** : halo bref (≈ 2,5 s) à l’appel, aux couleurs de l’assistant actif ; réponses mises en forme avec Copier / Insérer ; chaque modification arrive en **aperçu des différences** (Accepter ⏎ / Refuser Échap), puis le passage s'illumine.
- **Contexte autonome** : Aura Script reconnaît seul le sujet du document — musique, maths, physique, chimie, biologie, informatique, langues (pinyin à tons), économie, droit, scénario, poésie — et adapte la barre d’outils et l’IA. Aucun choix à faire ; réglages dans **Paramètres › Contexte**.
- **Atelier musique** : diagrammes guitare et piano de chaque accord, écoute au clic, grille d’accords insérable, tonalité probable et capo conseillé, transposition, notation C ⇄ Do, ChordPro ⇄ accords au-dessus des paroles, syllabes par ligne et rimes colorées, métronome avec tempo tapé, symboles et nuances.
- **Chimie** : équilibrage automatique des équations (CH₄ + 2 O₂ → CO₂ + 2 H₂O).
- **Clé API = assistant principal** : dès qu’une clé (ChatGPT, Claude, Gemini, Mistral, OpenRouter…) est validée, elle devient l’assistant principal ; la zone de saisie et le halo prennent son nom et sa couleur.
- **Connecteur MCP en un clic** : détection des assistants installés et connexion automatique, extension **Claude Desktop** (`.mcpb`) installable d’un clic, invites prêtes à l’emploi. Voir `CONNECTEUR-MCP.md`.
- **Canvas** : bibliothèque ✦ (émojis, stickers, formes, compositions : carte mentale, frise, kanban, matrice, SWOT) et **mode groupe** sur le réseau local, sans serveur ni compte.
- **Premier lancement** : choix de la langue, introduction animée, choix de l'ambiance ; rejouable depuis l'Aide.
- **Thèmes** : Auto (selon l'heure), Nuit (lumière chaude), Papier ; bascule animée.
- **Deux identités visuelles** : **Violet Aura** (principale, par défaut) et **Sakura** (rose pastel, au choix), construites sur les mêmes composants et les mêmes variables CSS (`styles/tokens.css`). Indépendantes du mode d'apparence (Système, Clair, Sombre, Auto, Nuit, Papier). Choix en vignettes dans Paramètres › Général › Apparence, appliqué sans redémarrage et sans flash au lancement. Police des réponses de l'IA au choix (Newsreader par défaut…).
- **Pétales de Sakura** (identité Sakura uniquement) : quelques pétales flottent et s'effacent quand on écrit ; petite éclosion quand une modification de l'IA est acceptée. Désactivables ; coupés si Windows réduit les animations.
- **Langues** : français, anglais, espagnol, allemand, portugais, chinois (interface principale ; le reste en anglais pour les quatre nouvelles langues).
- **Clic droit adapté à chaque espace** : Canvas (l'objet visé est sélectionné), Code (expliquer, corriger, commenter, optimiser, tester avec l'IA), Diapositives, Feuille (graphique, analyse IA) ; survol d'un mot mal orthographié → corrections en un clic ; survol d'un lien → adresse.
- **Lecture à voix haute** (voix Windows, hors ligne) et nouvelles commandes dans Ctrl+K.
- **Mode groupe sécurisé** : réseau local uniquement, chiffrement AES-256-GCM de bout en bout, blocage des essais répétés, validation stricte des données reçues, protocole WebSocket confié à la bibliothèque maintenue `ws` (trames malformées rejetées ; tests : `node tools/test-groupe.js`).
- **Nouveaux modèles locaux** : Qwen3.5 2B (2026, Apache 2.0) par défaut, SmolLM3 3B et Phi-4 mini en option ; voir `MODELES.md`.
- **Confidentialité** : les PDF enregistrés en clair par les versions précédentes sont chiffrés à leur tour (aller-retour vérifié avant remplacement) ; l'indicateur « Local et privé » affiche l'état réel des documents ET des PDF ; tous les échanges internes (IPC) n'acceptent que la fenêtre principale ; politique de sécurité resserrée (plus de script en ligne, `object-src`, `base-uri`, `form-action` bloqués).
- **Fluidité** : canvas redessiné une fois par image, traits plus lisses (tous les points du geste), halo calculé par la carte graphique, animations en pause quand la fenêtre est en arrière-plan.
- **Corrections** : la dernière feuille A4 est toujours une page entière ; menu Langue de la barre du bas qui s'ouvrait hors écran ; menus de la feuille de calcul qui suivaient la langue du correcteur au lieu de celle de l'interface ; le modèle Aurora choisi devient réellement le modèle actif ; signature Windows unifiée (CSC_LINK) et vérifiée ; documentation des modèles harmonisée (`MODELES.md`).

*Télécharger pour Windows : [Microsoft Store](https://apps.microsoft.com/detail/9nsqkw8c6xp8). Le code source de l'application n'est pas publié.*
