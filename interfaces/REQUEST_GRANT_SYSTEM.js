/**
 * Request Grant System - Universal Component
 * 4th payment/donation option: Request Grant (Pay What You Can)
 * Captures request info, processes grant, captures review results
 * 
 * Usage: Include in any demo/application
 * Appears alongside donation/payment options
 */

(function() {
    'use strict';

    // Grant System State
    const GrantState = {
        pendingRequests: [],
        approvedGrants: [],
        reviewsCollected: []
    };

    // Grant Request Form HTML
    const grantFormHTML = `
        <style>
            .grant-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
                z-index: 11000;
                padding: 20px;
                overflow-y: auto;
            }

            .grant-modal.active {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .grant-form-container {
                background: linear-gradient(135deg, rgba(26, 10, 10, 0.95), rgba(10, 10, 26, 0.95));
                border: 3px solid #90EE90;
                border-radius: 20px;
                padding: 40px;
                max-width: 700px;
                width: 100%;
                font-family: 'Georgia', serif;
                color: #f4e4c1;
                position: relative;
            }

            .grant-close {
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 2em;
                color: #90EE90;
                cursor: pointer;
                transition: all 0.3s;
            }

            .grant-close:hover {
                transform: rotate(90deg);
                color: #ff6464;
            }

            .grant-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .grant-icon {
                font-size: 4em;
                margin-bottom: 15px;
            }

            .grant-title {
                color: #90EE90;
                font-size: 2em;
                margin-bottom: 10px;
            }

            .grant-subtitle {
                color: #64c8ff;
                font-size: 1.1em;
                line-height: 1.6;
            }

            .grant-form-group {
                margin-bottom: 25px;
            }

            .grant-label {
                display: block;
                color: #90EE90;
                font-size: 1.1em;
                margin-bottom: 10px;
                font-weight: bold;
            }

            .grant-label .required {
                color: #ff6464;
            }

            .grant-input,
            .grant-textarea,
            .grant-select {
                width: 100%;
                padding: 15px;
                background: rgba(0, 0, 0, 0.5);
                border: 2px solid rgba(144, 238, 144, 0.3);
                border-radius: 10px;
                color: #f4e4c1;
                font-size: 1em;
                font-family: 'Georgia', serif;
                transition: all 0.3s;
            }

            .grant-input:focus,
            .grant-textarea:focus,
            .grant-select:focus {
                outline: none;
                border-color: #90EE90;
                box-shadow: 0 0 20px rgba(144, 238, 144, 0.3);
            }

            .grant-textarea {
                min-height: 120px;
                resize: vertical;
            }

            .grant-info-box {
                background: rgba(144, 238, 144, 0.1);
                border-left: 4px solid #90EE90;
                padding: 20px;
                border-radius: 10px;
                margin: 25px 0;
                line-height: 1.8;
            }

            .grant-button {
                width: 100%;
                padding: 18px;
                background: linear-gradient(135deg, #90EE90, #60c060);
                color: #0a0a0a;
                border: none;
                border-radius: 15px;
                font-size: 1.3em;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Georgia', serif;
                margin-top: 20px;
            }

            .grant-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(144, 238, 144, 0.5);
            }

            .grant-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Approval/Review Screen */
            .grant-approval-screen {
                display: none;
                text-align: center;
            }

            .grant-approval-screen.active {
                display: block;
            }

            .grant-approval-icon {
                font-size: 6em;
                margin: 30px 0;
                animation: grant-bounce 1s ease-in-out;
            }

            @keyframes grant-bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            .grant-amount-selector {
                margin: 30px 0;
            }

            .grant-amount-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }

            .grant-amount-btn {
                padding: 15px;
                background: rgba(144, 238, 144, 0.2);
                border: 2px solid rgba(144, 238, 144, 0.5);
                border-radius: 10px;
                color: #90EE90;
                font-size: 1.1em;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Georgia', serif;
            }

            .grant-amount-btn:hover,
            .grant-amount-btn.selected {
                background: rgba(144, 238, 144, 0.3);
                border-color: #90EE90;
                transform: scale(1.05);
            }

            .grant-custom-amount {
                margin-top: 15px;
            }

            /* Review Form */
            .grant-review-form {
                display: none;
                margin-top: 30px;
            }

            .grant-review-form.active {
                display: block;
            }

            @media (max-width: 768px) {
                .grant-form-container {
                    padding: 25px;
                }

                .grant-title {
                    font-size: 1.5em;
                }

                .grant-amount-options {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        </style>

        <div class="grant-modal" id="grant-modal">
            <div class="grant-form-container">
                <div class="grant-close" onclick="RequestGrantSystem.close()">&times;</div>

                <!-- Request Form -->
                <div id="grant-request-form" class="grant-request-form active">
                    <div class="grant-header">
                        <div class="grant-icon">🌱</div>
                        <h2 class="grant-title">Request Grant Access</h2>
                        <p class="grant-subtitle">
                            Can't afford it? No problem. Request grant access and pay what you can after using it.
                        </p>
                    </div>

                    <div class="grant-info-box">
                        <strong style="color: #90EE90;">How This Works:</strong><br>
                        1. Tell us about your need and situation<br>
                        2. We review and approve (usually instant)<br>
                        3. Get full access immediately<br>
                        4. After using, share your experience<br>
                        5. Pay what you can (even $0 is fine)
                    </div>

                    <form id="grant-request-form-data" onsubmit="RequestGrantSystem.submitRequest(event)">
                        <div class="grant-form-group">
                            <label class="grant-label">
                                Your Name <span class="required">*</span>
                            </label>
                            <input type="text" class="grant-input" name="name" required 
                                   placeholder="How should we address you?">
                        </div>

                        <div class="grant-form-group">
                            <label class="grant-label">
                                Email <span class="required">*</span>
                            </label>
                            <input type="email" class="grant-input" name="email" required 
                                   placeholder="Where should we send your grant approval?">
                        </div>

                        <div class="grant-form-group">
                            <label class="grant-label">
                                What do you need this for? <span class="required">*</span>
                            </label>
                            <textarea class="grant-textarea" name="need" required 
                                      placeholder="Tell us about your situation. Why do you need grant access? What would this help you accomplish?"></textarea>
                        </div>

                        <div class="grant-form-group">
                            <label class="grant-label">
                                Your Current Situation
                            </label>
                            <select class="grant-select" name="situation">
                                <option value="">Select one...</option>
                                <option value="student">Student/Learning</option>
                                <option value="financial">Financial Hardship</option>
                                <option value="health">Health/Wellness Focus</option>
                                <option value="nonprofit">Nonprofit/Community Work</option>
                                <option value="creative">Creative Project</option>
                                <option value="research">Research/Development</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div class="grant-form-group">
                            <label class="grant-label">
                                Anything else we should know?
                            </label>
                            <textarea class="grant-textarea" name="additional" 
                                      placeholder="Optional: Share anything else that might help us understand your request."></textarea>
                        </div>

                        <button type="submit" class="grant-button">
                            🌱 Submit Grant Request
                        </button>
                    </form>
                </div>

                <!-- Approval Screen -->
                <div id="grant-approval-screen" class="grant-approval-screen">
                    <div class="grant-approval-icon">✅</div>
                    <h2 class="grant-title">Grant Approved!</h2>
                    <p class="grant-subtitle" style="margin-bottom: 30px;">
                        Welcome, <strong id="grant-approved-name">Friend</strong>! 
                        You now have full access.
                    </p>

                    <div class="grant-info-box">
                        <strong style="color: #90EE90;">Your Grant Includes:</strong><br>
                        ✓ Complete platform access<br>
                        ✓ All features unlocked<br>
                        ✓ Hero Host AI assistance<br>
                        ✓ Priority support<br>
                        ✓ Community membership
                    </div>

                    <button class="grant-button" onclick="RequestGrantSystem.showPayWhatYouCan()">
                        Continue to Experience
                    </button>
                </div>

                <!-- Pay What You Can (After Review) -->
                <div id="grant-payment-screen" class="grant-approval-screen">
                    <div class="grant-header">
                        <div class="grant-icon">💚</div>
                        <h2 class="grant-title">How Was Your Experience?</h2>
                        <p class="grant-subtitle">
                            Share your results and contribute what feels right to you.
                        </p>
                    </div>

                    <!-- Review Form -->
                    <div class="grant-review-form active">
                        <div class="grant-form-group">
                            <label class="grant-label">Share Your Experience</label>
                            <textarea class="grant-textarea" id="grant-review-text" 
                                      placeholder="What happened? How did this help you? What changed?"></textarea>
                        </div>

                        <div class="grant-form-group">
                            <label class="grant-label">Rating</label>
                            <select class="grant-select" id="grant-rating">
                                <option value="5">⭐⭐⭐⭐⭐ Life-changing</option>
                                <option value="4">⭐⭐⭐⭐ Extremely helpful</option>
                                <option value="3">⭐⭐⭐ Very good</option>
                                <option value="2">⭐⭐ Helpful</option>
                                <option value="1">⭐ Good</option>
                            </select>
                        </div>
                    </div>

                    <!-- Pay What You Can -->
                    <div class="grant-amount-selector">
                        <h3 style="color: #90EE90; margin-bottom: 20px;">Pay What You Can</h3>
                        <p style="margin-bottom: 20px; line-height: 1.6;">
                            <em>This is optional. Any amount helps us keep grants available. $0 is completely fine.</em>
                        </p>

                        <div class="grant-amount-options">
                            <button class="grant-amount-btn" onclick="RequestGrantSystem.selectAmount(0)">
                                $0<br><small>Gratitude</small>
                            </button>
                            <button class="grant-amount-btn" onclick="RequestGrantSystem.selectAmount(5)">
                                $5<br><small>Seed</small>
                            </button>
                            <button class="grant-amount-btn" onclick="RequestGrantSystem.selectAmount(11)">
                                $11<br><small>Thanks</small>
                            </button>
                            <button class="grant-amount-btn" onclick="RequestGrantSystem.selectAmount(33)">
                                $33<br><small>Harmony</small>
                            </button>
                            <button class="grant-amount-btn" onclick="RequestGrantSystem.selectAmount(77)">
                                $77<br><small>Flow</small>
                            </button>
                            <button class="grant-amount-btn" onclick="RequestGrantSystem.selectAmount('custom')">
                                Custom<br><small>Your choice</small>
                            </button>
                        </div>

                        <div class="grant-custom-amount" id="grant-custom-amount" style="display: none;">
                            <input type="number" class="grant-input" id="grant-custom-value" 
                                   placeholder="Enter any amount (even $1)" min="0" step="0.01">
                        </div>

                        <button class="grant-button" onclick="RequestGrantSystem.processPayment()">
                            💚 Complete & Share Review
                        </button>
                    </div>
                </div>

                <!-- Thank You Screen -->
                <div id="grant-thankyou-screen" class="grant-approval-screen">
                    <div class="grant-approval-icon">🙏</div>
                    <h2 class="grant-title">Thank You!</h2>
                    <p class="grant-subtitle" id="grant-thankyou-message">
                        Your contribution helps us provide more grants to others in need.
                    </p>
                    <button class="grant-button" onclick="RequestGrantSystem.close()">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    // Request Grant System Controller
    window.RequestGrantSystem = {
        initialized: false,
        currentAmount: 0,
        currentGrantData: {},

        init: function() {
            if (this.initialized) return;

            // Add HTML to page
            const container = document.createElement('div');
            container.innerHTML = grantFormHTML;
            document.body.appendChild(container);

            this.initialized = true;
            console.log('🌱 Request Grant System initialized');
        },

        open: function() {
            const modal = document.getElementById('grant-modal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                this.resetForm();
            }
        },

        close: function() {
            const modal = document.getElementById('grant-modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        },

        resetForm: function() {
            // Show request form, hide others
            document.getElementById('grant-request-form').classList.add('active');
            document.getElementById('grant-approval-screen').classList.remove('active');
            document.getElementById('grant-payment-screen').classList.remove('active');
            document.getElementById('grant-thankyou-screen').classList.remove('active');
        },

        submitRequest: function(event) {
            event.preventDefault();

            const form = document.getElementById('grant-request-form-data');
            const formData = new FormData(form);
            
            this.currentGrantData = {
                name: formData.get('name'),
                email: formData.get('email'),
                need: formData.get('need'),
                situation: formData.get('situation'),
                additional: formData.get('additional'),
                timestamp: new Date().toISOString()
            };

            // Store in state
            GrantState.pendingRequests.push(this.currentGrantData);

            // Save to local storage with sync
            if (window.StorageSyncProtocol) {
                window.StorageSyncProtocol.saveGrantRequest(this.currentGrantData);
            }

            // In production: Send to backend API
            console.log('Grant Request Submitted:', this.currentGrantData);

            // Auto-approve for demo (in production, would be reviewed)
            setTimeout(() => {
                this.approveGrant();
            }, 1000);
        },

        approveGrant: function() {
            // Move to approved
            GrantState.approvedGrants.push(this.currentGrantData);

            // Show approval screen
            document.getElementById('grant-request-form').classList.remove('active');
            document.getElementById('grant-approval-screen').classList.add('active');
            document.getElementById('grant-approved-name').textContent = this.currentGrantData.name;

            console.log('✅ Grant Approved:', this.currentGrantData.name);
        },

        showPayWhatYouCan: function() {
            // Hide approval, show payment/review screen
            document.getElementById('grant-approval-screen').classList.remove('active');
            document.getElementById('grant-payment-screen').classList.add('active');
        },

        selectAmount: function(amount) {
            // Deselect all buttons
            document.querySelectorAll('.grant-amount-btn').forEach(btn => {
                btn.classList.remove('selected');
            });

            // Select clicked button
            event.target.closest('.grant-amount-btn').classList.add('selected');

            if (amount === 'custom') {
                document.getElementById('grant-custom-amount').style.display = 'block';
                this.currentAmount = 0;
            } else {
                document.getElementById('grant-custom-amount').style.display = 'none';
                this.currentAmount = amount;
            }
        },

        processPayment: function() {
            // Get custom amount if set
            const customInput = document.getElementById('grant-custom-value');
            if (customInput.value) {
                this.currentAmount = parseFloat(customInput.value) || 0;
            }

            // Get review data
            const reviewText = document.getElementById('grant-review-text').value;
            const rating = document.getElementById('grant-rating').value;

            const reviewData = {
                ...this.currentGrantData,
                review: reviewText,
                rating: parseInt(rating),
                contribution: this.currentAmount,
                completedAt: new Date().toISOString()
            };

            // Store review
            GrantState.reviewsCollected.push(reviewData);

            // Save review to local storage with sync
            if (window.StorageSyncProtocol) {
                window.StorageSyncProtocol.storage.append('nspfrnp_grant_reviews', reviewData);
            }

            // In production: Send to backend, process payment
            console.log('Grant Review & Payment:', reviewData);

            // Show thank you
            this.showThankYou();
        },

        showThankYou: function() {
            document.getElementById('grant-payment-screen').classList.remove('active');
            document.getElementById('grant-thankyou-screen').classList.add('active');

            const message = document.getElementById('grant-thankyou-message');
            if (this.currentAmount === 0) {
                message.textContent = "No payment necessary! Your review helps others discover this. Thank you for sharing your experience!";
            } else {
                message.textContent = `Your $${this.currentAmount} contribution helps us provide more grants to others in need. You're making this accessible for everyone!`;
            }
        },

        // Helper: Add grant button to any payment section
        addGrantButtonTo: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const grantBtn = document.createElement('button');
            grantBtn.className = 'grant-trigger-btn';
            grantBtn.innerHTML = '🌱 Request Grant (Pay What You Can)';
            grantBtn.onclick = () => this.open();
            
            // Styling for the trigger button
            grantBtn.style.cssText = `
                padding: 18px 30px;
                background: linear-gradient(135deg, #90EE90, #60c060);
                color: #0a0a0a;
                border: none;
                border-radius: 15px;
                font-size: 1.2em;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Georgia', serif;
                width: 100%;
                margin-top: 15px;
            `;

            container.appendChild(grantBtn);
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            RequestGrantSystem.init();
        });
    } else {
        RequestGrantSystem.init();
    }

    console.log('🌱 Request Grant System loaded');
})();
