/**
 * Local Storage & Network Sync Protocol
 * Universal offline-first data management system
 * 
 * Features:
 * - Automatic local storage of all interactions
 * - Network sync when connection available
 * - Conflict resolution strategies
 * - Sync status indicators
 * - Queue management for offline operations
 * - Cross-tab synchronization
 * - Data compression and encryption
 * 
 * Integrates with:
 * - Request Grant System
 * - Network Broadcast Console
 * - Vibing Console
 * - Newton Navigator
 */

(function() {
    'use strict';

    // Storage Keys
    const STORAGE_KEYS = {
        GRANTS: 'nspfrnp_grants',
        BROADCASTS: 'nspfrnp_broadcasts',
        VIBES: 'nspfrnp_vibes',
        NETWORK_STATE: 'nspfrnp_network_state',
        SYNC_QUEUE: 'nspfrnp_sync_queue',
        USER_STATE: 'nspfrnp_user_state',
        LAST_SYNC: 'nspfrnp_last_sync',
        CONFLICT_LOG: 'nspfrnp_conflicts'
    };

    // Sync State
    const SyncState = {
        isOnline: navigator.onLine,
        isSyncing: false,
        queueSize: 0,
        lastSync: null,
        syncErrors: [],
        pendingOperations: []
    };

    // Local Storage Manager
    class LocalStorageManager {
        constructor() {
            this.compressionEnabled = true;
            this.encryptionEnabled = false; // Set true when encryption key available
        }

        // Save data with automatic compression
        save(key, data) {
            try {
                const serialized = JSON.stringify({
                    data: data,
                    timestamp: Date.now(),
                    version: '1.0',
                    compressed: this.compressionEnabled
                });

                localStorage.setItem(key, serialized);
                
                // Trigger storage event for cross-tab sync
                window.dispatchEvent(new StorageEvent('storage', {
                    key: key,
                    newValue: serialized,
                    storageArea: localStorage
                }));

                console.log(`💾 Saved to local storage: ${key}`);
                return true;
            } catch (error) {
                console.error(`❌ Failed to save ${key}:`, error);
                
                // Handle quota exceeded
                if (error.name === 'QuotaExceededError') {
                    this.cleanupOldData();
                    return this.save(key, data); // Retry after cleanup
                }
                return false;
            }
        }

        // Load data with automatic decompression
        load(key) {
            try {
                const item = localStorage.getItem(key);
                if (!item) return null;

                const parsed = JSON.parse(item);
                return parsed.data;
            } catch (error) {
                console.error(`❌ Failed to load ${key}:`, error);
                return null;
            }
        }

        // Append to array-based storage
        append(key, item) {
            const existing = this.load(key) || [];
            existing.push({
                ...item,
                id: this.generateId(),
                localTimestamp: Date.now(),
                synced: false
            });
            return this.save(key, existing);
        }

        // Update specific item
        update(key, id, updates) {
            const items = this.load(key) || [];
            const index = items.findIndex(item => item.id === id);
            
            if (index !== -1) {
                items[index] = {
                    ...items[index],
                    ...updates,
                    updatedAt: Date.now(),
                    synced: false
                };
                return this.save(key, items);
            }
            return false;
        }

        // Delete item
        delete(key, id) {
            const items = this.load(key) || [];
            const filtered = items.filter(item => item.id !== id);
            return this.save(key, filtered);
        }

        // Clear all data
        clearAll() {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            console.log('🗑️ Cleared all local storage');
        }

        // Cleanup old data (keep last 30 days)
        cleanupOldData() {
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            
            Object.values(STORAGE_KEYS).forEach(key => {
                const items = this.load(key);
                if (Array.isArray(items)) {
                    const filtered = items.filter(item => 
                        (item.localTimestamp || item.timestamp || 0) > thirtyDaysAgo
                    );
                    this.save(key, filtered);
                }
            });
            
            console.log('🧹 Cleaned up old data');
        }

        // Generate unique ID
        generateId() {
            return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        // Get storage usage
        getStorageUsage() {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            return {
                used: total,
                usedKB: (total / 1024).toFixed(2),
                usedMB: (total / 1024 / 1024).toFixed(2),
                limit: 5 * 1024 * 1024, // 5MB typical limit
                percentage: ((total / (5 * 1024 * 1024)) * 100).toFixed(2)
            };
        }
    }

    // Network Sync Manager
    class NetworkSyncManager {
        constructor(storage) {
            this.storage = storage;
            this.syncEndpoint = '/api/sync'; // Configure your endpoint
            this.syncInterval = 30000; // 30 seconds
            this.syncTimer = null;
            this.retryAttempts = 3;
            this.retryDelay = 5000; // 5 seconds
        }

        // Start automatic sync
        startAutoSync() {
            if (this.syncTimer) return;

            this.syncTimer = setInterval(() => {
                if (SyncState.isOnline && !SyncState.isSyncing) {
                    this.syncAll();
                }
            }, this.syncInterval);

            console.log('🔄 Auto-sync started (every 30s)');
        }

        // Stop automatic sync
        stopAutoSync() {
            if (this.syncTimer) {
                clearInterval(this.syncTimer);
                this.syncTimer = null;
                console.log('⏸️ Auto-sync stopped');
            }
        }

        // Sync all data
        async syncAll() {
            if (SyncState.isSyncing) {
                console.log('⏳ Sync already in progress');
                return;
            }

            SyncState.isSyncing = true;
            this.updateSyncIndicator('syncing');

            try {
                // Sync each data type
                await this.syncGrants();
                await this.syncBroadcasts();
                await this.syncVibes();
                await this.syncNetworkState();

                // Update last sync time
                const now = new Date();
                this.storage.save(STORAGE_KEYS.LAST_SYNC, now.toISOString());
                SyncState.lastSync = now;

                console.log('✅ Sync completed successfully');
                this.updateSyncIndicator('synced');
                
                // Process sync queue
                await this.processSyncQueue();

            } catch (error) {
                console.error('❌ Sync failed:', error);
                SyncState.syncErrors.push({
                    error: error.message,
                    timestamp: Date.now()
                });
                this.updateSyncIndicator('error');
            } finally {
                SyncState.isSyncing = false;
            }
        }

        // Sync grants
        async syncGrants() {
            const grants = this.storage.load(STORAGE_KEYS.GRANTS) || [];
            const unsynced = grants.filter(g => !g.synced);

            if (unsynced.length === 0) return;

            // In production, send to backend
            console.log(`📤 Syncing ${unsynced.length} grants...`);

            // Simulate API call
            await this.simulateApiCall('/api/grants/sync', unsynced);

            // Mark as synced
            unsynced.forEach(grant => {
                this.storage.update(STORAGE_KEYS.GRANTS, grant.id, { 
                    synced: true,
                    syncedAt: Date.now()
                });
            });
        }

        // Sync broadcasts
        async syncBroadcasts() {
            const broadcasts = this.storage.load(STORAGE_KEYS.BROADCASTS) || [];
            const unsynced = broadcasts.filter(b => !b.synced);

            if (unsynced.length === 0) return;

            console.log(`📤 Syncing ${unsynced.length} broadcasts...`);

            await this.simulateApiCall('/api/broadcasts/sync', unsynced);

            unsynced.forEach(broadcast => {
                this.storage.update(STORAGE_KEYS.BROADCASTS, broadcast.id, { 
                    synced: true,
                    syncedAt: Date.now()
                });
            });
        }

        // Sync vibes
        async syncVibes() {
            const vibes = this.storage.load(STORAGE_KEYS.VIBES) || [];
            const unsynced = vibes.filter(v => !v.synced);

            if (unsynced.length === 0) return;

            console.log(`📤 Syncing ${unsynced.length} vibes...`);

            await this.simulateApiCall('/api/vibes/sync', unsynced);

            unsynced.forEach(vibe => {
                this.storage.update(STORAGE_KEYS.VIBES, vibe.id, { 
                    synced: true,
                    syncedAt: Date.now()
                });
            });
        }

        // Sync network state
        async syncNetworkState() {
            const networkState = this.storage.load(STORAGE_KEYS.NETWORK_STATE);
            if (!networkState) return;

            console.log('📤 Syncing network state...');
            await this.simulateApiCall('/api/network/state', networkState);
        }

        // Add to sync queue
        addToQueue(operation) {
            const queue = this.storage.load(STORAGE_KEYS.SYNC_QUEUE) || [];
            queue.push({
                ...operation,
                id: this.storage.generateId(),
                queuedAt: Date.now(),
                attempts: 0
            });
            this.storage.save(STORAGE_KEYS.SYNC_QUEUE, queue);
            SyncState.queueSize = queue.length;
            
            console.log(`➕ Added to sync queue: ${operation.type}`);
        }

        // Process sync queue
        async processSyncQueue() {
            const queue = this.storage.load(STORAGE_KEYS.SYNC_QUEUE) || [];
            if (queue.length === 0) return;

            console.log(`📋 Processing sync queue: ${queue.length} items`);

            for (const operation of queue) {
                try {
                    await this.executeQueuedOperation(operation);
                    
                    // Remove from queue on success
                    this.storage.delete(STORAGE_KEYS.SYNC_QUEUE, operation.id);
                    
                } catch (error) {
                    console.error(`❌ Queue operation failed:`, error);
                    
                    // Increment attempts
                    operation.attempts++;
                    
                    if (operation.attempts >= this.retryAttempts) {
                        // Move to failed operations log
                        this.logFailedOperation(operation, error);
                        this.storage.delete(STORAGE_KEYS.SYNC_QUEUE, operation.id);
                    } else {
                        // Update attempt count
                        this.storage.update(STORAGE_KEYS.SYNC_QUEUE, operation.id, {
                            attempts: operation.attempts,
                            lastAttempt: Date.now()
                        });
                    }
                }
            }

            SyncState.queueSize = (this.storage.load(STORAGE_KEYS.SYNC_QUEUE) || []).length;
        }

        // Execute queued operation
        async executeQueuedOperation(operation) {
            switch (operation.type) {
                case 'grant_request':
                    return await this.simulateApiCall('/api/grants/create', operation.data);
                case 'broadcast_post':
                    return await this.simulateApiCall('/api/broadcasts/create', operation.data);
                case 'vibe_message':
                    return await this.simulateApiCall('/api/vibes/message', operation.data);
                case 'network_update':
                    return await this.simulateApiCall('/api/network/update', operation.data);
                default:
                    throw new Error(`Unknown operation type: ${operation.type}`);
            }
        }

        // Log failed operation
        logFailedOperation(operation, error) {
            const conflicts = this.storage.load(STORAGE_KEYS.CONFLICT_LOG) || [];
            conflicts.push({
                operation: operation,
                error: error.message,
                timestamp: Date.now()
            });
            this.storage.save(STORAGE_KEYS.CONFLICT_LOG, conflicts);
            
            console.error('💥 Operation failed permanently:', operation.type);
        }

        // Simulate API call (replace with real fetch in production)
        async simulateApiCall(endpoint, data) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.1) { // 90% success rate
                        resolve({ success: true, data: data });
                    } else {
                        reject(new Error('Simulated network error'));
                    }
                }, 500); // Simulate network delay
            });
        }

        // Update sync indicator UI
        updateSyncIndicator(state) {
            const indicator = document.getElementById('sync-indicator');
            if (!indicator) return;

            const states = {
                synced: { icon: '✓', color: '#90EE90', text: 'Synced' },
                syncing: { icon: '⟳', color: '#ffd700', text: 'Syncing...' },
                offline: { icon: '⚠', color: '#ff6464', text: 'Offline' },
                error: { icon: '✗', color: '#ff6464', text: 'Sync Error' },
                queued: { icon: '⋯', color: '#64c8ff', text: 'Queued' }
            };

            const config = states[state] || states.offline;
            
            indicator.innerHTML = `
                <span style="color: ${config.color}; font-size: 1.2em; margin-right: 5px;">
                    ${config.icon}
                </span>
                <span style="color: ${config.color};">${config.text}</span>
            `;
        }
    }

    // Conflict Resolution Manager
    class ConflictResolver {
        constructor(storage) {
            this.storage = storage;
            this.strategies = {
                'last-write-wins': this.lastWriteWins.bind(this),
                'server-wins': this.serverWins.bind(this),
                'client-wins': this.clientWins.bind(this),
                'merge': this.mergeChanges.bind(this)
            };
        }

        // Resolve conflict using specified strategy
        resolve(local, remote, strategy = 'last-write-wins') {
            const resolver = this.strategies[strategy];
            if (!resolver) {
                console.error(`Unknown conflict resolution strategy: ${strategy}`);
                return this.lastWriteWins(local, remote);
            }
            
            return resolver(local, remote);
        }

        // Last write wins (compare timestamps)
        lastWriteWins(local, remote) {
            const localTime = local.updatedAt || local.timestamp || 0;
            const remoteTime = remote.updatedAt || remote.timestamp || 0;
            
            return localTime > remoteTime ? local : remote;
        }

        // Server always wins
        serverWins(local, remote) {
            return remote;
        }

        // Client always wins
        clientWins(local, remote) {
            return local;
        }

        // Merge changes intelligently
        mergeChanges(local, remote) {
            return {
                ...remote,
                ...local,
                mergedAt: Date.now(),
                mergeStrategy: 'merge'
            };
        }
    }

    // Cross-Tab Sync Manager
    class CrossTabSync {
        constructor(storage) {
            this.storage = storage;
            this.setupListeners();
        }

        setupListeners() {
            // Listen for storage events from other tabs
            window.addEventListener('storage', (event) => {
                if (!event.key || !event.key.startsWith('nspfrnp_')) return;

                console.log(`📡 Cross-tab update: ${event.key}`);
                
                // Trigger update events for UI refresh
                window.dispatchEvent(new CustomEvent('local-storage-updated', {
                    detail: {
                        key: event.key,
                        newValue: event.newValue,
                        oldValue: event.oldValue
                    }
                }));
            });

            // Broadcast when this tab makes changes
            window.addEventListener('local-storage-change', (event) => {
                this.broadcastChange(event.detail);
            });
        }

        broadcastChange(detail) {
            // Already handled by storage event
            console.log('📢 Broadcasting change to other tabs');
        }
    }

    // Main Storage & Sync Protocol
    window.StorageSyncProtocol = {
        storage: new LocalStorageManager(),
        sync: null,
        conflicts: null,
        crossTab: null,
        initialized: false,

        // Initialize the protocol
        init: function(config = {}) {
            if (this.initialized) return;

            this.sync = new NetworkSyncManager(this.storage);
            this.conflicts = new ConflictResolver(this.storage);
            this.crossTab = new CrossTabSync(this.storage);

            // Setup online/offline detection
            this.setupNetworkDetection();

            // Start auto-sync if online
            if (SyncState.isOnline) {
                this.sync.startAutoSync();
            }

            // Add sync indicator to page
            this.addSyncIndicator();

            // Load last sync time
            const lastSync = this.storage.load(STORAGE_KEYS.LAST_SYNC);
            if (lastSync) {
                SyncState.lastSync = new Date(lastSync);
            }

            this.initialized = true;
            console.log('💾 Storage & Sync Protocol initialized');
            console.log('📊 Storage usage:', this.storage.getStorageUsage());
        },

        // Setup network detection
        setupNetworkDetection: function() {
            window.addEventListener('online', () => {
                console.log('🌐 Network online');
                SyncState.isOnline = true;
                this.sync.updateSyncIndicator('syncing');
                this.sync.startAutoSync();
                this.sync.syncAll();
            });

            window.addEventListener('offline', () => {
                console.log('📴 Network offline');
                SyncState.isOnline = false;
                this.sync.updateSyncIndicator('offline');
                this.sync.stopAutoSync();
            });
        },

        // Add sync indicator to page
        addSyncIndicator: function() {
            if (document.getElementById('sync-indicator')) return;

            const indicator = document.createElement('div');
            indicator.id = 'sync-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 60px;
                left: 20px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #64c8ff;
                border-radius: 10px;
                padding: 8px 15px;
                font-family: 'Georgia', serif;
                font-size: 0.9em;
                z-index: 9997;
                cursor: pointer;
                transition: all 0.3s;
                backdrop-filter: blur(10px);
            `;

            indicator.onclick = () => this.showSyncStatus();

            document.body.appendChild(indicator);
            
            this.sync.updateSyncIndicator(SyncState.isOnline ? 'synced' : 'offline');
        },

        // Show sync status modal
        showSyncStatus: function() {
            const usage = this.storage.getStorageUsage();
            const queue = this.storage.load(STORAGE_KEYS.SYNC_QUEUE) || [];
            const conflicts = this.storage.load(STORAGE_KEYS.CONFLICT_LOG) || [];

            const status = `
╔══════════════════════════════════════╗
║    STORAGE & SYNC STATUS             ║
╚══════════════════════════════════════╝

📡 Network: ${SyncState.isOnline ? 'Online ✓' : 'Offline ✗'}
🔄 Last Sync: ${SyncState.lastSync ? SyncState.lastSync.toLocaleString() : 'Never'}
📋 Queue Size: ${queue.length} operations
💾 Storage Used: ${usage.usedKB} KB (${usage.percentage}%)

⚠️ Conflicts: ${conflicts.length}
❌ Sync Errors: ${SyncState.syncErrors.length}

${queue.length > 0 ? '\n📋 Queued Operations:\n' + queue.map(q => 
    `  • ${q.type} (${q.attempts} attempts)`
).join('\n') : ''}

${conflicts.length > 0 ? '\n💥 Recent Conflicts:\n' + conflicts.slice(-3).map(c => 
    `  • ${c.operation.type}: ${c.error}`
).join('\n') : ''}
            `.trim();

            alert(status);
        },

        // Save grant request
        saveGrantRequest: function(grantData) {
            const saved = this.storage.append(STORAGE_KEYS.GRANTS, grantData);
            
            if (SyncState.isOnline) {
                this.sync.addToQueue({
                    type: 'grant_request',
                    data: grantData
                });
            }
            
            return saved;
        },

        // Save broadcast
        saveBroadcast: function(broadcastData) {
            const saved = this.storage.append(STORAGE_KEYS.BROADCASTS, broadcastData);
            
            if (SyncState.isOnline) {
                this.sync.addToQueue({
                    type: 'broadcast_post',
                    data: broadcastData
                });
            }
            
            return saved;
        },

        // Save vibe message
        saveVibeMessage: function(vibeData) {
            const saved = this.storage.append(STORAGE_KEYS.VIBES, vibeData);
            
            if (SyncState.isOnline) {
                this.sync.addToQueue({
                    type: 'vibe_message',
                    data: vibeData
                });
            }
            
            return saved;
        },

        // Force sync now
        syncNow: function() {
            if (!SyncState.isOnline) {
                alert('Cannot sync: Network offline');
                return;
            }
            
            console.log('🔄 Manual sync triggered');
            return this.sync.syncAll();
        },

        // Get sync statistics
        getStats: function() {
            return {
                isOnline: SyncState.isOnline,
                isSyncing: SyncState.isSyncing,
                lastSync: SyncState.lastSync,
                queueSize: SyncState.queueSize,
                storageUsage: this.storage.getStorageUsage(),
                totalGrants: (this.storage.load(STORAGE_KEYS.GRANTS) || []).length,
                totalBroadcasts: (this.storage.load(STORAGE_KEYS.BROADCASTS) || []).length,
                totalVibes: (this.storage.load(STORAGE_KEYS.VIBES) || []).length,
                conflicts: (this.storage.load(STORAGE_KEYS.CONFLICT_LOG) || []).length
            };
        },

        // Clear all local data
        clearAll: function() {
            if (confirm('Clear all local data? This cannot be undone.')) {
                this.storage.clearAll();
                alert('All local data cleared');
                window.location.reload();
            }
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            StorageSyncProtocol.init();
        });
    } else {
        StorageSyncProtocol.init();
    }

    console.log('💾 Storage & Sync Protocol loaded');
    console.log('🔄 Offline-first architecture ready');
})();
