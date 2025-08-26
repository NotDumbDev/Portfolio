function switchTab(tabName) {
    const loadingBar = document.getElementById('loadingBar');
    loadingBar.style.transform = 'scaleX(1)';

    setTimeout(() => {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');

        if (tabName === 'statistics') {
            setTimeout(() => {
                animateStats();
            }, 300);
        }

        loadingBar.style.transform = 'scaleX(0)';
    }, 200);
}

function animateCounter(element, target, duration = 2000, suffix = '') {
    let start = 0;
    const startTime = Date.now();
    
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        return num.toString();
    }
    
    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);
        
        if (target === 4500000) {
            element.textContent = formatNumber(current);
        } else if (target === 10000) {
            element.textContent = formatNumber(current) + suffix;
        } else {
            element.textContent = current + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            if (target === 4500000) {
                element.textContent = '4.5M';
            } else if (target === 10000) {
                element.textContent = '10k€';
            } else {
                element.textContent = target + suffix;
            }
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate');
        }, index * 200);
    });
    
    statNumbers.forEach((element, index) => {
        setTimeout(() => {
            const target = parseInt(element.getAttribute('data-target'));
            let suffix = '';
            
            if (target === 10000) {
                suffix = '€';
            }
            
            animateCounter(element, target, 2500, suffix);
        }, index * 300 + 500);
    });
}

document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = tab.getAttribute('data-tab');
        switchTab(tabName);

        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });

    tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        }
    });
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('stats-grid')) {
            const statsTab = document.getElementById('statistics');
            if (statsTab && statsTab.classList.contains('active')) {
                setTimeout(() => {
                    animateStats();
                }, 200);
            }
        }
    });
}, {
    threshold: 0.3
});

document.querySelectorAll('.skill-card, .portfolio-item, .testimonial-card, .contact-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

document.addEventListener('DOMContentLoaded', () => {
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        statsObserver.observe(statsGrid);
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


const glowStyle = document.createElement('style');
glowStyle.textContent = `
    @keyframes iconGlow {
        0% { filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.3)); }
        100% { filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.8)); }
    }
`;
document.head.appendChild(glowStyle);

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.querySelectorAll('.container > *').forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in');
    });
});

const entranceStyle = document.createElement('style');
entranceStyle.textContent = `
            body {
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            
            .fade-in {
                animation: fadeInUp 0.8s ease forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
document.head.appendChild(entranceStyle);

console.log("why you spying here");