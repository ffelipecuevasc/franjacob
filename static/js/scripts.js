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
// Seleccionamos la sección completa para nuestro Observer Maestro
const hitosSection = document.getElementById('hitos');

if (hitosTrack && coverCards.length > 0 && hitosDotsContainer) {
    const dots = [];
    let currentIndex = 0;
    let autoplayInterval;
    const AUTOPLAY_DELAY = 4500;

    // --- FUNCIÓN MATEMÁTICA DE SCROLL HORIZONTAL (Aislado) ---
    const scrollToCard = (card) => {
        // Calculamos la posición X exacta para centrar la tarjeta en el contenedor
        const scrollPos = card.offsetLeft - (hitosTrack.offsetWidth / 2) + (card.offsetWidth / 2);

        // Desplazamos SOLO el contenedor interno, la página principal ni se entera
        hitosTrack.scrollTo({
            left: scrollPos,
            behavior: 'smooth'
        });
    };

    // 1. Generación dinámica de los Dots
    coverCards.forEach((card, index) => {
        const dot = document.createElement('button');
        dot.className = 'w-3 h-3 rounded-full bg-surface-variant dark:bg-dark-surface-variant transition-all duration-300 hover:bg-primary/50 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-surface';
        dot.setAttribute('aria-label', `Ir al hito ${index + 1}`);

        card.dataset.index = index;

        dot.addEventListener('click', () => {
            // Reemplazamos scrollIntoView por nuestra nueva función matemática
            scrollToCard(card);
        });

        hitosDotsContainer.appendChild(dot);
        dots.push(dot);
    });

    // 2. Observer de las Tarjetas (Sincronización Visual)
    const coverObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const index = parseInt(entry.target.dataset.index);

            if (entry.isIntersecting) {
                currentIndex = index;

                entry.target.classList.add('is-active');
                entry.target.setAttribute('aria-current', 'true');

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

    // 3. --- MOTOR DE AUTOPLAY SEGURO ---
    const startAutoplay = () => {
        // Evitamos crear múltiples intervalos si se dispara varias veces
        if (!autoplayInterval) {
            autoplayInterval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % coverCards.length;
                scrollToCard(coverCards[nextIndex]); // Usamos la nueva función
            }, AUTOPLAY_DELAY);
        }
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
        autoplayInterval = null; // Limpiamos la referencia
    };

    // 4. --- ESCUDOS DE INTERRUPCIÓN (INTERACCIÓN) ---
    hitosTrack.addEventListener('mouseenter', stopAutoplay);
    hitosTrack.addEventListener('mouseleave', startAutoplay);
    hitosTrack.addEventListener('focusin', stopAutoplay);
    hitosTrack.addEventListener('focusout', startAutoplay);
    hitosTrack.addEventListener('touchstart', stopAutoplay, { passive: true });
    hitosTrack.addEventListener('touchend', startAutoplay);

    // 5. --- OBSERVER MAESTRO (RENDIMIENTO Y UX) ---
    // Este observer vigila si el usuario está viendo la sección de hitos
    if (hitosSection) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Si la sección es visible (al menos un 20%), arranca el motor
                    startAutoplay();
                } else {
                    // Si el usuario sube a "Sobre Mí", apagamos el motor para ahorrar recursos y evitar bugs
                    stopAutoplay();
                }
            });
        }, {
            root: null,
            threshold: 0.2 // Se activa cuando el 20% de la sección es visible
        });

        sectionObserver.observe(hitosSection);
    } else {
        // Fallback por si no encuentra la sección
        startAutoplay();
    }
}