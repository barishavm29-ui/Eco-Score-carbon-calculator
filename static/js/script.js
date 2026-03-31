// ========== GLOBAL VARIABLES ==========

let currentStep = 1;
let calculationResult = null;

// ========== THEME TOGGLE (DARK/LIGHT MODE) ==========

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

// Update icon based on theme
const themeIcon = document.getElementById('themeIcon');
if (themeIcon) {
    themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon with animation
        const icon = document.getElementById('themeIcon');
        icon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            icon.style.transform = 'rotate(0deg)';
        }, 300);
        
        // Play sound effect
        playSound('toggle');
    });
}

// ========== SOUND EFFECTS ==========

const sounds = {
    toggle: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVKjk',
    click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVKjk',
    success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUQ0PVKjk'
};

function playSound(type) {
    // Sound disabled for now - can enable with actual audio files
    // const audio = new Audio(sounds[type]);
    // audio.volume = 0.3;
    // audio.play();
}

// ========== ANIMATED COUNTER ==========

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.ceil(target).toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.ceil(current).toLocaleString();
        }
    }, 16);
}

// Animate counters on page load
window.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter-number');
    
    // Use Intersection Observer for scroll-triggered animation
    const observerOptions = {
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});

// ========== SCROLL REVEAL ANIMATIONS ==========

const revealElements = document.querySelectorAll('.scroll-reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, index * 100); // Stagger animation
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ========== CALCULATOR - MULTI-STEP FORM ==========

function nextStep(step) {
    // Validate current step before moving
    if (!validateStep(currentStep)) {
        return;
    }
    
    playSound('click');
    
    // Hide current step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Show next step
    currentStep = step;
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    playSound('click');
    
    // Hide current step
    document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Show previous step
    currentStep = step;
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(step) {
    const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = stepElement.querySelectorAll('input[required], select[required]');
    
    for (let input of inputs) {
        if (!input.value) {
            showNotification(`Please fill in: ${input.previousElementSibling.textContent}`, 'warning');
            input.focus();
            return false;
        }
    }
    return true;
}

// ========== NOTIFICATION SYSTEM ==========

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ========== FORM SUBMISSION ==========

if (document.getElementById('carbonForm')) {
    document.getElementById('carbonForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate final step
        if (!validateStep(4)) {
            return;
        }
        
        playSound('click');
        
        // Show loading
        document.getElementById('carbonForm').style.display = 'none';
        document.querySelector('.progress-bar').style.display = 'none';
        document.getElementById('loadingSpinner').style.display = 'block';
        
        // Collect form data
        const formData = {
            transport_mode: document.getElementById('transport_mode').value,
            transport_distance: document.getElementById('transport_distance').value,
            electricity_units: document.getElementById('electricity_units').value,
            electricity_source: document.getElementById('electricity_source').value,
            diet_type: document.getElementById('diet_type').value,
            domestic_flights: document.getElementById('domestic_flights').value,
            international_flights: document.getElementById('international_flights').value
        };
        
        try {
            // Send to backend
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                playSound('success');
                
                // Store result in sessionStorage
                sessionStorage.setItem('carbonResult', JSON.stringify(result));
                
                showNotification('Calculation complete! Redirecting...', 'success');
                
                // Redirect to dashboard after short delay
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                showNotification('Error: ' + result.error, 'warning');
                document.getElementById('carbonForm').style.display = 'block';
                document.querySelector('.progress-bar').style.display = 'flex';
                document.getElementById('loadingSpinner').style.display = 'none';
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Something went wrong. Please try again.', 'warning');
            document.getElementById('carbonForm').style.display = 'block';
            document.querySelector('.progress-bar').style.display = 'flex';
            document.getElementById('loadingSpinner').style.display = 'none';
        }
    });
}

// ========== DASHBOARD - LOAD RESULTS ==========

function loadDashboardData() {
    // Get result from sessionStorage
    const resultString = sessionStorage.getItem('carbonResult');
    
    if (!resultString) {
        showNotification('No calculation found. Please use the calculator first.', 'warning');
        setTimeout(() => {
            window.location.href = '/calculator';
        }, 2000);
        return;
    }
    
    const result = JSON.parse(resultString);
    calculationResult = result;
    
    // Update Score Card
    updateScoreCard(result);
    
    // Update CO2 Banner
    updateCO2Banner(result);
    
    // Update Breakdown Table
    updateBreakdownTable(result);
    
    // Create Charts
    createBarChart(result);
    createComparisonChart(result);
    
    // Load Recommendations
    loadRecommendations(result);
    
    // Load Badges
    loadBadges(result);
    
    // Play success sound
    playSound('success');
}

function updateScoreCard(result) {
    // Animate score number
    const scoreElement = document.getElementById('scoreNumber');
    animateCounter(scoreElement, result.score, 2000);
    
    document.getElementById('scoreEmoji').textContent = result.score_emoji;
    document.getElementById('scoreLevel').textContent = result.score_level;
    
    // Score-based message
    let message = '';
    if (result.score >= 800) {
        message = '🌟 Outstanding! You\'re making a real difference for our planet!';
    } else if (result.score >= 650) {
        message = '🌱 Great job! You\'re on the right track to sustainability!';
    } else if (result.score >= 500) {
        message = '💪 Good start! There\'s room for improvement. Let\'s reduce that footprint!';
    } else {
        message = '🌍 Your impact is high, but don\'t worry - small changes can make a big difference!';
    }
    
    document.getElementById('scoreMessage').textContent = message;
    
    // Change card color based on score
    const scoreCard = document.getElementById('scoreCardMain');
    if (result.score >= 800) {
        scoreCard.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    } else if (result.score >= 500) {
        scoreCard.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    } else {
        scoreCard.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    }
}

function updateCO2Banner(result) {
    const co2Element = document.getElementById('totalCO2');
    
    // Animate CO2 value
    let current = 0;
    const target = result.total_co2;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            co2Element.textContent = target.toFixed(2) + ' tons';
            clearInterval(timer);
        } else {
            co2Element.textContent = current.toFixed(2) + ' tons';
        }
    }, 16);
}

function updateBreakdownTable(result) {
    // Transport
    document.getElementById('transportCO2').textContent = result.breakdown.transport;
    document.getElementById('transportPercent').textContent = result.breakdown_percentage.transport + '%';
    
    // Animate bars
    setTimeout(() => {
        document.getElementById('transportBar').style.width = result.breakdown_percentage.transport + '%';
    }, 500);
    
    // Electricity
    document.getElementById('electricityCO2').textContent = result.breakdown.electricity;
    document.getElementById('electricityPercent').textContent = result.breakdown_percentage.electricity + '%';
    setTimeout(() => {
        document.getElementById('electricityBar').style.width = result.breakdown_percentage.electricity + '%';
    }, 700);
    
    // Diet
    document.getElementById('dietCO2').textContent = result.breakdown.diet;
    document.getElementById('dietPercent').textContent = result.breakdown_percentage.diet + '%';
    setTimeout(() => {
        document.getElementById('dietBar').style.width = result.breakdown_percentage.diet + '%';
    }, 900);
    
    // Flights
    document.getElementById('flightsCO2').textContent = result.breakdown.flights;
    document.getElementById('flightsPercent').textContent = result.breakdown_percentage.flights + '%';
    setTimeout(() => {
        document.getElementById('flightsBar').style.width = result.breakdown_percentage.flights + '%';
    }, 1100);
}

function createBarChart(result) {
    const data = [{
        x: ['🚗 Transport', '⚡ Electricity', '🍽️ Diet', '✈️ Flights'],
        y: [
            result.breakdown.transport,
            result.breakdown.electricity,
            result.breakdown.diet,
            result.breakdown.flights
        ],
        type: 'bar',
        marker: {
            color: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
            line: {
                width: 2,
                color: 'rgba(0,0,0,0.1)'
            }
        },
        text: [
            result.breakdown.transport + ' tons',
            result.breakdown.electricity + ' tons',
            result.breakdown.diet + ' tons',
            result.breakdown.flights + ' tons'
        ],
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>%{y:.2f} tons CO₂<extra></extra>'
    }];
    
    const layout = {
        title: '',
        xaxis: { 
            title: '',
            tickfont: { size: 14 }
        },
        yaxis: { 
            title: 'CO₂ Emissions (tons/year)',
            tickfont: { size: 12 }
        },
        margin: { t: 20, b: 60, l: 60, r: 20 },
        height: 350,
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: {
            family: 'Segoe UI, sans-serif'
        }
    };
    
    const config = {
        responsive: true,
        displayModeBar: false
    };
    
    Plotly.newPlot('barChart', data, layout, config);
}

function createComparisonChart(result) {
    const data = [{
        x: ['You', 'India Average', 'World Average', 'Paris Target'],
        y: [
            result.total_co2,
            result.comparisons.india_avg,
            result.comparisons.world_avg,
            result.comparisons.paris_target
        ],
        type: 'bar',
        marker: {
            color: ['#3b82f6', '#6b7280', '#9ca3af', '#10b981'],
            line: {
                width: 2,
                color: 'rgba(0,0,0,0.1)'
            }
        },
        text: [
            result.total_co2.toFixed(2) + ' tons',
            '1.9 tons',
            '4.0 tons',
            '2.0 tons'
        ],
        textposition: 'outside',
        hovertemplate: '<b>%{x}</b><br>%{y:.2f} tons CO₂/year<extra></extra>'
    }];
    
    const layout = {
        title: '',
        xaxis: { 
            title: '',
            tickfont: { size: 14 }
        },
        yaxis: { 
            title: 'Annual CO₂ Emissions (tons)',
            tickfont: { size: 12 }
        },
        margin: { t: 20, b: 80, l: 60, r: 20 },
        height: 350,
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: {
            family: 'Segoe UI, sans-serif'
        },
        annotations: [
            {
                x: 'Paris Target',
                y: 2.0,
                text: '2030 Goal',
                showarrow: true,
                arrowhead: 2,
                ax: 0,
                ay: -40,
                font: { color: '#10b981', size: 12 }
            }
        ]
    };
    
    const config = {
        responsive: true,
        displayModeBar: false
    };
    
    Plotly.newPlot('comparisonChart', data, layout, config);
}

// ========== RECOMMENDATIONS ==========

async function loadRecommendations(result) {
    try {
        const response = await fetch('/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                total_co2: result.total_co2,
                breakdown: result.breakdown_percentage
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayRecommendations(data.recommendations);
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
        document.getElementById('recommendationsGrid').innerHTML = 
            '<p style="color: var(--text-secondary); text-align: center;">Unable to load recommendations. Please refresh the page.</p>';
    }
}

function displayRecommendations(recommendations) {
    const grid = document.getElementById('recommendationsGrid');
    grid.innerHTML = '';
    
    recommendations.forEach((rec, index) => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="rec-header">
                <span class="rec-icon">${rec.icon}</span>
                <span class="rec-category">${rec.category}</span>
            </div>
            <p class="rec-tip">${rec.tip}</p>
            <p class="rec-impact">💚 ${rec.impact}</p>
            <span class="rec-difficulty ${rec.difficulty}">${rec.difficulty}</span>
        `;
        grid.appendChild(card);
    });
}

// ========== BADGES / GAMIFICATION ==========

function loadBadges(result) {
    const badges = [
        {
            name: 'First Step',
            icon: '🌱',
            description: 'Completed first calculation',
            earned: true
        },
        {
            name: 'Eco Warrior',
            icon: '⚔️',
            description: 'Score above 800',
            earned: result.score >= 800
        },
        {
            name: 'Below Average',
            icon: '🎯',
            description: 'Footprint below world average',
            earned: result.total_co2 < 4.0
        },
        {
            name: 'Paris Achiever',
            icon: '🏆',
            description: 'Footprint below 2 tons',
            earned: result.total_co2 <= 2.0
        },
        {
            name: 'Green Commuter',
            icon: '🚴',
            description: 'Low transport emissions',
            earned: result.breakdown_percentage.transport < 20
        },
        {
            name: 'Energy Saver',
            icon: '💡',
            description: 'Low electricity emissions',
            earned: result.breakdown_percentage.electricity < 25
        },
        {
            name: 'Plant-Based',
            icon: '🥗',
            description: 'Vegetarian or vegan diet',
            earned: result.breakdown_percentage.diet < 15
        },
        {
            name: 'Ground Traveler',
            icon: '🚂',
            description: 'Minimal flight emissions',
            earned: result.breakdown_percentage.flights < 10
        }
    ];
    
    const badgesGrid = document.getElementById('badgesGrid');
    badgesGrid.innerHTML = '';
    
    let earnedCount = 0;
    
    badges.forEach((badge, index) => {
        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card ${badge.earned ? 'earned' : 'locked'}`;
        badgeCard.style.animationDelay = `${index * 0.1}s`;
        badgeCard.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <small>${badge.description}</small>
        `;
        
        if (badge.earned) {
            earnedCount++;
            badgeCard.addEventListener('click', () => {
                playSound('success');
                showNotification(`🎉 Badge: ${badge.name} - ${badge.description}`, 'success');
            });
        }
        
        badgesGrid.appendChild(badgeCard);
    });
    
    // Show notification for earned badges
    if (earnedCount > 1) {
        setTimeout(() => {
            showNotification(`🏆 You've earned ${earnedCount} badges!`, 'success');
        }, 1500);
    }
}

// ========== DOWNLOAD PDF REPORT ==========

function downloadReport() {
    if (!calculationResult) {
        showNotification('No data to download', 'warning');
        return;
    }
    
    showNotification('📄 PDF generation coming soon! For now, take a screenshot of your dashboard.', 'info');
    
    // TODO: Implement actual PDF generation
    // Can use jsPDF library or backend PDF generation with fpdf
}

// ========== SHARE RESULTS ==========

function shareResults() {
    if (!calculationResult) {
        showNotification('No data to share', 'warning');
        return;
    }
    
    // Update modal content
    document.getElementById('modalScore').textContent = calculationResult.score;
    document.getElementById('modalCO2').textContent = calculationResult.total_co2;
    
    // Show modal
    document.getElementById('shareModal').style.display = 'flex';
    playSound('click');
}

function closeModal() {
    document.getElementById('shareModal').style.display = 'none';
    playSound('click');
}

function shareToTwitter() {
    const text = `🌍 I scored ${calculationResult.score}/1000 on my EcoScore! My carbon footprint is ${calculationResult.total_co2} tons/year. Join me in fighting climate change! 🌱 #EcoScore #ClimateAction`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    playSound('click');
}

function shareToWhatsApp() {
    const text = `🌍 I scored ${calculationResult.score}/1000 on my EcoScore! My carbon footprint is ${calculationResult.total_co2} tons/year. Join me in fighting climate change! 🌱`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    playSound('click');
}

function copyShareText() {
    const text = `🌍 I scored ${calculationResult.score}/1000 on my EcoScore! My carbon footprint is ${calculationResult.total_co2} tons/year. Join me in fighting climate change! 🌱`;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✅ Text copied to clipboard!', 'success');
        playSound('success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('❌ Failed to copy text', 'warning');
    });
}

// ========== SMOOTH SCROLLING ==========

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            playSound('click');
        }
    });
});

// ========== CLOSE MODAL ON OUTSIDE CLICK ==========

window.addEventListener('click', function(e) {
    const modal = document.getElementById('shareModal');
    if (e.target === modal) {
        closeModal();
    }
});

// ========== PARALLAX EFFECT ON HERO ==========

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 700);
    }
});

// ========== CONSOLE EASTER EGG ==========

console.log('%c🌍 EcoScore - Carbon Footprint Calculator', 'color: #10b981; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ for a sustainable future', 'color: #6b7280; font-size: 14px;');
console.log('%cWant to contribute? Check out our GitHub!', 'color: #3b82f6; font-size: 12px;');

console.log('🌍 EcoScore JavaScript Loaded Successfully! 🚀');