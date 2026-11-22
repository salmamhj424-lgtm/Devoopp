# QuizFlow — Application Web de Quiz Interactif

Projet universitaire **Introduction au DevOps (2026–2027)**. Une application web responsive de 5 questions de culture DevOps, avec score et corrections, conçue pour être utilisée dans 3 pipelines GitHub/Jenkins et dans Docker.

## 1. Démarrage immédiat (le plus facile)

Double-cliquez sur **`index.html`** : l'application fonctionne directement dans Chrome, sans installation ni connexion Internet. Les polices Google sont facultatives et remplacées automatiquement par une police système hors connexion.

Vous pouvez aussi lancer un serveur local avec Node.js (version 20 ou 22) :

```bash
npm run dev
```

Puis ouvrir **http://localhost:3000**.

## 2. Tests et build

```bash
npm test
npm run build
npm run smoke
```

- `npm test` : 10 tests unitaires de la logique métier avec le module natif `node:test`.
- `npm run build` : copie les fichiers utiles dans `dist/` (build statique, sans bibliothèque externe).
- `npm run smoke` : vérifie que les fichiers et ressources essentielles sont présents dans `dist/`.
- `npm run check` : lance l'ensemble.

**Aucun `npm install` nécessaire** : le projet n'a aucune dépendance NPM. `package-lock.json` est donc inutile.

## 3. Démarrage Docker

Prérequis : Docker Desktop opérationnel (conteneurs Linux).

```bash
docker compose up -d --build
```

Ouvrir **http://localhost:8088**. Vérifier le health endpoint **http://localhost:8088/health** (doit retourner `ok`).

Arrêter :

```bash
docker compose down
```

Dockerfile **multi-stage** : Node 22 produit `dist/`, Nginx sert les fichiers statiques.

## 4. GitHub : branches et événements

Démarrer avec un nouveau dépôt GitHub vide :

```bash
git init
git add .
git commit -m "Initial commit QuizFlow"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/quizflow-devops.git
git push -u origin main
git checkout -b dev
git push -u origin dev
git checkout -b feature/ui
# Modifier un fichier, puis :
git add .
git commit -m "Update quiz interface"
git push -u origin feature/ui
```

Dans GitHub, créer une **Pull Request** de `feature/ui` vers `dev`. Ensuite :

- **Pipeline PR** : création/mise à jour d'une Pull Request.
- **Pipeline DEV** : push sur la branche `dev` après merge.
- **Pipeline RELEASE** : tag Git conforme à `vX.Y.Z` (par ex. `v1.0.0`).

Pour la release :

```bash
git checkout main
git merge dev
git push origin main
git tag v1.0.0
git push origin v1.0.0
```

Ne créez pas un tag déjà existant ; utiliser une nouvelle version à chaque release.

## 5. Jenkins : 3 pipelines (Windows)

Le dossier `jenkins/` contient **trois Jenkinsfiles complets**, avec au moins 6 stages demandés : Checkout → Setup → Build → Run (Docker) → Smoke Test → Archive Artifacts. La pipeline DEV inclut **des tests en parallèle avec Node 20 et Node 22** exécutés dans des conteneurs distincts.

| Job Jenkins | Script Path | Evénement à configurer |
|---|---|---|
| QuizFlow-PR | `jenkins/Jenkinsfile.pr` | Pull Request depuis `feature/*` vers `dev` |
| QuizFlow-DEV | `jenkins/Jenkinsfile.dev` | push sur `dev` |
| QuizFlow-RELEASE | `jenkins/Jenkinsfile.release` | création du tag `vX.Y.Z` |

**Attention :** Jenkins ne déclenche pas automatiquement ces jobs simplement parce que les fichiers existent. Il faut installer/configurer les plugins Git/GitHub nécessaires, les credentials éventuels, et l'exploration des branches, PR et tags ou les webhooks. Utilisez des jobs **Multibranch Pipeline** (ou des jobs adaptés avec déclencheurs filtrés), et faites correspondre chaque événement au bon script. Pour les PR et les tags, assurez-vous que le job vérifie réellement la bonne référence Git. Vous pouvez utiliser 3 jobs multibranches avec des filtres adaptés.

### Prérequis Jenkins

- Jenkins fonctionne sur **Windows** avec `bat` autorisé.
- Les commandes `node`, `npm`, `docker` et `docker compose` marchent **depuis le compte qui exécute le service Jenkins**, pas seulement depuis votre session utilisateur.
- Docker Desktop est démarré en mode conteneurs Linux, l'utilisateur du service Jenkins a accès au daemon Docker.
- Accès à Internet pour télécharger les images `node:20-alpine`, `node:22-alpine` et `nginx:alpine` la première fois.
- Le port 8088 est libre. Les pipelines sont désactivés en concurrence **au sein d'un job**, mais si plusieurs jobs se lancent simultanément, ils peuvent se gêner sur le même port / projet Compose. Pour une démonstration locale, exécuter un job à la fois (ou isoler les jobs par ports/projet Docker Compose).

### Vérifications / artefacts

- Build et tests automatisés (`npm test`, `npm run build`).
- Vérification HTTP réelle depuis le conteneur (endpoints `/health` et `/`).
- `artifacts/tests.log`, `artifacts/build.log`, `artifacts/smoke-http.txt`, `artifacts/smoke-page.html`, `artifacts/container.log`, `artifacts/docker-status.txt`.
- Archive `dist/` et `artifacts/` (même si un stage échoue, les fichiers disponibles sont archivés dans le `post always`).
- Le pipeline RELEASE vérifie que `TAG_NAME` respecte exactement `vX.Y.Z`.

### Démonstration réelle du statut Failed → Passed

1. Créer une branche feature. Dans `tests/quiz-core.test.js`, modifier **temporairement** l'attente de `100` à `99` pour le test du score parfait.
2. Commit + push : le test échoue et Jenkins marque le build `FAILED`.
3. Remettre `100`, commit + push : le même test réussit (`PASSED`).
4. Capturer les deux exécutions et les inclure dans le rapport. **Ne pas laisser volontairement le test cassé dans le rendu final.**

## 6. Répartition / rapport

Voir `docs/REPARTITION_EQUIPE.md` et `docs/DEMO_10_MINUTES.md`.

Le rapport final de 15–20 pages doit expliquer l'architecture, les étapes, les branches, les PR, Docker, les 3 pipelines, la parallelisation, les logs, les artefacts et les exécutions **réellement effectuées**. Les captures Jenkins ne sont pas incluses ici : elles devront être prises sur votre propre environnement.

## Structure

```text
QuizFlow_Projet_DevOps/
├── index.html                 Application principale
├── src/                       CSS, interface, logique de quiz
├── tests/                     Tests automatiques
├── scripts/                   Serveur Node, build, smoke, validation tag
├── jenkins/                   3 Jenkinsfiles Windows
├── docs/                      Répartition de l'équipe et démonstration
├── Dockerfile                 Build multi-stage
├── compose.yaml               Lancement Docker Compose
├── nginx.conf                 Serveur du conteneur
├── package.json               Commandes npm sans dépendances
└── README.md                  Ce guide
```

**Note technique :** cette version utilise HTML/CSS/JavaScript natifs au lieu de React, afin de réduire au maximum la configuration et les risques. Le sujet autorise une application Web au choix et ne demande pas React. Le projet est une vraie application statique fonctionnelle, pas une maquette.
