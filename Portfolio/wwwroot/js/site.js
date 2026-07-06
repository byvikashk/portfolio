/* Modular site interactions: AOS init, smooth scroll, active nav, scroll-top, loader, counters, dark-mode, contact form
   All features implemented using vanilla JS. Performance-optimized with passive listeners and efficient observers.
   Production-ready portfolio site with accessibility, SEO, and responsive design.

   FEATURES:
   - Smooth scroll navigation (Step 8 from original workflow)
   - Active nav highlighting via IntersectionObserver (Step 7)
   - Scroll-to-top button with animations (Step 12)
   - Loading screen with fade-out (Step 10)
   - Counter animations on scroll (Step 5)
   - Contact form with validation and Google Forms integration (Step 11)
   - Dark mode with localStorage persistence (Step 9)
   - Scroll progress bar (Step 13)
   - Hero typing animation (Step 8)
   - AOS library integration (Step 6)
   - SEO metadata and structured data (Step 15)
   - Accessibility attributes and focus states (Step 16)
   - Performance optimizations (Step 17)
*/

(function () {

    // Elements
    const navbar = document.querySelector('.custom-navbar');
    const collapse = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scroll-top');
    const pageLoader = document.getElementById('page-loader');
    const darkToggle = document.getElementById('dark-mode-toggle');
    const darkIcon = document.getElementById('dark-mode-icon');

    // Smooth in-page navigation (preserve existing behavior)
    function initSmoothScroll() {

        document.querySelectorAll('.navbar .nav-link[href^="#"]').forEach(link => {

            link.addEventListener("click", function (e) {

                e.preventDefault();

                const href = this.getAttribute("href");
                document.querySelectorAll(".nav-link").forEach(l => {
                    l.classList.remove("active");
                });

                this.classList.add("active");
                const target = document.querySelector(href);

                if (!target) return;

                const navbarHeight = navbar.offsetHeight;

                const top =
                    target.offsetTop - navbarHeight;

                if (window.innerWidth < 992 && collapse.classList.contains("show")) {

                    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);

                    bsCollapse.hide();

                    collapse.addEventListener(
                        "hidden.bs.collapse",
                        function handler() {

                            collapse.removeEventListener("hidden.bs.collapse", handler);

                            const navbarHeight = navbar.offsetHeight;
                            const top =
                                target.getBoundingClientRect().top +
                                window.pageYOffset -
                                navbarHeight;

                            window.scrollTo({
                                top: top,
                                behavior: "smooth"
                            });
                            history.pushState(null, "", href);
                        },
                        { once: true }
                    );

                } 
                else {

                    window.scrollTo({
                        top: top,
                        behavior: "smooth"
                    });
                    history.pushState(null, "", href);
                }

            });

        });

    }

    // Initialize AOS
    function initAOS() {
        if (window.AOS) {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 120
            });
        }
    }

    // Active navigation using IntersectionObserver (preferred over scroll events)
    function initActiveNav() {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));

        if (!sections.length || !navLinks.length) return;

        // Map id -> link for quick lookup
        const linkById = new Map();
        navLinks.forEach(link => {
            const href = (link.getAttribute('href') || '').trim();
            if (href.startsWith('#')) {
                linkById.set(href.replace('#', ''), link);
            }
        });

        let observer = null;

        function createObserver() {
            if (observer) observer.disconnect();

            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            // Use negative top margin to detect when section enters viewport (accounts for navbar)
            // Use negative bottom margin to keep section highlighted while visible
            const rootMargin = `-${navbarHeight}px 0px -70% 0px`;
            observer = new IntersectionObserver((entries) => {
                // Find the most visible section
                let mostVisible = null;
                let maxRatio = 0;

                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                        maxRatio = entry.intersectionRatio;
                        mostVisible = entry.target;
                    }
                });

                // If no section is intersecting, use the closest one to top
                if (!mostVisible) {
                    let closest = null;
                    let closestDistance = Infinity;

                    entries.forEach(entry => {
                        const distance = Math.abs(entry.boundingClientRect.top);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closest = entry.target;
                        }
                    });

                    mostVisible = closest;
                }

                // Update active class only if we have a visible section
                if (mostVisible) {
                    const id = mostVisible.id;
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = linkById.get(id);
                    if (activeLink) activeLink.classList.add('active');
                }
            }, { root: null, rootMargin, threshold: 0.3 });

            sections.forEach(s => observer.observe(s));
        }

        // Recreate observer on resize to account for navbar height changes
        window.addEventListener('resize', throttle(() => createObserver(), 200));

        createObserver();
    }

    // Scroll to top button with passive listener (Step 12 - Performance optimized)
    function initScrollTop() {
        if (!scrollTopBtn) return;
        scrollTopBtn.style.display = 'none';

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.classList.remove('show');
                scrollTopBtn.style.display = 'none';
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Page loader
    function hideLoader() {
        if (!pageLoader) return;
        window.addEventListener('load', () => {
            pageLoader.classList.add('fade-out');
            setTimeout(() => pageLoader.style.display = 'none', 600);
        });
    }

    // Counters (animate once) - Performance optimized
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    const el = entry.target;
                    const end = parseInt(el.getAttribute('data-counter'), 10) || 0;
                    animateCounter(el, end, 1500);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach(c => observer.observe(c));
    }

    // Skills hover animation handled in CSS (class additions for icon rotation)

    // Timeline slide animations use AOS attributes on timeline items (we'll add classes)

    // Project card hover handled by CSS

    // Contact Form - Google Apps Script
    function initContactForm() {

        const form = document.getElementById("contact-form");
        if (!form) return;

        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx2ujw0IN7u29RUAgKzIBtPzhc9pHLHOFrKIHMpz9f-w1FfegJTQvN9kRcdVIlnWNK7/exec";

        form.addEventListener("submit", async function (e) {

            e.preventDefault();

            if (!form.checkValidity()) {
                // e.stopPropagation();
                form.classList.add("was-validated");
                return;
            }

            const submitBtn = document.getElementById("contact-submit-btn");
            const submitText = document.getElementById("submit-text");
            const submitSpinner = document.getElementById("submit-spinner");

            submitBtn.disabled = true;
            submitText.style.display = "none";
            submitSpinner.style.display = "inline";

            const data = new URLSearchParams();

            data.append("name", document.getElementById("name").value);
            data.append("email", document.getElementById("email").value);
            data.append("phone", document.getElementById("phone").value);
            data.append("subject", document.getElementById("subject").value);
            data.append("message", document.getElementById("message").value);

            try {

                const response = await fetch(SCRIPT_URL, {
                    method: "POST",
                    body: data
                });
                if (!response.ok) {
                    throw new Error("Failed to send message");
                }

                showFormMessage(
                    "✅ Thank you! Your message has been sent successfully. I'll get back to you soon.",
                    true
                );

                form.reset();
                form.classList.remove("was-validated");

                const msg = document.getElementById("contact-form-message");

                setTimeout(() => {

                    msg.style.opacity = "0";

                    setTimeout(() => {

                        msg.style.display = "none";
                        msg.style.opacity = "1";

                    }, 500);

                }, 5000);

            }
            catch (error) {

                console.error(error);

                showFormMessage(
                    "❌ Unable to send message. Please try again.",
                    false
                );

            }
            finally {

                submitBtn.disabled = false;
                submitText.style.display = "inline";
                submitSpinner.style.display = "none";

            }

        });

    }

    function showFormMessage(message, success) {

        const el = document.getElementById("contact-form-message");

        if (!el) return;

        el.innerHTML = message;

        el.className = success
            ? "alert alert-success mt-3"
            : "alert alert-danger mt-3";

        el.style.display = "block";

        setTimeout(() => {

            el.style.display = "none";

        }, 5000);

    }

    // Dark mode
    function initDarkMode() {
        if (!darkToggle) return;

        // Get stored preference or detect system preference
        let pref = localStorage.getItem('theme');
        if (!pref) {
            // Auto-detect system preference on first visit
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            pref = prefersDark ? 'dark' : 'light';
        }

        setTheme(pref);

        darkToggle.addEventListener('click', (e) => {
            e.preventDefault();

            const current =
                document.documentElement.getAttribute('data-theme') === 'dark'
                    ? 'dark'
                    : 'light';

            const next = current === 'dark' ? 'light' : 'dark';

            setTheme(next);

            // Close mobile menu after changing theme
            if (
                window.innerWidth < 992 &&
                collapse &&
                collapse.classList.contains("show")
            ) {
                bootstrap.Collapse.getOrCreateInstance(collapse).hide();
            }
        });
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (darkIcon) {
                darkIcon.className =
                    theme === "dark"
                        ? "bi bi-sun-fill"
                        : "bi bi-moon-fill";
            }        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            darkIcon.className = 'bi bi-moon-fill';
        }
        localStorage.setItem('theme', theme);
    }

    // Utility: throttle
    function throttle(fn, wait) {
        let time = Date.now();
        return function () {
            if ((time + wait - Date.now()) < 0) {
                fn.apply(this, arguments);
                time = Date.now();
            }
        };
    }

    // Animate number
    function animateCounter(el, end, duration) {
        const start = 0;
        const range = end - start;
        let startTime = null;
        const suffix = el.getAttribute('data-suffix') || '';

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(progress * range + start);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = end + suffix;
        }

        requestAnimationFrame(step);
    }

    // Hero typing animation (Step 8)
    function initHeroTyping() {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (!heroSubtitle) return;

        const titles = [
            "Full Stack .NET Developer",
            "ASP.NET Core Developer",
            "ASP.NET MVC Developer",
            "REST API Developer",
            "Microservices Developer",
            "Cloud Enthusiast"
        ];

        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 80;
        const deletingSpeed = 50;
        const pauseAtEnd = 2000;

        function type() {
            const currentTitle = titles[titleIndex];

            if (isDeleting) {
                heroSubtitle.textContent = currentTitle.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    titleIndex = (titleIndex + 1) % titles.length;
                    setTimeout(type, 500);
                } else {
                    setTimeout(type, deletingSpeed);
                }
            } else {
                heroSubtitle.textContent = currentTitle.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentTitle.length) {
                    isDeleting = true;
                    setTimeout(type, pauseAtEnd);
                } else {
                    setTimeout(type, typingSpeed);
                }
            }
        }

        type();
    }

    // Progress bar (Step 13)
    function initProgressBar() {
        const progressBar = document.getElementById('scroll-progress');
        if (!progressBar) return;

        window.addEventListener('scroll', throttle(() => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.pageYOffset / totalHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }, 50), { passive: true });
    }
    // Prevent browser restoring previous scroll position
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }
    // Init all
    document.addEventListener('DOMContentLoaded', () => {
        // Remove hash from URL on page refresh/load
        if (window.location.hash) {
            history.replaceState(null, "", window.location.pathname);
            window.scrollTo(0, 0);
        }
        try {
            const phone = document.getElementById("phone");

            if (phone) {
                phone.addEventListener("input", function () {
                    this.value = this.value.replace(/\D/g, "").slice(0, 10);
                });
            }
            initSmoothScroll();
            initAOS();
            initActiveNav();
            initScrollTop();
            initCounters();
            initContactForm();
            initDarkMode();
            initHeroTyping();
            initProgressBar();
        } catch (err) {
            console.error('Error initializing site features:', err);
        }
    });

    // Hide loader on full load
    hideLoader();

})();
