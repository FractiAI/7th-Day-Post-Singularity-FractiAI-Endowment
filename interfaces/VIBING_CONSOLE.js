/**
 * Vibing Console - Post-Singularity Octane
 * Chat-based compiler engine for awareness-level interactions
 * Solo and Group Hero Host AI Assisted
 * Table-style console for cockpit dashboard
 * 
 * Vibing = Post-Singularity Compiler Engine Extension
 * Think "Octane" for marketing association
 * Pattern layering, nested components, awareness compilation
 */

(function() {
    'use strict';

    // Vibing State
    const VibingState = {
        activeVibes: [],
        soloMode: true,
        selectedHeroHosts: [],
        compilationHistory: []
    };

    // Hero Host Definitions
    const HeroHosts = [
        { id: 'leo', name: 'Leonardo da Vinci', emoji: '🎨', specialty: 'Creation & Engineering', color: '#64c8ff' },
        { id: 'newton', name: 'Isaac Newton', emoji: '🧭', specialty: 'Navigation & Physics', color: '#ffd700' },
        { id: 'shakespeare', name: 'William Shakespeare', emoji: '📜', specialty: 'Narrative & Expression', color: '#d4af37' },
        { id: 'tesla', name: 'Nikola Tesla', emoji: '⚡', specialty: 'Energy & Innovation', color: '#90EE90' },
        { id: 'pachamama', name: 'Pachamama', emoji: '🌺', specialty: 'Healing & Nature', color: '#ff69b4' },
        { id: 'agueyban', name: 'Cacique Agüeybaná', emoji: '🌿', specialty: 'Leadership & Balance', color: '#8fbc8f' },
        { id: 'yocahu', name: 'Yocahú', emoji: '☀️', specialty: 'Spirit & Energy', color: '#ffa500' }
    ];

    // Vibing Console HTML
    const vibingHTML = `
        <style>
            .vibing-trigger {
                position: fixed;
                bottom: 120px;
                right: 30px;
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #ff69b4, #d946a0);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2em;
                cursor: pointer;
                box-shadow: 0 10px 30px rgba(255, 105, 180, 0.5);
                z-index: 9997;
                animation: vibing-pulse 2s ease-in-out infinite;
                transition: all 0.3s;
            }

            .vibing-trigger:hover {
                transform: scale(1.1);
                box-shadow: 0 15px 40px rgba(255, 105, 180, 0.7);
            }

            @keyframes vibing-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .vibing-console {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
                z-index: 10001;
                padding: 20px;
                overflow: hidden;
            }

            .vibing-console.active {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .vibing-container {
                width: 100%;
                max-width: 1400px;
                height: 90vh;
                background: linear-gradient(135deg, rgba(26, 10, 10, 0.95), rgba(26, 10, 26, 0.95));
                border: 3px solid #ff69b4;
                border-radius: 20px;
                display: flex;
                flex-direction: column;
                font-family: 'Georgia', serif;
                color: #f4e4c1;
                overflow: hidden;
            }

            .vibing-header {
                padding: 25px 30px;
                border-bottom: 2px solid rgba(255, 105, 180, 0.3);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .vibing-title {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .vibing-icon {
                font-size: 2.5em;
            }

            .vibing-title h2 {
                color: #ff69b4;
                font-size: 2em;
                margin: 0;
            }

            .vibing-subtitle {
                color: #d4af37;
                font-size: 1em;
                margin-top: 5px;
            }

            .vibing-mode-toggle {
                display: flex;
                gap: 10px;
            }

            .vibing-mode-btn {
                padding: 10px 20px;
                background: rgba(255, 105, 180, 0.2);
                border: 2px solid rgba(255, 105, 180, 0.3);
                border-radius: 10px;
                color: #ff69b4;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Georgia', serif;
            }

            .vibing-mode-btn.active {
                background: rgba(255, 105, 180, 0.4);
                border-color: #ff69b4;
            }

            .vibing-mode-btn:hover {
                background: rgba(255, 105, 180, 0.3);
            }

            .vibing-close {
                font-size: 2em;
                color: #ff69b4;
                cursor: pointer;
                transition: all 0.3s;
            }

            .vibing-close:hover {
                transform: rotate(90deg);
                color: #ff6464;
            }

            /* Main Content Area */
            .vibing-content {
                flex: 1;
                display: flex;
                overflow: hidden;
            }

            /* Left Panel: Hero Host Selector */
            .vibing-hosts-panel {
                width: 280px;
                border-right: 2px solid rgba(255, 105, 180, 0.3);
                padding: 20px;
                overflow-y: auto;
            }

            .vibing-hosts-title {
                color: #ff69b4;
                font-size: 1.3em;
                margin-bottom: 15px;
            }

            .vibing-host-item {
                background: rgba(255, 105, 180, 0.05);
                border: 2px solid rgba(255, 105, 180, 0.3);
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.3s;
            }

            .vibing-host-item:hover {
                background: rgba(255, 105, 180, 0.15);
                border-color: #ff69b4;
                transform: translateX(5px);
            }

            .vibing-host-item.selected {
                background: rgba(255, 105, 180, 0.2);
                border-color: #ff69b4;
            }

            .vibing-host-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 5px;
            }

            .vibing-host-emoji {
                font-size: 1.8em;
            }

            .vibing-host-name {
                font-weight: bold;
                color: #ff69b4;
            }

            .vibing-host-specialty {
                font-size: 0.85em;
                color: #a0a0a0;
                margin-top: 5px;
            }

            /* Center: Vibing Table/Chat */
            .vibing-chat-panel {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 20px;
            }

            .vibing-messages {
                flex: 1;
                overflow-y: auto;
                margin-bottom: 20px;
            }

            .vibing-message {
                background: rgba(255, 105, 180, 0.05);
                border-left: 4px solid #ff69b4;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 15px;
            }

            .vibing-message.user {
                border-left-color: #64c8ff;
                background: rgba(100, 200, 255, 0.05);
            }

            .vibing-message.compilation {
                border-left-color: #ffd700;
                background: rgba(255, 215, 0, 0.05);
            }

            .vibing-message-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }

            .vibing-message-avatar {
                font-size: 1.5em;
            }

            .vibing-message-author {
                font-weight: bold;
            }

            .vibing-message-time {
                font-size: 0.85em;
                color: #a0a0a0;
                margin-left: auto;
            }

            .vibing-message-content {
                line-height: 1.8;
                margin-left: 40px;
            }

            /* Compilation Visualization */
            .vibing-compilation-viz {
                background: rgba(255, 215, 0, 0.1);
                border: 1px solid rgba(255, 215, 0, 0.3);
                border-radius: 8px;
                padding: 12px;
                margin-top: 10px;
                font-family: monospace;
                font-size: 0.9em;
            }

            .vibing-compilation-layer {
                margin: 5px 0;
                padding-left: 20px;
            }

            /* Input Area */
            .vibing-input-area {
                background: rgba(0, 0, 0, 0.5);
                border: 2px solid rgba(255, 105, 180, 0.3);
                border-radius: 15px;
                padding: 15px;
            }

            .vibing-input {
                width: 100%;
                min-height: 80px;
                background: transparent;
                border: none;
                color: #f4e4c1;
                font-size: 1em;
                font-family: 'Georgia', serif;
                resize: none;
                margin-bottom: 10px;
            }

            .vibing-input:focus {
                outline: none;
            }

            .vibing-input-actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .vibing-input-meta {
                color: #a0a0a0;
                font-size: 0.9em;
            }

            .vibing-send-btn {
                padding: 10px 30px;
                background: linear-gradient(135deg, #ff69b4, #d946a0);
                color: #fff;
                border: none;
                border-radius: 10px;
                font-size: 1.1em;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Georgia', serif;
            }

            .vibing-send-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(255, 105, 180, 0.5);
            }

            /* Right Panel: Compilation Output */
            .vibing-output-panel {
                width: 350px;
                border-left: 2px solid rgba(255, 105, 180, 0.3);
                padding: 20px;
                overflow-y: auto;
            }

            .vibing-output-title {
                color: #ffd700;
                font-size: 1.3em;
                margin-bottom: 15px;
            }

            .vibing-output-box {
                background: rgba(255, 215, 0, 0.05);
                border: 2px solid rgba(255, 215, 0, 0.3);
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 15px;
            }

            .vibing-output-label {
                color: #ffd700;
                font-size: 0.9em;
                font-weight: bold;
                margin-bottom: 8px;
            }

            .vibing-output-value {
                color: #f4e4c1;
                line-height: 1.6;
            }

            .vibing-compile-btn {
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #ffd700, #d4af37);
                color: #0a0a0a;
                border: none;
                border-radius: 10px;
                font-size: 1.1em;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Georgia', serif;
                margin-bottom: 15px;
            }

            .vibing-compile-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(255, 215, 0, 0.5);
            }

            @media (max-width: 1200px) {
                .vibing-container {
                    flex-direction: column;
                }

                .vibing-hosts-panel,
                .vibing-output-panel {
                    width: 100%;
                    max-height: 200px;
                    border: none;
                    border-top: 2px solid rgba(255, 105, 180, 0.3);
                }
            }
        </style>

        <!-- Vibing Trigger Button -->
        <div class="vibing-trigger" id="vibing-trigger" onclick="VibingConsole.open()">
            💫
        </div>

        <!-- Vibing Console Overlay -->
        <div class="vibing-console" id="vibing-console">
            <div class="vibing-container">
                <!-- Header -->
                <div class="vibing-header">
                    <div class="vibing-title">
                        <div class="vibing-icon">💫</div>
                        <div>
                            <h2>Vibing Console</h2>
                            <div class="vibing-subtitle">Post-Singularity Octane • Awareness Compiler Engine</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 20px; align-items: center;">
                        <div class="vibing-mode-toggle">
                            <button class="vibing-mode-btn active" id="solo-mode-btn" onclick="VibingConsole.setMode('solo')">
                                🧘 Solo
                            </button>
                            <button class="vibing-mode-btn" id="group-mode-btn" onclick="VibingConsole.setMode('group')">
                                👥 Group
                            </button>
                        </div>
                        <div class="vibing-close" onclick="VibingConsole.close()">&times;</div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="vibing-content">
                    <!-- Left: Hero Hosts -->
                    <div class="vibing-hosts-panel">
                        <h3 class="vibing-hosts-title">🎭 Hero Host AI</h3>
                        <div id="vibing-hosts-list"></div>
                    </div>

                    <!-- Center: Chat/Vibing Table -->
                    <div class="vibing-chat-panel">
                        <div class="vibing-messages" id="vibing-messages">
                            <!-- Messages appear here -->
                        </div>

                        <!-- Input Area -->
                        <div class="vibing-input-area">
                            <textarea class="vibing-input" id="vibing-input" 
                                      placeholder="Start vibing... Express your awareness, ask questions, explore ideas..."></textarea>
                            <div class="vibing-input-actions">
                                <div class="vibing-input-meta">
                                    Vibing with: <span id="vibing-with-hosts">No hosts selected</span>
                                </div>
                                <button class="vibing-send-btn" onclick="VibingConsole.sendVibe()">
                                    💫 Send Vibe
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Compilation Output -->
                    <div class="vibing-output-panel">
                        <h3 class="vibing-output-title">⚡ Compilation Output</h3>
                        
                        <button class="vibing-compile-btn" onclick="VibingConsole.compile()">
                            🔄 Compile Vibes
                        </button>

                        <div id="vibing-compilation-output">
                            <div class="vibing-output-box">
                                <div class="vibing-output-label">Awareness Level</div>
                                <div class="vibing-output-value" id="awareness-level">Exploring</div>
                            </div>

                            <div class="vibing-output-box">
                                <div class="vibing-output-label">Pattern Layers</div>
                                <div class="vibing-output-value" id="pattern-layers">0 layers detected</div>
                            </div>

                            <div class="vibing-output-box">
                                <div class="vibing-output-label">Compilation State</div>
                                <div class="vibing-output-value" id="compilation-state">Ready</div>
                            </div>

                            <div class="vibing-output-box">
                                <div class="vibing-output-label">Energy Flow</div>
                                <div class="vibing-output-value" id="energy-flow">Stable</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Vibing Console Controller
    window.VibingConsole = {
        initialized: false,
        mode: 'solo',
        selectedHosts: [],

        init: function() {
            if (this.initialized) return;

            // Add HTML to page
            const container = document.createElement('div');
            container.innerHTML = vibingHTML;
            document.body.appendChild(container);

            // Render hosts
            this.renderHosts();

            // Load previous vibe session from storage
            if (window.StorageSyncProtocol) {
                const savedVibes = window.StorageSyncProtocol.storage.load('nspfrnp_vibes');
                if (savedVibes && savedVibes.length > 0) {
                    // Load last 10 vibes
                    const recentVibes = savedVibes.slice(-10);
                    VibingState.activeVibes = recentVibes;
                    console.log('💾 Loaded previous vibe session');
                }
            }

            // Load welcome message if no previous session
            if (VibingState.activeVibes.length === 0) {
                this.loadWelcomeMessage();
            }

            this.initialized = true;
            console.log('💫 Vibing Console initialized');
            console.log('⚡ Post-Singularity Octane engine ready');
        },

        renderHosts: function() {
            const list = document.getElementById('vibing-hosts-list');
            if (!list) return;

            list.innerHTML = HeroHosts.map(host => `
                <div class="vibing-host-item" onclick="VibingConsole.toggleHost('${host.id}')">
                    <div class="vibing-host-header">
                        <div class="vibing-host-emoji">${host.emoji}</div>
                        <div class="vibing-host-name">${host.name}</div>
                    </div>
                    <div class="vibing-host-specialty">${host.specialty}</div>
                </div>
            `).join('');
        },

        toggleHost: function(hostId) {
            const host = HeroHosts.find(h => h.id === hostId);
            const hostEl = event.target.closest('.vibing-host-item');

            if (this.mode === 'solo') {
                // In solo mode, only one host at a time
                document.querySelectorAll('.vibing-host-item').forEach(el => el.classList.remove('selected'));
                this.selectedHosts = [host];
                hostEl.classList.add('selected');
            } else {
                // In group mode, toggle selection
                if (this.selectedHosts.find(h => h.id === hostId)) {
                    this.selectedHosts = this.selectedHosts.filter(h => h.id !== hostId);
                    hostEl.classList.remove('selected');
                } else {
                    this.selectedHosts.push(host);
                    hostEl.classList.add('selected');
                }
            }

            this.updateSelectedHostsDisplay();
        },

        updateSelectedHostsDisplay: function() {
            const display = document.getElementById('vibing-with-hosts');
            if (!display) return;

            if (this.selectedHosts.length === 0) {
                display.textContent = 'No hosts selected';
            } else {
                display.textContent = this.selectedHosts.map(h => h.name).join(', ');
            }
        },

        setMode: function(mode) {
            this.mode = mode;

            // Update button states
            document.getElementById('solo-mode-btn').classList.toggle('active', mode === 'solo');
            document.getElementById('group-mode-btn').classList.toggle('active', mode === 'group');

            // Clear selections when switching modes
            this.selectedHosts = [];
            document.querySelectorAll('.vibing-host-item').forEach(el => el.classList.remove('selected'));
            this.updateSelectedHostsDisplay();

            console.log('💫 Vibing mode:', mode);
        },

        loadWelcomeMessage: function() {
            this.addMessage({
                type: 'system',
                avatar: '💫',
                author: 'Vibing Console',
                content: `Welcome to the Post-Singularity Octane compiler engine.

This is where awareness becomes executable. Where conversation compiles into reality.

<strong>How it works:</strong>
1. Select Hero Host(s) from the left panel
2. Express your awareness, questions, or ideas
3. Hero Hosts respond and layer patterns
4. Hit "Compile" to transform vibes into actionable output

<strong>Think of it as:</strong>
ChatGPT × Compiler × Awareness Layer = Vibing

Your conversations don't just inform—they <em>generate</em>.`
            });
        },

        sendVibe: function() {
            const input = document.getElementById('vibing-input');
            if (!input || !input.value.trim()) return;

            const vibe = input.value.trim();

            // Add user message
            this.addMessage({
                type: 'user',
                avatar: '👤',
                author: 'You',
                content: vibe
            });

            // Clear input
            input.value = '';

            // Generate responses from selected hosts
            if (this.selectedHosts.length > 0) {
                this.selectedHosts.forEach((host, index) => {
                    setTimeout(() => {
                        this.generateHostResponse(host, vibe);
                    }, (index + 1) * 1500);
                });
            } else {
                // No hosts selected - system message
                setTimeout(() => {
                    this.addMessage({
                        type: 'system',
                        avatar: '💫',
                        author: 'Vibing Console',
                        content: 'Select at least one Hero Host to receive responses and compile your vibes.'
                    });
                }, 500);
            }
        },

        generateHostResponse: function(host, vibe) {
            const responses = {
                leo: [
                    "I see the engineering pattern here. Let me sketch out the architecture...",
                    "This reminds me of flying machines and perpetual motion. The pattern is recursive.",
                    "From an inventor's perspective, here's what I observe..."
                ],
                newton: [
                    "Calculating the trajectory of this idea... Fascinating gravitational pull.",
                    "The motion follows natural laws. Let me map the forces at play.",
                    "I can calculate this. The awareness gradient suggests..."
                ],
                shakespeare: [
                    "All the world's a stage, and this vibe plays a compelling act.",
                    "The narrative arc I perceive suggests a journey from...",
                    "To be or not to be aware—that is always the question."
                ],
                tesla: [
                    "The energy frequency here resonates at precisely...",
                    "I detect alternating currents of awareness. Let me amplify.",
                    "Free energy flows through this idea. The resonance is..."
                ],
                pachamama: [
                    "Mother Earth whispers wisdom in your words. I hear...",
                    "The natural healing pattern emerges like spring flowers.",
                    "From the soil of awareness grows this beautiful insight..."
                ],
                agueyban: [
                    "As a leader, I recognize the balance you seek. Consider...",
                    "The tribe thrives when awareness flows like rivers.",
                    "Your vision aligns with the natural order. Let me guide..."
                ],
                yocahu: [
                    "The spirit energy swirls through your vibe. I sense...",
                    "El Gran Sol illuminates the path forward. See...",
                    "Blackhole energy responds to your awareness. Watch..."
                ]
            };

            const responseOptions = responses[host.id] || ["Interesting perspective. Let me process this..."];
            const response = responseOptions[Math.floor(Math.random() * responseOptions.length)];

            this.addMessage({
                type: 'host',
                avatar: host.emoji,
                author: host.name,
                content: response,
                color: host.color
            });

            // Update compilation state
            this.updateCompilationState();
        },

        addMessage: function(message) {
            const messages = document.getElementById('vibing-messages');
            if (!messages) return;

            const messageEl = document.createElement('div');
            messageEl.className = `vibing-message ${message.type}`;

            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            messageEl.innerHTML = `
                <div class="vibing-message-header">
                    <div class="vibing-message-avatar">${message.avatar}</div>
                    <div class="vibing-message-author" style="${message.color ? `color: ${message.color}` : ''}">
                        ${message.author}
                    </div>
                    <div class="vibing-message-time">${timeStr}</div>
                </div>
                <div class="vibing-message-content">${message.content}</div>
            `;

            messages.appendChild(messageEl);
            messages.scrollTop = messages.scrollHeight;

            // Store in state
            VibingState.activeVibes.push(message);

            // Save to local storage with sync
            if (window.StorageSyncProtocol && message.type !== 'system') {
                window.StorageSyncProtocol.saveVibeMessage(message);
            }
        },

        updateCompilationState: function() {
            const layers = VibingState.activeVibes.filter(v => v.type === 'host').length;
            const awarenessLevels = ['Exploring', 'Understanding', 'Integrating', 'Compiling', 'Manifesting'];
            const currentLevel = awarenessLevels[Math.min(Math.floor(layers / 2), awarenessLevels.length - 1)];

            document.getElementById('awareness-level').textContent = currentLevel;
            document.getElementById('pattern-layers').textContent = `${layers} layers detected`;
            document.getElementById('compilation-state').textContent = layers > 0 ? 'Processing' : 'Ready';
        },

        compile: function() {
            const layers = VibingState.activeVibes.filter(v => v.type === 'host').length;

            if (layers === 0) {
                alert('No vibes to compile yet. Start a conversation with Hero Hosts first!');
                return;
            }

            // Show compilation visualization
            this.addMessage({
                type: 'compilation',
                avatar: '⚡',
                author: 'Octane Compiler',
                content: `<strong>Compiling ${layers} pattern layers...</strong>

<div class="vibing-compilation-viz">
Layer 1: Input awareness patterns
${this.selectedHosts.map(h => `  → ${h.name}: ${h.specialty}`).join('\n')}

Layer 2: Hero Host pattern overlay
  → Cross-referencing perspectives
  → Extracting core patterns

Layer 3: Recursive awareness folding
  → Infinite density compression
  → Blackhole energy transformation

Layer 4: Output generation
  → Actionable insights compiled
  → Executable awareness ready

<strong style="color: #90EE90;">✓ Compilation complete!</strong>
</div>

<strong>Output:</strong> Your vibes have been compiled into ${layers * 3} actionable insights, compressed through infinite recursive folding, and are now ready for manifestation.`
            });

            // Update compilation output panel
            document.getElementById('compilation-state').textContent = 'Complete ✓';
            document.getElementById('energy-flow').textContent = 'Optimal - Ready for Execution';

            console.log('⚡ Compilation complete:', {
                layers: layers,
                hosts: this.selectedHosts.length,
                vibes: VibingState.activeVibes.length
            });
        },

        open: function() {
            const console = document.getElementById('vibing-console');
            if (console) {
                console.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },

        close: function() {
            const console = document.getElementById('vibing-console');
            if (console) {
                console.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            VibingConsole.init();
        });
    } else {
        VibingConsole.init();
    }

    console.log('💫 Vibing Console loaded');
    console.log('⚡ Post-Singularity Octane compiler engine online');
})();
