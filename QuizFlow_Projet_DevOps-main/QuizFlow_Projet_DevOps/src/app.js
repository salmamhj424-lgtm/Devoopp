(function () {
  'use strict';
  const { getQuizQuestions, calculateScore, getFeedback } = window.QuizCore;
  const app = document.getElementById('app');
  const state = { phase: 'welcome', name: '', questions: [], answers: {}, index: 0, selected: null, submitted: false };
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function renderWelcome() {
    app.innerHTML = `<div class="welcome">
      <div class="eyebrow"><span class="star">✦</span> Apprendre en s'amusant</div>
      <h1>Teste tes connaissances<br><span class="gradient-text">en DevOps.</span></h1>
      <p class="lead">Un mini quiz interactif pour découvrir GitHub, Jenkins, Docker et l’intégration continue. Prêt(e) à relever le défi ?</p>
      <div class="features"><span>✓ 5 questions</span><span>✓ Score instantané</span><span>✓ Explications</span></div>
      <form id="start-form" class="start-box"><label for="player-name">Ton prénom <span class="optional">(facultatif)</span></label><div class="form-row"><input id="player-name" maxlength="35" autocomplete="given-name" placeholder="Ex. Maram" value="${escapeHtml(state.name)}" /><button class="primary-btn" type="submit">Commencer <span aria-hidden="true">→</span></button></div></form>
      <div class="hero-note"><span class="note-icon">⚡</span><span><strong>Simple, rapide et éducatif.</strong><br>Environ 3 minutes · Aucune inscription nécessaire.</span></div>
    </div>`;
    document.getElementById('start-form').addEventListener('submit', event => {
      event.preventDefault(); state.name = document.getElementById('player-name').value.trim().slice(0,35);
      state.questions = getQuizQuestions(5); state.answers = {}; state.index = 0; state.selected = null; state.submitted = false; state.phase = 'question'; render();
    });
  }
  function renderQuestion() {
    const q = state.questions[state.index];
    const pct = Math.round((state.index / state.questions.length) * 100);
    app.innerHTML = `<div class="quiz-screen"><div class="quiz-header"><div><span class="eyebrow mini">QUIZ INTERACTIF</span><div class="question-count">Question <strong>${state.index+1}</strong> sur ${state.questions.length}</div></div><span class="category">${escapeHtml(q.category)}</span></div>
      <div class="progress" role="progressbar" aria-valuenow="${state.index}" aria-valuemin="0" aria-valuemax="${state.questions.length}" aria-label="Progression"><span style="width:${pct}%"></span></div>
      <div class="question-symbol" aria-hidden="true">?</div><h2 class="question-title">${escapeHtml(q.question)}</h2><p class="select-hint">Sélectionne la bonne réponse.</p>
      <div class="answers" role="group" aria-label="Choix de réponse">${q.options.map((option,i) => `<button class="answer ${state.selected === i ? 'selected' : ''} ${state.submitted && i === q.correct ? 'correct' : ''} ${state.submitted && state.selected === i && i !== q.correct ? 'incorrect' : ''}" data-choice="${i}" ${state.submitted ? 'disabled' : ''} aria-pressed="${state.selected === i}"><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${escapeHtml(option)}</span><span class="answer-indicator">${state.submitted && i === q.correct ? '✓' : state.submitted && state.selected === i ? '×' : state.selected === i ? '●' : '○'}</span></button>`).join('')}</div>
      ${state.submitted ? `<div class="explanation ${state.selected === q.correct ? 'ok' : 'ko'}" role="status"><strong>${state.selected === q.correct ? '✓ Bonne réponse !' : '✗ Pas tout à fait !'}</strong><p>${escapeHtml(q.explanation)}</p></div>` : ''}
      <div class="actions"><span class="support-text">${state.submitted ? 'Réponse enregistrée' : 'Une seule réponse possible'}</span><button class="primary-btn" id="next-btn" ${state.selected === null ? 'disabled' : ''}>${state.submitted ? (state.index === state.questions.length-1 ? 'Voir mon résultat →' : 'Question suivante →') : 'Valider ma réponse →'}</button></div></div>`;
    if (!state.submitted) document.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => { state.selected = Number(button.dataset.choice); render(); }));
    document.getElementById('next-btn').addEventListener('click', () => {
      if (state.selected === null) return;
      if (!state.submitted) { state.submitted = true; state.answers[q.id] = state.selected; }
      else if (state.index < state.questions.length - 1) { state.index++; state.selected = null; state.submitted = false; }
      else { state.phase = 'results'; }
      render();
    });
  }
  function renderResults() {
    const result = calculateScore(state.questions, state.answers); const feedback = getFeedback(result.percentage);
    app.innerHTML = `<div class="results"><span class="trophy" aria-hidden="true">${feedback.emoji}</span><span class="eyebrow mini">QUIZ TERMINÉ</span><h1>${escapeHtml(feedback.title)}</h1><p class="lead">${state.name ? `${escapeHtml(state.name)}, ` : ''}${escapeHtml(feedback.message)}</p>
      <div class="score-circle" style="background:conic-gradient(#7658df 0 ${result.percentage}%,#ece8fb ${result.percentage}% 100%)" role="img" aria-label="${result.correct} bonnes réponses sur ${result.total}"><div><span class="score-number">${result.correct}<small> / ${result.total}</small></span><span class="score-caption">bonnes réponses</span></div></div><strong class="score-percent">${result.percentage}% de réussite</strong>
      <div class="result-review"><h3>Récapitulatif des réponses</h3>${state.questions.map((q,i) => `<div class="review-line"><span class="review-icon ${state.answers[q.id] === q.correct ? 'yes' : 'no'}">${state.answers[q.id] === q.correct ? '✓' : '×'}</span><span><strong>Question ${i+1}</strong><small>${escapeHtml(q.question)}</small></span></div>`).join('')}</div><button class="primary-btn restart-btn" id="restart-btn">Recommencer le quiz ↻</button></div>`;
    document.getElementById('restart-btn').addEventListener('click', () => { state.phase = 'welcome'; render(); });
  }
  function render() { if (state.phase === 'welcome') renderWelcome(); else if (state.phase === 'question') renderQuestion(); else renderResults(); }
  render();
})();
