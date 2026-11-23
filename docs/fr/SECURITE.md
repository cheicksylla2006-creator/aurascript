# Aura Script — sécurité (version 2.8.0)

Ce document décrit les protections en place. Chaque affirmation ci-dessous est couverte par un test automatique qui attaque le vrai code ; ces tests sont exécutés avant chaque version (ils ne sont pas publiés, comme le code source).

## 1. Interface (processus de rendu)

| Protection | Détail | Test |
|---|---|---|
| CSP sans `unsafe-inline` ni `unsafe-eval` pour les scripts | `script-src 'self' 'wasm-unsafe-eval'` ; les 256 anciens `onclick="…"` sont compilés en fonctions dans `gestionnaires.js` (outil : `tools/compiler-gestionnaires.py`) | injection `<script>`, `onerror`, `onclick`, `setAttribute('onclick')`, `iframe srcdoc`, `javascript:` : tous bloqués |
| `object-src`, `base-uri`, `form-action` à `'none'` | — | test-securite |
| Documents nettoyés (DOMPurify) | gestionnaires, liens `javascript:` et attributs `data-h-*` retirés ; un `data-h-*` collé dans l'éditeur n'est jamais branché | test-securite-ui §2 |
| Isolation | `contextIsolation`, pas de Node.js dans la page, pont `window.aura` figé ; fenêtres et navigations arbitraires refusées | test-securite-ui §4, test-securite |
| Garde IPC | chaque appel doit venir de la fenêtre principale, du cadre principal et de la page d'Aura Script | revue de code (`trustedRenderer`) |

`style-src` garde `'unsafe-inline'` : les styles en ligne ne permettent pas d'exécuter du code.

## 2. Connecteur MCP (assistants IA)

**Canal local**
- Il porte un nom **aléatoire à chaque lancement**.
- Linux/macOS : socket `0600` dans un dossier `0700`.
- Windows : tube nommé, écriture réservée par Windows au propriétaire et aux administrateurs.
- Aucun port réseau.

**Authentification mutuelle (protocole v2)**
- Le **jeton (256 bits, renouvelé à chaque lancement) ne circule jamais**.
- Chaque requête est signée en HMAC-SHA256, avec un nonce de 128 bits et l'heure. Une requête rejouée, modifiée ou vieille de plus de 5 minutes est refusée.
- Chaque réponse est signée : un programme qui usurperait le canal ne peut ni voler le jeton ni se faire passer pour Aura Script.
- Coupure de la connexion après 3 échecs.

**Validation en trois couches**
1. Client (`mcp/aura-mcp.js`) : structure, taille (4 Mo), schéma complet en mode hors ligne.
2. Processus principal (`mcp/securite-serveur.js`) :
   - liste blanche des 13 outils ;
   - refus de `__proto__`, `constructor` et `prototype` ;
   - profondeur 8, 20 000 nœuds, ligne de 5 Mo au plus ;
   - 4 requêtes par connexion et 16 au total en simultané.
3. Fenêtre (`AuraOutils.valider`), strictement pour chaque outil :
   - types, champs obligatoires, valeurs permises, tailles ;
   - formats (cellules, couleurs, identifiants, noms de fichier sans `..` ni chemin absolu) ;
   - refus de tout argument inattendu.

**Autorisations**
- Lecture des documents partagés seulement, ou de toute la bibliothèque.
- Écriture : demandée à chaque fois, autorisée ou interdite.
- Les annotations MCP (`readOnlyHint` / `destructiveHint`) informent l'assistant. **Elles ne remplacent pas** ces contrôles.

## 3. Mode groupe (réseau local)

- Les adresses publiques sont refusées : réseau local uniquement.
- **Clé AES-256-GCM** :
  - Elle est dérivée par HKDF-SHA256 d'un secret **aléatoire de 128 bits** (`crypto.randomBytes`) contenu dans l'invitation, avec un sel propre à la session (son code).
  - Le secret n'est pas un mot de passe humain : Argon2 ou scrypt, utiles pour ralentir l'attaque d'un secret faible, n'apportent rien face à 2^128 possibilités.
- **Nonce GCM** de 96 bits, aléatoire pour chaque message ; la clé change à chaque session.
- **Contexte authentifié** (AAD) et **anti-rejeu** : identifiant de l'émetteur, compteur strictement croissant, horodatage (2 minutes au plus). Un message renvoyé à son émetteur est refusé.
- 5 échecs bloquent pendant 10 minutes ; 40 échecs ferment la session.
- Les trames WebSocket malformées sont refusées et chaque message reçu est validé.

## 4. Données

- Documents et PDF chiffrés par le système (DPAPI sous Windows).
- La migration vers le chiffrement ne remplace un PDF qu'**après un aller-retour vérifié** : en cas de coupure, chaque fichier reste soit lisible, soit chiffré, jamais perdu (test-securite-ui §5).
- Clés API chiffrées sur le PC, envoyées seulement au fournisseur choisi, jamais écrites dans les journaux ni le stockage de la page.

## 5. Limites connues (honnêtement)

- Pas d'audit externe ni de test d'intrusion par un tiers.
- Un logiciel malveillant qui s'exécute déjà **sous le même compte Windows** peut lire les fichiers de l'utilisateur, jeton compris. Aucune application de bureau ne peut s'en protéger seule.
- La liste des droits du tube nommé Windows n'est pas personnalisée (Node.js ne le permet pas). L'authentification mutuelle couvre ce point.
- Les tests de l'interface tournent sous Linux : le chiffrement DPAPI se vérifie sur un PC Windows.

## 6. Signaler une faille

cheicksylla615@gmail.com — merci de ne pas publier la faille avant sa correction.

## Données de santé (2.6.0)
- Les outils santé du cerveau local (relevé des traitements et des constantes, glossaire, anonymisation) s'exécutent uniquement dans l'application : aucune requête réseau.
- Garde de confidentialité **dans le processus principal** (`garde-sante.js`) : avant tout appel à une IA personnelle **en ligne**, sur les deux canaux (`ia-perso:appel` et `ia-perso:agent`), TOUT le contenu sortant est analysé — consigne système, historique complet, message, appels et résultats d'outils —, chaque morceau séparément puis l'ensemble (une longue consigne ne dilue pas un message médical). Contenu de santé sans accord de session ⇒ appel refusé par le processus principal, quel que soit le chemin pris dans la page. La page demande alors l'accord et réessaie une seule fois ; un refus fait répondre le cerveau local et Aurora. Une IA locale (`localhost`) n'est pas concernée ; une adresse impossible à analyser est traitée comme en ligne.
- L'anonymisation ne modifie jamais l'original : elle crée une copie (noms après civilité ou libellé, date de naissance, adresse, téléphone, e-mail, n° de sécurité sociale, identifiant patient). Elle est une aide, pas une garantie : la copie doit être relue avant partage.
- Testé : `tools/test-garde-sante.js` (historique médical + question ordinaire bloqué, consigne, résultats d'outils, dilution, IA locale, refus et accord de session), `tools/test-cerveau.js` (unitaire) et `tools/test-cerveau-app.js` (refus respecté, IA locale non bloquée, texte ordinaire non concerné, original intact).

## IPC « fail closed » (2.6.0)
Chaque gestionnaire IPC vérifie que l'appel vient de la fenêtre principale ET de son cadre principal. Depuis 2.6.0, un cadre émetteur absent, un cadre principal absent ou une exception pendant la vérification entraînent un **refus** (auparavant : autorisation). Testé dans `tools/test-garde-sante.js` (cadre principal accepté ; iframe, cadres absents et objet piégé refusés).

## Dictée vocale (2.7.0)
| Protection | Détail | Test |
|---|---|---|
| Micro sous contrôle | Le gestionnaire de permissions refuse tout, sauf `media` **audio seul** demandé par la fenêtre principale, son cadre principal et la page `aura://app/`, **pendant une dictée lancée** par l'auteur. Caméra et audio+vidéo toujours refusés. Après l'arrêt, nouveau refus. | test-dictee-app |
| Moteur isolé | sherpa-onnx (natif) tourne dans un `utilityProcess` : un plantage ou un modèle corrompu n'atteint ni la fenêtre ni le processus principal. L'audio arrive par IPC validé (`Float32Array`, 2 s maximum par bloc, ignoré hors dictée) ; rien n'est écrit sur disque ni envoyé. | test-dictee, test-dictee-app |
| Chemins confinés | Les fichiers du modèle doivent être dans le dossier du modèle et exister avant l'appel natif ; un manifeste trafiqué (`../`) rend le modèle « non installé ». | test-dictee |
| Téléchargement | Aucun sans clic ; HTTPS seulement ; hôtes autorisés : `huggingface.co`, `*.hf.co`, et `hf-mirror.com` **seulement si l'utilisateur accepte ce miroir tiers** après un échec de Hugging Face (redirections vérifiées **avant** connexion) ; SHA-256 du dépôt vérifié ; taille maximale ; noms `^[\w.+-]+$` ; écriture en `.part` puis renommage ; seuls les fichiers du modèle sont récupérés. | test-dictee (réseau simulé : hôte piégé jamais contacté, empreinte fausse rejetée sans résidu, miroir jamais contacté sans accord, annulation) |
| Import d'un dossier | Seuls les fichiers attendus sont copiés ; rien n'est exécuté. | test-dictee |
| Texte reconnu | Inséré comme **texte** (jamais interprété comme HTML) ; le texte provisoire n'est jamais enregistré. | test-dictee-app |
| Paquet | Seul le binaire natif de l'architecture construite est embarqué (`dictee-natif/`) ; capacité MSIX `microphone` déclarée. | revue de `build.js` |

## Exécutable durci (2.7.0)
Fusibles Electron posés par `build-config.js` (`electronFuses`) : `EnableNodeOptionsEnvironmentVariable`, `EnableNodeCliInspectArguments` et `GrantFileProtocolExtraPrivileges` **désactivés**. `RunAsNode` reste actif, car Aurora (processus séparé) et le connecteur MCP lancé par les assistants utilisent l'exécutable en mode Node ; c'est une limite connue : un programme qui s'exécute déjà sous le compte de l'utilisateur peut s'en servir comme d'un Node.js ordinaire (il pourrait de toute façon lancer le sien). Vérifier : `npx @electron/fuses read --app <exécutable>`.

## Transparence de l'IA (2.7.0)
- Signalement : un e-mail est **préparé** (`mailto:`) vers l'adresse du logiciel ; l'auteur le relit et l'envoie lui-même. Le contenu du document n'est jamais joint ; la question seulement si l'auteur coche la case. Testé : test-transparence-app.
- Modèles Aurora : `HF_ENDPOINT` (miroir) n'est transmis au téléchargement que sur accord explicite ; une valeur héritée de l'environnement est ignorée.
- Provenance : marquage local dans le document (`<span class="aura-ia" data-ia="…">`), aucune donnée transmise. C'est une indication, pas une preuve.

## 2.7.1 — confiance dans les modèles et les paquets
| Protection | Détail | Test |
|---|---|---|
| Empreintes épinglées | Nom, taille et empreinte officielle (SHA-256 LFS ou blob git) de chaque fichier de chaque modèle sont dans `dictee-modeles.js`. L'authenticité ne dépend plus du serveur (Hugging Face, hf-mirror, dossier importé). | test-dictee (fichier altéré à taille égale, fichier trop gros, miroir falsifié) |
| Réutilisation | Un fichier déjà présent n'est jamais réutilisé sans recalcul de son empreinte. | test-dictee |
| Import | Fichiers aux noms exacts seulement ; empreinte différente → « non vérifié », démarrage refusé sans accord explicite ; fichier modifié après vérification → de nouveau non vérifié. | test-dictee |
| Modèle intégré | Canary 180M Flash copié dans le paquet par `build.js` après vérification ; contrôlé de nouveau par `tools/verifier-paquet.js`. | test-verifier-paquet |
| Cycle de vie | Session numérotée ; micro jamais autorisé pour un démarrage annulé ; arrêt confirmé par l'accusé « termine » du moteur ; aucun texte écrit dans un autre document que celui de départ. | test-dictee-app |
| Paquets | Vérification automatique après chaque cible : version, fichiers essentiels, moteur de la bonne architecture et aucun autre, empreintes du modèle intégré, Aurora, fusibles durcis, absence de cache et d'adresse personnelle. | test-verifier-paquet |
| Accélération GPU | Essai GPU noté avant l'initialisation ; un essai jamais confirmé (plantage de pilote) est écarté au lancement suivant ; repli CPU à chaud ; aucun accès réseau ; seul le moteur Vulkan est embarqué (vérifié par le contrôle des paquets). | aurora/tests/gpu.test.ts |

## 2.8.0 — nouvelles fonctions, mêmes garanties
| Protection | Détail | Test |
|---|---|---|
| Recherche par le sens | Documents transmis à Aurora (processus local) seulement pendant une recherche, texte borné (300 documents × 5 000 caractères) et validé des deux côtés ; vecteurs dans le dossier de données d'Aurora ; modèles vérifiés par SHA-256 ; aucun accès réseau pendant la recherche. | aurora/tests/semantic.test.ts |
| Sorties JSON contraintes | Grammaire llama.cpp dérivée d'un schéma fermé (énumérations, `additionalProperties: false`) ; la réponse reste validée par `sanitizePlan` ; une grammaire n'est jamais réutilisée après un changement d'instance (repli GPU → CPU). | aurora/tests/semantic.test.ts |
| Dictée en direct | Même processus isolé que la dictée ; audio jamais écrit ; empreintes Nemotron épinglées ; mode simulation réservé aux tests. | tools/test-dictee.js |
| Modèles Aurora épinglés | Ministral 3 3B et Gemma 4 E2B : SHA-256 vérifié après téléchargement, fichier supprimé s'il diffère. | aurora/tests/semantic.test.ts |

