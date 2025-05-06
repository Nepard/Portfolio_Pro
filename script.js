// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
        }
    });
});

// Sample Projects (in case GitHub API fails or for testing)
const sampleProjects = [
    {
        name: "Secure Authentication System",
        description: "A Django-based authentication system with advanced security features",
        stars: 15,
        forks: 5,
        url: "#",
        demo: "#",
        tags: ["Python", "Django", "Security"]
    },
    {
        name: "E-commerce Platform",
        description: "Full-stack e-commerce solution with React frontend and Django backend",
        stars: 12,
        forks: 3,
        url: "#",
        demo: "#",
        tags: ["React", "Django", "SQL"]
    },
    {
        name: "Network Security Tool",
        description: "Python-based network security analysis and monitoring tool",
        stars: 8,
        forks: 2,
        url: "#",
        demo: "#",
        tags: ["Python", "Security", "Networking"]
    }
];

// Enhanced GitHub Projects Loading
async function loadGitHubProjects() {
    const projectGrid = document.getElementById('projectGrid');
    const username = 'your-github-username'; // Replace with your GitHub username

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const projects = await response.json();

        // Sort projects by stars and get top 6
        const topProjects = projects
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6);

        // If no GitHub projects found, use sample projects
        const displayProjects = topProjects.length > 0 ? topProjects : sampleProjects;

        displayProjects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.animationDelay = `${index * 0.2}s`;
            
            const tags = project.tags || ['Web Development', 'Python', 'Security'];
            
            card.innerHTML = `
                <div class="project-content">
                    <h3>${project.name}</h3>
                    <p>${project.description || 'No description available'}</p>
                    <div class="project-tags">
                        ${tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-stats">
                        <span><i class="fas fa-star"></i> ${project.stargazers_count || project.stars}</span>
                        <span><i class="fas fa-code-branch"></i> ${project.forks_count || project.forks}</span>
                    </div>
                    <div class="project-links">
                        <a href="${project.html_url || project.url}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i> View Project
                        </a>
                        ${(project.homepage || project.demo) ? `
                            <a href="${project.homepage || project.demo}" target="_blank" class="project-link">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
            projectGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        // Use sample projects if GitHub API fails
        sampleProjects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.animationDelay = `${index * 0.2}s`;
            
            card.innerHTML = `
                <div class="project-content">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-stats">
                        <span><i class="fas fa-star"></i> ${project.stars}</span>
                        <span><i class="fas fa-code-branch"></i> ${project.forks}</span>
                    </div>
                    <div class="project-links">
                        <a href="${project.url}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i> View Project
                        </a>
                        <a href="${project.demo}" target="_blank" class="project-link">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    </div>
                </div>
            `;
            projectGrid.appendChild(card);
        });
    }
}

// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

// Form submission handling
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Prepare template parameters
            const templateParams = {
                to_email: 'anish03025@gmail.com',
                from_name: name,
                from_email: email,
                message: message
            };
            
            // Send email using EmailJS
            const response = await emailjs.send(
                'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                templateParams
            );
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Error sending email:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
        }
    });
}

// Notification function
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Fibonacci sequence generator
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Create Fibonacci spiral
function createFibonacciSpiral() {
    const container = document.querySelector('.fibonacci-spiral-container');
    const spiral = document.querySelector('.fibonacci-spiral');
    
    // Generate Fibonacci sequence
    const sequence = Array.from({ length: 10 }, (_, i) => fibonacci(i));
    
    // Create spiral elements
    sequence.forEach((num, index) => {
        const element = document.createElement('div');
        element.className = 'spiral-element';
        element.style.width = `${num * 10}px`;
        element.style.height = `${num * 10}px`;
        element.style.animationDelay = `${index * 0.618}s`;
        spiral.appendChild(element);
    });
}

// Enhanced scroll animations with Fibonacci timing
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('project-card')) {
                const delay = fibonacci(index) * 0.1;
                entry.target.style.animationDelay = `${delay}s`;
            }
        }
    });
}, observerOptions);

// Fibonacci-based hover effects
function addFibonacciHoverEffects() {
    const elements = document.querySelectorAll('.fibonacci-item, .skill-tag');
    
    elements.forEach((element, index) => {
        element.addEventListener('mouseenter', () => {
            const scale = 1 + (fibonacci(index) * 0.1);
            element.style.transform = `scale(${scale})`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
    });
}

// Enhanced project card animations
function animateProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach((card, index) => {
        const delay = fibonacci(index) * 0.2;
        card.style.animationDelay = `${delay}s`;
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createFibonacciSpiral();
    loadGitHubProjects();
    addFibonacciHoverEffects();
    animateProjectCards();
    
    // Observe elements
    document.querySelectorAll('section, .project-card, .portfolio-item, .skill-tag').forEach((element, index) => {
        if (element.classList.contains('project-card') || 
            element.classList.contains('portfolio-item') || 
            element.classList.contains('skill-tag')) {
            element.dataset.index = index;
        }
        observer.observe(element);
    });
    
    // Add Fibonacci-based scroll effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const spiral = document.querySelector('.fibonacci-spiral');
        
        if (hero && spiral) {
            const scale = 1 + (scrolled * 0.0005);
            const rotation = scrolled * 0.1;
            spiral.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
});

// Add hover effect to portfolio items
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
    });
}); 