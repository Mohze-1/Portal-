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