/**
 * Swetha S Portfolio - Premium Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    // 0. Mobile Menu & Navigation Logic
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksList = document.getElementById('nav-links');
    const header = document.querySelector('.navbar');

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navLinksList.classList.toggle('active');
            const icon = menuToggle.querySelector('i');

            // Toggle orientation and lock scroll
            if (isActive) {
                icon.className = 'fas fa-times';
                document.body.style.overflow = 'hidden'; // Lock background scroll
            } else {
                icon.className = 'fas fa-bars';
                document.body.style.overflow = ''; // Unlock background scroll
            }
        });
    }

    // Smooth Scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // Close mobile menu if open
                navLinksList.classList.remove('active');
                document.body.style.overflow = ''; // Unlock background scroll
                const icon = menuToggle ? menuToggle.querySelector('i') : null;
                if (icon) icon.className = 'fas fa-bars';

                // Calculate position with offset
                const offset = header.offsetHeight || 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active link state
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                if (this.parentElement.parentElement.classList.contains('nav-links')) {
                    this.classList.add('active');
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinksList.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinksList.classList.remove('active');
            const icon = menuToggle ? menuToggle.querySelector('i') : null;
            if (icon) icon.className = 'fas fa-bars';
        }
    });

    // 1. Cursor Glow Tracking (Removed)


    // 2. 3D Card Tilt Effect
    const cards = document.querySelectorAll('.glass-card, .expertise-card, .work-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set CSS variables for tracking light
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
        });
    });

    // 3. Scroll Reveal Logic (Enhanced)
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Navbar Sticky & Active Link Highlighting
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    const activeLinkObserverOptions = {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: "-80px 0px -20% 0px" // Account for navbar height at top
    };

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, activeLinkObserverOptions);

    sections.forEach(section => {
        activeLinkObserver.observe(section);
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // 5. Contact Form AJAX
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();

                if (result.status === 'success') {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (err) {
                alert('Connection error. Please try again.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // 6. Dynamic Copyright Year
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 7. Typing Animation for Hero Title
    const typingElement = document.getElementById('typing-text');
    const textToType = "Swetha Sengottuvelu";
    let charIndex = 0;
    const typingSpeed = 100; // ms per character

    function typeEffect() {
        if (charIndex < textToType.length) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeEffect, typingSpeed);
        } else {
            // Typing finished, remove the cursor effect if any
            typingElement.style.borderRight = "none";
        }
    }

    if (typingElement) {
        // Initial style to support cursor if needed
        typingElement.style.borderRight = "3px solid var(--accent-secondary)";
        typingElement.style.paddingRight = "5px";

        // Start typing after a short delay
        setTimeout(typeEffect, 500);
    }
});
