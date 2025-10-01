// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to current nav item
const currentLocation = window.location.hash || '#info';
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentLocation) {
        link.classList.add('active');
    }
});

// Parallax effect on scroll
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const mainHeading = document.querySelector('.main-heading');
            if (mainHeading) {
                mainHeading.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Parallax effect for skills section background
window.addEventListener('scroll', () => {
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        const scrollPosition = window.pageYOffset;
        const sectionTop = skillsSection.offsetTop;
        const sectionHeight = skillsSection.offsetHeight;
        
        // Only apply parallax when section is in view
        if (scrollPosition + window.innerHeight > sectionTop && 
            scrollPosition < sectionTop + sectionHeight) {
            const yPos = -(scrollPosition - sectionTop) * 0.5;
            skillsSection.style.backgroundPosition = `center ${yPos}px`;
        }
    }
});