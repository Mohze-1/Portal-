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

(function () {
    const dropdown = document.getElementById('dropdown-why');
    if (!dropdown) return;

    const trigger = dropdown.querySelector('.dropdown-trigger');
    const menu = dropdown.querySelector('.dropdown-content');

    function openDropdown() {
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
    }

    function closeDropdown() {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
    }

    trigger.addEventListener('click', function (e) {
        const isOpen = dropdown.classList.contains('open');
        isOpen ? closeDropdown() : openDropdown();
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', function (e) {
        if (!dropdown.contains(e.target)) closeDropdown();
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDropdown();
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