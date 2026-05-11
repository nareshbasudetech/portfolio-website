/**
 * Aarogya Medical College & Teaching Hospital
 * Main JavaScript File
 * Pure Vanilla JS - No frameworks
 */

(function() {
    'use strict';

    // ===========================================
    // DOM Elements
    // ===========================================
    const DOM = {
        body: document.body,
        header: document.querySelector('.header'),
        navToggle: document.querySelector('#hamburger'),
        navMenu: document.querySelector('.nav-menu'),
        navLinks: document.querySelectorAll('.nav-link'),
        themeToggle: document.querySelector('#themeToggle'),
        backToTop: document.querySelector('#backToTop'),
        programFilters: document.querySelectorAll('.filter-btn'),
        programCards: document.querySelectorAll('.program-card'),
        deptTabs: document.querySelectorAll('.dept-tab'),
        deptPanels: document.querySelectorAll('.dept-panel'),
        faqItems: document.querySelectorAll('.faq-item'),
        testimonialSlider: document.querySelector('.testimonials-slider'),
        testimonialCards: document.querySelectorAll('.testimonial-card'),
        sliderDots: document.querySelectorAll('.slider-dot'),
        prevBtn: document.querySelector('#prevBtn'),
        nextBtn: document.querySelector('#nextBtn'),
        counters: document.querySelectorAll('[data-target]'),
        contactForm: document.querySelector('#contactForm'),
        newsletterForm: document.querySelector('#newsletterForm'),
        sections: document.querySelectorAll('section[id]')
    };

    // ===========================================
    // Theme Toggle (Dark Mode)
    // ===========================================
    const ThemeManager = {
        init() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            this.setTheme(savedTheme);

            if (DOM.themeToggle) {
                DOM.themeToggle.addEventListener('click', () => this.toggle());
            }
        },

        setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            this.updateToggleIcon(theme);
        },

        toggle() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        },

        updateToggleIcon(theme) {
            // Icons are handled by CSS via data-theme attribute
            // This method is kept for potential future use
        }
    };

    // ===========================================
    // Mobile Navigation
    // ===========================================
    const MobileNav = {
        init() {
            if (!DOM.navToggle || !DOM.navMenu) return;

            DOM.navToggle.addEventListener('click', () => this.toggle());

            // Close menu when clicking a link
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!DOM.header.contains(e.target) && DOM.navMenu.classList.contains('active')) {
                    this.close();
                }
            });

            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && DOM.navMenu.classList.contains('active')) {
                    this.close();
                    DOM.navToggle.focus();
                }
            });
        },

        toggle() {
            const isExpanded = DOM.navToggle.getAttribute('aria-expanded') === 'true';
            DOM.navToggle.setAttribute('aria-expanded', !isExpanded);
            DOM.navToggle.classList.toggle('active');
            DOM.navMenu.classList.toggle('active');
            DOM.body.classList.toggle('nav-open');
        },

        close() {
            DOM.navToggle.setAttribute('aria-expanded', 'false');
            DOM.navToggle.classList.remove('active');
            DOM.navMenu.classList.remove('active');
            DOM.body.classList.remove('nav-open');
        }
    };

    // ===========================================
    // Smooth Scroll
    // ===========================================
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href === '#') return;

                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };

    // ===========================================
    // Scrollspy (Active Nav Link)
    // ===========================================
    const Scrollspy = {
        init() {
            if (!DOM.sections.length || !DOM.navLinks.length) return;

            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -80% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        this.setActiveLink(id);
                    }
                });
            }, observerOptions);

            DOM.sections.forEach(section => observer.observe(section));
        },

        setActiveLink(id) {
            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    // ===========================================
    // Sticky Header
    // ===========================================
    const StickyHeader = {
        init() {
            if (!DOM.header) return;

            let lastScroll = 0;

            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 100) {
                    DOM.header.classList.add('scrolled');
                } else {
                    DOM.header.classList.remove('scrolled');
                }

                // Hide/show header on scroll
                if (currentScroll > lastScroll && currentScroll > 300) {
                    DOM.header.classList.add('header-hidden');
                } else {
                    DOM.header.classList.remove('header-hidden');
                }

                lastScroll = currentScroll;
            }, { passive: true });
        }
    };

    // ===========================================
    // Program Filters
    // ===========================================
    const ProgramFilters = {
        init() {
            if (!DOM.programFilters.length || !DOM.programCards.length) return;

            DOM.programFilters.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active button
                    DOM.programFilters.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filter = btn.dataset.filter;
                    this.filterPrograms(filter);
                });
            });
        },

        filterPrograms(filter) {
            DOM.programCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    };

    // ===========================================
    // Department Tabs
    // ===========================================
    const DepartmentTabs = {
        init() {
            if (!DOM.deptTabs.length || !DOM.deptPanels.length) return;

            DOM.deptTabs.forEach(tab => {
                tab.addEventListener('click', () => this.switchTab(tab));
                tab.addEventListener('keydown', (e) => this.handleKeyboard(e, tab));
            });
        },

        switchTab(selectedTab) {
            const targetId = selectedTab.dataset.tab;

            // Update tabs
            DOM.deptTabs.forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });
            selectedTab.classList.add('active');
            selectedTab.setAttribute('aria-selected', 'true');

            // Update panels
            DOM.deptPanels.forEach(panel => {
                panel.classList.remove('active');
                panel.setAttribute('hidden', '');
            });

            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                targetPanel.removeAttribute('hidden');
            }
        },

        handleKeyboard(e, currentTab) {
            const tabs = Array.from(DOM.deptTabs);
            const currentIndex = tabs.indexOf(currentTab);
            let newIndex;

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    newIndex = (currentIndex + 1) % tabs.length;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                    break;
                case 'Home':
                    e.preventDefault();
                    newIndex = 0;
                    break;
                case 'End':
                    e.preventDefault();
                    newIndex = tabs.length - 1;
                    break;
                default:
                    return;
            }

            tabs[newIndex].focus();
            this.switchTab(tabs[newIndex]);
        }
    };

    // ===========================================
    // FAQ Accordion
    // ===========================================
    const FAQAccordion = {
        init() {
            if (!DOM.faqItems.length) return;

            DOM.faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                if (question) {
                    question.addEventListener('click', () => this.toggle(item));
                    question.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            this.toggle(item);
                        }
                    });
                }
            });
        },

        toggle(item) {
            const isOpen = item.classList.contains('active');
            const answer = item.querySelector('.faq-answer');
            const question = item.querySelector('.faq-question');

            // Close all other items (optional - remove for multi-open)
            DOM.faqItems.forEach(faq => {
                if (faq !== item && faq.classList.contains('active')) {
                    faq.classList.remove('active');
                    const faqAnswer = faq.querySelector('.faq-answer');
                    const faqQuestion = faq.querySelector('.faq-question');
                    if (faqAnswer) faqAnswer.style.maxHeight = null;
                    if (faqQuestion) faqQuestion.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            if (isOpen) {
                item.classList.remove('active');
                if (answer) answer.style.maxHeight = null;
                if (question) question.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
                if (question) question.setAttribute('aria-expanded', 'true');
            }
        }
    };

    // ===========================================
    // Testimonials Slider
    // ===========================================
    const TestimonialsSlider = {
        currentIndex: 0,
        autoplayInterval: null,
        autoplayDelay: 5000,
        dots: [],

        init() {
            if (!DOM.testimonialCards.length) return;

            // Generate dots dynamically
            this.generateDots();

            this.showSlide(0);
            this.startAutoplay();

            if (DOM.prevBtn) {
                DOM.prevBtn.addEventListener('click', () => {
                    this.prev();
                    this.resetAutoplay();
                });
            }

            if (DOM.nextBtn) {
                DOM.nextBtn.addEventListener('click', () => {
                    this.next();
                    this.resetAutoplay();
                });
            }

            // Pause on hover
            if (DOM.testimonialSlider) {
                DOM.testimonialSlider.addEventListener('mouseenter', () => this.stopAutoplay());
                DOM.testimonialSlider.addEventListener('mouseleave', () => this.startAutoplay());
            }

            // Touch/swipe support
            this.initTouchSupport();
        },

        generateDots() {
            const dotsContainer = document.querySelector('#sliderDots');
            if (!dotsContainer) return;

            dotsContainer.innerHTML = '';
            DOM.testimonialCards.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'slider-dot';
                dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
                dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
                dot.addEventListener('click', () => {
                    this.goToSlide(index);
                    this.resetAutoplay();
                });
                dotsContainer.appendChild(dot);
            });
            this.dots = dotsContainer.querySelectorAll('.slider-dot');
        },

        showSlide(index) {
            const total = DOM.testimonialCards.length;
            this.currentIndex = ((index % total) + total) % total;

            DOM.testimonialCards.forEach((card, i) => {
                card.classList.remove('active', 'prev', 'next');
                if (i === this.currentIndex) {
                    card.classList.add('active');
                } else if (i === (this.currentIndex - 1 + total) % total) {
                    card.classList.add('prev');
                } else if (i === (this.currentIndex + 1) % total) {
                    card.classList.add('next');
                }
            });

            this.dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
                dot.setAttribute('aria-selected', i === this.currentIndex);
            });
        },

        prev() {
            this.showSlide(this.currentIndex - 1);
        },

        next() {
            this.showSlide(this.currentIndex + 1);
        },

        goToSlide(index) {
            this.showSlide(index);
        },

        startAutoplay() {
            this.stopAutoplay();
            this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
        },

        stopAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        },

        resetAutoplay() {
            this.stopAutoplay();
            this.startAutoplay();
        },

        initTouchSupport() {
            if (!DOM.testimonialSlider) return;

            let touchStartX = 0;
            let touchEndX = 0;

            DOM.testimonialSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            DOM.testimonialSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
        },

        handleSwipe(startX, endX) {
            const threshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
                this.resetAutoplay();
            }
        }
    };

    // ===========================================
    // Animated Counters
    // ===========================================
    const AnimatedCounters = {
        animated: new Set(),

        init() {
            // Find stat items with data-count attribute
            const statItems = document.querySelectorAll('[data-count]');
            if (!statItems.length) return;

            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animated.add(entry.target);
                        this.animateCounter(entry.target);
                    }
                });
            }, observerOptions);

            statItems.forEach(item => observer.observe(item));
        },

        animateCounter(element) {
            const target = parseInt(element.dataset.count, 10);
            // Support both .stat-number and .stat-value class names
            const numberEl = element.querySelector('.stat-number, .stat-value');
            if (!numberEl || isNaN(target)) return;

            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    numberEl.textContent = Math.ceil(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    // Add suffix if exists (e.g., "+", "%")
                    const suffix = element.dataset.suffix || '';
                    numberEl.textContent = target.toLocaleString() + suffix;
                }
            };

            requestAnimationFrame(updateCounter);
        }
    };

    // ===========================================
    // Form Validation
    // ===========================================
    const FormValidation = {
        init() {
            if (DOM.contactForm) {
                this.initContactForm();
            }
            if (DOM.newsletterForm) {
                this.initNewsletterForm();
            }
        },

        initContactForm() {
            DOM.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();

                if (this.validateContactForm()) {
                    this.showSuccess(DOM.contactForm, 'Thank you! Your message has been sent successfully.');
                    DOM.contactForm.reset();
                }
            });

            // Real-time validation
            const inputs = DOM.contactForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => {
                    if (input.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            });
        },

        initNewsletterForm() {
            DOM.newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const emailInput = DOM.newsletterForm.querySelector('input[type="email"]');
                if (this.validateEmail(emailInput.value)) {
                    this.showSuccess(DOM.newsletterForm, 'Thank you for subscribing!');
                    DOM.newsletterForm.reset();
                } else {
                    this.showError(emailInput, 'Please enter a valid email address');
                }
            });
        },

        validateContactForm() {
            const name = DOM.contactForm.querySelector('#name');
            const email = DOM.contactForm.querySelector('#email');
            const subject = DOM.contactForm.querySelector('#subject');
            const message = DOM.contactForm.querySelector('#message');

            let isValid = true;

            if (!this.validateRequired(name)) isValid = false;
            if (!this.validateEmail(email?.value)) {
                this.showError(email, 'Please enter a valid email address');
                isValid = false;
            }
            if (!this.validateRequired(subject)) isValid = false;
            if (!this.validateRequired(message)) isValid = false;

            return isValid;
        },

        validateField(input) {
            const type = input.type;
            const value = input.value.trim();

            this.clearError(input);

            if (input.hasAttribute('required') && !value) {
                this.showError(input, 'This field is required');
                return false;
            }

            if (type === 'email' && value && !this.validateEmail(value)) {
                this.showError(input, 'Please enter a valid email address');
                return false;
            }

            if (type === 'tel' && value && !this.validatePhone(value)) {
                this.showError(input, 'Please enter a valid phone number');
                return false;
            }

            return true;
        },

        validateRequired(input) {
            if (!input) return false;

            const value = input.value.trim();
            if (!value) {
                this.showError(input, 'This field is required');
                return false;
            }
            this.clearError(input);
            return true;
        },

        validateEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },

        validatePhone(phone) {
            const regex = /^[\d\s\-\+\(\)]{10,}$/;
            return regex.test(phone);
        },

        showError(input, message) {
            if (!input) return;

            input.classList.add('error');
            input.classList.remove('valid');

            let errorEl = input.parentElement.querySelector('.error-message');
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'error-message';
                errorEl.setAttribute('role', 'alert');
                input.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = message;
        },

        clearError(input) {
            if (!input) return;

            input.classList.remove('error');
            const errorEl = input.parentElement.querySelector('.error-message');
            if (errorEl) {
                errorEl.remove();
            }
        },

        showSuccess(form, message) {
            // Remove any existing success message
            const existingMsg = form.querySelector('.success-message');
            if (existingMsg) existingMsg.remove();

            const successEl = document.createElement('div');
            successEl.className = 'success-message';
            successEl.setAttribute('role', 'status');
            successEl.textContent = message;

            form.insertBefore(successEl, form.firstChild);

            setTimeout(() => {
                successEl.classList.add('fade-out');
                setTimeout(() => successEl.remove(), 300);
            }, 3000);
        }
    };

    // ===========================================
    // Back to Top Button
    // ===========================================
    const BackToTop = {
        init() {
            if (!DOM.backToTop) return;

            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 500) {
                    DOM.backToTop.classList.add('visible');
                } else {
                    DOM.backToTop.classList.remove('visible');
                }
            }, { passive: true });

            DOM.backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    };

    // ===========================================
    // Scroll Reveal Animation
    // ===========================================
    const ScrollReveal = {
        init() {
            const revealElements = document.querySelectorAll('.reveal, .program-card, .dept-card, .facility-card, .news-card, .timeline-item');

            if (!revealElements.length) return;

            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -100px 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            revealElements.forEach(el => {
                el.classList.add('reveal-ready');
                observer.observe(el);
            });
        }
    };

    // ===========================================
    // Preloader
    // ===========================================
    const Preloader = {
        init() {
            const preloader = document.querySelector('.preloader');
            if (!preloader) return;

            window.addEventListener('load', () => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            });
        }
    };

    // ===========================================
    // Initialize All Modules
    // ===========================================
    function init() {
        ThemeManager.init();
        MobileNav.init();
        SmoothScroll.init();
        Scrollspy.init();
        StickyHeader.init();
        ProgramFilters.init();
        DepartmentTabs.init();
        FAQAccordion.init();
        TestimonialsSlider.init();
        AnimatedCounters.init();
        FormValidation.init();
        BackToTop.init();
        ScrollReveal.init();
        Preloader.init();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
