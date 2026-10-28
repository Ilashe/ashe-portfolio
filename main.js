// Progressive enhancement: content is fully visible without JavaScript.
document.documentElement.classList.add('js');

var LINKEDIN = 'https://www.linkedin.com/in/ashe-s-a5156119a';
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', function () {
    setupReveal();
    setupScrollSpy();
    setupMobileMenu();
    setupTyper();
    setupCountUp();
    setupSpotlight();
    setupPhishGame();
    setupPalette();
    setupLightbox();
    sayHello();
});

// Reveal elements as they scroll into view
function setupReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }
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
function setupScrollSpy() {
    var links = document.querySelectorAll('.nav-link');
    var sections = ['home', 'projects', 'about', 'skills', 'certifications', 'connect']
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;
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

// The phone menu opens with the native popover attribute; close it after a link is tapped
function setupMobileMenu() {
    var menu = document.getElementById('mobile-menu');
    if (!menu || !menu.hidePopover) return;
    menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) menu.hidePopover();
    });
}

// Hero line types itself out: "I build secure AI products / cloud cost tools / ..."
function setupTyper() {
    var el = document.querySelector('.typer');
    if (!el || reduceMotion) return;
    var words = el.getAttribute('data-words').split('|');
    var word = 0;
    var chars = words[0].length;
    var deleting = true;
    el.classList.add('is-typing');

    function tick() {
        if (document.hidden) return setTimeout(tick, 500);
        if (deleting) {
            chars--;
            if (chars === 0) {
                deleting = false;
                word = (word + 1) % words.length;
            }
        } else {
            chars++;
        }
        el.textContent = words[word].slice(0, chars);
        if (!deleting && chars === words[word].length) {
            deleting = true;
            return setTimeout(tick, 2200);
        }
        setTimeout(tick, deleting ? 35 : 70);
    }
    setTimeout(tick, 2600);
}

// Numbers count up when they scroll into view (the real value is in the HTML)
function setupCountUp() {
    var items = document.querySelectorAll('[data-count]');
    if (!items.length || reduceMotion || !('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            animateCount(entry.target);
        });
    }, { threshold: 0.3 });
    items.forEach(function (el) {
        el.textContent = '0' + (el.getAttribute('data-suffix') || '');
        observer.observe(el);
    });
}

function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null;
    var duration = 1400;
    function frame(now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

// A soft gold glow follows the mouse across cards (CSS only shows it on mouse devices)
function setupSpotlight() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.addEventListener('pointermove', function (e) {
        var card = e.target.closest && e.target.closest('.spotlight');
        if (!card) return;
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    }, { passive: true });
}

// Homepage mini-game: tap the red flags in a practice phishing email
function setupPhishGame() {
    var game = document.getElementById('phish-game');
    if (!game) return;
    var spots = game.querySelectorAll('.phish-spot');
    var flags = game.querySelectorAll('.phish-spot[data-flag]');
    var total = flags.length;
    var found = 0;
    var startedAt = null;
    var done = false;
    var score = game.querySelector('.phish-score');
    var meter = game.querySelector('.phish-meter-fill');
    var list = game.querySelector('.phish-found');
    var hint = game.querySelector('.phish-hint');
    var reveal = game.querySelector('[data-phish-reveal]');
    var reset = game.querySelector('[data-phish-reset]');
    var finish = game.querySelector('.phish-finish');

    function update() {
        score.textContent = found + ' of ' + total + ' red flags found';
        meter.style.width = (found / total * 100) + '%';
    }

    function addReason(spot) {
        var li = document.createElement('li');
        var strong = document.createElement('strong');
        strong.textContent = spot.getAttribute('data-title') + ': ';
        li.appendChild(strong);
        li.appendChild(document.createTextNode(spot.getAttribute('data-why')));
        list.appendChild(li);
    }

    function end(message) {
        done = true;
        hint.textContent = message;
        reveal.hidden = true;
        finish.hidden = false;
    }

    spots.forEach(function (spot) {
        spot.addEventListener('click', function () {
            if (done) return;
            if (startedAt === null) startedAt = Date.now();
            if (!spot.hasAttribute('data-flag')) {
                spot.classList.remove('is-fine');
                void spot.offsetWidth; // restart the shake
                spot.classList.add('is-fine');
                hint.textContent = 'That part looks normal. Keep looking.';
                return;
            }
            if (spot.classList.contains('is-flag')) return;
            spot.classList.add('is-flag');
            spot.setAttribute('aria-pressed', 'true');
            found++;
            addReason(spot);
            update();
            hint.textContent = 'Red flag! ' + (total - found) + ' to go.';
            if (found === total) {
                var seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
                end('You found all ' + total + ' in ' + seconds + (seconds === 1 ? ' second' : ' seconds') + '. Nice catch!');
            }
        });
    });

    reveal.addEventListener('click', function () {
        flags.forEach(function (spot) {
            if (spot.classList.contains('is-flag')) return;
            spot.classList.add('is-missed');
            addReason(spot);
        });
        meter.style.width = '100%';
        end('You found ' + found + ' of ' + total + '. The ones you missed are now underlined.');
    });

    reset.addEventListener('click', function () {
        spots.forEach(function (spot) {
            spot.classList.remove('is-flag', 'is-missed', 'is-fine');
            if (spot.hasAttribute('data-flag')) spot.setAttribute('aria-pressed', 'false');
        });
        list.textContent = '';
        found = 0;
        startedAt = null;
        done = false;
        hint.textContent = '';
        reveal.hidden = false;
        finish.hidden = true;
        update();
        flags[0].focus();
    });

    update();
}

// Ctrl + K (or the search button) opens a quick jump list
function setupPalette() {
    if (typeof HTMLDialogElement !== 'function') return;
    var home = location.pathname === '/' || location.pathname === '/index.html';
    var at = function (id) { return (home ? '' : '/') + '#' + id; };
    var entries = [
        { label: 'Projects', hint: 'Section', href: at('projects') },
        { label: 'About', hint: 'Section', href: at('about') },
        { label: 'Skills', hint: 'Section', href: at('skills') },
        { label: 'Certifications', hint: 'Section', href: at('certifications') },
        { label: 'Try Spot the Phish', hint: 'Mini-game', href: at('phish-game') },
        { label: 'Spot the Phish', hint: 'Project', href: '/projects/spot-the-phish/' },
        { label: 'Sealed', hint: 'Project', href: '/projects/sealed/' },
        { label: 'Verba', hint: 'Project', href: '/projects/verba/' },
        { label: 'CloudSpend IQ', hint: 'Project', href: '/projects/cloudspend-iq/' },
        { label: 'Message me on LinkedIn', hint: 'Contact', href: LINKEDIN, external: true },
        { label: 'GitHub', hint: 'Profile', href: 'https://github.com/ashe-sule', external: true }
    ];

    var dialog = document.createElement('dialog');
    dialog.className = 'palette';
    dialog.setAttribute('aria-label', 'Jump to');
    var input = document.createElement('input');
    input.className = 'palette-input';
    input.type = 'text';
    input.placeholder = 'Jump to a project or section...';
    input.setAttribute('aria-label', 'Search the site');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', 'palette-list');
    input.setAttribute('aria-expanded', 'true');
    var list = document.createElement('div');
    list.className = 'palette-list';
    list.id = 'palette-list';
    list.setAttribute('role', 'listbox');
    dialog.appendChild(input);
    dialog.appendChild(list);
    document.body.appendChild(dialog);

    var shown = [];
    var active = 0;

    function render() {
        var q = input.value.trim().toLowerCase();
        shown = entries.filter(function (e) {
            return (e.label + ' ' + e.hint).toLowerCase().indexOf(q) !== -1;
        });
        active = Math.min(active, Math.max(shown.length - 1, 0));
        list.textContent = '';
        if (!shown.length) {
            var empty = document.createElement('p');
            empty.className = 'palette-empty';
            empty.textContent = 'No matches';
            list.appendChild(empty);
            input.removeAttribute('aria-activedescendant');
            return;
        }
        shown.forEach(function (e, i) {
            var a = document.createElement('a');
            a.className = 'palette-item' + (i === active ? ' is-active' : '');
            a.id = 'palette-item-' + i;
            a.href = e.href;
            a.setAttribute('role', 'option');
            a.setAttribute('aria-selected', i === active ? 'true' : 'false');
            a.tabIndex = -1;
            if (e.external) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }
            var label = document.createElement('span');
            label.textContent = e.label;
            var hint = document.createElement('small');
            hint.textContent = e.hint;
            a.appendChild(label);
            a.appendChild(hint);
            a.addEventListener('mousemove', function () {
                if (active !== i) { active = i; render(); }
            });
            list.appendChild(a);
        });
        input.setAttribute('aria-activedescendant', 'palette-item-' + active);
        var current = list.children[active];
        if (current && current.scrollIntoView) current.scrollIntoView({ block: 'nearest' });
    }

    function open() {
        input.value = '';
        active = 0;
        render();
        dialog.showModal();
        input.focus();
    }

    input.addEventListener('input', function () { active = 0; render(); });
    input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!shown.length) return;
            active = (active + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length;
            render();
        } else if (e.key === 'Enter' && shown.length) {
            e.preventDefault();
            list.children[active].click();
        }
    });
    list.addEventListener('click', function (e) {
        if (e.target.closest('a')) dialog.close();
    });
    dialog.addEventListener('click', function (e) {
        if (e.target === dialog) dialog.close(); // click on the backdrop
    });
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (dialog.open) dialog.close(); else open();
        }
    });
    document.querySelectorAll('[data-palette-open]').forEach(function (btn) {
        btn.addEventListener('click', open);
    });
}

// Project pages: click a screenshot to see it full size
function setupLightbox() {
    if (typeof HTMLDialogElement !== 'function') return;
    var images = document.querySelectorAll('figure.project-shot img, .project-hero-media img');
    if (!images.length) return;

    var dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.setAttribute('aria-label', 'Screenshot');
    var close = document.createElement('button');
    close.className = 'lightbox-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '✕';
    var big = document.createElement('img');
    big.alt = '';
    var caption = document.createElement('p');
    caption.className = 'lightbox-caption';
    dialog.appendChild(close);
    dialog.appendChild(big);
    dialog.appendChild(caption);
    document.body.appendChild(dialog);

    close.addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) {
        if (e.target === dialog || e.target === big) dialog.close();
    });

    images.forEach(function (img) {
        img.classList.add('zoomable');
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'Enlarge screenshot: ' + img.alt);
        function show() {
            big.src = img.currentSrc || img.src;
            big.alt = img.alt;
            var fig = img.closest('figure');
            var cap = fig && fig.querySelector('figcaption');
            caption.textContent = cap ? cap.textContent : '';
            dialog.showModal();
            close.focus();
        }
        img.addEventListener('click', show);
        img.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                show();
            }
        });
    });
}

// A hello for anyone who opens the browser console
function sayHello() {
    if (!window.console || !console.log) return;
    console.log(
        '%cHey, fellow builder! %c\nThanks for peeking under the hood. Strict CSP, no frameworks, no cookies.\nLet’s talk: ' + LINKEDIN,
        'color:#d4af37;font-size:16px;font-weight:bold',
        'color:#94a3b8'
    );
}
