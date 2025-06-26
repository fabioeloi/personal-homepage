// Analytics and Performance Monitoring
// Simple, privacy-focused analytics implementation

class PortfolioAnalytics {
    constructor() {
        this.startTime = performance.now();
        this.interactions = [];
        this.performanceMetrics = {};
        
        this.init();
    }
    
    init() {
        this.trackPageLoad();
        this.trackUserInteractions();
        this.trackPerformanceMetrics();
        this.trackScrollDepth();
        this.setupBeforeUnload();
    }
    
    // Track page load performance
    trackPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            
            this.performanceMetrics = {
                pageLoadTime: Math.round(loadTime),
                domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                firstPaint: this.getFirstPaint(),
                largestContentfulPaint: this.getLargestContentfulPaint()
            };
            
            this.logEvent('page_load', {
                loadTime: this.performanceMetrics.pageLoadTime,
                userAgent: navigator.userAgent,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    // Track user interactions
    trackUserInteractions() {
        // Track navigation clicks
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                this.logEvent('navigation_click', {
                    target: e.target.textContent,
                    href: e.target.href,
                    timestamp: new Date().toISOString()
                });
            });
        });
        
        // Track portfolio interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.logEvent('portfolio_filter', {
                    filter: e.target.getAttribute('data-filter'),
                    timestamp: new Date().toISOString()
                });
            }
            
            if (e.target.classList.contains('view-project-btn') || e.target.closest('.view-project-btn')) {
                const projectLink = e.target.closest('a') || e.target;
                this.logEvent('project_view', {
                    project: projectLink.href,
                    timestamp: new Date().toISOString()
                });
            }
            
            if (e.target.classList.contains('contact-link')) {
                this.logEvent('contact_click', {
                    method: e.target.textContent.trim(),
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        // Track interest card hovers
        document.querySelectorAll('.interest-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const interest = card.querySelector('h3').textContent;
                this.logEvent('interest_hover', {
                    interest: interest,
                    timestamp: new Date().toISOString()
                });
            });
        });
    }
    
    // Track scroll depth
    trackScrollDepth() {
        let maxScrollDepth = 0;
        const sections = document.querySelectorAll('section');
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollDepth = Math.round((scrollTop / documentHeight) * 100);
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                
                // Track section visibility
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const sectionId = section.id || section.className.split(' ')[0];
                        this.logEvent('section_view', {
                            section: sectionId,
                            scrollDepth: scrollDepth,
                            timestamp: new Date().toISOString()
                        });
                    }
                });
            }
        }, 1000));
        
        // Track final scroll depth on page unload
        this.finalScrollDepth = () => maxScrollDepth;
    }
    
    // Track performance metrics
    trackPerformanceMetrics() {
        // Track Core Web Vitals
        if ('web-vital' in window) {
            // This would integrate with Google's web-vitals library if included
            // For now, we'll track basic metrics
        }
        
        // Track resource loading
        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            const slowResources = resources.filter(resource => resource.duration > 1000);
            
            if (slowResources.length > 0) {
                this.logEvent('slow_resources', {
                    count: slowResources.length,
                    resources: slowResources.map(r => ({
                        name: r.name,
                        duration: Math.round(r.duration)
                    })),
                    timestamp: new Date().toISOString()
                });
            }
        });
    }
    
    // Get First Paint time
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? Math.round(firstPaint.startTime) : null;
    }
    
    // Get Largest Contentful Paint
    getLargestContentfulPaint() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    resolve(Math.round(lastEntry.startTime));
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } else {
                resolve(null);
            }
        });
    }
    
    // Setup page unload tracking
    setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            const sessionData = {
                sessionDuration: Math.round(performance.now() - this.startTime),
                maxScrollDepth: this.finalScrollDepth(),
                totalInteractions: this.interactions.length,
                performanceMetrics: this.performanceMetrics,
                timestamp: new Date().toISOString()
            };
            
            // Send beacon if supported (doesn't block page unload)
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/analytics', JSON.stringify({
                    event: 'session_end',
                    data: sessionData
                }));
            } else {
                // Fallback: store in localStorage for next session
                localStorage.setItem('portfolio_session_data', JSON.stringify(sessionData));
            }
        });
    }
    
    // Log events (privacy-focused)
    logEvent(eventName, data) {
        const event = {
            event: eventName,
            data: data,
            sessionId: this.getSessionId(),
            pageUrl: window.location.href
        };
        
        this.interactions.push(event);
        
        // Console log for development (remove in production)
        if (this.isDevelopment()) {
            console.log('📊 Analytics Event:', event);
        }
        
        // In production, you might want to send to an analytics service
        // this.sendToAnalyticsService(event);
    }
    
    // Generate session ID (privacy-friendly)
    getSessionId() {
        let sessionId = sessionStorage.getItem('portfolio_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            sessionStorage.setItem('portfolio_session_id', sessionId);
        }
        return sessionId;
    }
    
    // Check if in development mode
    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('github.io');
    }
    
    // Throttle function for performance
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    // Get analytics summary (for development/debugging)
    getAnalyticsSummary() {
        return {
            sessionDuration: Math.round(performance.now() - this.startTime),
            totalInteractions: this.interactions.length,
            performanceMetrics: this.performanceMetrics,
            recentEvents: this.interactions.slice(-5)
        };
    }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioAnalytics = new PortfolioAnalytics();
    
    // Expose analytics summary in development
    if (window.portfolioAnalytics.isDevelopment()) {
        window.getAnalyticsSummary = () => window.portfolioAnalytics.getAnalyticsSummary();
        console.log('📊 Analytics initialized. Type getAnalyticsSummary() to see data.');
    }
});
