/* ===========================================
   CleanOS Academy — API Client
   Fetch-обёртка для работы с PHP API
   =========================================== */

const API_BASE = '/api';

const API = {
    /**
     * Получить список модулей
     */
    async getModules() {
        try {
            const response = await fetch(`${API_BASE}/modules.php`);
            return await response.json();
        } catch (error) {
            console.error('API Error (getModules):', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Получить данные модуля с секциями
     */
    async getModule(moduleId) {
        try {
            const response = await fetch(`${API_BASE}/modules.php?id=${encodeURIComponent(moduleId)}`);
            return await response.json();
        } catch (error) {
            console.error('API Error (getModule):', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Получить список тестов
     */
    async getTests() {
        try {
            const response = await fetch(`${API_BASE}/tests.php`);
            return await response.json();
        } catch (error) {
            console.error('API Error (getTests):', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Получить вопросы теста
     */
    async getTest(moduleId) {
        try {
            const response = await fetch(`${API_BASE}/tests.php?id=${encodeURIComponent(moduleId)}`);
            return await response.json();
        } catch (error) {
            console.error('API Error (getTest):', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Получить прогресс пользователя
     */
    async getProgress() {
        try {
            const response = await fetch(`${API_BASE}/progress.php`);
            return await response.json();
        } catch (error) {
            console.error('API Error (getProgress):', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Отметить секцию как прочитанную
     */
    async completeSection(moduleId, sectionId) {
        try {
            const response = await fetch(`${API_BASE}/progress.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'complete_section',
                    module_id: moduleId,
                    section_id: sectionId
                })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (completeSection):', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Отправить результаты теста
     */
    async submitTest(moduleId, answers) {
        try {
            const response = await fetch(`${API_BASE}/progress.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'submit_test',
                    module_id: moduleId,
                    answers: answers
                })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (submitTest):', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Проверить доступ к тесту
     */
    async checkTestAccess(moduleId) {
        try {
            const response = await fetch(
                `${API_BASE}/check-access.php?type=test&module_id=${encodeURIComponent(moduleId)}`
            );
            return await response.json();
        } catch (error) {
            console.error('API Error (checkTestAccess):', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Обновить время визита
     */
    async updateVisit() {
        try {
            const response = await fetch(`${API_BASE}/progress.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update_visit' })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (updateVisit):', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Сбросить прогресс
     */
    async resetProgress() {
        try {
            const response = await fetch(`${API_BASE}/progress.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reset' })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (resetProgress):', error);
            return { success: false, error: error.message };
        }
    }
};

// Export for global use
window.API = API;
