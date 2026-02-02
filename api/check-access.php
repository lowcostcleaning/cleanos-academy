<?php
/**
 * CleanOS Academy — Access Check API
 * 
 * GET /api/check-access.php?type=test&module_id=module1
 * 
 * Проверяет доступ пользователя к тестам и другим ресурсам.
 * Для теста требуется 50% прогресса модуля.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/data/modules.php';

// Только GET запросы
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$type = $_GET['type'] ?? '';
$moduleId = $_GET['module_id'] ?? '';

if (!$type) {
    jsonError('type parameter is required');
}

switch ($type) {
    case 'test':
        checkTestAccess($moduleId);
        break;
    case 'module':
        checkModuleAccess($moduleId);
        break;
    default:
        jsonError('Unknown type: ' . $type);
}

/**
 * Проверить доступ к тесту
 * Требуется 50% прогресса модуля
 */
function checkTestAccess(string $moduleId): void
{
    global $modulesData;

    if (!$moduleId) {
        jsonError('module_id is required');
    }

    if (!isset($modulesData[$moduleId])) {
        jsonError('Module not found', 404);
    }

    $sessionId = getSessionId();
    $progress = getProgress($sessionId);
    $moduleProgress = $progress['modules'][$moduleId]['progress'] ?? 0;

    $requiredProgress = 50;
    $hasAccess = $moduleProgress >= $requiredProgress;

    $reason = null;
    if (!$hasAccess) {
        $reason = "Необходимо пройти {$requiredProgress}% модуля. Текущий прогресс: {$moduleProgress}%";
    }

    jsonResponse([
        'success' => true,
        'has_access' => $hasAccess,
        'reason' => $reason,
        'current_progress' => $moduleProgress,
        'required_progress' => $requiredProgress
    ]);
}

/**
 * Проверить доступ к модулю
 * Модули доступны всегда (в будущем можно добавить последовательную разблокировку)
 */
function checkModuleAccess(string $moduleId): void
{
    global $modulesData;

    if (!$moduleId) {
        jsonError('module_id is required');
    }

    if (!isset($modulesData[$moduleId])) {
        jsonError('Module not found', 404);
    }

    // Сейчас все модули доступны
    // В будущем здесь можно добавить логику:
    // - Последовательная разблокировка (нужно пройти предыдущий модуль)
    // - Проверка подписки
    // - Проверка роли пользователя

    jsonResponse([
        'success' => true,
        'has_access' => true,
        'reason' => null
    ]);
}
