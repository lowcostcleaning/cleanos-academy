/* ===========================================
   CleanOS Academy — Tests System
   Interactive quiz functionality
   =========================================== */

const testsData = {
    module1: {
        title: 'Тест: Регламент уборки',
        description: 'Проверьте свои знания стандартов и порядка уборки',
        passingScore: 70,
        questions: [
            {
                id: 1,
                question: 'С чего начинается уборка апартамента?',
                options: [
                    'Мытьё полов',
                    'Проветривание',
                    'Сбор мусора',
                    'Уборка санузла'
                ],
                correct: 1,
                explanation: 'Первым шагом всегда является проветривание — откройте окна для свежего воздуха.'
            },
            {
                id: 2,
                question: 'В каком направлении выполняется протирание поверхностей от пыли?',
                options: [
                    'Снизу вверх',
                    'Сверху вниз',
                    'Слева направо',
                    'Справа налево'
                ],
                correct: 1,
                explanation: 'Пыль протирают сверху вниз, чтобы она не оседала на уже убранные поверхности.'
            },
            {
                id: 3,
                question: 'Что необходимо сделать с постельным бельём при уборке?',
                options: [
                    'Оставить как есть',
                    'Просто расправить',
                    'Собрать для стирки и застелить свежее',
                    'Выбросить'
                ],
                correct: 2,
                explanation: 'Постельное бельё собирается для стирки, а кровать застилается свежим комплектом.'
            },
            {
                id: 4,
                question: 'Какой последний этап уборки апартамента?',
                options: [
                    'Мытьё полов',
                    'Уборка кухни',
                    'Проветривание',
                    'Финальная проверка по чек-листу'
                ],
                correct: 3,
                explanation: 'Финальная проверка по чек-листу гарантирует, что ничего не упущено.'
            },
            {
                id: 5,
                question: 'Что строго ЗАПРЕЩЕНО делать в апартаменте?',
                options: [
                    'Открывать окна',
                    'Использовать технику гостей (ТВ, музыка)',
                    'Мыть посуду',
                    'Протирать зеркала'
                ],
                correct: 1,
                explanation: 'Использование техники гостей категорически запрещено правилами.'
            },
            {
                id: 6,
                question: 'За сколько минут нужно предупредить об опоздании?',
                options: [
                    '5 минут',
                    '15 минут',
                    '30 минут',
                    '1 час'
                ],
                correct: 2,
                explanation: 'Если опаздываете — предупредите за 30 минут.'
            },
            {
                id: 7,
                question: 'Что делать при обнаружении поломки в апартаменте?',
                options: [
                    'Попробовать починить самостоятельно',
                    'Игнорировать',
                    'Сообщить немедленно',
                    'Написать записку гостю'
                ],
                correct: 2,
                explanation: 'О любых поломках или проблемах сообщайте немедленно руководству.'
            }
        ]
    },

    module2: {
        title: 'Тест: Химия для уборок',
        description: 'Проверьте знания о чистящих средствах и безопасности',
        passingScore: 70,
        questions: [
            {
                id: 1,
                question: 'Какие средства нельзя смешивать друг с другом?',
                options: [
                    'Моющее и ополаскиватель',
                    'Хлор и аммиак',
                    'Мыло и воду',
                    'Шампунь и кондиционер'
                ],
                correct: 1,
                explanation: 'Хлор и аммиак при смешивании образуют токсичный газ!'
            },
            {
                id: 2,
                question: 'Сколько времени нужно держать средство для санузла?',
                options: [
                    'Сразу смывать',
                    '1-2 минуты',
                    '5-10 минут',
                    '30 минут'
                ],
                correct: 2,
                explanation: 'Средство для санузла выдерживается 5-10 минут для эффективной дезинфекции.'
            },
            {
                id: 3,
                question: 'Как правильно наносить чистящее средство?',
                options: [
                    'Прямо на поверхность',
                    'На тряпку, а не на поверхность',
                    'На руки',
                    'Как угодно'
                ],
                correct: 1,
                explanation: 'Наносите средство на тряпку — это экономит химию и предотвращает разводы.'
            },
            {
                id: 4,
                question: 'Что нужно сделать, если средство попало в глаза?',
                options: [
                    'Потереть глаза',
                    'Промывать водой 15 минут и обратиться к врачу',
                    'Подождать, пройдёт само',
                    'Закапать другим средством'
                ],
                correct: 1,
                explanation: 'При попадании в глаза — промывать водой 15 минут и обратиться к врачу!'
            },
            {
                id: 5,
                question: 'Какая дозировка универсального средства на 5 литров воды?',
                options: [
                    '10 мл',
                    '30 мл',
                    '100 мл',
                    '500 мл'
                ],
                correct: 1,
                explanation: 'Стандартная дозировка — 30 мл (2 столовые ложки) на 5 литров воды.'
            },
            {
                id: 6,
                question: 'При использовании каких средств обязательно проветривание?',
                options: [
                    'Мыльный раствор',
                    'Средства с резким запахом',
                    'Вода',
                    'Никаких'
                ],
                correct: 1,
                explanation: 'Открывайте окна при использовании средств с резким запахом.'
            },
            {
                id: 7,
                question: 'Что обязательно использовать при работе с химией?',
                options: [
                    'Шарф',
                    'Перчатки',
                    'Очки для чтения',
                    'Наушники'
                ],
                correct: 1,
                explanation: 'Всегда надевайте перчатки при работе с любой химией.'
            }
        ]
    },

    module3: {
        title: 'Тест: Инвентарь',
        description: 'Проверьте знания об инструментах и их использовании',
        passingScore: 70,
        questions: [
            {
                id: 1,
                question: 'Для чего используется КРАСНАЯ микрофибра?',
                options: [
                    'Для кухни',
                    'Только для санузлов (унитаз)',
                    'Для зеркал',
                    'Для мебели'
                ],
                correct: 1,
                explanation: 'Красная микрофибра — только для санузлов, чтобы предотвратить перекрёстное загрязнение.'
            },
            {
                id: 2,
                question: 'При какой температуре стирать микрофибру?',
                options: [
                    '30°C',
                    '40°C',
                    '60°C',
                    '90°C'
                ],
                correct: 2,
                explanation: 'Микрофибру стирают при 60°C — это убивает бактерии.'
            },
            {
                id: 3,
                question: 'Почему нельзя использовать кондиционер при стирке микрофибры?',
                options: [
                    'Дорого стоит',
                    'Портит цвет',
                    'Забивает волокна',
                    'Неприятный запах'
                ],
                correct: 2,
                explanation: 'Кондиционер забивает волокна микрофибры и снижает её эффективность.'
            },
            {
                id: 4,
                question: 'Как часто нужно менять губки?',
                options: [
                    'Каждый день',
                    'Каждые 2 недели',
                    'Каждые 2 месяца',
                    'Раз в год'
                ],
                correct: 1,
                explanation: 'Губки рекомендуется менять каждые 2 недели.'
            },
            {
                id: 5,
                question: 'ЗЕЛЁНАЯ микрофибра используется для:',
                options: [
                    'Санузла',
                    'Кухни',
                    'Спальни',
                    'Прихожей'
                ],
                correct: 1,
                explanation: 'Зелёная микрофибра — для кухни и пищевых поверхностей.'
            },
            {
                id: 6,
                question: 'Как хранить швабру после использования?',
                options: [
                    'В ведре с водой',
                    'Горизонтально на полу',
                    'В вертикальном положении',
                    'В пакете'
                ],
                correct: 2,
                explanation: 'Швабру сушат в вертикальном положении для правильной просушки.'
            },
            {
                id: 7,
                question: 'Когда лучше проверять набор инвентаря?',
                options: [
                    'Утром в день уборки',
                    'Вечером перед рабочим днём',
                    'Во время уборки',
                    'Раз в месяц'
                ],
                correct: 1,
                explanation: 'Проверяйте набор вечером перед рабочим днём, чтобы утром не терять время.'
            }
        ]
    }
};

// Current test state
let currentTest = {
    moduleId: null,
    currentQuestion: 0,
    answers: [],
    startTime: null
};

// Initialize test page
function renderTestPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const moduleId = urlParams.get('id');

    if (moduleId && testsData[moduleId]) {
        startTest(moduleId);
    } else {
        renderTestSelection();
    }
}

// Render test selection page
function renderTestSelection() {
    const container = document.querySelector('.test-container');
    if (!container) return;

    const state = Storage.getState();

    container.innerHTML = `
    <div class="test-selection animate-fadeInUp">
      <h1>Выберите тест</h1>
      <p class="text-secondary">Проверьте свои знания после изучения модулей</p>
      
      <div class="test-cards">
        ${Object.entries(testsData).map(([id, test], index) => {
        const testResult = state.tests[id];
        const moduleProg = state.modules[id]?.progress || 0;
        const isLocked = moduleProg < 50;

        return `
            <div class="glass-card test-card ${isLocked ? 'locked' : ''} delay-${index + 1}" 
                 ${!isLocked ? `onclick="startTest('${id}')"` : ''}>
              <div class="test-card-icon">${ModulesData[id].icon}</div>
              <h3>${test.title}</h3>
              <p>${test.description}</p>
              <div class="test-card-meta">
                <span>📝 ${test.questions.length} вопросов</span>
                <span>⏱️ ~${Math.ceil(test.questions.length * 1.5)} мин</span>
              </div>
              ${testResult.passed ? `
                <div class="test-result-badge success">
                  ✅ Сдано: ${testResult.score}%
                </div>
              ` : testResult.attempts > 0 ? `
                <div class="test-result-badge fail">
                  Последний результат: ${testResult.score}%
                </div>
              ` : ''}
              ${isLocked ? `
                <div class="test-locked-overlay">
                  <span>🔒</span>
                  <p>Пройдите 50% модуля</p>
                </div>
              ` : `
                <button class="btn btn-primary">Начать тест</button>
              `}
            </div>
          `;
    }).join('')}
      </div>
    </div>
  `;
}

// Start a test
function startTest(moduleId) {
    const test = testsData[moduleId];
    if (!test) return;

    currentTest = {
        moduleId,
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

    const test = testsData[currentTest.moduleId];
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
    const test = testsData[currentTest.moduleId];
    const question = test.questions[currentTest.currentQuestion];
    const isCorrect = answerIndex === question.correct;

    // Store answer
    currentTest.answers.push({
        questionId: question.id,
        selected: answerIndex,
        correct: question.correct,
        isCorrect
    });

    // Show feedback
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === answerIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    // Show explanation
    const questionCard = document.querySelector('.question-card');
    const feedback = document.createElement('div');
    feedback.className = `answer-feedback ${isCorrect ? 'correct' : 'incorrect'} animate-fadeInUp`;
    feedback.innerHTML = `
    <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
    <div class="feedback-text">
      <strong>${isCorrect ? 'Правильно!' : 'Неправильно'}</strong>
      <p>${question.explanation}</p>
    </div>
  `;
    questionCard.appendChild(feedback);

    // Next button
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
    const test = testsData[currentTest.moduleId];

    if (currentTest.currentQuestion < test.questions.length - 1) {
        currentTest.currentQuestion++;
        renderQuestion();
    } else {
        finishTest();
    }
}

// Finish test and show results
function finishTest() {
    const container = document.querySelector('.test-container');
    if (!container) return;

    const test = testsData[currentTest.moduleId];
    const correctAnswers = currentTest.answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / test.questions.length) * 100);
    const passed = score >= test.passingScore;
    const timeTaken = Math.round((Date.now() - currentTest.startTime) / 1000);

    // Save results
    Storage.updateTestResults(currentTest.moduleId, score, passed);

    container.innerHTML = `
    <div class="test-results animate-fadeInUp">
      <div class="results-card glass-card-static">
        <div class="results-icon ${passed ? 'success' : 'fail'}">
          ${passed ? '🎉' : '📚'}
        </div>
        
        <h1 class="results-title">
          ${passed ? 'Поздравляем!' : 'Попробуйте ещё раз'}
        </h1>
        
        <p class="results-subtitle">
          ${passed
            ? 'Вы успешно прошли тест!'
            : `Для прохождения нужно набрать ${test.passingScore}%`}
        </p>
        
        <div class="results-score">
          <div class="score-circle ${passed ? 'success' : 'fail'}">
            <span class="score-value">${score}%</span>
          </div>
        </div>
        
        <div class="results-stats">
          <div class="result-stat">
            <span class="stat-value">${correctAnswers}/${test.questions.length}</span>
            <span class="stat-label">Правильных</span>
          </div>
          <div class="result-stat">
            <span class="stat-value">${formatTime(timeTaken)}</span>
            <span class="stat-label">Время</span>
          </div>
          <div class="result-stat">
            <span class="stat-value">${test.passingScore}%</span>
            <span class="stat-label">Проходной балл</span>
          </div>
        </div>
        
        <div class="results-actions">
          ${!passed ? `
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
      
      ${passed ? `
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
window.TestsData = testsData;
