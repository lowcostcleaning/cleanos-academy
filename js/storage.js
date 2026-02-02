/* ===========================================
   CleanOS Academy — Storage Utility
   LocalStorage management for progress tracking
   =========================================== */

const STORAGE_KEY = 'cleanos_academy';

// Default state
const defaultState = {
    user: {
        name: 'Клинер',
        avatar: 'К'
    },
    modules: {
        module1: {
            id: 'module1',
            title: 'Регламент уборки',
            progress: 0,
            completed: false,
            sections: []
        },
        module2: {
            id: 'module2',
            title: 'Химия для уборок',
            progress: 0,
            completed: false,
            sections: []
        },
        module3: {
            id: 'module3',
            title: 'Инвентарь',
            progress: 0,
            completed: false,
            sections: []
        }
    },
    tests: {
        module1: { score: 0, passed: false, attempts: 0 },
        module2: { score: 0, passed: false, attempts: 0 },
        module3: { score: 0, passed: false, attempts: 0 }
    },
    podcasts: {
        currentEpisode: null,
        currentTime: 0,
        completed: []
    },
    stats: {
        totalTimeSpent: 0,
        lastVisit: null
    }
};

// Get state from storage
function getState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return { ...defaultState };
    } catch (e) {
        console.error('Error reading from storage:', e);
        return { ...defaultState };
    }
}

// Save state to storage
function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
    } catch (e) {
        console.error('Error saving to storage:', e);
        return false;
    }
}

// Update specific part of state
function updateState(path, value) {
    const state = getState();
    const keys = path.split('.');
    let current = state;

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    saveState(state);
    return state;
}

// Get overall progress percentage
function getOverallProgress() {
    const state = getState();
    const modules = Object.values(state.modules);
    const totalProgress = modules.reduce((sum, m) => sum + m.progress, 0);
    return Math.round(totalProgress / modules.length);
}

// Update module progress
function updateModuleProgress(moduleId, progress) {
    const state = getState();
    if (state.modules[moduleId]) {
        state.modules[moduleId].progress = progress;
        state.modules[moduleId].completed = progress >= 100;
        saveState(state);
    }
    return state;
}

// Update test results
function updateTestResults(moduleId, score, passed) {
    const state = getState();
    if (state.tests[moduleId]) {
        state.tests[moduleId].score = score;
        state.tests[moduleId].passed = passed;
        state.tests[moduleId].attempts++;
        saveState(state);
    }
    return state;
}

// Update podcast progress
function updatePodcastProgress(episodeId, currentTime) {
    const state = getState();
    state.podcasts.currentEpisode = episodeId;
    state.podcasts.currentTime = currentTime;
    saveState(state);
    return state;
}

// Mark podcast as completed
function markPodcastCompleted(episodeId) {
    const state = getState();
    if (!state.podcasts.completed.includes(episodeId)) {
        state.podcasts.completed.push(episodeId);
        saveState(state);
    }
    return state;
}

// Update last visit
function updateLastVisit() {
    const state = getState();
    state.stats.lastVisit = new Date().toISOString();
    saveState(state);
    return state;
}

// Reset all progress
function resetProgress() {
    saveState({ ...defaultState });
    return defaultState;
}

// Export functions
window.Storage = {
    getState,
    saveState,
    updateState,
    getOverallProgress,
    updateModuleProgress,
    updateTestResults,
    updatePodcastProgress,
    markPodcastCompleted,
    updateLastVisit,
    resetProgress
};
