// ===== MAIN JAVASCRIPT FILE =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initSmoothScrolling();
    initPortfolioFilter();
    initScrollEffects();
    initInteractiveElements();
    loadPortfolioItems();
});

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== PORTFOLIO FILTER =====
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            filterPortfolioItems(filterValue);
        });
    });
}

function filterPortfolioItems(filter) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.5s ease';
        } else {
            item.style.display = 'none';
        }
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const floatingElements = document.querySelector('.floating-elements');
        
        if (hero && floatingElements) {
            const rate = scrolled * -0.5;
            floatingElements.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ===== INTERACTIVE ELEMENTS =====
function initInteractiveElements() {
    // Add glitch effect on hover for hero title
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        glitchText.addEventListener('mouseenter', function() {
            this.style.animationDuration = '0.1s';
        });
        
        glitchText.addEventListener('mouseleave', function() {
            this.style.animationDuration = '2s';
        });
    }
    
    // Interest cards hover effects
    const interestCards = document.querySelectorAll('.interest-card');
    interestCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle rotation effect
            this.style.transform = 'translateY(-10px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg)';
        });
    });
    
    // Dynamic background color change based on scroll
    window.addEventListener('scroll', function() {
        const scrollPercent = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
        const psychedelicBg = document.querySelector('.psychedelic-bg');
        
        if (psychedelicBg) {
            const hue = Math.floor(scrollPercent * 360);
            psychedelicBg.style.filter = `hue-rotate(${hue}deg)`;
        }
    });
}

// ===== LOAD PORTFOLIO ITEMS =====
function loadPortfolioItems() {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    
    // Portfolio data with actual project links
    const portfolioData = [
        {
            title: "AI Music Composer",
            category: "tech",
            description: "Machine learning model that generates original music compositions.",
            image: "assets/images/ai-music.jpg",
            tags: ["AI", "Music", "Python"],
            link: "projects/ai-music-composer/index.html"
        },
        {
            title: "Data Visualization Symphony",
            category: "data",
            description: "Interactive visualization that turns data into musical experiences.",
            image: "assets/images/data-viz.jpg",
            tags: ["D3.js", "Statistics", "Audio"],
            link: "projects/data-viz-symphony/index.html"
        },
        {
            title: "Surreal Photography Series",
            category: "art",
            description: "Photography series inspired by Dalí's surrealistic vision.",
            image: "assets/images/surreal-photos.jpg",
            tags: ["Photography", "Digital Art", "Surrealism"],
            link: "projects/surreal-photography/index.html"
        },
        {
            title: "Neural Network Visualizer",
            category: "tech",
            description: "Real-time visualization of neural network training processes.",
            image: "assets/images/neural-viz.jpg",
            tags: ["AI", "Visualization", "WebGL"],
            link: "projects/neural-network-visualizer/index.html"
        },
        {
            title: "Psychedelic Sound Installation",
            category: "art",
            description: "Interactive sound installation inspired by 60s psychedelic music.",
            image: "assets/images/sound-install.jpg",
            tags: ["Sound Design", "Interactive", "Installation"],
            link: "projects/psychedelic-sound-installation/index.html"
        },
        {
            title: "Statistical Music Analysis",
            category: "data",
            description: "Analysis of musical patterns using advanced statistical methods.",
            image: "assets/images/music-stats.jpg",
            tags: ["Statistics", "Music Theory", "R"],
            link: "projects/statistical-music-analysis/index.html"
        }
    ];
    
    if (portfolioGrid) {
        portfolioData.forEach(item => {
            const portfolioItem = createPortfolioItem(item);
            portfolioGrid.appendChild(portfolioItem);
        });
    }
}

function createPortfolioItem(data) {
    const item = document.createElement('div');
    item.className = `portfolio-item ${data.category}`;
    
    item.innerHTML = `
        <div class="portfolio-card">
            <div class="portfolio-image">
                <img src="${data.image}" alt="${data.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg=='">
                <div class="portfolio-overlay">
                    <div class="portfolio-content">
                        <h3>${data.title}</h3>
                        <p>${data.description}</p>
                        <div class="portfolio-tags">
                            ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <a href="${data.link}" class="view-project-btn">View Project</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return item;
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    .portfolio-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        overflow: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .portfolio-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
    }
    
    .portfolio-image {
        position: relative;
        height: 250px;
        overflow: hidden;
    }
    
    .portfolio-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .portfolio-card:hover .portfolio-image img {
        transform: scale(1.1);
    }
    
    .portfolio-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .portfolio-card:hover .portfolio-overlay {
        opacity: 1;
    }
    
    .portfolio-content {
        text-align: center;
        padding: 2rem;
    }
    
    .portfolio-content h3 {
        font-family: var(--font-futuristic);
        color: var(--accent-blue);
        margin-bottom: 1rem;
    }
    
    .portfolio-content p {
        margin-bottom: 1rem;
        color: var(--primary-light);
    }
    
    .portfolio-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
        margin-bottom: 1rem;
    }
    
    .tag {
        background: var(--accent-blue);
        color: var(--primary-dark);
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-family: var(--font-futuristic);
    }
    
    .view-project-btn {
        background: transparent;
        border: 1px solid var(--accent-blue);
        color: var(--accent-blue);
        padding: 0.5rem 1rem;
        border-radius: 25px;
        font-family: var(--font-futuristic);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .view-project-btn:hover {
        background: var(--accent-blue);
        color: var(--primary-dark);
        box-shadow: 0 0 15px var(--accent-blue);
    }
`;

document.head.appendChild(style);
