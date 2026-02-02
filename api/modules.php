<?php
/**
 * CleanOS Academy — Modules API
 * 
 * GET /api/modules.php           — список всех модулей
 * GET /api/modules.php?id=module1 — данные конкретного модуля
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/data/modules.php';

// Только GET запросы
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$moduleId = $_GET['id'] ?? null;

if ($moduleId) {
    // Получить конкретный модуль
    getModule($moduleId);
} else {
    // Получить список всех модулей
    getModulesList();
}

/**
 * Список модулей (без полного контента секций)
 */
function getModulesList(): void
{
    global $modulesData;

    $sessionId = getSessionId();
    $progress = getProgress($sessionId);

    $modules = [];
    foreach ($modulesData as $id => $module) {
        $moduleProgress = $progress['modules'][$id] ?? ['progress' => 0, 'completed' => false];

        $modules[] = [
            'id' => $module['id'],
            'title' => $module['title'],
            'description' => $module['description'],
            'icon' => $module['icon'],
            'color' => $module['color'],
            'sectionsCount' => count($module['sections']),
            'progress' => $moduleProgress['progress'],
            'completed' => $moduleProgress['completed']
        ];
    }

    $overallProgress = calculateOverallProgress($progress);

    jsonResponse([
        'success' => true,
        'modules' => $modules,
        'overallProgress' => $overallProgress
    ]);
}

/**
 * Полные данные модуля с секциями
 */
function getModule(string $moduleId): void
{
    global $modulesData;

    if (!isset($modulesData[$moduleId])) {
        jsonError('Module not found', 404);
    }

    $module = $modulesData[$moduleId];

    // Получаем прогресс пользователя
    $sessionId = getSessionId();
    $progress = getProgress($sessionId);
    $moduleProgress = $progress['modules'][$moduleId] ?? ['progress' => 0, 'completed' => false, 'sections' => []];

    // Добавляем информацию о завершённых секциях
    $sections = [];
    foreach ($module['sections'] as $section) {
        $sections[] = [
            'id' => $section['id'],
            'title' => $section['title'],
            'content' => $section['content'],
            'completed' => in_array($section['id'], $moduleProgress['sections'] ?? [])
        ];
    }

    jsonResponse([
        'success' => true,
        'module' => [
            'id' => $module['id'],
            'title' => $module['title'],
            'description' => $module['description'],
            'icon' => $module['icon'],
            'color' => $module['color'],
            'sections' => $sections,
            'progress' => $moduleProgress['progress'],
            'completed' => $moduleProgress['completed']
        ]
    ]);
}
