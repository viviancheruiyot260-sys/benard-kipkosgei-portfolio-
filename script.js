document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen
    const loaderWrapper = document.querySelector('.loader-wrapper');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loaderWrapper.style.opacity = '0';
            loaderWrapper.style.visibility = 'hidden';
        }, 500); // Small delay for visual effect
    });

    // 3. Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // 4. Sticky Navigation & Scroll Progress
    const navbar = document.querySelector('.navbar');
    const progressBar = document.getElementById('myBar');
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        // Sticky Nav
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }

        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";

        // Back to top button
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 5. Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        // Click functionality for mobile/fallback
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });

        // Add mouseenter event to scroll on hover without clicking
        link.addEventListener('mouseenter', function(e) {
            // Ensure this only runs on desktop to prevent chaotic behavior on mobile touch
            if (window.innerWidth > 768) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80, // Adjusting for the sticky navbar height
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // 6. Active Navigation Links on Scroll
    const sections = document.querySelectorAll('section, header');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 7. Typing Animation
    const typingText = document.querySelector('.typing-text');
    const words = [
        "Teacher", 
        "Agriculture Officer", 
        "Community Leader", 
        "Mentor", 
        "Agricultural Research Enthusiast"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing animation
    if(typingText) typeEffect();

    // 8. Scroll Reveal Animations
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
                
                // Trigger skill bars animation when about section is revealed
                if (reveals[i].classList.contains('skills-container')) {
                    const progressBars = document.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width + '%';
                    });
                }
                
            }
        }
    }
    
    window.addEventListener('scroll', reveal);
    reveal(); // Trigger on load

    // 10. Ripple Button Effect
    const buttons = document.querySelectorAll('.ripple');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple-effect');
            
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });

    // 11. Gallery Lightbox
    const modal = document.getElementById("galleryModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const closeModal = document.querySelector(".close-modal");

    galleryItems.forEach(item => {
        item.addEventListener("click", function() {
            modal.style.display = "block";
            const img = this.querySelector('img');
            const title = this.querySelector('h3').innerText;
            const desc = this.querySelector('p').innerText;
            
            modalImg.src = img.src;
            captionText.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
        });
    });

    if(closeModal) {
        closeModal.addEventListener("click", function() {
            modal.style.display = "none";
        });
    }

    // Close modal on outside click
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // 12. Form Validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            // Basic validation
            if (name.value.trim() === '') {
                setError(name, 'Name is required');
                isValid = false;
            } else {
                setSuccess(name);
            }
            
            if (email.value.trim() === '') {
                setError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                setError(email, 'Provide a valid email address');
                isValid = false;
            } else {
                setSuccess(email);
            }
            
            if (subject.value.trim() === '') {
                setError(subject, 'Subject is required');
                isValid = false;
            } else {
                setSuccess(subject);
            }
            
            if (message.value.trim() === '') {
                setError(message, 'Message is required');
                isValid = false;
            } else {
                setSuccess(message);
            }
            
            if (isValid) {
                // Change button text to show processing
                const btn = contactForm.querySelector('button');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Submit form to Formspree using fetch
                const formData = new FormData(contactForm);
                
                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        alert('Thank you for your message! I will get back to you soon.');
                        contactForm.reset();
                        
                        // Reset classes
                        const controls = contactForm.querySelectorAll('.form-control');
                        controls.forEach(control => {
                            control.classList.remove('success');
                        });
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                alert(data["errors"].map(error => error["message"]).join(", "));
                            } else {
                                alert('Oops! There was a problem submitting your form');
                            }
                        });
                    }
                })
                .catch(error => {
                    alert('Oops! There was a problem submitting your form');
                })
                .finally(() => {
                    btn.innerHTML = originalText;
                });
            }
        });
    }
    
    function setError(element, message) {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error-message');
        
        errorDisplay.innerText = message;
        errorDisplay.style.display = 'block';
        element.classList.add('error');
        element.classList.remove('success');
    }
    
    function setSuccess(element) {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error-message');
        
        errorDisplay.innerText = '';
        errorDisplay.style.display = 'none';
        element.classList.remove('error');
        element.classList.add('success');
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});
