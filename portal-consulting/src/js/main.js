// Oculta header instantáneamente al scrollear hacia abajo, muestra al subir (sin animaciones)
(function () {
    const header = document.querySelector('header');
    if (!header) return;
    let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
    const threshold = 60; // px antes de empezar a ocultar

    window.addEventListener('scroll', function () {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScroll && st > threshold) {
            // scroll down -> ocultar (sin animación)
            header.classList.add('header--hidden');
        } else if (st < lastScroll) {
            // scroll up -> mostrar
            header.classList.remove('header--hidden');
        }
        lastScroll = st <= 0 ? 0 : st;
    }, { passive: true });
})();

/* Reemplazo/añadido: manejo genérico de dropdowns (hover en dispositivos con pointer + click toggle accesible)
   con retardo en el cierre para evitar que se cierre antes de alcanzar el panel */
(function manageDropdowns() {
    const dropdowns = Array.from(document.querySelectorAll('.dropdown'));
    if (!dropdowns.length) return;

    function closeAll(except = null) {
        dropdowns.forEach(dd => {
            if (dd === except) return;
            const trig = dd.querySelector('.dropdown-trigger');
            const menu = dd.querySelector('.dropdown-content');
            dd.classList.remove('open');
            if (trig) trig.setAttribute('aria-expanded', 'false');
            if (menu) menu.setAttribute('aria-hidden', 'true');
        });
    }

    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-content');
        if (!trigger || !menu) return;

        // Ensure ARIA initial state
        trigger.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');

        let closeTimer = null;

        function openImmediate() {
            clearTimeout(closeTimer);
            dropdown.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
            menu.setAttribute('aria-hidden', 'false');
            closeAll(dropdown);
        }
        function closeImmediate() {
            dropdown.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
        }
        function closeDelayed(timeout = 180) {
            clearTimeout(closeTimer);
            closeTimer = setTimeout(() => closeImmediate(), timeout);
        }

        // Click toggles dropdown (stops propagation so document click doesn't immediately close it)
        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdown.classList.contains('open') ? closeImmediate() : openImmediate();
        });

        // Hover behavior only on devices that support hover (avoid interfering on touch)
        if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
            // open on enter, delay close on leave to give time to reach the panel
            dropdown.addEventListener('mouseenter', openImmediate);
            dropdown.addEventListener('mouseleave', () => closeDelayed(160));

            // keep open when mouse enters the menu itself
            menu.addEventListener('mouseenter', openImmediate);
            menu.addEventListener('mouseleave', () => closeDelayed(160));
        }
    });

    // Close when clicking outside any dropdown
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) closeAll();
    });

    // Close with Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAll();
    });
})();

/* Añade clase .active al link del nav que coincide con el archivo actual.
   También marca el trigger del dropdown si el link está dentro de un dropdown. */
(function markActiveNavItem(){
    try {
        const currentFile = (location.pathname.split('/').pop() || 'inicio.html').toLowerCase();
        document.querySelectorAll('nav a').forEach(a => {
            const href = a.getAttribute('href') || '';
            const linkFile = href.split('/').pop().split('?')[0].split('#')[0].toLowerCase();
            if (!linkFile) return;
            if (linkFile === currentFile) {
                a.classList.add('active');
                // si está dentro de un dropdown, marcar el trigger también
                const dropdownPanel = a.closest('.dropdown-content, .dropdown-panel');
                if (dropdownPanel) {
                    const parent = dropdownPanel.closest('.dropdown, .has-dropdown');
                    if (parent) {
                        const trigger = parent.querySelector('.dropdown-trigger');
                        trigger && trigger.classList.add('active');
                    }
                }
            }
        });
    } catch (e) {
        // silencioso en caso de error
        console.warn('markActiveNavItem error', e);
    }
})();

// Portfolio Filters
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            
            // Close all other accordion items
            accordionTriggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger) {
                    otherTrigger.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current accordion item
            trigger.setAttribute('aria-expanded', !isExpanded);
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // toggles para todos los dropdowns
    document.querySelectorAll('.dropdown').forEach(drop => {
        const btn = drop.querySelector('.dropdown-trigger');
        const menu = drop.querySelector('.dropdown-content');
        if (!btn || !menu) return;

        btn.addEventListener('click', (e) => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            // cerrar todos
            document.querySelectorAll('.dropdown .dropdown-content').forEach(m => m.classList.remove('show'));
            document.querySelectorAll('.dropdown .dropdown-trigger').forEach(b => b.setAttribute('aria-expanded', 'false'));
            // toggle actual
            if (!expanded) {
                menu.classList.add('show');
                btn.setAttribute('aria-expanded', 'true');
                menu.setAttribute('aria-hidden', 'false');
            } else {
                menu.classList.remove('show');
                btn.setAttribute('aria-expanded', 'false');
                menu.setAttribute('aria-hidden', 'true');
            }
        });
    });

    // cerrar dropdowns al click fuera o con ESC
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown .dropdown-content').forEach(m => m.classList.remove('show'));
            document.querySelectorAll('.dropdown .dropdown-trigger').forEach(b => b.setAttribute('aria-expanded', 'false'));
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown .dropdown-content').forEach(m => m.classList.remove('show'));
            document.querySelectorAll('.dropdown .dropdown-trigger').forEach(b => b.setAttribute('aria-expanded', 'false'));
        }
    });
});