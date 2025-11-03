// Hide header while scrolling down, show when scrolling up (sin animación)
(function () {
    const header = document.querySelector('header');
    if (!header) return;
    let lastScroll = 0;
    const threshold = 80;

    window.addEventListener('scroll', function () {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScroll && st > threshold) {
            // scrolldown -> hide
            header.classList.add('header--hidden');
        } else {
            // scrollup -> show
            header.classList.remove('header--hidden');
        }
        lastScroll = st <= 0 ? 0 : st;
    }, { passive: true });
})();