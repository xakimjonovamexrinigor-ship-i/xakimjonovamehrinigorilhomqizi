// Navigation functionality
const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections and cards
const sections = document.querySelectorAll('section');
const skillCards = document.querySelectorAll('.skill-card');
const projectCards = document.querySelectorAll('.project-card');
const statItems = document.querySelectorAll('.stat-item');

// Add fade-in class to elements
[...sections, ...skillCards, ...projectCards, ...statItems].forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Progress bar animation
const progressBars = document.querySelectorAll('.progress');
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.style.width;
            progressBar.style.width = '0';
            setTimeout(() => {
                progressBar.style.width = width;
            }, 100);
            progressObserver.unobserve(progressBar);
        }
    });
}, { threshold: 0.5 });

progressBars.forEach(bar => {
    progressObserver.observe(bar);
});

// Contact form handling with Telegram Bot
const contactForm = document.getElementById('contactForm');

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8500294526:AAHkvn_grqArwY9mYpLL7HmkkMcc8CAkEKA';
const TELEGRAM_CHAT_ID = '6847606385';
const TELEGRAM_BOT_USERNAME = '@nur1zzbot';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Form validation
    if (!name || !email || !message) {
        alert('Iltimos, barcha maydonlarni to\'ldiring.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Iltimos, to\'g\'ri email manzil kiriting.');
        return;
    }

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Yuborilmoqda...';

    // Format message for Telegram
    const telegramMessage = `
📧 <b>Yangi xabar - Portfolio saytidan</b>

👤 <b>Ism:</b> ${escapeHtml(name)}
📧 <b>Email:</b> ${escapeHtml(email)}

💬 <b>Xabar:</b>
${escapeHtml(message)}

---
📅 Vaqt: ${new Date().toLocaleString('uz-UZ')}
🤖 Bot: ${TELEGRAM_BOT_USERNAME}
    `.trim();

    try {
        // Send message to Telegram using GET method (to avoid CORS issues)
        const url = `${TELEGRAM_API_URL}?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(telegramMessage.replace(/<[^>]*>/g, ''))}&parse_mode=HTML`;
        
        // Try POST method first
        let response = await fetch(TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: 'HTML'
            })
        });

        // If POST fails due to CORS, try alternative method
        if (!response.ok) {
            // Alternative: Use proxy or direct GET request
            response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(telegramMessage.replace(/<[^>]*>/g, ''))}&parse_mode=HTML`);
        }

        const data = await response.json();

        if (response.ok && data.ok) {
            alert('✅ Xabar muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
            contactForm.reset();
        } else {
            throw new Error(data.description || 'Xatolik yuz berdi');
        }
    } catch (error) {
        console.error('Telegram xatosi:', error);
        // Fallback: Open Telegram directly
        const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME.replace('@', '')}?text=${encodeURIComponent(`Ism: ${name}\nEmail: ${email}\n\nXabar: ${message}`)}`;
        const userChoice = confirm('❌ Xabar yuborishda xatolik yuz berdi.\n\nTelegram orqali to\'g\'ridan-to\'g\'ri yuborishni xohlaysizmi?');
        if (userChoice) {
            window.open(telegramUrl, '_blank');
        }
    } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Active navigation link on scroll
const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', updateActiveNavLink);

// Add active class styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--accent-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Button hover effects enhancement
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Project card hover effect enhancement
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Skill card hover effect enhancement
skillCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    updateActiveNavLink();
    
    // Animate hero content on load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
});




