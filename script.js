const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');
const progressBar = document.querySelector('.scroll-progress');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Navigation ---------- */

menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
    menuIcon.classList.toggle('bx-x');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuIcon.classList.remove('bx-x');
    });
});

const onScroll = () => {
    const scrollY = window.scrollY;
    header.classList.toggle('sticky', scrollY > 40);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;

    let current = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 160) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Scroll reveal ---------- */

const revealTargets = document.querySelectorAll(
    '.section-tag, .heading, .about-content, .skills-box, .timeline-item, .education-box, .achievement-col, .projects-box, .focus-card, .stat-box, .contact-cta, .contact-info-item, .interests, .projects-more'
);

revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--delay', `${(i % 6) * 0.07}s`);
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

/* ---------- Animated stat counters ---------- */

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        counterObserver.unobserve(el);

        const match = el.textContent.trim().match(/^([\d.]+)(.*)$/);
        if (!match) return;
        const target = parseFloat(match[1]);
        const decimals = (match[1].split('.')[1] || '').length;
        const suffix = match[2];
        const duration = 1600;
        const start = performance.now();

        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = (target * eased).toFixed(decimals) + suffix;
            if (t < 1) requestAnimationFrame(tick);
        };
        if (!reduceMotion) requestAnimationFrame(tick);
    });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-box h3').forEach(el => counterObserver.observe(el));

/* ---------- Project filter tabs ---------- */

const tabButtons = document.querySelectorAll('.tab-btn');
const projectCards = document.querySelectorAll('.projects-box[data-category]');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        tabButtons.forEach(b => b.classList.toggle('active', b === btn));
        projectCards.forEach((card, i) => {
            const hide = filter !== 'all' && card.dataset.category !== filter;
            card.classList.toggle('hidden', hide);
            card.classList.remove('filter-in');
            if (!hide) {
                void card.offsetWidth;
                card.style.animationDelay = `${(i % 9) * 0.04}s`;
                card.classList.add('filter-in');
            }
        });
    });
});

/* ---------- Typing effect ---------- */

const typingRoles = ['Mobile App Developer', 'Flutter Developer', 'Python Developer', 'AI / LLM Developer', 'Backend Developer'];
const typingEl = document.querySelector('.multiple-text');

if (typingEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
        const currentRole = typingRoles[roleIndex];

        if (!deleting) {
            charIndex++;
            typingEl.textContent = currentRole.slice(0, charIndex);
            if (charIndex === currentRole.length) {
                deleting = true;
                setTimeout(type, 1600);
                return;
            }
        } else {
            charIndex--;
            typingEl.textContent = currentRole.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % typingRoles.length;
            }
        }

        setTimeout(type, deleting ? 40 : 85);
    };

    type();
}

/* ---------- Seamless tech marquee ---------- */

const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
    [...marqueeTrack.children].forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        marqueeTrack.appendChild(clone);
    });
}

/* ---------- Card spotlight + 3D tilt ---------- */

if (finePointer && !reduceMotion) {
    const tiltCards = document.querySelectorAll(
        '.skills-box, .projects-box, .focus-card, .stat-box, .education-box, .achievement-col, .timeline-content, .contact-info-item, .contact-cta'
    );

    tiltCards.forEach(card => {
        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mx', `${x}px`);
            card.style.setProperty('--my', `${y}px`);
            card.style.setProperty('--ry', `${((x / rect.width) - 0.5) * 7}deg`);
            card.style.setProperty('--rx', `${(0.5 - (y / rect.height)) * 7}deg`);
        });

        card.addEventListener('pointerleave', () => {
            ['--mx', '--my', '--rx', '--ry'].forEach(p => card.style.removeProperty(p));
        });
    });
}

/* ---------- Cursor glow + hero parallax ---------- */

const glow = document.querySelector('.cursor-glow');
const homeImg = document.querySelector('.home-img');
const floaters = document.querySelectorAll('.float-chip, .code-card');
const pointer = { x: -9999, y: -9999, active: false };

if (finePointer && !reduceMotion) {
    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;

    window.addEventListener('pointermove', (e) => {
        if (!pointer.active) {
            gx = e.clientX;
            gy = e.clientY;
        }
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
        glow.classList.add('active');
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
        pointer.active = false;
        glow.classList.remove('active');
    });

    const followGlow = () => {
        gx += (pointer.x - gx) * 0.12;
        gy += (pointer.y - gy) * 0.12;
        glow.style.transform = `translate(${gx}px, ${gy}px)`;

        if (homeImg && pointer.active && window.scrollY < window.innerHeight) {
            const dx = (pointer.x / window.innerWidth - 0.5);
            const dy = (pointer.y / window.innerHeight - 0.5);
            floaters.forEach((el, i) => {
                const depth = (i + 1) * 8;
                el.style.translate = `${dx * depth}px ${dy * depth}px`;
            });
        }
        requestAnimationFrame(followGlow);
    };
    followGlow();
}

/* ---------- Neural network background ---------- */

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width = 0;
let height = 0;
let nodes = [];
let rafId = null;

const COLORS = ['34, 211, 238', '99, 102, 241', '168, 85, 247', '66, 165, 245'];
const LINK_DIST = 150;
const MOUSE_DIST = 200;

const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(95, Math.max(35, Math.floor((width * height) / 15000)));
    nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2
    }));
};

const drawNetwork = (time = 0) => {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        if (!reduceMotion) {
            a.x += a.vx;
            a.y += a.vy;
            if (a.x < 0 || a.x > width) a.vx *= -1;
            if (a.y < 0 || a.y > height) a.vy *= -1;

            if (pointer.active) {
                const dx = pointer.x - a.x;
                const dy = pointer.y - a.y;
                const d = Math.hypot(dx, dy);
                if (d < MOUSE_DIST && d > 1) {
                    a.x += (dx / d) * 0.25;
                    a.y += (dy / d) * 0.25;
                }
            }
        }

        for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = dx * dx + dy * dy;
            if (dist < LINK_DIST * LINK_DIST) {
                const alpha = (1 - Math.sqrt(dist) / LINK_DIST) * 0.28;
                ctx.strokeStyle = `rgba(${a.c}, ${alpha})`;
                ctx.lineWidth = 0.7;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }

        if (pointer.active) {
            const d = Math.hypot(pointer.x - a.x, pointer.y - a.y);
            if (d < MOUSE_DIST) {
                ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - d / MOUSE_DIST) * 0.45})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(pointer.x, pointer.y);
                ctx.stroke();
            }
        }

        const glowAmt = 0.55 + Math.sin(time * 0.002 + a.phase) * 0.35;
        ctx.fillStyle = `rgba(${a.c}, ${glowAmt})`;
        ctx.shadowColor = `rgba(${a.c}, 0.9)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    if (!reduceMotion) rafId = requestAnimationFrame(drawNetwork);
};

resizeCanvas();
drawNetwork();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        resizeCanvas();
        if (reduceMotion) drawNetwork();
    }, 150);
});

document.addEventListener('visibilitychange', () => {
    if (reduceMotion) return;
    if (document.hidden) {
        cancelAnimationFrame(rafId);
    } else {
        rafId = requestAnimationFrame(drawNetwork);
    }
});
