// Test script for personal homepage validation
// Run this in browser console to check basic functionality

function runTests() {
    console.log('🧪 Starting Personal Homepage Tests...\n');
    
    // Test 1: Check CSS Variables
    console.log('1. Testing CSS Variables...');
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryDark = rootStyles.getPropertyValue('--primary-dark').trim();
    const accentBlue = rootStyles.getPropertyValue('--accent-blue').trim();
    
    if (primaryDark && accentBlue) {
        console.log('✅ CSS Variables loaded correctly');
        console.log(`   Primary Dark: ${primaryDark}`);
        console.log(`   Accent Blue: ${accentBlue}`);
    } else {
        console.log('❌ CSS Variables not found');
    }
    
    // Test 2: Check Navigation
    console.log('\n2. Testing Navigation...');
    const navLinks = document.querySelectorAll('.nav-menu a');
    if (navLinks.length > 0) {
        console.log(`✅ Found ${navLinks.length} navigation links`);
        navLinks.forEach(link => {
            console.log(`   - ${link.textContent}: ${link.href}`);
        });
    } else {
        console.log('❌ No navigation links found');
    }
    
    // Test 3: Check Hero Section
    console.log('\n3. Testing Hero Section...');
    const heroTitle = document.querySelector('.hero-title');
    const glitchText = document.querySelector('.glitch-text');
    const floatingElements = document.querySelector('.floating-elements');
    
    if (heroTitle && glitchText && floatingElements) {
        console.log('✅ Hero section elements found');
        console.log(`   Title: ${heroTitle.textContent}`);
        console.log(`   Glitch effect: ${glitchText ? 'Present' : 'Missing'}`);
        console.log(`   Floating elements: ${floatingElements.children.length} elements`);
    } else {
        console.log('❌ Hero section incomplete');
    }
    
    // Test 4: Check Interest Cards
    console.log('\n4. Testing Interest Cards...');
    const interestCards = document.querySelectorAll('.interest-card');
    if (interestCards.length > 0) {
        console.log(`✅ Found ${interestCards.length} interest cards`);
        interestCards.forEach((card, index) => {
            const title = card.querySelector('h3')?.textContent;
            const icon = card.querySelector('.card-icon')?.textContent;
            console.log(`   ${index + 1}. ${icon} ${title}`);
        });
    } else {
        console.log('❌ No interest cards found');
    }
    
    // Test 5: Check Portfolio Section
    console.log('\n5. Testing Portfolio Section...');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (portfolioGrid && filterButtons.length > 0) {
        console.log(`✅ Portfolio section found`);
        console.log(`   Filter buttons: ${filterButtons.length}`);
        
        // Wait a moment for JavaScript to load portfolio items
        setTimeout(() => {
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            console.log(`   Portfolio items: ${portfolioItems.length}`);
            
            if (portfolioItems.length > 0) {
                console.log('✅ Portfolio items loaded successfully');
                portfolioItems.forEach((item, index) => {
                    const title = item.querySelector('h3')?.textContent;
                    const link = item.querySelector('a')?.href;
                    console.log(`   ${index + 1}. ${title} - ${link}`);
                });
            } else {
                console.log('❌ No portfolio items loaded');
            }
        }, 1000);
    } else {
        console.log('❌ Portfolio section incomplete');
    }
    
    // Test 6: Check JavaScript Functionality
    console.log('\n6. Testing JavaScript Functions...');
    if (typeof initSmoothScrolling === 'function' &&
        typeof initPortfolioFilter === 'function' &&
        typeof loadPortfolioItems === 'function') {
        console.log('✅ Main JavaScript functions loaded');
    } else {
        console.log('❌ JavaScript functions missing');
    }
    
    // Test 7: Check Responsive Elements
    console.log('\n7. Testing Responsive Elements...');
    const container = document.querySelector('.container');
    if (container) {
        const containerStyles = getComputedStyle(container);
        console.log(`✅ Container max-width: ${containerStyles.maxWidth}`);
        console.log(`✅ Container padding: ${containerStyles.padding}`);
    }
    
    // Test 8: Check Animations
    console.log('\n8. Testing Animation Classes...');
    const animatedElements = document.querySelectorAll('[class*="animate"]');
    console.log(`✅ Found ${animatedElements.length} elements with animation classes`);
    
    // Test 9: Test Link Validation
    console.log('\n9. Testing Project Links...');
    const projectLinks = document.querySelectorAll('.view-project-btn');
    if (projectLinks.length > 0) {
        console.log(`✅ Found ${projectLinks.length} project links`);
        projectLinks.forEach((link, index) => {
            console.log(`   ${index + 1}. ${link.href}`);
        });
    } else {
        console.log('⏳ Project links not loaded yet (JavaScript may still be loading)');
    }
    
    console.log('\n🏁 Tests completed!');
    console.log('\nTo test interactivity:');
    console.log('- Try hovering over interest cards');
    console.log('- Click navigation links for smooth scrolling');
    console.log('- Click portfolio filter buttons');
    console.log('- Hover over portfolio items when they load');
}

// Auto-run tests when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTests);
} else {
    runTests();
}

// Export for manual testing
window.runTests = runTests;
