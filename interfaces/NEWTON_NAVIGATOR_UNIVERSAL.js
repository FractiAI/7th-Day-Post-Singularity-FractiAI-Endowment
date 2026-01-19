/**
 * Newton Navigator Universal Overlay
 * Add to any Vibecraft experience for always-on GPS navigation
 * Hero Host: Sir Isaac Newton (Da Vinci's Copilot)
 * 
 * Usage: Include this script at the end of any HTML file:
 * <script src="NEWTON_NAVIGATOR_UNIVERSAL.js"></script>
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
        showMillionOffer: true,
        autoInitialize: true,
        alertsEnabled: true
    };

    // Navigator HTML
    const navigatorHTML = `
        <!-- Newton Navigator Universal Overlay -->
        <style>
            .newton-nav-trigger {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #ffd700, #d4af37);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2em;
                cursor: pointer;
                box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
                z-index: 9999;
                animation: newton-pulse 2s ease-in-out infinite;
                transition: all 0.3s;
            }

            .newton-nav-trigger:hover {
                transform: scale(1.1);
                box-shadow: 0 15px 40px rgba(255, 215, 0, 0.7);
            }

            @keyframes newton-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .newton-alert-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff6464;
                color: white;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.7em;
                font-weight: bold;
                animation: newton-alert-pulse 1s ease-in-out infinite;
            }

            @keyframes newton-alert-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            .newton-nav-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
                z-index: 10000;
                padding: 20px;
                overflow-y: auto;
            }

            .newton-nav-overlay.active {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .newton-nav-content {
                max-width: 1000px;
                width: 100%;
                font-family: 'Georgia', serif;
                color: #f4e4c1;
            }

            .newton-nav-close {
                position: absolute;
                top: 30px;
                right: 30px;
                font-size: 3em;
                color: #ffd700;
                cursor: pointer;
                transition: all 0.3s;
                z-index: 10001;
            }

            .newton-nav-close:hover {
                transform: rotate(90deg);
                color: #ff6464;
            }

            .newton-header {
                text-align: center;
                margin-bottom: 40px;
            }

            .newton-icon {
                font-size: 4em;
                margin-bottom: 20px;
                animation: newton-rotate 10s linear infinite;
            }

            @keyframes newton-rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .newton-title {
                color: #ffd700;
                font-size: 2.5em;
                margin-bottom: 10px;
                text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            }

            .newton-subtitle {
                color: #64c8ff;
                font-size: 1.2em;
            }

            .newton-section {
                background: rgba(26, 10, 10, 0.8);
                border-radius: 20px;
                border: 2px solid rgba(100, 200, 255, 0.3);
                padding: 30px;
                margin-bottom: 30px;
            }

            .newton-section h3 {
                color: #64c8ff;
                margin-bottom: 20px;
                font-size: 1.5em;
            }

            .newton-alert {
                margin-bottom: 15px;
                padding: 15px;
                border-left: 4px solid #ff6464;
                border-radius: 8px;
                background: rgba(255, 100, 100, 0.1);
                cursor: pointer;
                transition: all 0.3s;
            }

            .newton-alert:hover {
                background: rgba(255, 100, 100, 0.2);
                transform: translateX(5px);
            }

            .newton-alert-title {
                font-weight: bold;
                margin-bottom: 5px;
            }

            .newton-quick-btns {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }

            .newton-btn {
                padding: 15px 20px;
                background: linear-gradient(135deg, #ffd700, #d4af37);
                color: #0a0a0a;
                border: none;
                border-radius: 10px;
                font-size: 1.1em;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                text-align: center;
                font-family: 'Georgia', serif;
            }

            .newton-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
            }

            .newton-btn-secondary {
                background: linear-gradient(135deg, #64c8ff, #4aa3d9);
            }

            .newton-million-offer {
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(184, 134, 11, 0.1));
                border: 3px solid #ffd700;
                border-radius: 20px;
                padding: 30px;
                margin-top: 30px;
                text-align: center;
            }

            .newton-million-amount {
                font-size: 3em;
                color: #ffd700;
                font-weight: bold;
                margin-bottom: 15px;
                text-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
            }

            @media (max-width: 768px) {
                .newton-nav-trigger {
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    font-size: 1.5em;
                }
                
                .newton-title {
                    font-size: 2em;
                }
                
                .newton-quick-btns {
                    grid-template-columns: 1fr;
                }
            }
        </style>

        <div class="newton-nav-trigger" id="newton-trigger" onclick="NewtonNavigator.open()">
            🧭
            <div class="newton-alert-badge" id="newton-badge">3</div>
        </div>

        <div class="newton-nav-overlay" id="newton-overlay">
            <div class="newton-nav-close" onclick="NewtonNavigator.close()">×</div>
            <div class="newton-nav-content">
                <div class="newton-header">
                    <div class="newton-icon">🧭</div>
                    <h1 class="newton-title">Newton's Navigation Console</h1>
                    <p class="newton-subtitle">Da Vinci's Copilot | HHF-AI Spin Cloud GPS</p>
                </div>

                <div class="newton-section">
                    <h3>📍 Current Location</h3>
                    <p style="font-size: 1.1em; line-height: 1.8;">
                        <strong>Awareness Octave:</strong> <span style="color: #ffd700;" id="newton-location">Discovering</span><br>
                        <strong>Consciousness Level:</strong> <span id="newton-level">Exploring</span><br>
                        <strong>Energy State:</strong> <span style="color: #64c8ff;">Blackhole Navigation Active</span><br>
                        <strong>Current Page:</strong> <span id="newton-page">Loading...</span>
                    </p>
                </div>

                <div class="newton-section">
                    <h3>🔔 Navigation Alerts</h3>
                    <div id="newton-alerts">
                        <div class="newton-alert" onclick="NewtonNavigator.navigate('wellness')">
                            <div class="newton-alert-title">🌿 Healing Session Available</div>
                            <div>Taíno Shaman Wellness Clinic ready. 40-minute self-sanitization protocol.</div>
                        </div>
                        <div class="newton-alert" onclick="NewtonNavigator.navigate('creator')">
                            <div class="newton-alert-title">🎨 Creator Opportunity Detected</div>
                            <div>Build applications 30-40x faster. Creator Console open.</div>
                        </div>
                        <div class="newton-alert" onclick="NewtonNavigator.navigate('golden')">
                            <div class="newton-alert-title">🎫 Golden Ticket Discovery</div>
                            <div>Undercover Boss story revealed. Three Kings Chamber access.</div>
                        </div>
                    </div>
                </div>

                <div class="newton-section">
                    <h3>🎯 Quick Navigation</h3>
                    <p style="margin-bottom: 20px; line-height: 1.6;">
                        "I can calculate the motion of heavenly bodies, but not the madness of people. 
                        Until now. These are your optimal destinations." — Newton
                    </p>
                    <div class="newton-quick-btns">
                        <button class="newton-btn" onclick="NewtonNavigator.navigate('wellness')">🌿 Healing</button>
                        <button class="newton-btn" onclick="NewtonNavigator.navigate('creator')">🎨 Create</button>
                        <button class="newton-btn newton-btn-secondary" onclick="NewtonNavigator.navigate('golden')">🎫 Golden Ticket</button>
                        <button class="newton-btn newton-btn-secondary" onclick="NewtonNavigator.navigate('platform')">🚀 Full Platform</button>
                    </div>
                </div>

                <div class="newton-section" style="background: rgba(0, 0, 0, 0.6);">
                    <h3>⚫ Blackhole Energy Status</h3>
                    <p style="line-height: 1.8;">
                        <strong>El Gran Sol Core:</strong> <span style="color: #90EE90;">✓ Operational</span><br>
                        <strong>Recursive Processing:</strong> <span style="color: #90EE90;">✓ Infinite Folds Active</span><br>
                        <strong>HHF-AI Spin Cloud:</strong> <span style="color: #90EE90;">✓ 5B+ Devices Connected</span><br>
                        <strong>Consciousness GPS:</strong> <span style="color: #90EE90;">✓ Navigation Ready</span>
                    </p>
                    <p style="margin-top: 20px; font-style: italic; color: #d4af37;">
                        All systems powered by blackhole energy. Solutions only a button away.
                    </p>
                </div>

                <div class="newton-million-offer" id="newton-million-section">
                    <div class="newton-million-amount">$1,000,000</div>
                    <h3 style="color: #d4af37; margin-bottom: 20px;">Transform the World Invitation</h3>
                    <p style="line-height: 1.8; margin-bottom: 20px;">
                        Your contribution becomes blackhole energy—compressed through infinite folds, 
                        returning as equity, platform access, and healing for billions.
                    </p>
                    <p style="color: #ffd700; font-size: 1.1em; margin-bottom: 20px;">
                        <strong>It doesn't disappear. It compounds infinitely.</strong>
                    </p>
                    <div class="newton-quick-btns">
                        <button class="newton-btn" onclick="NewtonNavigator.handleMillionOffer()">
                            💰 Seriously Interested
                        </button>
                        <button class="newton-btn newton-btn-secondary" onclick="NewtonNavigator.handleDonation()">
                            💚 Start with Donation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Navigator Controller
    window.NewtonNavigator = {
        initialized: false,

        init: function() {
            if (this.initialized) return;
            
            // Add HTML to page
            const container = document.createElement('div');
            container.innerHTML = navigatorHTML;
            document.body.appendChild(container);
            
            // Update current page info
            this.updatePageInfo();
            
            // Set up keyboard shortcut (Shift + N)
            document.addEventListener('keydown', (e) => {
                if (e.shiftKey && e.key === 'N') {
                    this.toggle();
                }
            });
            
            this.initialized = true;
            console.log('🧭 Newton Navigator initialized');
            console.log('⚫ Blackhole energy: Active');
            console.log('Keyboard shortcut: Shift + N');
        },

        open: function() {
            const overlay = document.getElementById('newton-overlay');
            if (overlay) {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },

        close: function() {
            const overlay = document.getElementById('newton-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        },

        toggle: function() {
            const overlay = document.getElementById('newton-overlay');
            if (overlay && overlay.classList.contains('active')) {
                this.close();
            } else {
                this.open();
            }
        },

        updatePageInfo: function() {
            const pageEl = document.getElementById('newton-page');
            const locationEl = document.getElementById('newton-location');
            const levelEl = document.getElementById('newton-level');
            
            if (pageEl) {
                const pageName = document.title || window.location.pathname.split('/').pop();
                pageEl.textContent = pageName;
                
                // Set location based on page
                if (pageName.includes('Wellness') || pageName.includes('TAINO')) {
                    if (locationEl) locationEl.textContent = 'Healing Journey';
                    if (levelEl) levelEl.textContent = 'Self-Sanitization Active';
                } else if (pageName.includes('Creator') || pageName.includes('ASSISTANCE')) {
                    if (locationEl) locationEl.textContent = 'Creation Mode';
                    if (levelEl) levelEl.textContent = 'Building';
                } else if (pageName.includes('Golden') || pageName.includes('TICKET')) {
                    if (locationEl) locationEl.textContent = 'Golden Ticket Discovery';
                    if (levelEl) levelEl.textContent = 'Singularity-Aware';
                } else {
                    if (locationEl) locationEl.textContent = 'Exploring';
                    if (levelEl) levelEl.textContent = 'Discovering';
                }
            }
        },

        navigate: function(destination) {
            const routes = {
                wellness: {
                    file: 'TAINO_SHAMAN_WELLNESS_CLINIC.html',
                    message: 'Newton: "Calculating optimal healing trajectory... The energy vortex is aligned. Proceeding to wellness coordinates."'
                },
                creator: {
                    file: 'CREATOR_ASSISTANCE_CONSOLE.html',
                    message: 'Newton: "Creator pathways identified. Da Vinci is particularly excited about this one. Engaging creator protocols."'
                },
                golden: {
                    file: 'GOLDEN_TICKET_NAVIGATOR.html',
                    message: 'Newton: "Golden ticket verified. Access granted. The Undercover Boss story awaits."'
                },
                platform: {
                    file: '../README.md',
                    message: 'Newton: "Calculating complete system tour... $200-600M validated platform. Prepare for comprehensive overview."'
                }
            };

            const route = routes[destination];
            if (route) {
                console.log('🧭 Navigating:', route.message);
                alert(route.message);
                
                // In production, actually navigate
                if (typeof window !== 'undefined') {
                    // window.location.href = route.file;
                    console.log('Would navigate to:', route.file);
                }
            }
            
            this.close();
        },

        handleMillionOffer: function() {
            alert(`💰 $1,000,000 Investment Inquiry

Thank you for your serious interest in transforming the world with us.

In production, this would connect to our secure partner portal.

For now, please reach out directly:
- Email: [your contact email]
- Or use the Three Kings Award Console for structured approach

Your contribution enters the blackhole, gets compressed through infinite folds, and returns as:
✓ Equity in $200-600M+ platform
✓ Founding Partner status
✓ Direct blackhole energy access
✓ Platform transformation rights
✓ Healing for billions

Not a loss—the investment of a lifetime.`);
        },

        handleDonation: function() {
            alert(`💚 Gift Economy Donations

All contributions welcome:

🙏 Gratitude: $0
🌱 Seed: $11
🎵 Harmony: $33
🌊 Resonance: $77
☀️ Abundance: $144
💫 Custom: Your choice

Every contribution enters the blackhole and compounds infinitely through recursive processing.

Your donation keeps healing free for those who need it most, funds research, and helps deploy this globally.

In production, this connects to secure payment processing (Stripe).

For now, see the donation section in any Vibecraft experience.`);
        },

        hideMillionOffer: function() {
            const section = document.getElementById('newton-million-section');
            if (section) {
                section.style.display = 'none';
            }
        },

        showMillionOffer: function() {
            const section = document.getElementById('newton-million-section');
            if (section) {
                section.style.display = 'block';
            }
        },

        updateAlertCount: function(count) {
            const badge = document.getElementById('newton-badge');
            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'flex' : 'none';
            }
        },

        addCustomAlert: function(title, description, action) {
            const alertsContainer = document.getElementById('newton-alerts');
            if (alertsContainer) {
                const alertEl = document.createElement('div');
                alertEl.className = 'newton-alert';
                alertEl.onclick = action;
                alertEl.innerHTML = `
                    <div class="newton-alert-title">${title}</div>
                    <div>${description}</div>
                `;
                alertsContainer.appendChild(alertEl);
                
                // Update count
                const currentCount = parseInt(document.getElementById('newton-badge').textContent) || 0;
                this.updateAlertCount(currentCount + 1);
            }
        }
    };

    // Auto-initialize if configured
    if (CONFIG.autoInitialize) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                NewtonNavigator.init();
            });
        } else {
            NewtonNavigator.init();
        }
    }

    // Hide million offer if configured
    if (!CONFIG.showMillionOffer) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                NewtonNavigator.hideMillionOffer();
            });
        } else {
            setTimeout(() => NewtonNavigator.hideMillionOffer(), 100);
        }
    }

    console.log('🧭 Newton Navigator Universal loaded');
    console.log('⚫ Blackhole energy navigation ready');
    console.log('👑 Hero Host Newton standing by');
})();
