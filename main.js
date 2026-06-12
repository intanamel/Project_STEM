document.addEventListener('DOMContentLoaded', () => {
    // 1. DARK MODE TOGGLE
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check if theme preference exists in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark);
        });
    }
    
    function updateThemeIcon(isDark) {
        if (!themeToggleBtn) return;
        themeToggleBtn.innerHTML = isDark 
            ? '☀️' // Sun icon for switching back to light mode
            : '🌙'; // Moon icon for switching to dark mode
    }

    // 2. RESPONSIVE NAVBAR HAMBURGER MENU
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Animate hamburger lines
            hamburger.classList.toggle('toggle');
        });

        // Close menu when clicking outside or on a link
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            }
        });
    }

    // 3. BACK TO TOP BUTTON
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. SCROLL ANIMATION (REVEAL ON SCROLL)
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Unobserve if we only want the animation to run once
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters the viewport fully
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 5. STATS COUNTER ANIMATION
    const counterElements = document.querySelectorAll('.counter');
    if (counterElements.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const targetStr = counter.getAttribute('data-target');
                    const hasPercent = targetStr.includes('%');
                    const targetVal = parseFloat(targetStr.replace('%', ''));
                    
                    animateCounter(counter, targetVal, hasPercent);
                    counterObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });
        
        counterElements.forEach(el => counterObserver.observe(el));
    }
    
    function animateCounter(element, target, hasPercent) {
        let start = 0;
        const duration = 2000; // 2 seconds animation
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function: easeOutQuad
            const easedProgress = progress * (2 - progress);
            
            // Calculate current value
            const currentVal = start + easedProgress * (target - start);
            
            // Format display output
            if (Number.isInteger(target)) {
                element.innerText = Math.floor(currentVal) + (hasPercent ? '%' : '');
            } else {
                element.innerText = currentVal.toFixed(2) + (hasPercent ? '%' : '');
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure target value is reached exactly
                element.innerText = target + (hasPercent ? '%' : '');
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
});

// GLOBAL UTILITY: DOWNLOAD AS PDF BY PRINTING
function printReport() {
    window.print();
}
