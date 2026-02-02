<?php
/**
 * CleanOS Academy — API Configuration
 * 
 * Общая конфигурация для всех API endpoints
 * Подготовлено для лёгкой миграции на БД
 */

// Включаем отображение ошибок для разработки
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS для локальной разработки
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Константы путей
define('API_DIR', __DIR__);
define('DATA_DIR', __DIR__ . '/data');
define('PROGRESS_DIR', DATA_DIR . '/progress');

// Создаём папку для прогресса если не существует
if (!file_exists(PROGRESS_DIR)) {
    mkdir(PROGRESS_DIR, 0755, true);
}

/**
 * Получить ID сессии пользователя
 * В будущем: заменить на user_id из авторизации
 */
function getSessionId(): string {
    session_start();
    if (!isset($_SESSION['academy_id'])) {
        $_SESSION['academy_id'] = 'user_' . bin2hex(random_bytes(8));
    }
    return $_SESSION['academy_id'];
}

/**
 * Отправить JSON-ответ
 */
function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

/**
 * Отправить ошибку
 */
function jsonError(string $message, int $status = 400): void {
    jsonResponse(['success' => false, 'error' => $message], $status);
}

/**
 * Получить данные из POST запроса
 */
function getPostData(): array {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    return is_array($data) ? $data : [];
}

// =====================================================
// Функции для работы с прогрессом (файловое хранение)
// =====================================================

/**
 * Получить прогресс пользователя
 * 
 * БУДУЩЕЕ (БД):
 * function getProgress($userId) {
 *     global $pdo;
 *     $stmt = $pdo->prepare("SELECT * FROM user_progress WHERE user_id = ?");
 *     $stmt->execute([$userId]);
 *     return $stmt->fetch(PDO::FETCH_ASSOC);
 * }
 */
function getProgress(string $sessionId): array {
    $file = PROGRESS_DIR . "/{$sessionId}.json";
    
    if (!file_exists($file)) {
        return getDefaultProgress();
    }
    
    $data = json_decode(file_get_contents($file), true);
    return is_array($data) ? array_merge(getDefaultProgress(), $data) : getDefaultProgress();
}

/**
 * Сохранить прогресс пользователя
 * 
 * БУДУЩЕЕ (БД):
 * function saveProgress($userId, $data) {
 *     global $pdo;
 *     $stmt = $pdo->prepare("UPDATE user_progress SET data = ? WHERE user_id = ?");
 *     $stmt->execute([json_encode($data), $userId]);
 * }
 */
function saveProgress(string $sessionId, array $data): bool {
    $file = PROGRESS_DIR . "/{$sessionId}.json";
    $result = file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    return $result !== false;
}

/**
 * Дефолтный прогресс нового пользователя
 */
function getDefaultProgress(): array {
    return [
        'modules' => [
            'module1' => ['progress' => 0, 'completed' => false, 'sections' => []],
            'module2' => ['progress' => 0, 'completed' => false, 'sections' => []],
            'module3' => ['progress' => 0, 'completed' => false, 'sections' => []]
        ],
        'tests' => [
            'module1' => ['score' => 0, 'passed' => false, 'attempts' => 0],
            'module2' => ['score' => 0, 'passed' => false, 'attempts' => 0],
            'module3' => ['score' => 0, 'passed' => false, 'attempts' => 0]
        ],
        'stats' => [
            'lastVisit' => null
        ]
    ];
}

/**
 * Рассчитать общий прогресс
 */
function calculateOverallProgress(array $progress): int {
    $modules = $progress['modules'] ?? [];
    if (empty($modules)) {
        return 0;
    }
    
    $totalProgress = 0;
    foreach ($modules as $module) {
        $totalProgress += $module['progress'] ?? 0;
    }
    
    return (int) round($totalProgress / count($modules));
}

/**
 * Рассчитать прогресс модуля
 */
function calculateModuleProgress(array $completedSections, int $totalSections): int {
    if ($totalSections === 0) {
        return 0;
    }
    return (int) round((count($completedSections) / $totalSections) * 100);
}
