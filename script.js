const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const NAV_LINKS = [
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
];

function renderNavLinks(containerId, { closeMenuOnClick = false } = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    NAV_LINKS.forEach(({ href, label }) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        if (closeMenuOnClick) {
            a.addEventListener("click", closeMenu);
        }
        li.appendChild(a);
        container.appendChild(li);
    });
}

function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    const isOpen = menu.classList.toggle("open");
    icon.classList.toggle("open");
    icon.setAttribute("aria-expanded", isOpen);
}

function closeMenu() {
    document.querySelector(".menu-links").classList.remove("open");
    const icon = document.querySelector(".hamburger-icon");
    icon.classList.remove("open");
    icon.setAttribute("aria-expanded", "false");
}

renderNavLinks("nav-links-desktop");
renderNavLinks("nav-links-mobile", { closeMenuOnClick: true });
renderNavLinks("nav-links-footer");

document.querySelector(".hamburger-icon").addEventListener("click", toggleMenu);

// Highlight the current section's nav link while scrolling
const sections = document.querySelectorAll("section[id]");
const navLinkEls = document.querySelectorAll(".nav-links a, .menu-links a");

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute("id");
            navLinkEls.forEach((link) => {
                link.classList.toggle("active-link", link.getAttribute("href") === `#${id}`);
            });
        });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

// Dark mode toggle
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        applyTheme(current === "dark" ? "light" : "dark");
    });
});

// Scroll-reveal animations
if (prefersReducedMotion) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

// Skill bar fill animation
const skillObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const bar = entry.target;
            const level = bar.getAttribute("data-level");
            const fill = bar.querySelector(".skill-fill");
            if (fill) fill.style.width = `${level}%`;
            observer.unobserve(bar);
        });
    },
    { threshold: 0.4 }
);

document.querySelectorAll(".skill-bar").forEach((bar) => skillObserver.observe(bar));

// Animated stat counter — replays every time it scrolls into view
function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"), 10);
    if (prefersReducedMotion) {
        el.textContent = target;
        return;
    }

    if (el._counterFrame) cancelAnimationFrame(el._counterFrame);

    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        el.textContent = Math.round(progress * target);
        el._counterFrame = progress < 1 ? requestAnimationFrame(tick) : null;
    }

    el._counterFrame = requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            } else if (!prefersReducedMotion) {
                if (entry.target._counterFrame) cancelAnimationFrame(entry.target._counterFrame);
                entry.target.textContent = "0";
            }
        });
    },
    { threshold: 0.6 }
);

document.querySelectorAll(".stat-number").forEach((el) => counterObserver.observe(el));

// Typewriter effect in hero subtitle
const typewriterEl = document.getElementById("typewriter");

if (typewriterEl) {
    const roles = ["Software Developer", "Frontend Developer", "Web Developer"];

    if (prefersReducedMotion) {
        typewriterEl.textContent = roles[0];
    } else {
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeTick() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                charIndex -= 1;
            } else {
                charIndex += 1;
            }

            typewriterEl.textContent = currentRole.slice(0, charIndex);

            let delay = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentRole.length) {
                delay = 1800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = 300;
            }

            setTimeout(typeTick, delay);
        }

        typeTick();
    }
}

// Scroll progress bar
const scrollProgressEl = document.getElementById("scroll-progress");

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressEl.style.width = `${progress}%`;
}

if (scrollProgressEl) {
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();
}
