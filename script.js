/* ============================================================
   TakeWake Cafe — JavaScript
   Handles: Loading, Navigation, Scroll Animations, Dark Mode,
   Menu Filtering, Form Handling, Stats Counter, Particles,
   Back to Top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===== LOADING SCREEN =====
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Trigger hero animations after loader hides
            setTimeout(() => {
                document.querySelectorAll('.hero .animate-on-scroll').forEach((el, i) => {
                    setTimeout(() => el.classList.add('visible'), i * 150);
                });
            }, 200);
        }, 1800);
    });

    // Fallback: hide loader after 4s max
    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }, 4000);

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('nav-links');
    const menuToggle = document.getElementById('menu-toggle');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Sticky Navbar on Scroll
    const handleScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // run on init

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav);

    // ===== DARK MODE TOGGLE =====
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check saved theme
    const savedTheme = localStorage.getItem('takewake-theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('takewake-theme', next);
    });

    // ===== SCROLL ANIMATIONS (Intersection Observer) =====
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    animateElements.forEach(el => {
        // Don't observe hero elements — they animate after loader
        if (!el.closest('.hero')) {
            scrollObserver.observe(el);
        }
    });

    // ===== MENU CATEGORY TABS =====
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCards = document.querySelectorAll('.menu-card');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');

            // Update active tab
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Hide all cards with fade
            menuCards.forEach(card => {
                card.classList.remove('fade-in');
                card.classList.add('fade-out');
            });

            // Show matching cards after brief delay
            setTimeout(() => {
                menuCards.forEach(card => {
                    if (card.getAttribute('data-category') === category) {
                        card.style.display = '';
                        card.classList.remove('fade-out');
                        // Stagger the fade in
                        setTimeout(() => {
                            card.classList.add('fade-in');
                        }, 50);
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('fade-out');
                    }
                });
            }, 250);
        });
    });

    // ===== BOOKING FORM =====
    const bookingForm = document.getElementById('booking-form');
    const bookingSuccess = document.getElementById('booking-success');
    const bookingSubmit = document.getElementById('booking-submit');

    // Set minimum date to today
    const dateInput = document.getElementById('book-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Button loading state
        bookingSubmit.innerHTML = '<span>Reserving...</span>';
        bookingSubmit.disabled = true;

        // Simulate API call
        setTimeout(() => {
            bookingForm.style.display = 'none';
            bookingSuccess.style.display = 'block';
        }, 1500);
    });

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');
    const contactSubmit = document.getElementById('contact-submit');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        contactSubmit.innerHTML = '<span>Sending...</span>';
        contactSubmit.disabled = true;

        setTimeout(() => {
            contactForm.style.display = 'none';
            contactSuccess.style.display = 'block';
        }, 1500);
    });

    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const btn = newsletterForm.querySelector('button');
            btn.textContent = '✓';
            btn.style.background = '#27ae60';
            input.value = '';
            input.placeholder = 'Subscribed!';
            input.disabled = true;

            setTimeout(() => {
                btn.textContent = '→';
                btn.style.background = '';
                input.placeholder = 'Your email';
                input.disabled = false;
            }, 3000);
        });
    }

    // ===== STATS COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(eased * target);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(update);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsCounted) {
                statsCounted = true;
                statNumbers.forEach(num => animateCounter(num));
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // ===== HERO PARTICLES =====
    const particlesContainer = document.getElementById('hero-particles');
    
    const createParticles = () => {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: ${Math.random() * 0.4 + 0.1};
            `;

            particlesContainer.appendChild(particle);
        }
    };
    createParticles();

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== PARALLAX EFFECT ON HERO (subtle) =====
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                hero.style.backgroundPositionY = `${scrolled * 0.4}px`;
            }
        }
    });

}); // end DOMContentLoaded
