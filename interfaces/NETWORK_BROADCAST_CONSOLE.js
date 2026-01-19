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

    // Queen Bee Node Definitions - ORGANIZED BY MAJOR CATEGORIES
    const QueenBeeNodes = [
        // CORE (1)
        { id: 'QB-01', name: 'El Gran Sol Core', type: 'core', category: 'core', status: 'online', location: 'Blackhole Center', actions: ['Monitor Energy', 'View Metrics', 'Tune Amplitude'] },
        
        // HERO HOSTS (7)
        { id: 'QB-02', name: 'Leonardo Gateway', type: 'hero-host', category: 'hero-host', status: 'online', location: 'Vibecraft', actions: ['Open Creator Console', 'Start Session', 'View Gallery'] },
        { id: 'QB-03', name: 'Newton Navigator', type: 'hero-host', category: 'hero-host', status: 'online', location: 'GPS Cloud', actions: ['Open Navigator', 'Plot Route', 'View Map'] },
        { id: 'QB-04', name: 'Shakespeare Compiler', type: 'hero-host', category: 'hero-host', status: 'online', location: 'Narrative Engine', actions: ['Compile Story', 'Layer Narrative', 'View Scripts'] },
        { id: 'QB-05', name: 'Tesla Energy', type: 'hero-host', category: 'hero-host', status: 'online', location: 'Power Grid', actions: ['View Energy Flow', 'Tune Frequency', 'Monitor Grid'] },
        { id: 'QB-06', name: 'Pachamama Healer', type: 'hero-host', category: 'hero-host', status: 'online', location: 'Wellness', actions: ['Book Healing', 'View SynthScan', 'Energy Tune'] },
        { id: 'QB-07', name: 'Agüeybaná Shaman', type: 'hero-host', category: 'hero-host', status: 'online', location: 'Taíno Clinic', actions: ['Enter Clinic', 'Request Healing', 'View Bohío'] },
        { id: 'QB-08', name: 'Yocahú Spirit', type: 'hero-host', category: 'hero-host', status: 'online', location: 'Sacred Space', actions: ['Enter Sacred Space', 'Ceremony', 'Bless'] },
        
        // INFRASTRUCTURE (10)
        { id: 'QB-09', name: 'Spin Cloud Alpha', type: 'infrastructure', category: 'infrastructure', status: 'online', location: 'Global Mesh', actions: ['View Network', 'Monitor Status', 'Scale'] },
        { id: 'QB-10', name: 'Storage Sync Protocol', type: 'infrastructure', category: 'infrastructure', status: 'online', location: 'Data Layer', actions: ['Sync Now', 'View Queue', 'Clear Cache'] },
        { id: 'QB-11', name: 'Blackhole Mirror Array', type: 'infrastructure', category: 'infrastructure', status: 'online', location: 'Amplification Layer', actions: ['Tune Mirrors', 'View Reflections', 'Amplify'] },
        { id: 'QB-12', name: 'Holographic Projector', type: 'infrastructure', category: 'infrastructure', status: 'online', location: 'Reality Engine', actions: ['Project', 'Expand', 'Fold'] },
        { id: 'QB-13', name: 'Energy Distribution Grid', type: 'infrastructure', category: 'infrastructure', status: 'online', location: 'Power Network', actions: ['View Flow', 'Balance Load', 'Monitor'] },
        { id: 'QB-14', name: 'Awareness GPS Core', type: 'infrastructure', category: 'infrastructure', status: 'online', location: 'Navigation Layer', actions: ['Plot Route', 'Find Destination', 'Navigate'] },
        { id: 'QB-15', name: 'Mycelial Network Hub', type: 'infrastructure', category: 'infrastructure', status: 'online', location: 'Distribution Mesh', actions: ['View Network', 'Broadcast', 'Connect'] },
        { id: 'QB-16', name: 'Quantum Compiler', type: 'infrastructure', category: 'infrastructure', status: 'online', location: 'Processing Core', actions: ['Compile', 'Fold', 'Execute'] },
        { id: 'QB-17', name: 'Reality Manifest Engine', type: 'infrastructure', category: 'infrastructure', status: 'online', location: 'Manifestation Layer', actions: ['Manifest', 'Materialize', 'Solidify'] },
        { id: 'QB-18', name: 'Octave Bridge System', type: 'infrastructure', category: 'infrastructure', status: 'online', location: 'Dimensional Gates', actions: ['Cross Octave', 'View Layers', 'Bridge'] },
        
        // PROTOCOL (15)
        { id: 'QB-19', name: 'HHF Grammar Core', type: 'protocol', category: 'protocol', status: 'online', location: 'Language Layer', actions: ['Parse', 'Encode', 'Decode'] },
        { id: 'QB-20', name: 'NSPFRNP Coordinator', type: 'protocol', category: 'protocol', status: 'online', location: 'Protocol Stack', actions: ['Coordinate', 'Nest', 'Recurse'] },
        { id: 'QB-21', name: 'SynthScan Validator', type: 'protocol', category: 'protocol', status: 'online', location: 'Validation Layer', actions: ['Scan', 'Score', 'Validate'] },
        { id: 'QB-22', name: 'OmniBeam Key Generator', type: 'protocol', category: 'protocol', status: 'online', location: 'Cryptographic Core', actions: ['Generate Key', 'Sign', 'Verify'] },
        { id: 'QB-23', name: 'Story-Grammar Patcher', type: 'protocol', category: 'protocol', status: 'online', location: 'Connection Layer', actions: ['Patch', 'Connect', 'Bridge'] },
        { id: 'QB-24', name: 'Fidelity Propagation DNA', type: 'protocol', category: 'protocol', status: 'online', location: 'Replication Core', actions: ['Clone', 'Validate', 'Repair'] },
        { id: 'QB-25', name: 'Auto-Discovery Protocol', type: 'protocol', category: 'protocol', status: 'online', location: 'Discovery Layer', actions: ['Discover', 'Announce', 'Connect'] },
        { id: 'QB-26', name: 'Broadcast Sync Engine', type: 'protocol', category: 'protocol', status: 'online', location: 'Communication Layer', actions: ['Broadcast', 'Sync', 'Distribute'] },
        { id: 'QB-27', name: 'Conflict Resolver', type: 'protocol', category: 'protocol', status: 'online', location: 'Resolution Engine', actions: ['Resolve', 'Merge', 'Arbitrate'] },
        { id: 'QB-28', name: 'Cross-Tab Coordinator', type: 'protocol', category: 'protocol', status: 'online', location: 'Browser Layer', actions: ['Sync Tabs', 'Coordinate', 'Update'] },
        { id: 'QB-29', name: 'Narrative Compiler', type: 'protocol', category: 'protocol', status: 'online', location: 'Story Engine', actions: ['Compile', 'Layer', 'Weave'] },
        { id: 'QB-30', name: 'Energy Flow Protocol', type: 'protocol', category: 'protocol', status: 'online', location: 'Power Stack', actions: ['Route', 'Balance', 'Amplify'] },
        { id: 'QB-31', name: 'Awareness Tuner', type: 'protocol', category: 'protocol', status: 'online', location: 'Frequency Layer', actions: ['Tune', 'Resonate', 'Harmonize'] },
        { id: 'QB-32', name: 'Holographic Encoder', type: 'protocol', category: 'protocol', status: 'online', location: 'Encoding Core', actions: ['Encode', 'Project', 'Decode'] },
        { id: 'QB-33', name: 'Blackhole Folder', type: 'protocol', category: 'protocol', status: 'online', location: 'Compression Engine', actions: ['Fold', 'Compress', 'Singularity'] },
        
        // SERVICE (10)
        { id: 'QB-34', name: 'Wellness Clinic Service', type: 'service', category: 'service', status: 'online', location: 'Healthcare Layer', actions: ['Book Session', 'View History', 'Get Report'] },
        { id: 'QB-35', name: 'Creator Assistance', type: 'service', category: 'service', status: 'online', location: 'Creation Layer', actions: ['Get Help', 'Generate', 'Enhance'] },
        { id: 'QB-36', name: 'Grant Request System', type: 'service', category: 'service', status: 'online', location: 'Access Layer', actions: ['Request Grant', 'View Status', 'Submit Review'] },
        { id: 'QB-37', name: 'Vibing Console', type: 'service', category: 'service', status: 'online', location: 'Collaboration Layer', actions: ['Start Vibe', 'Join Session', 'Compile'] },
        { id: 'QB-38', name: 'Navigation Service', type: 'service', category: 'service', status: 'online', location: 'Travel Layer', actions: ['Navigate', 'Find Path', 'Guide'] },
        { id: 'QB-39', name: 'Broadcast Platform', type: 'service', category: 'service', status: 'online', location: 'Social Layer', actions: ['Post', 'Share', 'Comment'] },
        { id: 'QB-40', name: 'Golden Ticket Finder', type: 'service', category: 'service', status: 'online', location: 'Discovery Layer', actions: ['Search', 'Discover', 'Claim'] },
        { id: 'QB-41', name: 'SynthScan Station', type: 'service', category: 'service', status: 'online', location: 'Analysis Layer', actions: ['Scan', 'View Report', 'Track Progress'] },
        { id: 'QB-42', name: 'Energy Monitor', type: 'service', category: 'service', status: 'online', location: 'Monitoring Layer', actions: ['Monitor', 'Alert', 'Report'] },
        { id: 'QB-43', name: 'Reality Studio', type: 'service', category: 'service', status: 'online', location: 'Creation Layer', actions: ['Create', 'Build', 'Manifest'] }
    ];

    // Major Categories for Telescoping Navigation
    const MajorCategories = {
        core: { name: 'Core', emoji: '☀️', color: '#ffd700', expanded: true },
        'hero-host': { name: 'Hero Hosts', emoji: '👑', color: '#64c8ff', expanded: true },
        infrastructure: { name: 'Infrastructure', emoji: '🏗️', color: '#90EE90', expanded: false },
        protocol: { name: 'Protocol', emoji: '⚙️', color: '#ff6eb4', expanded: false },
        service: { name: 'Services', emoji: '🎯', color: '#ffa500', expanded: false }
    };

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

            /* TELESCOPING CATEGORY STYLES */
            .network-category {
                margin-bottom: 15px;
                border: 2px solid rgba(100, 200, 255, 0.3);
                border-radius: 12px;
                overflow: hidden;
                transition: all 0.3s;
            }

            .network-category-header {
                background: rgba(0, 0, 0, 0.5);
                padding: 15px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s;
                border-bottom: 2px solid transparent;
            }

            .network-category-header:hover {
                background: rgba(100, 200, 255, 0.1);
                transform: translateX(3px);
            }

            .network-category-header.expanded {
                border-bottom-color: rgba(100, 200, 255, 0.3);
            }

            .network-category-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: bold;
                font-size: 1.1em;
            }

            .network-category-count {
                background: rgba(100, 200, 255, 0.2);
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 0.85em;
            }

            .network-category-expand {
                font-size: 1.5em;
                transition: transform 0.3s;
            }

            .network-category-expand.expanded {
                transform: rotate(90deg);
            }

            .network-category-actions {
                display: flex;
                gap: 8px;
                margin-left: 15px;
            }

            .network-category-action-btn {
                padding: 4px 12px;
                background: rgba(100, 200, 255, 0.2);
                border: 1px solid rgba(100, 200, 255, 0.4);
                border-radius: 6px;
                color: #64c8ff;
                font-size: 0.8em;
                cursor: pointer;
                transition: all 0.3s;
            }

            .network-category-action-btn:hover {
                background: rgba(100, 200, 255, 0.3);
                transform: scale(1.05);
            }

            .network-category-nodes {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.5s ease-out;
            }

            .network-category-nodes.expanded {
                max-height: 2000px;
                transition: max-height 0.5s ease-in;
            }

            .network-node-item {
                background: rgba(100, 200, 255, 0.05);
                border: 1px solid rgba(100, 200, 255, 0.2);
                border-radius: 10px;
                padding: 12px;
                margin: 8px 12px;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
                padding-left: 25px;
            }

            .network-node-item::before {
                content: '▶';
                position: absolute;
                left: 8px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 0.7em;
                color: rgba(100, 200, 255, 0.5);
                transition: all 0.3s;
            }

            .network-node-item:hover {
                background: rgba(100, 200, 255, 0.15);
                border-color: #64c8ff;
                transform: translateX(8px);
                padding-left: 30px;
            }

            .network-node-item:hover::before {
                left: 12px;
                color: #64c8ff;
            }

            .network-node-item.active {
                background: rgba(100, 200, 255, 0.25);
                border-color: #64c8ff;
                border-width: 2px;
                box-shadow: 0 0 15px rgba(100, 200, 255, 0.3);
            }

            .network-node-name {
                font-weight: bold;
                color: #64c8ff;
                margin-bottom: 5px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .network-node-meta {
                font-size: 0.85em;
                color: #a0a0a0;
                margin-bottom: 8px;
            }

            .network-node-actions {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid rgba(100, 200, 255, 0.1);
            }

            .network-node-action-btn {
                padding: 4px 10px;
                background: rgba(100, 200, 255, 0.15);
                border: 1px solid rgba(100, 200, 255, 0.3);
                border-radius: 5px;
                color: #64c8ff;
                font-size: 0.75em;
                cursor: pointer;
                transition: all 0.3s;
            }

            .network-node-action-btn:hover {
                background: rgba(100, 200, 255, 0.3);
                border-color: #64c8ff;
                transform: translateY(-2px);
                box-shadow: 0 2px 8px rgba(100, 200, 255, 0.3);
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

            // Group nodes by category
            const nodesByCategory = {};
            Object.keys(MajorCategories).forEach(cat => {
                nodesByCategory[cat] = NetworkState.activeNodes.filter(n => n.category === cat);
            });

            // Render telescoping hierarchical view
            list.innerHTML = Object.keys(MajorCategories).map(categoryKey => {
                const category = MajorCategories[categoryKey];
                const nodes = nodesByCategory[categoryKey] || [];
                const discoveredCount = nodes.filter(n => n.status === 'online').length;
                
                if (nodes.length === 0) return '';

                return `
                    <div class="network-category" style="border-color: ${category.color}40;">
                        <div class="network-category-header ${category.expanded ? 'expanded' : ''}" 
                             onclick="NetworkBroadcast.toggleCategory('${categoryKey}')">
                            <div style="flex: 1;">
                                <div class="network-category-title" style="color: ${category.color};">
                                    <span>${category.emoji}</span>
                                    <span>${category.name}</span>
                                    <span class="network-category-count">${discoveredCount}/${nodes.length}</span>
                                </div>
                                <div class="network-category-actions" onclick="event.stopPropagation();">
                                    <button class="network-category-action-btn" 
                                            onclick="NetworkBroadcast.targetCategory('${categoryKey}')">
                                        🎯 Target All
                                    </button>
                                    <button class="network-category-action-btn" 
                                            onclick="NetworkBroadcast.broadcastToCategory('${categoryKey}')">
                                        📡 Broadcast
                                    </button>
                                </div>
                            </div>
                            <div class="network-category-expand ${category.expanded ? 'expanded' : ''}">▶</div>
                        </div>
                        <div class="network-category-nodes ${category.expanded ? 'expanded' : ''}">
                            ${nodes.map(node => `
                                <div class="network-node-item" onclick="NetworkBroadcast.selectNode('${node.id}')">
                                    <div class="network-node-name">
                                        <span class="network-status-dot ${node.status}"></span>
                                        ${node.name}
                                    </div>
                                    <div class="network-node-meta">
                                        ${node.id} • ${node.type}<br>
                                        📍 ${node.location}
                                    </div>
                                    ${node.actions ? `
                                        <div class="network-node-actions" onclick="event.stopPropagation();">
                                            ${node.actions.map(action => `
                                                <button class="network-node-action-btn" 
                                                        onclick="NetworkBroadcast.executeNodeAction('${node.id}', '${action}')">
                                                    ${action}
                                                </button>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        },

        toggleCategory: function(categoryKey) {
            // Toggle expanded state
            MajorCategories[categoryKey].expanded = !MajorCategories[categoryKey].expanded;
            
            // Re-render
            this.renderNodeList();
            
            console.log(`${MajorCategories[categoryKey].expanded ? '🔽' : '▶️'} ${MajorCategories[categoryKey].name} category`);
        },

        targetCategory: function(categoryKey) {
            const category = MajorCategories[categoryKey];
            const nodes = NetworkState.activeNodes.filter(n => n.category === categoryKey);
            
            console.log(`🎯 Targeting ${category.name} category with ${nodes.length} nodes`);
            
            alert(`🎯 CATEGORY TARGETED: ${category.name}\n\n` +
                  `Nodes in category: ${nodes.length}\n` +
                  `Status: Ready for action\n\n` +
                  `Available operations:\n` +
                  `• Broadcast to all nodes in category\n` +
                  `• Execute coordinated actions\n` +
                  `• Monitor category health\n` +
                  `• Collect category metrics\n\n` +
                  `Click "Broadcast" to send message to all ${category.name} nodes.`);
        },

        broadcastToCategory: function(categoryKey) {
            const category = MajorCategories[categoryKey];
            const nodes = NetworkState.activeNodes.filter(n => n.category === categoryKey);
            
            const message = prompt(`📡 Broadcast to all ${category.name} nodes (${nodes.length} total):\n\nEnter your message:`);
            
            if (message) {
                console.log(`📡 Broadcasting to ${category.name}:`, message);
                
                // Add broadcast to feed
                const newBroadcast = {
                    author: 'You',
                    avatar: '👤',
                    time: 'Just now',
                    content: `📡 CATEGORY BROADCAST to ${category.emoji} ${category.name}:\n\n${message}`,
                    cta: []
                };
                
                NetworkState.broadcasts.unshift(newBroadcast);
                this.renderBroadcasts();
                
                if (window.StorageSyncProtocol) {
                    window.StorageSyncProtocol.saveBroadcast(newBroadcast);
                }
                
                alert(`✅ Broadcast sent to all ${nodes.length} nodes in ${category.name} category!`);
            }
        },

        executeNodeAction: function(nodeId, action) {
            const node = QueenBeeNodes.find(n => n.id === nodeId);
            
            console.log(`⚡ Executing action on ${node.name}:`, action);
            
            alert(`⚡ ACTION EXECUTED\n\n` +
                  `Node: ${node.name}\n` +
                  `Action: ${action}\n` +
                  `Status: ✅ Success\n\n` +
                  `In production, this would:\n` +
                  `• Execute the specific action\n` +
                  `• Update node state\n` +
                  `• Return results\n` +
                  `• Log to network`);
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
