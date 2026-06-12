document.addEventListener('DOMContentLoaded', () => {
    // 1. DARK MODE TOGGLE (Font Awesome fa-moon / fa-sun)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage preference
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
        // Font Awesome classes: fas fa-sun OR fas fa-moon
        themeToggleBtn.innerHTML = isDark 
            ? '<i class="fas fa-sun"></i>' // Sun icon for light mode option
            : '<i class="fas fa-moon"></i>'; // Moon icon for dark mode option
    }

    // 2. MOBILE MENU HAMBURGER
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });

        // Close menu when clicking outside
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

    // 4. SCROLL REVEAL (REVEAL ON SCROLL)
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
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
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = progress * (2 - progress); // easeOutQuad
            const currentVal = start + easedProgress * (target - start);
            
            if (Number.isInteger(target)) {
                element.innerText = Math.floor(currentVal) + (hasPercent ? '%' : '');
            } else {
                element.innerText = currentVal.toFixed(2) + (hasPercent ? '%' : '');
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.innerText = target + (hasPercent ? '%' : '');
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // 6. ACCORDION COMPONENT LOGIC (proses.html)
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close other items
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-body').style.maxHeight = null;
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            const body = item.querySelector('.accordion-body');
            
            if (item.classList.contains('active')) {
                body.style.maxHeight = body.scrollHeight + 'px';
            } else {
                body.style.maxHeight = null;
            }
        });
    });

    // 7. GALLERY LIGHTBOX MODAL LOGIC (proses.html)
    const surveyCards = document.querySelectorAll('.survey-card');
    const modal = document.getElementById('survey-modal');
    
    if (surveyCards.length > 0 && modal) {
        const modalTitle = document.getElementById('modal-title');
        const modalQuestion = document.getElementById('modal-question');
        const modalFillPercent = document.getElementById('modal-fill-percent');
        const modalStatsLabel = document.getElementById('modal-stats-label');
        const modalClose = document.getElementById('modal-close');
        
        surveyCards.forEach(card => {
            card.addEventListener('click', () => {
                const qNum = card.getAttribute('data-q');
                const qText = card.querySelector('.survey-q-text').innerText;
                const statsSpan = card.querySelector('.survey-stats-bar').innerText;
                const percentStr = statsSpan.split('\n').pop() || statsSpan.split(' ').pop();
                
                modalTitle.innerText = `${qNum.toUpperCase()} - Analisis Survei`;
                modalQuestion.innerText = qText;
                
                // Dynamically size progress bar inside modal
                if (modalFillPercent) {
                    modalFillPercent.style.width = percentStr;
                }
                if (modalStatsLabel) {
                    modalStatsLabel.innerText = `Persentase Responden Setuju: ${percentStr}`;
                }
                
                modal.classList.add('show');
            });
        });
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }
        
        // Close modal when clicking outside content area
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
});

// GLOBAL PRINT HELP
function printReport() {
    window.print();
}
