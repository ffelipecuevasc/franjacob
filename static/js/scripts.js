// Archivo: /static/js/scripts.js

/* =======================================================
   1. GESTIÓN DEL TEMA (MODO CLARO / OSCURO)
   ======================================================= */
const html = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

const applyTheme = (theme) => {
    if (theme === 'dark') {
        html.classList.add('dark');
        html.classList.remove('light');
        if (themeIcon) themeIcon.textContent = 'light_mode';
    } else {
        html.classList.add('light');
        html.classList.remove('dark');
        if (themeIcon) themeIcon.textContent = 'dark_mode';
    }
};

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        if (html.classList.contains('dark')) {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

/* =======================================================
   2. EFECTO LINTERNA (FLASHLIGHT OVERLAY)
   ======================================================= */
const flashlight = document.createElement('div');
flashlight.classList.add('flashlight-overlay');
document.body.prepend(flashlight);

window.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
        flashlight.style.setProperty('--x', `${e.clientX}px`);
        flashlight.style.setProperty('--y', `${e.clientY}px`);
    });
});

document.body.addEventListener('mouseleave', () => flashlight.style.opacity = '0');
document.body.addEventListener('mouseenter', () => flashlight.style.opacity = '1');

/* =======================================================
   3. MICROINTERACCIONES DE SCROLL (INTERSECTION OBSERVER)
   ======================================================= */
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
});

document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

/* =======================================================
   4. BARRA DE PROGRESO DE LECTURA (NEÓN)
   ======================================================= */
const readingProgress = document.getElementById('reading-progress');

if (readingProgress) {
    let isScrolling = false;

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        readingProgress.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateScrollProgress();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    updateScrollProgress();
} // <-- AQUÍ SE CIERRA CORRECTAMENTE EL IF

/* =======================================================
   5. NAVEGACIÓN SUAVE (SMOOTH SCROLL) CON OFFSET
   ======================================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);

        if (!targetId) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* =======================================================
   6. MOTOR COVER FLOW Y NAVEGACIÓN (HITOS PROFESIONALES)
   ======================================================= */
const hitosTrack = document.getElementById('hitos-track');
const coverCards = document.querySelectorAll('.cover-card');
const hitosDotsContainer = document.getElementById('hitos-dots');

if (hitosTrack && coverCards.length > 0 && hitosDotsContainer) {
    const dots = [];
    let currentIndex = 0; // Estado global para saber dónde estamos
    let autoplayInterval;
    const AUTOPLAY_DELAY = 4500; // 4.5 segundos (UX Premium)

    // 1. Generación dinámica de los Dots
    coverCards.forEach((card, index) => {
        // ... (Tu código actual para crear los dots se mantiene igual)
        const dot = document.createElement('button');
        dot.className = 'w-3 h-3 rounded-full bg-surface-variant dark:bg-dark-surface-variant transition-all duration-300 hover:bg-primary/50 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-surface';
        dot.setAttribute('aria-label', `Ir al hito ${index + 1}`);

        // Optimización: inyectamos el dataset index a la tarjeta para no usar indexOf en el observer
        card.dataset.index = index;

        dot.addEventListener('click', () => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });

        hitosDotsContainer.appendChild(dot);
        dots.push(dot);
    });

    // 2. Observer (Ligeramente modificado para sincronizar el Autoplay)
    const coverObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Recuperamos el índice en O(1) gracias al dataset que inyectamos arriba
            const index = parseInt(entry.target.dataset.index);

            if (entry.isIntersecting) {
                currentIndex = index; // Sincronizamos el estado lógico

                entry.target.classList.add('is-active');
                entry.target.setAttribute('aria-current', 'true'); // A11y

                if(dots[index]) {
                    dots[index].classList.remove('bg-surface-variant', 'dark:bg-dark-surface-variant');
                    dots[index].classList.add('bg-primary', 'dark:bg-dark-primary', 'scale-125');
                }
            } else {
                entry.target.classList.remove('is-active');
                entry.target.removeAttribute('aria-current');

                if(dots[index]) {
                    dots[index].classList.remove('bg-primary', 'dark:bg-dark-primary', 'scale-125');
                    dots[index].classList.add('bg-surface-variant', 'dark:bg-dark-surface-variant');
                }
            }
        });
    }, {
        root: hitosTrack,
        rootMargin: '0px -45% 0px -45%',
        threshold: 0
    });

    coverCards.forEach(card => coverObserver.observe(card));

    // 3. --- NUEVO MOTOR DE AUTOPLAY ---
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            // Matemática circular: si llega a la última tarjeta, vuelve a la 0
            const nextIndex = (currentIndex + 1) % coverCards.length;
            coverCards[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, AUTOPLAY_DELAY);
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };

    // 4. --- ESCUDOS DE INTERRUPCIÓN (PAUSA EN INTERACCIÓN) ---
    // Mouse (Desktop)
    hitosTrack.addEventListener('mouseenter', stopAutoplay);
    hitosTrack.addEventListener('mouseleave', startAutoplay);

    // Teclado (Accesibilidad)
    hitosTrack.addEventListener('focusin', stopAutoplay);
    hitosTrack.addEventListener('focusout', startAutoplay);

    // Táctil (Móviles)
    hitosTrack.addEventListener('touchstart', stopAutoplay, { passive: true });
    hitosTrack.addEventListener('touchend', startAutoplay);

    // Iniciar el ciclo por primera vez
    startAutoplay();
}