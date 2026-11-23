# Aura Script — historique des versions

## 2.8.0 — la voix en direct, la recherche par le sens, une IA aux réponses sûres
- **Dictée en direct** : nouveau modèle facultatif **Nemotron 3.5 ASR streaming** (NVIDIA, OpenMDW 1.1, 40 langues, ≈ 682 Mo, empreintes épinglées). Les mots s'affichent pendant qu'on parle (blocs de 560 ms) : l'audio est versé au fil de l'eau dans un flux « online » de sherpa-onnx, jamais deux fois le même échantillon. Canary reste intégré au logiciel et fonctionne sans téléchargement.
- **Recherche par le sens** : la recherche dans tous les documents devient hybride. Le classement lexical du cerveau (BM25) est fusionné avec un classement par le sens (Qwen3 Embedding 0.6B), puis le haut de liste est reclassé (Qwen3 Reranker 0.6B). Un document qui parle d'« accord signé » est trouvé avec « contrat ». Deux modèles Apache 2.0 (≈ 1,28 Go au total), installés sur demande, vérifiés par SHA-256, chargés pendant la recherche seulement ; vecteurs conservés sur le PC.
- **Sorties JSON contraintes** : quand Aurora doit répondre en JSON (plan d'action), une grammaire llama.cpp dérivée d'un schéma est appliquée pendant la génération : le modèle ne peut plus produire un objet mal formé ou un mode inconnu. L'option `json` existante, jusque-là ignorée par le moteur local, est désormais réellement appliquée.
- **Nouveaux modèles Aurora** (sur demande) : **Ministral 3 3B** (Mistral AI, Apache 2.0, 2,15 Go) et **Gemma 4 E2B** (Google, Apache 2.0, 2,98 Go). Tout modèle dont l'empreinte est épinglée est vérifié après téléchargement et supprimé s'il diffère.
- Tests : dictée 81 (dont flux en direct : partiels croissants, aucun échantillon en double, moteur natif Nemotron), application 45, Aurora 413 (dont recherche sémantique, cache des vecteurs, reclasseur, grammaires réelles node-llama-cpp, catalogue), sécurité 29 + 137 + 28, syntaxe 123/123, analyses 14/14.

## 2.7.1 — stabilité : dictée intégrée, cycle de vie fiable, paquets vérifiés
Version corrective, d'après la revue du sous-chef : la stabilité avant de nouvelles fonctions.
- **Dictée intégrée au logiciel** : le modèle **Canary 180M Flash** (NVIDIA, CC-BY-4.0, ≈ 207 Mo, français/anglais/espagnol/allemand, ponctuation et majuscules natives) est livré dans le paquet. La dictée marche dès l'installation, **sans rien télécharger**. Parakeet v3 et Whisper restent en option.
- **Cycle de vie de la dictée** (priorité critique) : chaque démarrage a son numéro de session ; arrêter pendant le chargement **annule vraiment** le démarrage (le micro n'est jamais ouvert pour une session abandonnée) ; l'arrêt **attend l'accusé « termine »** du moteur, envoyé après le dernier segment, avant de proposer la relecture par l'IA ; changer de document pendant la transcription n'écrit **jamais** dans l'autre document (le passage est proposé à la copie).
- **Sélection conservée** (priorité critique) : sélectionner un passage puis dicter ne l'efface plus tant qu'aucun texte n'est reconnu ; le remplacement se fait en une seule opération, annulable (Ctrl+Z ou « annule ça » rétablit le texte d'origine).
- **Modèles vérifiés** (priorité élevée) : chaque fichier de chaque modèle est **épinglé** dans le code (nom, taille, empreinte officielle SHA-256 ou blob git, recoupées sur deux API de Hugging Face). Un fichier présent est recalculé avant réutilisation ; un fichier plus gros que prévu est coupé et rejeté ; un modèle importé ou modifié devient « non vérifié » et ne démarre qu'avec ton accord. Le miroir hf-mirror ne peut plus rien injecter.
- **Compilation fiable** (priorité élevée) : un seul `build.js` pour Windows **et Linux** (`--linux`, `Construire-Linux.sh`, `LINUX.md`) ; moteur natif et modèle intégré **obligatoires** (sauf `--sans-dictee`, explicitement non publiable) ; chaque paquet est contrôlé par `tools/verifier-paquet.js` avant d'être déclaré réussi (version, fichiers, moteur de la bonne architecture et lui seul, empreintes du modèle, Aurora, fusibles, aucun cache ni adresse personnelle).
- **Aurora accélérée par le GPU, automatiquement et sans risque** : le mode « auto » restait toujours sur le CPU, la détection cherchait les moteurs dans le mauvais dossier, et aucun moteur GPU n'était embarqué. Désormais : moteur **Vulkan** embarqué sur x64 (NVIDIA, AMD, Intel intégré ; ≈ 70 Mo) ; « auto » essaie le meilleur moteur installé pour la plateforme ; un **journal des essais** retient un pilote qui a fait planter le moteur et repasse au CPU au lancement suivant (oubli après 30 jours ou nouvelle version) ; repli à chaud sur le CPU si le modèle ne se charge pas sur le GPU ou si llama.cpp se replie en silence ; le GPU ne fait jamais refuser un modèle qui tient en mémoire sur CPU (PC de 8 Go). Vérifié sur une machine sans GPU : 1er lancement CUDA → échec noté, 2e Vulkan → échec noté, 3e CPU directement (0,7 s).
- **IA locale plus sobre** : la réflexion cachée des modèles « thinking » (Qwen3.5) est bornée explicitement à 0 jeton par défaut (node-llama-cpp lui laissait 50 à 75 % du contexte) ; les tâches difficiles pourront la relever requête par requête.
- Tests : dictée 73 (dont empreintes épinglées, fichier altéré, miroir falsifié, modèle intégré), application réelle 45 (dont arrêt pendant le chargement, accusé de fin, sélection, changement de document), vérificateur de paquets 15 (dont moteur Aurora superflu), GPU 17, Aurora 400.

## 2.7.0 — on parle, l'éditeur écrit ; l'IA se montre
- **Dictée vocale locale** (bouton micro, Ctrl+Maj+D, menu Insertion) : le texte provisoire s'affiche en direct au curseur ; à chaque pause, le passage est retranscrit puis **corrigé par le cerveau** (ponctuation dictée — « virgule », « point à la ligne », « nouveau paragraphe »… —, nombres décimaux, majuscules, espaces insécables françaises) et inséré pour de bon. Commandes « annule ça » et « arrête la dictée ». Hallucinations connues de Whisper filtrées. Relecture par l'IA proposée à la fin.
- **100 % local** : moteur sherpa-onnx (Apache-2.0) dans un **processus isolé** (un plantage ne ferme pas l'application) ; modèles téléchargés une seule fois, au choix : Whisper base / small (MIT) ou Parakeet TDT 0.6B v3 de NVIDIA (CC-BY-4.0, 25 langues européennes). Source Hugging Face ; s'il est bloqué (Chine, réseau filtré), le miroir **hf-mirror.com est proposé, avec accord explicite** (service tiers) ; ou import d'un dossier déjà téléchargé.
- **Sécurité de la dictée** : micro autorisé *uniquement* pendant une dictée lancée (audio seul, jamais la caméra, fenêtre et page d'Aura Script uniquement), voyant rouge visible, arrêt par Échap, au changement de document, après 3 min de silence ou 1 min fenêtre masquée ; aucun audio enregistré ; téléchargement en HTTPS vers des hôtes autorisés (redirections comprises), **empreinte SHA-256 vérifiée**, taille bornée, noms de fichiers assainis, fichiers `.part` jamais utilisés ; capacité « microphone » déclarée dans le paquet MSIX.
- **Transparence de l'IA** : chaque réponse porte « Généré par IA » et le moteur (Aurora locale, ou IA personnelle en ligne / sur serveur local, avec le modèle) ; bouton **Signaler** (motif, commentaire, e-mail préparé dans la messagerie — rien n'est envoyé seul ; la question n'est jointe que sur demande) ; page **Aide › Transparence de l'IA**.
- **Provenance du texte** : les passages insérés par l'IA sont marqués dans le document ; ce que l'auteur tape ou dicte ne l'est jamais (même au milieu d'un passage de l'IA). **Affichage › Provenance du texte** (soulignement pointillé, info-bulle) et **rapport chiffré** (« indication, pas une preuve »). À l'export **HTML** et **Word**, des métadonnées lisibles par machine indiquent la part de texte généré par IA lorsqu'elle n'est pas nulle.
- **Exécutable durci** (fusibles Electron posés à l'empaquetage) : `NODE_OPTIONS` / `NODE_EXTRA_CA_CERTS` et le débogueur (`--inspect`, SIGUSR1) sont ignorés par l'application installée ; `file://` sans privilèges supplémentaires. Vérifié sur le binaire Linux : une injection par `NODE_OPTIONS` n'a plus d'effet.
- Corrections : icône du bouton de tri de la bibliothèque décalée de 2 px (padding par défaut du bouton).
- **Modèles Aurora depuis la Chine** : si Hugging Face est injoignable, le téléchargement propose de passer par hf-mirror.com (accord explicite, jamais automatique).
- Nouveaux tests : dictée (65 unitaires et sécurité du téléchargement : hôte piégé, redirection, SHA-256, miroir uniquement sur accord, annulation, manifeste trafiqué, moteur natif réel), application réelle avec le vrai `main.js` (28 : permissions micro/caméra, processus isolé, insertion, commandes, Ctrl+Z, worklet audio sous CSP), transparence (30).

## 2.6.1 — un cerveau plus juste, une recherche qui trouve
- **Commandes strictes** : une commande doit couvrir toute la demande (aux formules de politesse près). « Fais un tableau comparatif des forfaits » part désormais à l'IA au lieu d'insérer un tableau vide ; « Rends ce passage plus sombre » ne bascule plus le thème. Corpus de 108 demandes réelles dans les tests. Quand l'IA ne répond pas, seules des intentions sans risque (analyses, propositions) sont reconnues librement.
- **Questions sur le document, sans IA** : « Quand le contrat se termine-t-il ? » → la phrase qui répond, avec « Aller au passage ».
- **IA mieux nourrie** : pour une question sur un long document, Aurora ou l'IA reçoit le début ET les passages pertinents (choisis localement), au lieu des 2 600 premiers caractères.
- **Recherche dans tous les documents** : contenu des feuilles, présentations, code et canvas ; accents ignorés, complétion du mot en cours, une faute tolérée, classement par pertinence, extrait surligné. Avant : seuls le nom et le HTML brut des textes étaient lus (balises comprises).
- **Infos** : thèmes du document et « Voir aussi » (documents proches par le contenu).
- **Corrections** : état « IA prête » lu après la bascule vers l'IA personnelle ; cache de recherche qui ne se périmait pas ; analyse de la Révision mise en cache ; règles de correction compilées une seule fois (document de 170 000 mots analysé en moins d'une seconde).

## 2.6.0 — le cerveau local
- **Cerveau local** (`cerveau.js`) : sans IA ni réseau, Aura Script comprend et retravaille le texte — langue, statistiques, lisibilité (Kandel-Moles / Flesch), phrases longues, répétitions, résumé extractif (TextRank + MMR), mots-clés, idées de titres, plan, correction par règles sûres (grammaire courante, ponctuation, majuscules, mots doublés, typographie française sur demande), raccourcir, clarifier.
- **Commandes en langage naturel** dans le panneau Assistant, en français et en anglais, exécutées instantanément sans IA : « insère un tableau 3x4 », « mets en gras », « titre 2 », « remplace chat par chien », « exporte en PDF », « nouvelle présentation », « analyse la feuille »… (« aide » pour la liste).
- **Hors ligne d'abord, IA en renfort** : quand Aurora ou l'IA personnelle ne répondent pas, le cerveau prend le relais (Corriger, Raccourcir, Améliorer, Résumer, Plan, Titres, questions du chat). Quand elles répondent, il leur fournit des repères calculés et vérifie leurs propositions (nombres inventés, thèmes oubliés, répétitions).
- **Révision** : nouvelle section « Grammaire et style » locale, avec application en un clic (mise en forme conservée).
- **Feuilles** : analyse des colonnes (types, totaux, moyennes), graphique conseillé, insertion des totaux.
- **Santé** : modèles (compte rendu de consultation, plan de traitement, journal de santé, transmissions de soins), relevé des traitements et des constantes, glossaire des abréviations médicales, **anonymisation** en copie séparée, lexique médical pour le correcteur. Un texte de santé n'est jamais envoyé à une IA en ligne sans accord explicite.
- **Corrections** : l'export Excel produisait un fichier invalide (relations XML mal fermées, styles tronqués) et n'exportait qu'un onglet — réécrit, tous les onglets, validé par LibreOffice et openpyxl ; l'export PowerPoint perdait images, tableaux et flèches et ignorait le format 4:3 — corrigé ; sélecteur d'image de couverture manquant.
- Aurora : Qwen3.5 4B (Apache 2.0) ajouté au catalogue pour les PC de 16 Go ; les notes non mesurées sont affichées comme estimées (Qwen3.5 2B : 5 → 4 estimée) ; banc français par modèle (`Banc-Modeles.bat`).
- Audit 2.6 : garde santé déplacée dans le processus principal et étendue à tout le contenu sortant (consigne, historique, outils) ; IPC en *fail closed* ; documentation harmonisée.
- Nouveaux tests : robot qui clique sur tous les contrôles, aller-retour de tous les formats avec validation externe, 87 tests unitaires du cerveau, 28 tests d'intégration.

## 2.5.1 — sécurité
- CSP sans `unsafe-inline` pour les scripts : 256 gestionnaires en ligne compilés (`gestionnaires.js`).
- Connecteur MCP : protocole authentifié v2 (HMAC, nonce, anti-rejeu, réponses signées), jeton renouvelé à chaque lancement, canal à nom aléatoire, socket privée, validation des arguments en trois couches, limites de débit.
- Mode groupe : sel par session, contexte authentifié (AAD), anti-rejeu et anti-réflexion.
- Migration des PDF testée contre les coupures. Batterie de tests d'attaque (`SECURITE.md`).
- Ouverture depuis l'Explorateur : Aura Script apparaît dans « Ouvrir avec » (Word, PowerPoint, Excel, CSV, PDF, texte) ; nouveaux lecteurs PowerPoint (.pptx : textes, puces, images, tableaux, couleurs) et Excel (.xlsx : tous les onglets, formules) ; message clair pour les anciens formats.
- Barres d'outils adaptatives : plus aucun bouton caché ou coupé sur les écrans moyens (barres sur deux lignes, menus sous le titre si besoin, onglets des paramètres).

## 2.5
Contexte autonome (11 sujets), atelier musique, clé API = assistant principal, halo bref, connecteur MCP en un clic, plugin Claude, version Linux.

## 2.4
Espaces Présentation / Feuille / PDF / Code / Canvas, graphiques, IA connectée avec outils, connecteur MCP local, tactile.

## Historique (2.2.0)
Éditeur d’écriture local pour Windows.

## Nouveautés v1.6
- Interface d’écriture repensée : page plus lisible, palette éditoriale apaisée et barre principale simplifiée ; les outils avancés restent accessibles dans le menu de mise en forme.
- Cadre natif Windows conservé, avec les contrôles standard de la fenêtre.
- Paramètres remis en ordre, entrée Studio retirée du menu principal et versions déplacées hors du menu « Plus ».
- Studio enrichi : tableau canvas avec outils de création, calques réordonnables, sélection, déplacement, propriétés, annulation, zoom et export PNG ; feuilles de calcul avec formules sûres, navigation clavier, collage de tableaux et export Excel/CSV.
- Assistant simplifié : actions directes sur le texte, modifications annulables/rétablissables et protection contre les changements de document pendant la génération.
- Visite guidée limitée au premier lancement et association de formats éditables à Aura dans « Ouvrir avec » de Windows ; le choix de l’application par défaut reste confirmé par Windows.
- Transparence adaptative avec solution de repli, barres de défilement fines et arrondies, et moteur IA local corrigé pour charger le modèle du bon dossier.
- Barres de menus et d’outils translucides, positionnement ajusté en plein écran, panneau Info enrichi et plan narratif accessible directement.
- Assistant Aurora exécuté dans un processus local séparé ; son modèle local (Qwen3.5 2B, licence Apache 2.0, ≈ 1,2 Go) se télécharge à la demande, licence affichée avant. Détails : `MODELES.md`.
- Section « Paye-moi un café » avec le lien du développeur ; rappel facultatif affiché une seule fois après 10 000 mots ajoutés dans l’éditeur.
- Assistant d’écriture resserré : le passage sélectionné est conservé en priorité dans le prompt et les réponses trop éloignées sont refusées sans modifier le document ; l’historique visuel superflu a été remplacé par un état compact.
- Révision propose une correction orthographique complète avec aperçu et annulation ; son interrupteur a été déplacé dans Paramètres > Écriture.

## IA
Aura utilise un moteur local avec mémoire éditoriale et Bible d’univers.

## Assistant et interface v1.6.23
- Indicateur Aurora intégré au chat avec voyants explicites : vert lorsque le modèle est prêt, orange pendant la vérification ou le téléchargement, rouge lorsque l’IA n’est pas disponible.
- Espace de conversation agrandi, note de pied de panneau et bouton de tri retirés ; le tri reste accessible depuis le menu « Plus ».
- Surfaces translucides rétablies dans les thèmes clair et sombre ; le statut de disponibilité n’est plus dupliqué par un voyant vert permanent.
- Export accessible depuis le menu « Plus » sur les petits écrans.
- Panneau Assistant défilant sur petits écrans et fenêtres basses, avec le compositeur conservé en bas sans masquer les commandes.

## Interface de référence v1.6.23
- Mise en page rapprochée de la capture fournie : navigation documentaire, page d’écriture centrale et assistant Aura avec quatre actions principales et compositeur ancré en bas.
- Barre d’application en deux rangées : menus principaux au-dessus des outils de mise en forme, avec défilement horizontal sur les fenêtres étroites ; le titre du document reste visible et modifiable dans la page de saisie.
- Au lancement, Aurora précharge automatiquement le modèle local installé en tâche de fond ; le statut du panneau indique lorsque le modèle est prêt. La politique mémoire existante peut libérer le contexte après cinq minutes d’inactivité.
- Vues statique et dynamique de l’assistant harmonisées ; les outils avancés, la traduction, le plan et l’annulation restent accessibles sous « Autres actions ».
- Correctif du bouton de téléchargement du modèle : il reste masqué tant que l’application ne peut pas proposer cette installation.
- Les documents récents affichent leur date de modification ; la recherche retrouve également les documents encore sans titre.
- « Présenter le document » est de nouveau disponible depuis le menu « Plus » sans encombrer la barre principale.

## Interface et export v1.6.20
- Mise en page rapprochée de la maquette fournie : largeur de lecture mieux maîtrisée, commandes plus compactes et textes secondaires plus lisibles.
- Correction du libellé Exporter, auparavant blanc sur fond clair, et raccordement du partage depuis le menu Fichier au bouton d’export réel.

## Correctifs visuels v1.6.19
- Correction du panneau Aurora qui réduisait deux fois la largeur de l’espace d’écriture lorsqu’il était ouvert.
- Recherche latérale remise en forme et doublon du raccourci de recherche retiré de la navigation.
- Contrastes et couleurs des thèmes clair/sombre harmonisés ; le bouton de thème suit maintenant le thème réellement actif et le mode système réagit aux changements de Windows.
- Panneau Aurora réorganisé pour préserver l’espace de conversation et garder le compositeur accessible sans chevauchement.

## Correctifs v1.6.7
- Sauvegarde forcée avant de changer de document ou de fermer l’application ; import de bibliothèque validé et conflits annoncés.
- Images redimensionnées lors de l’insertion, du collage et de l’import Word/HTML, puis conservées sans duplication dans les documents Aura et leurs versions.
- Export Word enrichi (styles, alignement, liens, images, tableaux et listes imbriquées) ; caractères XML interdits retirés.
- Recherche narrative et boîtes de saisie corrigées ; feuille de calcul compatible avec les nombres décimaux français et formules courantes.
- Ressources locales de l’assistant résolues indépendamment de l’URL `about:blank`.

La génération réelle du modèle local et son pic mémoire doivent toujours être vérifiés sur les machines cibles ; ce correctif ne prétend pas certifier la compatibilité avec 8 Go de RAM.

## Interface d’écriture v1.6.8
- La ligne de date, compteur et raccourcis de métadonnées a été retirée sous le titre pour libérer de l’espace à la saisie ; les actions Étiquette et Icône restent disponibles dans « Plus ».
- Un bouton de mise en page dans la barre du bas bascule entre la page simple et une vue Livre à deux pages côte à côte. Le choix est mémorisé sur l’appareil.

## Studio et modèles v1.6.9
- Galerie de modèles de documents enrichie avec des aperçus, une recherche et des catégories ; les modèles restent intégrés et utilisables hors ligne.
- Canvas : grille d’aide non exportée, redimensionnement par poignée, duplication, centrage et déplacement fin au clavier ; les calques restent réordonnables.
- Présentation : réglage du fond des diapositives et export PPTX avec thème, arrière-plans, formes et tailles de titre structurés.
- Feuille : export XLSX avec valeurs calculées, formules prises en charge, styles gras et formats nombre/devise/pourcentage.
- Les exports Excel et PowerPoint sont enregistrés localement et n’envoient pas le contenu sur Internet.

## Studio v1.6.10
- Palette de couleurs intégrée au Canvas et à la Présentation : couleurs prédéfinies et couleurs personnalisées mémorisées localement.
- La couleur choisie s’applique à l’élément sélectionné ou, sans sélection, au fond de la diapositive ; les couleurs de texte et de forme sont conservées dans l’export PowerPoint.
- Les nouvelles formes et zones de texte sont sélectionnées dès leur création pour permettre de les modifier immédiatement.

## Interface v1.6.11
- Le mode Focus réduit la barre latérale, masque le panneau latéral, recentre le document dans l’espace disponible et se quitte avec Échap.
- Le clic droit sur le titre ouvre le menu contextuel enrichi ; ses commandes de texte et de mise en forme restent adaptées au titre et sont enregistrées avec le document.
- Un bouton Présentation dans la barre d’outils ouvre directement le Studio sur la création de diapositives.

## Paquet universel v1.6.13
- La compilation standard ne demande plus de choisir entre deux éditions : elle produit un seul paquet contenant l’application, le moteur IA et son modèle local.
- Au lancement, Aura détecte la configuration et désactive l’IA sur les PC ayant 4 Go de RAM ou moins ; les outils hors IA restent disponibles.
- Jusqu’à 8 Go, l’IA est limitée à un thread, un contexte de 4 000 caractères et une sortie de 256 tokens ; elle attend qu’au moins 2 Go de RAM soient libres.
- Le modèle embarqué occupe de l’espace disque dans le paquet universel même lorsque l’IA est désactivée sur un PC modeste.

## Présentation du document v1.6.14
- Le champ de titre « Sans titre » a été retiré de la page de saisie ; le nom du document reste modifiable depuis son fil d’Ariane en haut.
- Le bouton « Présenter le document » se trouve dans la barre supérieure et affiche le contenu de la page d’écriture courante en mode lecture.
- Cette présentation est distincte des diapositives créées dans Studio > Présentation ; Échap ou le bouton × permet de revenir à la saisie.
## Taille d’écriture v1.6.15
- Le champ de taille de la barre d’outils accepte désormais une valeur saisie librement de 6 à 120 px, par pas de 0,5 px ; les tailles prédéfinies restent proposées.
- Entrée applique la taille au texte sélectionné ou au point de saisie ; la valeur affichée suit également la taille du texte sous le curseur.
- Les limites protègent la mémoire, mais les performances réelles dépendent du système et ne sont pas certifiées sans mesure sur les appareils cibles.

## Focus immersif v1.6.16
- Le mode Focus passe en plein écran natif et masque la barre latérale, les barres de commande et la barre d’état pour laisser la page occuper presque tout l’écran.
- Les commandes réapparaissent temporairement en approchant le pointeur du bord supérieur ou inférieur ; Échap quitte le Focus et restaure la fenêtre.
- Le champ de taille accepte des valeurs de 6 à 120 px par pas de 0,5 px, et conserve les demi-pixels lors de la synchronisation avec le texte sélectionné.

## Interface éditoriale v1.6.18
- Remplacement de la composition de l’interface par celle de `aura-script-final.html` : navigation latérale, en-tête du document, barre de mise en forme, page d’écriture et panneau latéral Aura.
- Les documents et commandes réels d’Aura restent reliés (édition, sauvegarde, réglages, Studio, menus, exports et assistant) ; aucun contenu d’exemple ni action simulée du prototype n’est intégré. Les commandes avancées restent accessibles via le bouton de menus.
- Adaptation aux thèmes clair/sombre et aux fenêtres étroites ; le panneau IA est visible sans déclencher le chargement du modèle, qui reste à la demande.
- Le moteur IA, le modèle, son chargement, ses limites et ses données n’ont pas été modifiés.

