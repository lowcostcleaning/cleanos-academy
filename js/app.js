/* ===========================================
   CleanOS Academy — Main Application
   =========================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize app
    initApp();
});

function initApp() {
    // Update last visit
    Storage.updateLastVisit();

    // Render components based on current page
    const page = document.body.dataset.page || 'home';

    switch (page) {
        case 'home':
            renderHomePage();
            break;
        case 'module':
            renderModulePage();
            break;
        case 'test':
            renderTestPage();
            break;
        case 'podcasts':
            renderPodcastsPage();
            break;
    }

    // Setup common interactions
    setupSidebar();
    setupAnimations();
}

// ===== Home Page =====
function renderHomePage() {
    const state = Storage.getState();
    const overallProgress = Storage.getOverallProgress();

    // Update hero progress
    const progressCircle = document.querySelector('.hero-progress-circle .fill');
    const progressValue = document.querySelector('.hero-progress-value');

    if (progressCircle) {
        progressCircle.style.setProperty('--progress', overallProgress);
    }
    if (progressValue) {
        progressValue.textContent = overallProgress + '%';
    }

    // Render module cards
    renderModuleCards(state);

    // Update stats
    updateStats(state);
}

function renderModuleCards(state) {
    const container = document.querySelector('.modules-grid');
    if (!container) return;

    const modules = Object.values(ModulesData);

    container.innerHTML = modules.map((module, index) => {
        const progress = state.modules[module.id]?.progress || 0;
        const status = progress === 0 ? 'new' : progress >= 100 ? 'complete' : 'progress';
        const statusText = { new: 'Новый', progress: 'В процессе', complete: 'Завершён' };
        const btnText = progress === 0 ? 'Начать' : progress >= 100 ? 'Повторить' : 'Продолжить';

        return `
      <div class="glass-card module-card animate-fadeInUp delay-${index + 1}" onclick="goToModule('${module.id}')">
        <div class="module-card-header">
          <div class="module-card-icon">${module.icon}</div>
          <span class="badge badge-${status}">${statusText[status]}</span>
        </div>
        <h3 class="module-card-title">${module.title}</h3>
        <p class="module-card-description">${module.description}</p>
        <div class="module-card-footer">
          <div class="module-card-progress">
            <div class="module-card-progress-text">${progress}% завершено</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
          </div>
          <button class="btn btn-primary module-card-btn">${btnText}</button>
        </div>
      </div>
    `;
    }).join('');
}

function updateStats(state) {
    const completedModules = Object.values(state.modules).filter(m => m.completed).length;
    const passedTests = Object.values(state.tests).filter(t => t.passed).length;
    const avgScore = Object.values(state.tests).reduce((sum, t) => sum + t.score, 0) / 3;

    const statsElements = document.querySelectorAll('.stat-card-value');
    if (statsElements[0]) statsElements[0].textContent = completedModules + '/3';
    if (statsElements[1]) statsElements[1].textContent = passedTests + '/3';
    if (statsElements[2]) statsElements[2].textContent = Math.round(avgScore) + '%';
}

// ===== Module Page =====
function renderModulePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const moduleId = urlParams.get('id') || 'module1';
    const module = ModulesData[moduleId];

    if (!module) {
        window.location.href = 'index.html';
        return;
    }

    // Set module title
    document.querySelector('.module-title').textContent = module.title;
    document.querySelector('.module-icon').textContent = module.icon;

    // Render sidebar navigation
    renderModuleSidebar(module);

    // Render first section or from URL
    const sectionId = urlParams.get('section') || module.sections[0].id;
    renderSection(module, sectionId);

    // Setup navigation
    setupModuleNavigation(module);
}

function renderModuleSidebar(module) {
    const container = document.querySelector('.module-nav');
    if (!container) return;

    const state = Storage.getState();
    const completedSections = state.modules[module.id]?.sections || [];

    container.innerHTML = module.sections.map((section, index) => {
        const isCompleted = completedSections.includes(section.id);
        const urlParams = new URLSearchParams(window.location.search);
        const currentSection = urlParams.get('section') || module.sections[0].id;
        const isActive = section.id === currentSection;

        return `
      <a href="?id=${module.id}&section=${section.id}" 
         class="module-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
         data-section="${section.id}">
        <span class="module-nav-number">${index + 1}</span>
        <span class="module-nav-title">${section.title}</span>
        ${isCompleted ? '<span class="module-nav-check">✓</span>' : ''}
      </a>
    `;
    }).join('');
}

function renderSection(module, sectionId) {
    const section = module.sections.find(s => s.id === sectionId);
    if (!section) return;

    const container = document.querySelector('.module-content');
    if (!container) return;

    container.innerHTML = `
    <div class="section-content animate-fadeIn">
      ${section.content}
    </div>
    <div class="section-footer">
      <button class="btn btn-primary" onclick="markSectionComplete('${module.id}', '${sectionId}')">
        Отметить как прочитано ✓
      </button>
    </div>
  `;

    // Update progress indicator
    const currentIndex = module.sections.findIndex(s => s.id === sectionId);
    const progressPercent = ((currentIndex + 1) / module.sections.length) * 100;

    const progressBar = document.querySelector('.reading-progress-fill');
    if (progressBar) {
        progressBar.style.width = progressPercent + '%';
    }
}

function setupModuleNavigation(module) {
    // Add click handlers to nav items
    document.querySelectorAll('.module-nav-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.dataset.section;

            // Update URL
            const url = new URL(window.location);
            url.searchParams.set('section', sectionId);
            window.history.pushState({}, '', url);

            // Update active state
            document.querySelectorAll('.module-nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Render section
            renderSection(module, sectionId);
        });
    });
}

// ===== Section Completion =====
window.markSectionComplete = function (moduleId, sectionId) {
    const state = Storage.getState();
    const module = state.modules[moduleId];

    if (!module.sections) {
        module.sections = [];
    }

    if (!module.sections.includes(sectionId)) {
        module.sections.push(sectionId);
    }

    // Calculate progress
    const totalSections = ModulesData[moduleId].sections.length;
    const completedSections = module.sections.length;
    module.progress = Math.round((completedSections / totalSections) * 100);
    module.completed = module.progress >= 100;

    Storage.saveState(state);

    // Update UI
    const navItem = document.querySelector(`.module-nav-item[data-section="${sectionId}"]`);
    if (navItem) {
        navItem.classList.add('completed');
        if (!navItem.querySelector('.module-nav-check')) {
            navItem.innerHTML += '<span class="module-nav-check">✓</span>';
        }
    }

    // Show feedback
    showToast('Раздел отмечен как прочитанный! ✓');

    // Auto-navigate to next section
    const moduleData = ModulesData[moduleId];
    const currentIndex = moduleData.sections.findIndex(s => s.id === sectionId);
    if (currentIndex < moduleData.sections.length - 1) {
        const nextSection = moduleData.sections[currentIndex + 1];
        setTimeout(() => {
            const nextNav = document.querySelector(`.module-nav-item[data-section="${nextSection.id}"]`);
            if (nextNav) nextNav.click();
        }, 500);
    } else if (module.progress >= 100) {
        // Module complete!
        showToast('🎉 Поздравляем! Модуль завершён!', 'success');
    }
};

// ===== Navigation =====
window.goToModule = function (moduleId) {
    window.location.href = `module.html?id=${moduleId}`;
};

window.goToTest = function (moduleId) {
    window.location.href = `test.html?id=${moduleId}`;
};

// ===== Sidebar =====
function setupSidebar() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay?.classList.toggle('show');
        });

        overlay?.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    }

    // Set active nav item
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===== Animations =====
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;

    // Add styles if not exist
    if (!document.querySelector('#toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
      .toast {
        position: fixed;
        bottom: 32px;
        right: 32px;
        padding: 16px 24px;
        background: var(--bg-card);
        backdrop-filter: blur(20px);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        color: var(--text-primary);
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
      }
      .toast-success {
        border-color: var(--color-success);
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
      }
      @keyframes slideInRight {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        to { opacity: 0; transform: translateX(20px); }
      }
    `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Export for global use
window.showToast = showToast;
