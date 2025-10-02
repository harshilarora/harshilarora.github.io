
//  active class to current nav item
const currentLocation = window.location.hash || '#info';
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentLocation) {
        link.classList.add('active');
    }
});


// Parallax effect for skills section background
window.addEventListener('scroll', () => {
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        const scrollPosition = window.pageYOffset;
        const sectionTop = skillsSection.offsetTop;
        const sectionHeight = skillsSection.offsetHeight;
        
        if (scrollPosition + window.innerHeight > sectionTop && 
            scrollPosition < sectionTop + sectionHeight) {
            const yPos = -(scrollPosition - sectionTop) * 0.5;
            skillsSection.style.backgroundPosition = `center ${yPos}px`;
        }
    }
});