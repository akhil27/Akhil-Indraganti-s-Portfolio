// Portfolio website JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const heroButtons = document.querySelectorAll('.hero-actions .btn');
    const publicationLink = document.querySelector('.publication-link');
    
    // Enhanced smooth scroll functionality
    function smoothScrollToSection(targetId) {
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                navToggle.classList.remove('active');
            }
            
            return true;
        }
        return false;
    }
    
    // Add event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                smoothScrollToSection(targetId);
            }
        });
    });
    
    // Add event listeners to hero buttons
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                smoothScrollToSection(targetId);
            }
        });
    });
    
    // Handle publication link clicks (external link with proper targeting)
    if (publicationLink) {
        publicationLink.addEventListener('click', function(e) {
            // Ensure the link opens in a new tab/window
            console.log('Opening IEEE publication:', this.href);
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
    
    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navMenu.classList.toggle('show');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        }
    });
    
    // Active navigation highlighting
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150; // Offset for header
        
        let activeSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop - 100 && scrollPos < sectionTop + sectionHeight - 100) {
                activeSection = sectionId;
            }
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Scroll event listener for active nav updates
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveNav();
                handleScrollToTop();
                handleHeroPhotoParallax();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial call to set active nav on page load
    setTimeout(updateActiveNav, 100);
    
    // Hero photo parallax effect
    function handleHeroPhotoParallax() {
        const heroPhoto = document.querySelector('.hero-photo-fallback');
        const heroSection = document.querySelector('.hero');
        
        if (heroPhoto && heroSection) {
            const scrolled = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;
            const scrollPercent = scrolled / heroHeight;
            
            if (scrollPercent <= 1) {
                // Subtle parallax effect for the photo
                const translateY = scrolled * 0.1;
                heroPhoto.style.transform = `translateY(${translateY}px)`;
            }
        }
    }
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    const animatedElements = document.querySelectorAll('.card, .hero-content, .hero-image, .about-content, .contact-content');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Enhanced mobile menu functionality
    function createMobileMenuStyles() {
        if (window.innerWidth <= 768) {
            if (!document.getElementById('mobile-menu-styles')) {
                const style = document.createElement('style');
                style.id = 'mobile-menu-styles';
                style.textContent = `
                    .nav-menu {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background-color: rgba(var(--color-slate-900-rgb), 0.98);
                        flex-direction: column;
                        padding: var(--space-16);
                        transform: translateY(-100%);
                        opacity: 0;
                        visibility: hidden;
                        transition: all var(--duration-normal) var(--ease-standard);
                        backdrop-filter: blur(10px);
                        border-top: 1px solid rgba(var(--color-teal-300-rgb), 0.2);
                    }
                    
                    .nav-menu.show {
                        transform: translateY(0);
                        opacity: 1;
                        visibility: visible;
                    }
                    
                    .nav-menu li {
                        margin: var(--space-8) 0;
                    }
                    
                    .nav-link {
                        display: block;
                        padding: var(--space-12);
                        text-align: center;
                        border-radius: var(--radius-base);
                    }
                    
                    .nav-toggle.active span:nth-child(1) {
                        transform: rotate(45deg) translate(6px, 6px);
                    }
                    
                    .nav-toggle.active span:nth-child(2) {
                        opacity: 0;
                    }
                    
                    .nav-toggle.active span:nth-child(3) {
                        transform: rotate(-45deg) translate(6px, -6px);
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    // Initialize mobile menu styles
    createMobileMenuStyles();
    
    // Update mobile menu on resize
    window.addEventListener('resize', createMobileMenuStyles);
    
    // Add active nav link styling
    const activeNavStyle = document.createElement('style');
    activeNavStyle.textContent = `
        .nav-link.active {
            color: var(--color-teal-300) !important;
            background-color: rgba(var(--color-teal-300-rgb), 0.15);
        }
    `;
    document.head.appendChild(activeNavStyle);
    
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateY(-6px)';
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Typing effect for hero subtitle
    function typeWriter() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) {
            const text = subtitle.textContent;
            subtitle.textContent = '';
            subtitle.style.borderRight = '2px solid var(--color-teal-300)';
            subtitle.style.minHeight = '1.2em';
            
            let i = 0;
            function type() {
                if (i < text.length) {
                    subtitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 80);
                } else {
                    setTimeout(() => {
                        subtitle.style.borderRight = 'none';
                    }, 1000);
                }
            }
            
            // Start typing effect after a short delay
            setTimeout(type, 1500);
        }
    }
    
    // Initialize typing effect
    typeWriter();
    
    // Hero photo interaction enhancement
    function enhanceHeroPhoto() {
        const heroPhotoFallback = document.querySelector('.hero-photo-fallback');
        const heroPhotoBorder = document.querySelector('.hero-photo-border');
        
        if (heroPhotoFallback) {
            // Add interactive hover effects
            heroPhotoFallback.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 25px 50px rgba(var(--color-teal-300-rgb), 0.2)';
                
                if (heroPhotoBorder) {
                    heroPhotoBorder.style.transform = 'translate(-50%, -50%) scale(1.05)';
                }
            });
            
            heroPhotoFallback.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                
                if (heroPhotoBorder) {
                    heroPhotoBorder.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            });
            
            console.log('Hero photo fallback loaded and enhanced with interactions');
        }
    }
    
    // Initialize hero photo enhancements
    enhanceHeroPhoto();
    
    // Publication link analytics and enhancements
    function enhancePublicationLink() {
        if (publicationLink) {
            // Add loading state simulation
            publicationLink.addEventListener('click', function() {
                console.log('Publication link clicked: IEEE AISP 2022 paper');
                console.log('Opening URL:', this.href);
                
                // Add temporary loading state
                const originalText = this.querySelector('.publication-link-text').textContent;
                this.querySelector('.publication-link-text').textContent = 'Opening...';
                
                setTimeout(() => {
                    this.querySelector('.publication-link-text').textContent = originalText;
                }, 1000);
            });
            
            // Add keyboard navigation support
            publicationLink.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            console.log('Publication link enhanced with accessibility and feedback');
        }
    }
    
    enhancePublicationLink();
    
    // Scroll to top functionality
    let scrollToTopBtn = null;
    
    function createScrollToTop() {
        scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.classList.add('scroll-to-top');
        scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
        
        const scrollBtnStyle = document.createElement('style');
        scrollBtnStyle.textContent = `
            .scroll-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: var(--color-teal-500);
                color: var(--color-white);
                border: none;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all var(--duration-normal) var(--ease-standard);
                z-index: 999;
                box-shadow: var(--shadow-lg);
            }
            
            .scroll-to-top.show {
                opacity: 1;
                visibility: visible;
            }
            
            .scroll-to-top:hover {
                background: var(--color-teal-600);
                transform: translateY(-2px);
            }
        `;
        
        document.head.appendChild(scrollBtnStyle);
        document.body.appendChild(scrollToTopBtn);
        
        // Scroll to top functionality
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Show/hide scroll to top button
    function handleScrollToTop() {
        if (scrollToTopBtn) {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }
    }
    
    // Initialize scroll to top button
    createScrollToTop();
    
    // Enhanced publication section interactions
    function enhancePublicationSection() {
        const publicationCard = document.querySelector('.publication-card');
        const publicationActions = document.querySelector('.publication-actions');
        
        if (publicationCard && publicationActions) {
            // Add hover effect to highlight the publication link
            publicationCard.addEventListener('mouseenter', function() {
                publicationActions.style.transform = 'translateX(8px)';
                publicationActions.style.transition = 'transform 0.3s ease';
            });
            
            publicationCard.addEventListener('mouseleave', function() {
                publicationActions.style.transform = 'translateX(0)';
            });
        }
    }
    
    enhancePublicationSection();
    
    // Accessibility improvements
    function enhanceAccessibility() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#home';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-teal-500);
            color: var(--color-white);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1001;
            transition: top 0.3s;
        `;
        
        // Show skip link on focus
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
            this.classList.remove('sr-only');
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
            this.classList.add('sr-only');
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add aria-labels to interactive elements
        const heroPhotoFallback = document.querySelector('.hero-photo-fallback');
        if (heroPhotoFallback) {
            heroPhotoFallback.setAttribute('aria-label', 'Professional photo placeholder for Akhil Indraganti');
            heroPhotoFallback.setAttribute('role', 'img');
        }
        
        // Ensure all buttons have proper labels
        navLinks.forEach(link => {
            const text = link.textContent.trim();
            link.setAttribute('aria-label', `Navigate to ${text} section`);
        });
        
        // Add proper ARIA labels to publication link
        if (publicationLink) {
            publicationLink.setAttribute('aria-label', 'Open IEEE publication about Convolutional GRU Networks for Singing Voice Separation in a new tab');
        }
    }
    
    enhanceAccessibility();
    
    // Performance monitoring and optimization
    function optimizePerformance() {
        // Lazy load animations
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.willChange = 'transform';
        });
        
        // Optimize scroll performance
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                // Clean up will-change after scroll ends
                cards.forEach(card => {
                    card.style.willChange = 'auto';
                });
            }, 200);
        });
        
        // Add performance logging
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = performance.timing;
                    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`Enhanced portfolio loaded in ${loadTime}ms`);
                }, 100);
            });
        }
    }
    
    optimizePerformance();
    
    // Debug function to verify all sections and elements
    function debugApplicationState() {
        const sections = ['home', 'about', 'education', 'experience', 'projects', 'publications', 'skills', 'contact'];
        let allSectionsValid = true;
        
        sections.forEach(sectionId => {
            const element = document.querySelector(`#${sectionId}`);
            if (!element) {
                console.warn(`Section #${sectionId} not found`);
                allSectionsValid = false;
            }
        });
        
        // Check hero photo
        const heroPhoto = document.querySelector('.hero-photo-fallback');
        if (heroPhoto) {
            console.log('✓ Hero photo fallback is present and styled');
        } else {
            console.warn('✗ Hero photo fallback not found');
        }
        
        // Check publication link
        if (publicationLink && publicationLink.href) {
            console.log('✓ Publication link is functional:', publicationLink.href);
        } else {
            console.warn('✗ Publication link not found or missing href');
        }
        
        if (allSectionsValid) {
            console.log('✓ All sections are present and accounted for');
        }
        
        return {
            sectionsValid: allSectionsValid,
            heroPhotoPresent: !!heroPhoto,
            publicationLinkFunctional: !!(publicationLink && publicationLink.href)
        };
    }
    
    // Run final debug check
    const appState = debugApplicationState();
    
    console.log('🚀 Enhanced portfolio website loaded successfully!');
    console.log('Features included:');
    console.log('• Professional photo placeholder in hero section');
    console.log('• Functional IEEE publication link');
    console.log('• Smooth scrolling navigation');
    console.log('• Responsive design with mobile menu');
    console.log('• Enhanced accessibility features');
    console.log('• Performance optimizations');
    
    return appState;
});