/* QuizFlow — logique métier testable dans Node.js et le navigateur. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.QuizCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const QUESTION_BANK = Object.freeze([
    { id: 1, category: 'DevOps', question: 'Que signifie CI dans CI/CD ?', options: ['Continuous Integration', 'Code Installation', 'Central Internet', 'Continuous Inspection'], correct: 0, explanation: 'CI signifie Continuous Integration : intégrer et tester régulièrement le code.' },
    { id: 2, category: 'GitHub', question: 'À quoi sert une Pull Request ?', options: ['Supprimer le dépôt', 'Proposer et faire revoir des changements', 'Installer Docker', 'Éteindre Jenkins'], correct: 1, explanation: 'Une Pull Request permet de proposer, vérifier et fusionner les modifications.' },
    { id: 3, category: 'Docker', question: 'Quel fichier contient les instructions de construction d’une image Docker ?', options: ['README.md', 'package.json', 'Dockerfile', '.gitignore'], correct: 2, explanation: 'Un Dockerfile décrit comment construire une image Docker.' },
    { id: 4, category: 'Jenkins', question: 'À quoi sert principalement Jenkins ?', options: ['Dessiner des logos', 'Automatiser des tâches de CI/CD', 'Créer des comptes bancaires', 'Héberger des vidéos'], correct: 1, explanation: 'Jenkins automatise les builds, les tests et les déploiements.' },
    { id: 5, category: 'Git', question: 'Quelle commande enregistre un commit dans Git ?', options: ['git push', 'git checkout', 'git fetch', 'git commit'], correct: 3, explanation: 'git commit enregistre localement un ensemble de modifications.' },
    { id: 6, category: 'Testing', question: 'Quel est le rôle d’un smoke test ?', options: ['Vérifier rapidement que les fonctions essentielles marchent', 'Effacer les tests', 'Changer les couleurs', 'Remplacer Git'], correct: 0, explanation: 'Un smoke test vérifie rapidement que le système démarre et répond.' },
    { id: 7, category: 'Versions', question: 'Quel tag respecte un versioning vX.Y.Z ?', options: ['version-finale', 'v1.2.0', 'nouveau', '1-2'], correct: 1, explanation: 'v1.2.0 respecte le format majeur.mineur.correctif précédé de v.' },
    { id: 8, category: 'Pipeline', question: 'Quelle étape récupère le code source ?', options: ['Checkout', 'Archive', 'Smoke Test', 'Cleanup'], correct: 0, explanation: 'Checkout récupère le code du dépôt dans l’espace de travail du pipeline.' },
    { id: 9, category: 'Docker', question: 'Quel outil lance des services définis dans compose.yaml ?', options: ['git status', 'docker compose up', 'npm test', 'git tag'], correct: 1, explanation: 'docker compose up lance les services déclarés dans le fichier Compose.' },
    { id: 10, category: 'Git', question: 'Quelle branche est souvent utilisée pour le développement ?', options: ['assets', 'images', 'dev', 'logs'], correct: 2, explanation: 'La branche dev sert souvent à intégrer les développements avant la branche principale.' },
    { id: 11, category: 'CI/CD', question: 'Que peut signifier un résultat Failed dans Jenkins ?', options: ['Tous les tests ont réussi', 'Une étape a échoué', 'Le site est automatiquement publié', 'Le dépôt est vide'], correct: 1, explanation: 'Failed indique qu’une étape ou un contrôle a échoué.' },
    { id: 12, category: 'Artifacts', question: 'Pourquoi archive-t-on les artefacts de pipeline ?', options: ['Pour supprimer les branches', 'Pour cacher les résultats', 'Pour conserver builds, logs et rapports', 'Pour désinstaller Git'], correct: 2, explanation: 'Les artefacts servent à conserver les livrables et preuves du pipeline.' }
  ]);
  function isValidQuestion(q) { return !!q && Number.isInteger(q.id) && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length === 4 && q.options.every(x => typeof x === 'string' && x.length > 0) && Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length; }
  function calculateScore(questions, answers) {
    if (!Array.isArray(questions) || !answers || typeof answers !== 'object') throw new TypeError('Paramètres invalides');
    let correct = 0;
    for (const q of questions) { if (!isValidQuestion(q)) throw new TypeError('Question invalide'); if (Object.prototype.hasOwnProperty.call(answers, q.id) && answers[q.id] === q.correct) correct++; }
    return { correct, total: questions.length, percentage: questions.length ? Math.round((correct / questions.length) * 100) : 0 };
  }
  function getFeedback(score) {
    if (score >= 80) return { title: 'Excellent travail !', message: 'Tu maîtrises déjà bien les bases du DevOps.', emoji: '🏆' };
    if (score >= 50) return { title: 'Bien joué !', message: 'Encore quelques révisions et ce sera parfait.', emoji: '✨' };
    return { title: 'Continue à apprendre !', message: 'Chaque essai est une occasion de progresser.', emoji: '📚' };
  }
  function getQuizQuestions(count = 5, bank = QUESTION_BANK) {
    if (!Number.isInteger(count) || count < 1 || count > bank.length) throw new RangeError('Nombre de questions invalide');
    return bank.slice(0, count).map(q => ({ ...q, options: [...q.options] }));
  }
  return { QUESTION_BANK, isValidQuestion, calculateScore, getFeedback, getQuizQuestions };
});
