const test = require('node:test');
const assert = require('node:assert/strict');
const { QUESTION_BANK, isValidQuestion, calculateScore, getQuizQuestions, getFeedback } = require('../src/quiz-core.js');
test('banque contient 12 questions valides et uniques', () => {
  assert.equal(QUESTION_BANK.length, 12);
  assert.equal(new Set(QUESTION_BANK.map(q=>q.id)).size, 12);
  assert.ok(QUESTION_BANK.every(isValidQuestion));
});
test('le quiz affiche 5 questions par défaut', () => { assert.equal(getQuizQuestions().length, 5); });
test('les réponses correctes donnent 5 points', () => {
  const q=getQuizQuestions();const answers=Object.fromEntries(q.map(item=>[item.id,item.correct]));
  assert.deepEqual(calculateScore(q, answers), {correct:5,total:5,percentage:100});
});
test('les réponses incorrectes donnent zéro point', () => {
  const q=getQuizQuestions();const answers=Object.fromEntries(q.map(item=>[item.id,(item.correct+1)%4]));
  assert.deepEqual(calculateScore(q,answers), {correct:0,total:5,percentage:0});
});
test('une question ignorée ne donne pas de point', () => { assert.equal(calculateScore(getQuizQuestions(),{}).correct,0); });
test('un résultat partiel calcule le bon pourcentage', () => {
  const q=getQuizQuestions();const answers=Object.fromEntries(q.slice(0,3).map(item=>[item.id,item.correct]));
  assert.equal(calculateScore(q,answers).percentage,60);
});
test('le score ne dépasse pas le nombre de questions', () => {
  const q=getQuizQuestions();const answers=Object.fromEntries(q.map(item=>[item.id,item.correct]));
  assert.ok(calculateScore(q,answers).correct<=q.length);
});
test('un nombre de questions invalide provoque une erreur', () => {
  assert.throws(()=>getQuizQuestions(0),RangeError);
  assert.throws(()=>getQuizQuestions(100),RangeError);
});
test('la liste de questions est indépendante de la banque', () => {
  const q=getQuizQuestions();q[0].options[0]='modifié';
  assert.notEqual(q[0].options[0],QUESTION_BANK[0].options[0]);
});
test('retour utilisateur selon le score', () => {
  assert.equal(getFeedback(95).title,'Excellent travail !');
  assert.equal(getFeedback(60).title,'Bien joué !');
  assert.equal(getFeedback(20).title,'Continue à apprendre !');
});
