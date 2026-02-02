/* ===========================================
   CleanOS Academy — Tests System
   Версия 2.0 — работает с PHP API
   =========================================== */

// Current test state
let currentTest = {
  moduleId: null,
  testData: null,
  currentQuestion: 0,
  answers: [],
  startTime: null
};

// Initialize test page
async function renderTestPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const moduleId = urlParams.get('id');

  if (moduleId) {
    await startTest(moduleId);
  } else {
    await renderTestSelection();
  }
}

// Render test selection page
async function renderTestSelection() {
  const container = document.querySelector('.test-container');
  if (!container) return;

  // Загружаем список тестов с сервера
  const data = await API.getTests();

  if (!data.success) {
    container.innerHTML = '<p>Ошибка загрузки тестов</p>';
    return;
  }

  container.innerHTML = `
    <div class="test-selection animate-fadeInUp">
      <h1>Выберите тест</h1>
      <p class="text-secondary">Проверьте свои знания после изучения модулей</p>
      
      <div class="test-cards">
        ${data.tests.map((test, index) => `
            <div class="glass-card test-card ${test.isLocked ? 'locked' : ''} delay-${index + 1}" 
                 ${!test.isLocked ? `onclick="startTest('${test.id}')"` : ''}>
              <div class="test-card-icon">${test.icon}</div>
              <h3>${test.title}</h3>
              <p>${test.description}</p>
              <div class="test-card-meta">
                <span>📝 ${test.questionsCount} вопросов</span>
                <span>⏱️ ~${Math.ceil(test.questionsCount * 1.5)} мин</span>
              </div>
              ${test.passed ? `
                <div class="test-result-badge success">
                  ✅ Сдано: ${test.score}%
                </div>
              ` : test.attempts > 0 ? `
                <div class="test-result-badge fail">
                  Последний результат: ${test.score}%
                </div>
              ` : ''}
              ${test.isLocked ? `
                <div class="test-locked-overlay">
                  <span>🔒</span>
                  <p>Пройдите 50% модуля (сейчас: ${test.moduleProgress}%)</p>
                </div>
              ` : `
                <button class="btn btn-primary">Начать тест</button>
              `}
            </div>
          `).join('')}
      </div>
    </div>
  `;
}

// Start a test
async function startTest(moduleId) {
  // Проверяем доступ через API
  const accessData = await API.checkTestAccess(moduleId);

  if (!accessData.success || !accessData.has_access) {
    showToast(accessData.reason || 'Доступ к тесту закрыт', 'error');
    return;
  }

  // Загружаем тест с сервера
  const testData = await API.getTest(moduleId);

  if (!testData.success) {
    showToast('Ошибка загрузки теста: ' + testData.error, 'error');
    return;
  }

  currentTest = {
    moduleId,
    testData: testData.test,
    currentQuestion: 0,
    answers: [],
    startTime: Date.now()
  };

  // Update URL
  const url = new URL(window.location);
  url.searchParams.set('id', moduleId);
  window.history.pushState({}, '', url);

  renderQuestion();
}

// Render current question
function renderQuestion() {
  const container = document.querySelector('.test-container');
  if (!container) return;

  const test = currentTest.testData;
  const question = test.questions[currentTest.currentQuestion];
  const progress = ((currentTest.currentQuestion + 1) / test.questions.length) * 100;

  container.innerHTML = `
    <div class="test-question animate-fadeIn">
      <div class="test-header">
        <a href="test.html" class="btn btn-ghost">← Назад к тестам</a>
        <div class="test-progress-info">
          Вопрос ${currentTest.currentQuestion + 1} из ${test.questions.length}
        </div>
      </div>
      
      <div class="test-progress-bar">
        <div class="test-progress-fill" style="width: ${progress}%"></div>
      </div>
      
      <div class="question-card glass-card-static">
        <h2 class="question-text">${question.question}</h2>
        
        <div class="options-list">
          ${question.options.map((option, index) => `
            <button class="option-btn" onclick="selectAnswer(${index})">
              <span class="option-letter">${String.fromCharCode(65 + index)}</span>
              <span class="option-text">${option}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// Select answer
function selectAnswer(answerIndex) {
  const test = currentTest.testData;
  const question = test.questions[currentTest.currentQuestion];

  // Store answer (отправим на сервер в конце теста)
  currentTest.answers.push({
    question_id: question.id,
    selected: answerIndex
  });

  // Disable buttons and show selected
  const options = document.querySelectorAll('.option-btn');
  options.forEach((btn, index) => {
    btn.disabled = true;
    if (index === answerIndex) {
      btn.classList.add('selected');
    }
  });

  // Show "Next" button
  const questionCard = document.querySelector('.question-card');
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-primary btn-lg next-question-btn';
  nextBtn.textContent = currentTest.currentQuestion < test.questions.length - 1
    ? 'Следующий вопрос →'
    : 'Завершить тест';
  nextBtn.onclick = nextQuestion;
  questionCard.appendChild(nextBtn);
}

// Next question or finish
function nextQuestion() {
  const test = currentTest.testData;

  if (currentTest.currentQuestion < test.questions.length - 1) {
    currentTest.currentQuestion++;
    renderQuestion();
  } else {
    finishTest();
  }
}

// Finish test and show results
async function finishTest() {
  const container = document.querySelector('.test-container');
  if (!container) return;

  // Показываем загрузку
  container.innerHTML = '<div class="loading">Проверка ответов...</div>';

  // Отправляем ответы на сервер для проверки
  const result = await API.submitTest(currentTest.moduleId, currentTest.answers);

  if (!result.success) {
    container.innerHTML = '<p>Ошибка проверки теста</p>';
    return;
  }

  const timeTaken = Math.round((Date.now() - currentTest.startTime) / 1000);

  container.innerHTML = `
    <div class="test-results animate-fadeInUp">
      <div class="results-card glass-card-static">
        <div class="results-icon ${result.passed ? 'success' : 'fail'}">
          ${result.passed ? '🎉' : '📚'}
        </div>
        
        <h1 class="results-title">
          ${result.passed ? 'Поздравляем!' : 'Попробуйте ещё раз'}
        </h1>
        
        <p class="results-subtitle">
          ${result.passed
      ? 'Вы успешно прошли тест!'
      : `Для прохождения нужно набрать ${result.passingScore}%`}
        </p>
        
        <div class="results-score">
          <div class="score-circle ${result.passed ? 'success' : 'fail'}">
            <span class="score-value">${result.score}%</span>
          </div>
        </div>
        
        <div class="results-stats">
          <div class="result-stat">
            <span class="stat-value">${result.correctCount}/${result.totalQuestions}</span>
            <span class="stat-label">Правильных</span>
          </div>
          <div class="result-stat">
            <span class="stat-value">${formatTime(timeTaken)}</span>
            <span class="stat-label">Время</span>
          </div>
          <div class="result-stat">
            <span class="stat-value">${result.passingScore}%</span>
            <span class="stat-label">Проходной балл</span>
          </div>
        </div>
        
        ${result.results ? `
        <div class="results-details">
          <h3>Разбор ответов:</h3>
          ${result.results.map((r, i) => `
            <div class="result-item ${r.is_correct ? 'correct' : 'incorrect'}">
              <span class="result-icon">${r.is_correct ? '✅' : '❌'}</span>
              <span class="result-text">${r.explanation}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        <div class="results-actions">
          ${!result.passed ? `
            <button class="btn btn-primary btn-lg" onclick="startTest('${currentTest.moduleId}')">
              Пройти заново
            </button>
            <a href="module.html?id=${currentTest.moduleId}" class="btn btn-secondary btn-lg">
              Повторить материал
            </a>
          ` : `
            <a href="test.html" class="btn btn-primary btn-lg">
              К другим тестам
            </a>
            <a href="index.html" class="btn btn-secondary btn-lg">
              На главную
            </a>
          `}
        </div>
      </div>
      
      ${result.passed ? `
        <div class="confetti-container">
          ${Array(50).fill('').map(() => `<div class="confetti"></div>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

// Format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Export for global use
window.startTest = startTest;
window.selectAnswer = selectAnswer;
window.nextQuestion = nextQuestion;
window.renderTestPage = renderTestPage;
