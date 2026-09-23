# Modifications versionnées

Un aperçu résumé de toutes les modifications, par version de ce projet.

> Les entrées seront ajoutées dans l'ordre chronologique inverse, donc la plus récente en haut.
>
> L'en-tête de version le plus haut est toujours la version active en développement, identifiée par un `-pre`
> Suffixe sur son numéro de version (par exemple `## v1.1.1-pre`) au lieu d'une balise d'état. Une fois une version gelée
> Ou libéré, ce suffixe est remplacé par l'un de ces codes d'état :
> - `[{{date}}]` - figé/finalisé le {{date}}
> - `[released: {{date}}]` - publié vers le gestionnaire de packages ou la production sur {{date}}
> - `[broken]` - considéré comme cassé et non utilisé

---

## v3.5.1-pre
- DevEx: Le nouveau script `run-review-server.py` sert le projet via HTTP threadé pour l'examen et les tests du navigateur.
- FrontEnd: Les paramètres s'ouvrent désormais en plein écran, avec le bouton de rapport d'erreur en haut à gauche comme dans À propos de cette application.
- FrontEnd: De nouveaux boutons lancent un quiz avec des questions incorrectes précédentes ou répètent uniquement les questions incorrectes par la suite.
- FrontEnd: L'établissement ajoute automatiquement les questions incorrectes du quiz précédent à un nouveau tour.
- FrontEnd: Le temps de jeu total, les statistiques de jeu et les questions les plus fréquemment mal répondues sont désormais suivis localement dans localStorage.
- FrontEnd: Le bouton Signaler un bug est désormais un véritable bouton omniprésent avec un contexte d'écran automatique.
- BackEnd: L'e-mail récapitulatif affiche désormais son propre tableau pour chaque joueur suivi avec des colonnes Toujours/Dernière semaine/Dernières 24h divisées à parts égales.
- BackEnd: Les problèmes signalés affichent désormais à la fois l'ID de la question et le texte de la question au lieu d'un seul.

## v3.5.0 [released: 2026-09-22]
- BackEnd: Google Apps Script envoie désormais chaque jour à 7h00 et 19h00 UTC un e-mail récapitulatif de style néerlandais avec les résultats, les notifications et une liste personnalisable de joueurs à suivre.
- FrontEnd: L'écran À propos affiche désormais le journal des modifications traduit dans la langue active de l'interface.
- FrontEnd: La boîte de dialogue "Signaler un bug" affiche désormais une icône de titre et un contexte de question facultatif configurable.
- FrontEnd: Une boîte de dialogue de paramètres avec des sections claires Général/Quiz/Carrousel remplace les deux boîtes de dialogue séparées.
- FrontEnd: Le nom, la langue, le thème et la couleur du thème sont désormais également réglables et enregistrés dans localStorage.
- DevEx: Ajout de `translate-markdown.py`, segmentant Markdown par titre et paragraphe avant de traduire chaque version.

## v3.4.0 [released: 2026-09-22]
- FrontEnd: Les questions du quiz ont reçu un bouton de fermeture en haut à droite de la carte confirmant la perte de progression dans les cinq langues.
- FrontEnd: Les mises à jour automatiques de PWA seront désormais plus rapides.
- FrontEnd: Le jeu d'icônes est désormais mis de côté et utilisé de manière cohérente.

## v3.3.0 [released: 2026-09-22]
- FrontEnd: Ajout de traductions italiennes pour l'interface utilisateur, les boîtes de dialogue de configuration et la banque de questions.
- FrontEnd: Ajout de traductions allemandes pour l'interface utilisateur, les boîtes de dialogue de configuration et la banque de questions.
- FrontEnd: Ajout de traductions françaises pour l'interface utilisateur, les boîtes de dialogue de configuration et la banque de questions.
- FrontEnd: Clarification de l'info-bulle de changement de langue ; il affiche désormais le cycle linguistique complet avec la langue active mise en évidence.
- FrontEnd: Les liens du code source Code de la route affichent désormais la version française lors de la sélection de la langue française ; L'allemand et l'anglais restent dans la version néerlandaise, en l'absence d'équivalent officiel.
- FrontEnd: Toutes sortes d'autres améliorations mineures de l'UI/UX

## v3.2.0 [2026-09-22]
- FrontEnd: Explications et titres séparés et localisés pour les panneaux routiers ajoutés au carrousel, y compris des traductions complètes en néerlandais et en anglais.
- FrontEnd: Remplacement des textes alternatifs d'images génériques par des codes de tableau descriptifs dans les questions du quiz, les options de réponse et le carrousel.
- FrontEnd: Ajout de la possibilité de partager les résultats du quiz via l'API Web Share, avec une possibilité de copier dans le presse-papiers et les notifications toast.
- FrontEnd: Ajout de badges indicateurs (indépendants de la couleur) pour les options de réponse et de l'en-tête pour indiquer les réponses correctes et incorrectes (accessibilité pour les daltoniens).
- FrontEnd: CSS refactorisé en une feuille de style modulaire « mobile-first » conforme aux jetons d'audit et aux normes de contraste WCAG.
- FrontEnd: Ajout de la traduction en anglais et du changement de langue pour l'interface utilisateur, les boîtes de dialogue de configuration et les 324 questions.
- FrontEnd: Ajout des attributs « Portée » aux en-têtes de colonnes dans le tableau des résultats pour l'accessibilité des lecteurs d'écran.
- DevEx: Architecture JavaScript modularisée en modules ES distincts, séparant l'état de l'application, le stockage et la logique de présentation de l'interface utilisateur.
- FrontEnd: Activation des mises à jour automatiques du cycle de vie des agents de service et des rechargements des clients lors du déploiement de nouvelles versions.
- FrontEnd: Conservez le texte d'introduction sur l'écran d'accueil lorsque vous changez de mode de quiz ou modifiez les configurations.
- FrontEnd: Ajout d'un thème sombre et d'accents de couleur configurables, y compris la détection des préférences système et la prise en charge des paramètres de requête.
- FrontEnd: Ajout de la prise en charge des paramètres de requête de nom de joueur (y compris les alias) pour contourner le champ de saisie sur l'écran d'accueil.
- FrontEnd: Ajout de vingt questions photo sur des situations de circulation réelles, y compris une mise en cache hors ligne améliorée et des tests automatisés.
- DevEx: Tous les commentaires du code source dans les modules HTML, CSS et JavaScript standardisés en anglais américain.
- FrontEnd: Nom du joueur et paramètres du quiz enregistrés sur le stockage local, les paramètres de requête URL étant prioritaires.

## v3.1.0 [released: 2026-09-21]
- FrontEnd: Écran d'accueil réduit avec des boutons d'action ronds, un commutateur de mode, des commandes de carrousel et des boîtes de dialogue de paramètres interactives.
- FrontEnd: De meilleurs choix de configuration, des boutons plus cohérents et des instructions d'interface simplifiées.
- DevEx: Numérotation des versions liée au journal des modifications en tant que source centrale pour les scripts frontend et de développement.

## v3.0.0 [released: 2026-09-19]
- FrontEnd: Nettoyage de l'écran d'accueil et ajout d'une vue À propos spécifique avec l'historique des versions, les notes de version, les citations des sources et les droits d'auteur.
- FrontEnd: Icône d'application et favicon à l'extérieur du panneau routier rond rendus entièrement transparents avec ico multi-résolution.
- FrontEnd: Ajout d'un carrousel de panneaux de signalisation avec durée de changement réglable, contrôle de pause et indicateur de pause clair via les paramètres URL et le bouton de démarrage.
- Inhoud: Les 294 questions ont été révisées ; Correction de 27 erreurs substantielles et de 2 années non confirmées.
- FrontEnd: Boutons de résultats placés de manière compacte en haut à droite du bureau et étiquettes de modifications légales harmonisées en termes de typographie.
- Inhoud: Vingt questions pratiques avec des photos de situations de circulation ajoutées, y compris la prise en charge du filtrage via les paramètres de requête.
- FrontEnd: Ajout d'un filtre de type de question avec des invites de démarrage visuelles et un affichage de photos réactif pour les situations du monde réel.
- FrontEnd: Disposition à deux panneaux sur ordinateur et vue mobile sans défilement avec bouton d'action flottant et lien de loi compact mis en œuvre.
- FrontEnd: Application Web progressive installée avec une prise en charge 100 % hors ligne, des icônes de rond-point et une file d'attente d'erreurs locale.
- Test: Ajout de tests de mise en page automatisés pour la structure à deux panneaux, le masquage d'options mobiles et le lien de loi compact.
- Test: Ajout de tests de vérification automatisés pour le manifeste de l'application Web, la taille des icônes et les fichiers de préchargement des techniciens de service.
- CLI: Standardisation de tous les scripts de développement selon des directives CLI exploitables avec une journalisation structurée et des noms de fichiers kebab-case.

## v2.0.0 [released: 2026-09-18]
- Inhoud: Couverture complète de tous les panneaux de signalisation belges réalisée avec 193 images de panneaux et 284 questions.
- FrontEnd: Formulaire de rapport d'erreur optimisé pour un envoi instantané en arrière-plan sans aucun délai d'interface.
- FrontEnd: Barre de progression corrigée pour augmenter proportionnellement de la première question à 100 pour cent.
- Test: Suite de tests étendue avec des contrôles stricts de la présence d'images du tableau pour toutes les questions du tableau.

## v1.1.0 [released: 2026-09-18]
- Documentatie: Visite visuelle avec captures d'écran sur ordinateur et mobile ajoutées au README.
- FrontEnd: Favicon de panneau de signalisation bleu ajouté et bouton de la dernière question modifié pour afficher les résultats.
- FrontEnd: Les indicateurs de notification de démarrage et de progression affichent désormais le nombre de questions dynamiques limité aux questions disponibles.
- FrontEnd: Ajout de paramètres de requête URL pour le filtrage par année de modification de la loi et nombre de questions.
- FrontEnd: Articles de droit officiels et liens explicatifs affichés après avoir répondu à chaque question du quiz.
- Inhoud: La banque de questions a doublé pour atteindre 126 questions avec une couverture complète du conseil et des règles post-2022.

## v1.0.0 [released: 2026-09-18]
- Documentatie: Ajout d'une documentation de projet standard, y compris les exigences, le guide DevOps, la licence et l'index de la documentation.
- DevEx: Ajout de scripts d'amorçage et de déploiement multiplateformes avec la version CLI et les options d'aide.
- Test: Ajout d'une suite de tests automatisés pour la vérification de la structure des questions, des images du tableau et des années de droit.
- FrontEnd: Panneaux routiers et vignettes affichés dans l'aperçu des résultats pour les questions liées aux panneaux.
- FrontEnd: Ajout d'un badge de version interactive sur l'écran d'accueil qui ouvre le journal des modifications lorsque vous cliquez dessus.
- FrontEnd: Ajout d'un bouton et d'une boîte de dialogue de rapport d'erreurs pour envoyer des commentaires sur les questions à Google Sheets.
- FrontEnd: Durée du quiz suivie du début à la fin, affichée avec les résultats et enregistrée dans Google Sheets.
- FrontEnd: Liens directs vers le Code de la route officiel consolidé et les modifications législatives ajoutées à l'écran d'accueil.
- FrontEnd: Aperçu des résultats une fois imprimés en plein écran avec protection contre la séparation des pages et titres répétitifs.
- FrontEnd: Cartes de résultats mobiles rendues plus compactes avec des badges de statut en haut à droite et des champs de réponse fusionnés.
- FrontEnd: Ajout de badges de changement de loi et de paramètres d'URL pour mettre en pratique les règles de circulation récentes de manière ciblée.
- FrontEnd: Quiz néerlandais adapté aux mobiles, composé de 20 questions aléatoires et d'un retour immédiat.
- FrontEnd: Ajout d'un aperçu des résultats imprimables avec des vignettes du tableau et des confettis pour un score parfait.
- Inhoud: Questions, réponses, explications et panneaux de signalisation adaptés au code de la route belge en vigueur.
- Inhoud: 63 questions d'examen vérifiées avec références de sources et 35 panneaux de signalisation belges ajoutés.
- BackEnd: Suivi des scores facultatif dans Google Sheets pour les joueurs via un point de terminaison Apps Script sécurisé.
- Documentatie: Ajout d'instructions pour les tests locaux, la publication de pages GitHub et la configuration de Google Sheet.
- Documentatie: Code de la route officiel et tous les amendements depuis 2021 ajoutés comme sources de référence légale.
