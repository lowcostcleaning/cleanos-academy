<?php
/**
 * CleanOS Academy — Tests API
 * 
 * GET /api/tests.php              — список всех тестов
 * GET /api/tests.php?id=module1   — вопросы конкретного теста
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/data/tests.php';
require_once __DIR__ . '/data/modules.php';

// Только GET запросы
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$moduleId = $_GET['id'] ?? null;

if ($moduleId) {
    getTest($moduleId);
} else {
    getTestsList();
}

/**
 * Список тестов с прогрессом пользователя
 */
function getTestsList(): void
{
    global $testsData, $modulesData;

    $sessionId = getSessionId();
    $progress = getProgress($sessionId);

    $tests = [];
    foreach ($testsData as $id => $test) {
        $testProgress = $progress['tests'][$id] ?? ['score' => 0, 'passed' => false, 'attempts' => 0];
        $moduleProgress = $progress['modules'][$id]['progress'] ?? 0;
        $isLocked = $moduleProgress < 50;

        $tests[] = [
            'id' => $id,
            'title' => $test['title'],
            'description' => $test['description'],
            'questionsCount' => count($test['questions']),
            'passingScore' => $test['passingScore'],
            'icon' => $modulesData[$id]['icon'] ?? '📝',
            'score' => $testProgress['score'],
            'passed' => $testProgress['passed'],
            'attempts' => $testProgress['attempts'],
            'isLocked' => $isLocked,
            'moduleProgress' => $moduleProgress
        ];
    }

    jsonResponse([
        'success' => true,
        'tests' => $tests
    ]);
}

/**
 * Вопросы теста (без правильных ответов!)
 */
function getTest(string $moduleId): void
{
    global $testsData, $modulesData;

    if (!isset($testsData[$moduleId])) {
        jsonError('Test not found', 404);
    }

    // Проверяем доступ (50% модуля)
    $sessionId = getSessionId();
    $progress = getProgress($sessionId);
    $moduleProgress = $progress['modules'][$moduleId]['progress'] ?? 0;

    if ($moduleProgress < 50) {
        jsonError('Необходимо пройти 50% модуля для доступа к тесту', 403);
    }

    $test = $testsData[$moduleId];

    // Возвращаем вопросы БЕЗ правильных ответов (безопасность!)
    $questions = [];
    foreach ($test['questions'] as $q) {
        $questions[] = [
            'id' => $q['id'],
            'question' => $q['question'],
            'options' => $q['options']
            // НЕ включаем 'correct' и 'explanation'
        ];
    }

    jsonResponse([
        'success' => true,
        'test' => [
            'id' => $moduleId,
            'title' => $test['title'],
            'description' => $test['description'],
            'passingScore' => $test['passingScore'],
            'icon' => $modulesData[$moduleId]['icon'] ?? '📝',
            'questions' => $questions
        ]
    ]);
}
