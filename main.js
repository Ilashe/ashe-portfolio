// Progressive enhancement: content is fully visible without JavaScript.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
    // Reveal elements as they scroll into view
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var revealer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        items.forEach(function (el) { revealer.observe(el); });
    }

    // Highlight the nav link for the section in view
    var links = document.querySelectorAll('.nav-link');
    var sections = ['about', 'skills', 'certifications', 'connect']
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);
    if ('IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (link) {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { spy.observe(s); });
    }
});
