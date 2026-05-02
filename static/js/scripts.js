// Archivo: /static/js/scripts.js

document.addEventListener('DOMContentLoaded', () => {
    /* =======================================================
       1. GESTIÓN DEL TEMA (MODO CLARO / OSCURO)
       ======================================================= */
    const html = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Función para aplicar tema y cambiar el icono
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

    // Cargar preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    // Evento del botón para alternar el tema
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
    document.body.prepend(flashlight); // Lo inyectamos al principio del body

    window.addEventListener('mousemove', (e) => {
        // requestAnimationFrame sincroniza con el pintado de pantalla (60fps)
        requestAnimationFrame(() => {
            flashlight.style.setProperty('--x', `${e.clientX}px`);
            flashlight.style.setProperty('--y', `${e.clientY}px`);
        });
    });

    // Ocultar el efecto suavemente si el mouse sale de la ventana
    document.body.addEventListener('mouseleave', () => {
        flashlight.style.opacity = '0';
    });
    document.body.addEventListener('mouseenter', () => {
        flashlight.style.opacity = '1';
    });

    /* =======================================================
       3. MICROINTERACCIONES DE SCROLL (INTERSECTION OBSERVER)
       ======================================================= */
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            // Si el elemento entra al viewport (pantalla)
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); // Animamos solo 1 vez
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // El elemento debe estar 15% visible para detonar
    });

    // Buscamos todos los elementos con la clase y los ponemos en observación
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
});

    /* =======================================================
       4. BARRA DE PROGRESO DE LECTURA (NEÓN)
       ======================================================= */
const readingProgress = document.getElementById('reading-progress');

if (readingProgress) {
    let isScrolling = false;

    const updateScrollProgress = () => {
        // Distancia que el usuario ha scrolleado desde arriba
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Altura total del documento menos la altura visible de la ventana
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // Calculamos el porcentaje (de 0 a 100)
        const progress = (scrollTop / scrollHeight) * 100;

        // Actualizamos el ancho de la barra
        readingProgress.style.width = `${progress}%`;
    };

    // Escuchador de evento optimizado para evitar cuellos de botella (Jank)
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateScrollProgress();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // Forzamos el cálculo inicial por si la página se recarga a la mitad
    updateScrollProgress();
}