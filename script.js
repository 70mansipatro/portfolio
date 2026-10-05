const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

menuIcon.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    header.classList.toggle('sticky', window.scrollY > 60);

    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 150;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
});

const revealTargets = document.querySelectorAll(
    '.heading, .about-content, .about-img, .skills-box, .timeline-item, .education-box, .achievement-col, .projects-box, .focus-card, .contact-container'
);

revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--delay', `${(i % 6) * 0.08}s`);
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

const tabButtons = document.querySelectorAll('.tab-btn');
const projectCards = document.querySelectorAll('.projects-box[data-category]');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        tabButtons.forEach(b => b.classList.toggle('active', b === btn));
        projectCards.forEach(card => {
            card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
        });
    });
});

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
                setTimeout(type, 1500);
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

        setTimeout(type, deleting ? 40 : 90);
    };

    type();
}
