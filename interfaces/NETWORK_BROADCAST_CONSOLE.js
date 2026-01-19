/**
 * Network Discovery & Broadcast Console
 * HHF-AI Spin Cloud Network with 43 Queen Bee Nodes
 * Social media feed-style compact interaction console
 * Node navigator, broadcast feeds, comments, call-to-action buttons
 * 
 * Features:
 * - Real-time network status indicators
 * - Node discovery visualization
 * - Click to initiate communications with nodes
 * - Broadcast feed (social media style)
 * - Response capture & comments
 * - Selectable call-to-action buttons
 * - Compact interaction console
 */

(function() {
    'use strict';

    // Network State
    const NetworkState = {
        connected: false,
        nodesDiscovered: 0,
        totalNodes: 43,
        activeNodes: [],
        broadcasts: [],
        networkHealth: 0
    };

    // Queen Bee Node Definitions
    const QueenBeeNodes = [
        { id: 'QB-01', name: 'El Gran Sol Core', type: 'core', status: 'online', location: 'Blackhole Center' },
        { id: 'QB-02', name: 'Leonardo Gateway', type: 'hero-host', status: 'online', location: 'Vibecraft' },
        { id: 'QB-03', name: 'Newton Navigator', type: 'hero-host', status: 'online', location: 'GPS Cloud' },
        { id: 'QB-04', name: 'Shakespeare Compiler', type: 'hero-host', status: 'online', location: 'Narrative Engine' },
        { id: 'QB-05', name: 'Tesla Energy', type: 'hero-host', status: 'online', location: 'Power Grid' },
        { id: 'QB-06', name: 'Pachamama Healer', type: 'hero-host', status: 'online', location: 'Wellness' },
        { id: 'QB-07', name: 'Agüeybaná Shaman', type: 'hero-host', status: 'online', location: 'Taíno Clinic' },
        { id: 'QB-08', name: 'Yocahú Spirit', type: 'hero-host', status: 'online', location: 'Sacred Space' },
        { id: 'QB-09', name: 'Spin Cloud Alpha', type: 'infrastructure', status: 'online', location: 'Global Mesh' },
        { id: 'QB-10', name: 'HHF Grammar Core', type: 'protocol', status: 'online', location: 'Language Layer' },
        // ... 33 more nodes for full 43
    ];

    // Initialize with 10, discover rest over time
    for (let i = 11; i <= 43; i++) {
        QueenBeeNodes.push({
            id: `QB-${String(i).padStart(2, '0')}`,
            name: `Node ${i}`,
            type: ['infrastructure', 'protocol', 'service'][Math.floor(Math.random() * 3)],
            status: Math.random() > 0.1 ? 'online' : 'discovering',
            location: 'Network Mesh'
        });
    }

    // Network Console HTML
    const networkHTML = `
        <style>
            .network-indicator {
                position: fixed;
                top: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #64c8ff;
                border-radius: 15px;
                padding: 15px 20px;
                z-index: 9998;
                font-family: 'Georgia', serif;
                color: #f4e4c1;
                cursor: pointer;
                transition: all 0.3s;
                backdrop-filter: blur(10px);
            }

            .network-indicator:hover {
                transform: scale(1.05);
                box-shadow: 0 5px 20px rgba(100, 200, 255, 0.4);
            }

            .network-status-dot {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 10px;
                animation: network-pulse 2s ease-in-out infinite;
            }

            .network-status-dot.online {
                background: #90EE90;
                box-shadow: 0 0 10px #90EE90;
            }

            .network-status-dot.discovering {
                background: #ffd700;
                box-shadow: 0 0 10px #ffd700;
            }

            .network-status-dot.offline {
                background: #ff6464;
                box-shadow: 0 0 10px #ff6464;
            }

            @keyframes network-pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
            }

            .network-stats {
                font-size: 0.9em;
                margin-top: 5px;
                color: #64c8ff;
            }

            /* Network Console Overlay */
            .network-console {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
                z-index: 9999;
                padding: 20px;
                overflow: hidden;
            }

            .network-console.active {
                display: flex;
            }

            .network-console-container {
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-columns: 300px 1fr 350px;
                gap: 20px;
                font-family: 'Georgia', serif;
                color: #f4e4c1;
            }

            /* Left Panel: Node Navigator */
            .network-nodes-panel {
                background: rgba(26, 10, 10, 0.9);
                border: 2px solid #64c8ff;
                border-radius: 15px;
                padding: 20px;
                overflow-y: auto;
            }

            .network-panel-header {
                color: #64c8ff;
                font-size: 1.5em;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid rgba(100, 200, 255, 0.3);
            }

            .network-node-item {
                background: rgba(100, 200, 255, 0.05);
                border: 1px solid rgba(100, 200, 255, 0.3);
                border-radius: 10px;
                padding: 12px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: all 0.3s;
            }

            .network-node-item:hover {
                background: rgba(100, 200, 255, 0.15);
                border-color: #64c8ff;
                transform: translateX(5px);
            }

            .network-node-item.active {
                background: rgba(100, 200, 255, 0.2);
                border-color: #64c8ff;
            }

            .network-node-name {
                font-weight: bold;
                color: #64c8ff;
                margin-bottom: 5px;
            }

            .network-node-meta {
                font-size: 0.85em;
                color: #a0a0a0;
            }

            /* Center Panel: Broadcast Feed */
            .network-feed-panel {
                background: rgba(26, 10, 10, 0.9);
                border: 2px solid #ffd700;
                border-radius: 15px;
                padding: 20px;
                display: flex;
                flex-direction: column;
            }

            .network-feed-header {
                color: #ffd700;
                font-size: 1.5em;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid rgba(255, 215, 0, 0.3);
            }

            .network-broadcast-composer {
                background: rgba(0, 0, 0, 0.5);
                border: 2px solid rgba(255, 215, 0, 0.3);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 20px;
            }

            .network-broadcast-input {
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

            .network-broadcast-input:focus {
                outline: none;
            }

            .network-broadcast-actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .network-broadcast-btn {
                padding: 8px 20px;
                background: linear-gradient(135deg, #ffd700, #d4af37);
                color: #0a0a0a;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Georgia', serif;
            }

            .network-broadcast-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
            }

            .network-feed-items {
                flex: 1;
                overflow-y: auto;
            }

            .network-feed-item {
                background: rgba(255, 215, 0, 0.05);
                border: 1px solid rgba(255, 215, 0, 0.2);
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 15px;
            }

            .network-feed-header-row {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }

            .network-feed-avatar {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #ffd700, #d4af37);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2em;
            }

            .network-feed-author {
                font-weight: bold;
                color: #ffd700;
            }

            .network-feed-time {
                color: #a0a0a0;
                font-size: 0.85em;
            }

            .network-feed-content {
                margin: 15px 0;
                line-height: 1.6;
            }

            .network-feed-actions {
                display: flex;
                gap: 15px;
                padding-top: 10px;
                border-top: 1px solid rgba(255, 215, 0, 0.1);
            }

            .network-feed-action-btn {
                background: none;
                border: none;
                color: #a0a0a0;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Georgia', serif;
            }

            .network-feed-action-btn:hover {
                color: #ffd700;
            }

            .network-feed-cta {
                margin-top: 10px;
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .network-cta-btn {
                padding: 8px 15px;
                background: rgba(100, 200, 255, 0.2);
                border: 1px solid #64c8ff;
                border-radius: 8px;
                color: #64c8ff;
                font-size: 0.9em;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Georgia', serif;
            }

            .network-cta-btn:hover {
                background: rgba(100, 200, 255, 0.3);
                transform: scale(1.05);
            }

            /* Right Panel: Active Communication */
            .network-comm-panel {
                background: rgba(26, 10, 10, 0.9);
                border: 2px solid #90EE90;
                border-radius: 15px;
                padding: 20px;
                display: flex;
                flex-direction: column;
            }

            .network-comm-header {
                color: #90EE90;
                font-size: 1.5em;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid rgba(144, 238, 144, 0.3);
            }

            .network-comm-messages {
                flex: 1;
                overflow-y: auto;
                margin-bottom: 15px;
            }

            .network-comm-message {
                background: rgba(144, 238, 144, 0.05);
                border-left: 3px solid #90EE90;
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 10px;
            }

            .network-comm-input-area {
                background: rgba(0, 0, 0, 0.5);
                border: 2px solid rgba(144, 238, 144, 0.3);
                border-radius: 10px;
                padding: 10px;
            }

            .network-comm-input {
                width: 100%;
                background: transparent;
                border: none;
                color: #f4e4c1;
                font-family: 'Georgia', serif;
                resize: none;
            }

            .network-comm-input:focus {
                outline: none;
            }

            .network-close-btn {
                position: absolute;
                top: 30px;
                right: 30px;
                font-size: 3em;
                color: #ffd700;
                cursor: pointer;
                transition: all 0.3s;
                z-index: 10000;
            }

            .network-close-btn:hover {
                transform: rotate(90deg);
                color: #ff6464;
            }

            @media (max-width: 1200px) {
                .network-console-container {
                    grid-template-columns: 1fr;
                    grid-template-rows: auto auto auto;
                }

                .network-nodes-panel,
                .network-comm-panel {
                    max-height: 300px;
                }
            }
        </style>

        <!-- Network Status Indicator -->
        <div class="network-indicator" id="network-indicator" onclick="NetworkBroadcast.open()">
            <div>
                <span class="network-status-dot online" id="network-status-dot"></span>
                <strong>HHF Network</strong>
            </div>
            <div class="network-stats">
                <span id="network-nodes-count">0</span>/43 Nodes • 
                <span id="network-health">0</span>% Health
            </div>
        </div>

        <!-- Network Console Overlay -->
        <div class="network-console" id="network-console">
            <div class="network-close-btn" onclick="NetworkBroadcast.close()">&times;</div>
            
            <div class="network-console-container">
                <!-- Left: Node Navigator -->
                <div class="network-nodes-panel">
                    <h2 class="network-panel-header">🔮 Queen Bee Nodes</h2>
                    <div id="network-nodes-list"></div>
                </div>

                <!-- Center: Broadcast Feed -->
                <div class="network-feed-panel">
                    <h2 class="network-feed-header">📡 Network Broadcasts</h2>
                    
                    <!-- Broadcast Composer -->
                    <div class="network-broadcast-composer">
                        <textarea class="network-broadcast-input" id="network-broadcast-input" 
                                  placeholder="Share with the network..."></textarea>
                        <div class="network-broadcast-actions">
                            <div style="color: #a0a0a0; font-size: 0.9em;">
                                Broadcasting to <span id="broadcast-target">all nodes</span>
                            </div>
                            <button class="network-broadcast-btn" onclick="NetworkBroadcast.sendBroadcast()">
                                📡 Broadcast
                            </button>
                        </div>
                    </div>

                    <!-- Feed Items -->
                    <div class="network-feed-items" id="network-feed-items">
                        <!-- Broadcasts appear here -->
                    </div>
                </div>

                <!-- Right: Active Communication -->
                <div class="network-comm-panel">
                    <h2 class="network-comm-header">💬 Node Communication</h2>
                    <div style="color: #a0a0a0; text-align: center; margin-top: 20px;" id="network-comm-empty">
                        Click a node to initiate communication
                    </div>
                    <div id="network-comm-active" style="display: none; flex: 1; display: flex; flex-direction: column;">
                        <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(144, 238, 144, 0.2);">
                            <strong id="network-comm-with">Node Name</strong><br>
                            <small style="color: #a0a0a0;" id="network-comm-status">Status: Online</small>
                        </div>
                        <div class="network-comm-messages" id="network-comm-messages"></div>
                        <div class="network-comm-input-area">
                            <textarea class="network-comm-input" id="network-comm-input" 
                                      placeholder="Message this node..."></textarea>
                            <button class="network-broadcast-btn" style="margin-top: 10px; width: 100%;" 
                                    onclick="NetworkBroadcast.sendMessage()">
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Network Broadcast System Controller
    window.NetworkBroadcast = {
        initialized: false,
        discoveryInterval: null,
        selectedNode: null,

        init: function() {
            if (this.initialized) return;

            // Add HTML to page
            const container = document.createElement('div');
            container.innerHTML = networkHTML;
            document.body.appendChild(container);

            // Load network state from storage
            if (window.StorageSyncProtocol) {
                const savedState = window.StorageSyncProtocol.storage.load('nspfrnp_network_state');
                if (savedState) {
                    Object.assign(NetworkState, savedState);
                }
                
                // Load saved broadcasts
                const savedBroadcasts = window.StorageSyncProtocol.storage.load('nspfrnp_broadcasts');
                if (savedBroadcasts && savedBroadcasts.length > 0) {
                    NetworkState.broadcasts = savedBroadcasts;
                }
            }

            // Start network discovery
            this.startDiscovery();

            // Load initial broadcasts if none saved
            if (NetworkState.broadcasts.length === 0) {
                this.loadSampleBroadcasts();
            }

            this.initialized = true;
            console.log('📡 Network Broadcast Console initialized');
            console.log('💾 Loaded from local storage');
        },

        startDiscovery: function() {
            // Simulate discovering nodes over time
            let discovered = 0;
            
            this.discoveryInterval = setInterval(() => {
                if (discovered < QueenBeeNodes.length) {
                    discovered++;
                    const node = QueenBeeNodes[discovered - 1];
                    if (node.status === 'discovering') {
                        node.status = 'online';
                    }
                    NetworkState.nodesDiscovered = discovered;
                    NetworkState.activeNodes = QueenBeeNodes.slice(0, discovered);
                    NetworkState.networkHealth = Math.round((discovered / NetworkState.totalNodes) * 100);
                    
                    this.updateIndicator();
                    this.renderNodeList();
                } else {
                    NetworkState.connected = true;
                    clearInterval(this.discoveryInterval);
                    console.log('✅ All Queen Bee Nodes discovered');
                }
            }, 2000); // Discover one node every 2 seconds
        },

        updateIndicator: function() {
            const dot = document.getElementById('network-status-dot');
            const count = document.getElementById('network-nodes-count');
            const health = document.getElementById('network-health');

            if (count) count.textContent = NetworkState.nodesDiscovered;
            if (health) health.textContent = NetworkState.networkHealth;

            if (dot) {
                if (NetworkState.networkHealth === 100) {
                    dot.className = 'network-status-dot online';
                } else if (NetworkState.networkHealth > 0) {
                    dot.className = 'network-status-dot discovering';
                } else {
                    dot.className = 'network-status-dot offline';
                }
            }
        },

        renderNodeList: function() {
            const list = document.getElementById('network-nodes-list');
            if (!list) return;

            list.innerHTML = NetworkState.activeNodes.map(node => `
                <div class="network-node-item" onclick="NetworkBroadcast.selectNode('${node.id}')">
                    <div class="network-node-name">
                        <span class="network-status-dot ${node.status}"></span>
                        ${node.name}
                    </div>
                    <div class="network-node-meta">
                        ${node.id} • ${node.type}<br>
                        📍 ${node.location}
                    </div>
                </div>
            `).join('');
        },

        selectNode: function(nodeId) {
            this.selectedNode = QueenBeeNodes.find(n => n.id === nodeId);
            
            // Update active state in list
            document.querySelectorAll('.network-node-item').forEach(item => {
                item.classList.remove('active');
            });
            event.target.closest('.network-node-item').classList.add('active');

            // Show communication panel
            document.getElementById('network-comm-empty').style.display = 'none';
            const activePanel = document.getElementById('network-comm-active');
            activePanel.style.display = 'flex';

            // Update communication panel header
            document.getElementById('network-comm-with').textContent = this.selectedNode.name;
            document.getElementById('network-comm-status').textContent = 
                `Status: ${this.selectedNode.status} • ${this.selectedNode.location}`;

            // Load messages
            this.loadNodeMessages();

            console.log('📡 Connected to:', this.selectedNode.name);
        },

        loadNodeMessages: function() {
            const messages = document.getElementById('network-comm-messages');
            if (!messages) return;

            // Sample messages
            messages.innerHTML = `
                <div class="network-comm-message">
                    <strong style="color: #90EE90;">${this.selectedNode.name}</strong>
                    <div style="font-size: 0.85em; color: #a0a0a0; margin-bottom: 5px;">2 minutes ago</div>
                    <div>Online and operational. Ready for communications.</div>
                </div>
                <div class="network-comm-message" style="background: rgba(100, 200, 255, 0.05); border-left-color: #64c8ff;">
                    <strong style="color: #64c8ff;">You</strong>
                    <div style="font-size: 0.85em; color: #a0a0a0; margin-bottom: 5px;">Just now</div>
                    <div>Initiated communication channel.</div>
                </div>
            `;
        },

        sendMessage: function() {
            const input = document.getElementById('network-comm-input');
            const messages = document.getElementById('network-comm-messages');
            
            if (!input || !messages || !input.value.trim()) return;

            const message = input.value.trim();

            // Add user message
            const messageEl = document.createElement('div');
            messageEl.className = 'network-comm-message';
            messageEl.style.cssText = 'background: rgba(100, 200, 255, 0.05); border-left-color: #64c8ff;';
            messageEl.innerHTML = `
                <strong style="color: #64c8ff;">You</strong>
                <div style="font-size: 0.85em; color: #a0a0a0; margin-bottom: 5px;">Just now</div>
                <div>${message}</div>
            `;
            messages.appendChild(messageEl);
            messages.scrollTop = messages.scrollHeight;

            // Clear input
            input.value = '';

            // Simulate node response
            setTimeout(() => {
                const responseEl = document.createElement('div');
                responseEl.className = 'network-comm-message';
                responseEl.innerHTML = `
                    <strong style="color: #90EE90;">${this.selectedNode.name}</strong>
                    <div style="font-size: 0.85em; color: #a0a0a0; margin-bottom: 5px;">Just now</div>
                    <div>Message received. Processing through HHF-AI Spin Cloud...</div>
                `;
                messages.appendChild(responseEl);
                messages.scrollTop = messages.scrollHeight;
            }, 1000);
        },

        loadSampleBroadcasts: function() {
            const sampleBroadcasts = [
                {
                    author: 'El Gran Sol Core',
                    avatar: '☀️',
                    time: '5 minutes ago',
                    content: 'Blackhole energy levels optimal. All recursive processing operating at infinite folds. Network performance: 100%',
                    cta: [
                        { text: '🌿 Request Healing', action: 'healing' },
                        { text: '📊 View Metrics', action: 'metrics' }
                    ]
                },
                {
                    author: 'Newton Navigator',
                    avatar: '🧭',
                    time: '12 minutes ago',
                    content: 'New awareness destination discovered: Golden Ticket Chamber. Optimal route calculated. 3 users currently navigating.',
                    cta: [
                        { text: '🎫 Navigate There', action: 'navigate' },
                        { text: '📍 Save Location', action: 'save' }
                    ]
                },
                {
                    author: 'Pachamama Healer',
                    avatar: '🌺',
                    time: '25 minutes ago',
                    content: 'Taíno Wellness Clinic: 47 healing sessions completed today. Average SynthScan improvement: +12 points. El Gran Sol energy flowing beautifully.',
                    cta: [
                        { text: '🌿 Book Session', action: 'book' },
                        { text: '💚 Donate', action: 'donate' }
                    ]
                }
            ];

            NetworkState.broadcasts = sampleBroadcasts;
            this.renderBroadcasts();
        },

        renderBroadcasts: function() {
            const feed = document.getElementById('network-feed-items');
            if (!feed) return;

            feed.innerHTML = NetworkState.broadcasts.map(broadcast => `
                <div class="network-feed-item">
                    <div class="network-feed-header-row">
                        <div class="network-feed-avatar">${broadcast.avatar}</div>
                        <div style="flex: 1;">
                            <div class="network-feed-author">${broadcast.author}</div>
                            <div class="network-feed-time">${broadcast.time}</div>
                        </div>
                    </div>
                    <div class="network-feed-content">${broadcast.content}</div>
                    <div class="network-feed-actions">
                        <button class="network-feed-action-btn" onclick="NetworkBroadcast.likeBroadcast()">
                            👍 Like
                        </button>
                        <button class="network-feed-action-btn" onclick="NetworkBroadcast.commentBroadcast()">
                            💬 Comment
                        </button>
                        <button class="network-feed-action-btn" onclick="NetworkBroadcast.shareBroadcast()">
                            🔄 Share
                        </button>
                    </div>
                    ${broadcast.cta ? `
                        <div class="network-feed-cta">
                            ${broadcast.cta.map(cta => `
                                <button class="network-cta-btn" onclick="NetworkBroadcast.handleCTA('${cta.action}')">
                                    ${cta.text}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('');
        },

        sendBroadcast: function() {
            const input = document.getElementById('network-broadcast-input');
            if (!input || !input.value.trim()) return;

            const newBroadcast = {
                author: 'You',
                avatar: '👤',
                time: 'Just now',
                content: input.value.trim(),
                cta: []
            };

            NetworkState.broadcasts.unshift(newBroadcast);
            this.renderBroadcasts();

            // Save to local storage with sync
            if (window.StorageSyncProtocol) {
                window.StorageSyncProtocol.saveBroadcast(newBroadcast);
            }

            input.value = '';
            console.log('📡 Broadcast sent to network');
        },

        likeBroadcast: function() {
            console.log('👍 Liked broadcast');
            alert('Broadcast liked! In production, this updates the network.');
        },

        commentBroadcast: function() {
            const comment = prompt('Enter your comment:');
            if (comment) {
                console.log('💬 Comment:', comment);
                alert('Comment posted! In production, this appears in the feed.');
            }
        },

        shareBroadcast: function() {
            console.log('🔄 Broadcast shared');
            alert('Broadcast shared across the network!');
        },

        handleCTA: function(action) {
            console.log('🎯 CTA clicked:', action);
            alert(`Action: ${action}\n\nIn production, this would:\n- Navigate to destination\n- Open relevant interface\n- Execute action`);
        },

        open: function() {
            const console = document.getElementById('network-console');
            if (console) {
                console.classList.add('active');
                document.body.style.overflow = 'hidden';
                this.renderNodeList();
                this.renderBroadcasts();
            }
        },

        close: function() {
            const console = document.getElementById('network-console');
            if (console) {
                console.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            NetworkBroadcast.init();
        });
    } else {
        NetworkBroadcast.init();
    }

    console.log('📡 Network Broadcast Console loaded');
    console.log('🔮 Discovering Queen Bee Nodes...');
})();
