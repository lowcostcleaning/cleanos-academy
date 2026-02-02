<?php
/**
 * CleanOS Academy — Progress API
 * 
 * GET  /api/progress.php — получить прогресс пользователя
 * POST /api/progress.php — обновить прогресс
 * 
 * POST actions:
 *   - complete_section: отметить секцию как прочитанную
 *   - submit_test: сохранить результат теста
 *   - reset: сбросить весь прогресс
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/data/modules.php';
require_once __DIR__ . '/data/tests.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetProgress();
        break;
    case 'POST':
        handlePostProgress();
        break;
    default:
        jsonError('Method not allowed', 405);
}

/**
 * Получить прогресс пользователя
 */
function handleGetProgress(): void
{
    global $modulesData;

    $sessionId = getSessionId();
    $progress = getProgress($sessionId);

    // Добавляем статистику
    $completedModules = 0;
    $passedTests = 0;
    $totalScore = 0;
    $testCount = 0;

    foreach ($progress['modules'] as $module) {
        if ($module['completed'] ?? false) {
            $completedModules++;
        }
    }

    foreach ($progress['tests'] as $test) {
        if ($test['passed'] ?? false) {
            $passedTests++;
        }
        $totalScore += $test['score'] ?? 0;
        $testCount++;
    }

    $avgScore = $testCount > 0 ? round($totalScore / $testCount) : 0;

    jsonResponse([
        'success' => true,
        'progress' => $progress,
        'stats' => [
            'overallProgress' => calculateOverallProgress($progress),
            'completedModules' => $completedModules,
            'totalModules' => count($modulesData),
            'passedTests' => $passedTests,
            'totalTests' => count($progress['tests']),
            'avgScore' => $avgScore
        ]
    ]);
}

/**
 * Обновить прогресс
 */
function handlePostProgress(): void
{
    $data = getPostData();
    $action = $data['action'] ?? '';

    switch ($action) {
        case 'complete_section':
            completeSection($data);
            break;
        case 'submit_test':
            submitTest($data);
            break;
        case 'reset':
            resetProgress();
            break;
        case 'update_visit':
            updateVisit();
            break;
        default:
            jsonError('Unknown action: ' . $action);
    }
}

/**
 * Отметить секцию как прочитанную
 */
function completeSection(array $data): void
{
    global $modulesData;

    $moduleId = $data['module_id'] ?? '';
    $sectionId = $data['section_id'] ?? '';

    if (!$moduleId || !$sectionId) {
        jsonError('module_id and section_id are required');
    }

    if (!isset($modulesData[$moduleId])) {
        jsonError('Module not found', 404);
    }

    $sessionId = getSessionId();
    $progress = getProgress($sessionId);

    // Инициализируем модуль если нужно
    if (!isset($progress['modules'][$moduleId])) {
        $progress['modules'][$moduleId] = [
            'progress' => 0,
            'completed' => false,
            'sections' => []
        ];
    }

    // Добавляем секцию если ещё не добавлена
    if (!in_array($sectionId, $progress['modules'][$moduleId]['sections'])) {
        $progress['modules'][$moduleId]['sections'][] = $sectionId;
    }

    // Рассчитываем прогресс модуля
    $totalSections = count($modulesData[$moduleId]['sections']);
    $completedSections = count($progress['modules'][$moduleId]['sections']);
    $progress['modules'][$moduleId]['progress'] = calculateModuleProgress(
        $progress['modules'][$moduleId]['sections'],
        $totalSections
    );
    $progress['modules'][$moduleId]['completed'] = $progress['modules'][$moduleId]['progress'] >= 100;

    saveProgress($sessionId, $progress);

    // Определяем следующую секцию
    $nextSection = null;
    $sections = $modulesData[$moduleId]['sections'];
    $currentIndex = array_search($sectionId, array_column($sections, 'id'));
    if ($currentIndex !== false && $currentIndex < count($sections) - 1) {
        $nextSection = $sections[$currentIndex + 1]['id'];
    }

    jsonResponse([
        'success' => true,
        'moduleProgress' => $progress['modules'][$moduleId]['progress'],
        'moduleCompleted' => $progress['modules'][$moduleId]['completed'],
        'overallProgress' => calculateOverallProgress($progress),
        'nextSection' => $nextSection
    ]);
}

/**
 * Сохранить результат теста
 */
function submitTest(array $data): void
{
    global $testsData;

    $moduleId = $data['module_id'] ?? '';
    $answers = $data['answers'] ?? [];

    if (!$moduleId) {
        jsonError('module_id is required');
    }

    if (!isset($testsData[$moduleId])) {
        jsonError('Test not found', 404);
    }

    $test = $testsData[$moduleId];
    $questions = $test['questions'];

    // Проверяем ответы
    $correctCount = 0;
    $results = [];

    foreach ($answers as $answer) {
        $questionId = $answer['question_id'] ?? 0;
        $selectedOption = $answer['selected'] ?? -1;

        // Находим вопрос
        $question = null;
        foreach ($questions as $q) {
            if ($q['id'] == $questionId) {
                $question = $q;
                break;
            }
        }

        if ($question) {
            $isCorrect = $selectedOption === $question['correct'];
            if ($isCorrect) {
                $correctCount++;
            }

            $results[] = [
                'question_id' => $questionId,
                'selected' => $selectedOption,
                'correct' => $question['correct'],
                'is_correct' => $isCorrect,
                'explanation' => $question['explanation']
            ];
        }
    }

    // Рассчитываем результат
    $score = count($questions) > 0 ? round(($correctCount / count($questions)) * 100) : 0;
    $passed = $score >= $test['passingScore'];

    // Сохраняем результат
    $sessionId = getSessionId();
    $progress = getProgress($sessionId);

    if (!isset($progress['tests'][$moduleId])) {
        $progress['tests'][$moduleId] = ['score' => 0, 'passed' => false, 'attempts' => 0];
    }

    $progress['tests'][$moduleId]['score'] = $score;
    $progress['tests'][$moduleId]['passed'] = $passed;
    $progress['tests'][$moduleId]['attempts']++;

    saveProgress($sessionId, $progress);

    jsonResponse([
        'success' => true,
        'score' => $score,
        'passed' => $passed,
        'correctCount' => $correctCount,
        'totalQuestions' => count($questions),
        'passingScore' => $test['passingScore'],
        'attempts' => $progress['tests'][$moduleId]['attempts'],
        'results' => $results
    ]);
}

/**
 * Сбросить прогресс
 */
function resetProgress(): void
{
    $sessionId = getSessionId();
    saveProgress($sessionId, getDefaultProgress());

    jsonResponse([
        'success' => true,
        'message' => 'Progress reset successfully'
    ]);
}

/**
 * Обновить время последнего визита
 */
function updateVisit(): void
{
    $sessionId = getSessionId();
    $progress = getProgress($sessionId);
    $progress['stats']['lastVisit'] = date('c');
    saveProgress($sessionId, $progress);

    jsonResponse([
        'success' => true
    ]);
}
