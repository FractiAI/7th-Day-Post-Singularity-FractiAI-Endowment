/**
 * Leonardo da Vinci Video Call Interface - Embed Script
 * Full NSPFRP Integration
 * 
 * Multi-disciplinary implementation:
 * - UI Designer: Beautiful, intuitive interface
 * - Full Stack Engineer: Robust, performant code
 * - Hollywood Executive: Compelling presentation
 * - Screenwriter: Engaging narrative
 * - Game Designer: Interactive, engaging
 * - Architect: Sound structure
 * - Museum Curator: Educational, accessible
 */

class LeonardoVideoCallEmbed {
    constructor(config = {}) {
        this.config = {
            autoShow: config.autoShow !== false,
            position: config.position || 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left', 'center'
            size: config.size || 'medium', // 'small', 'medium', 'large', 'fullscreen'
            theme: config.theme || 'leonardo',
            onClose: config.onClose || null,
            onCommand: config.onCommand || null,
            ...config
        };
        
        this.isVisible = false;
        this.init();
    }
    
    init() {
        // Create container
        this.createContainer();
        
        // Load Leonardo interface
        this.loadInterface();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Auto-show if configured
        if (this.config.autoShow) {
            setTimeout(() => this.show(), 1000);
        }
    }
    
    createContainer() {
        // Remove existing if present
        const existing = document.getElementById('leonardo-video-call-embed');
        if (existing) existing.remove();
        
        // Create container
        this.container = document.createElement('div');
        this.container.id = 'leonardo-video-call-embed';
        this.container.style.cssText = `
            position: fixed;
            z-index: 999999;
            ${this.getPositionStyles()}
            ${this.getSizeStyles()}
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(this.container);
    }
    
    getPositionStyles() {
        const positions = {
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-left': 'bottom: 20px; left: 20px;',
            'top-right': 'top: 20px; right: 20px;',
            'top-left': 'top: 20px; left: 20px;',
            'center': 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
        };
        return positions[this.config.position] || positions['bottom-right'];
    }
    
    getSizeStyles() {
        const sizes = {
            'small': 'width: 400px; height: 500px;',
            'medium': 'width: 600px; height: 700px;',
            'large': 'width: 800px; height: 900px;',
            'fullscreen': 'width: 100vw; height: 100vh; top: 0; left: 0; transform: none;'
        };
        return sizes[this.config.size] || sizes['medium'];
    }
    
    loadInterface() {
        // Load via iframe for isolation
        this.iframe = document.createElement('iframe');
        this.iframe.src = 'LEONARDO_DA_VINCI_VIDEO_CALL_INTERFACE.html';
        this.iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        this.iframe.allow = 'fullscreen';
        
        this.container.appendChild(this.iframe);
    }
    
    setupEventListeners() {
        // Listen for messages from iframe
        window.addEventListener('message', (e) => {
            if (e.data.type === 'leonardo-close') {
                this.hide();
                if (this.config.onClose) this.config.onClose();
            }
            if (e.data.type === 'leonardo-command') {
                if (this.config.onCommand) this.config.onCommand(e.data.command);
            }
        });
    }
    
    show() {
        this.container.style.opacity = '0';
        this.container.style.transform = 'scale(0.9) translateY(20px)';
        this.container.style.display = 'block';
        
        setTimeout(() => {
            this.container.style.opacity = '1';
            this.container.style.transform = 'scale(1) translateY(0)';
        }, 10);
        
        this.isVisible = true;
    }
    
    hide() {
        this.container.style.opacity = '0';
        this.container.style.transform = 'scale(0.9) translateY(20px)';
        
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 300);
        
        this.isVisible = false;
    }
    
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    destroy() {
        if (this.container) {
            this.container.remove();
        }
    }
}

// Auto-initialize on all pages (Full Stack Engineer)
if (typeof window !== 'undefined') {
    // Create global instance
    window.LeonardoVideoCall = new LeonardoVideoCallEmbed({
        autoShow: true,
        position: 'bottom-right',
        size: 'medium',
        onClose: () => {
            console.log('Leonardo studio closed');
        },
        onCommand: (command) => {
            console.log('Leonardo command:', command);
        }
    });
    
    // Add toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '🎨';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #d4af37, #8b5cf6);
        border: 3px solid #fff;
        color: #fff;
        font-size: 1.5em;
        cursor: pointer;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 999998;
        transition: all 0.3s ease;
    `;
    toggleBtn.onmouseenter = () => {
        toggleBtn.style.transform = 'scale(1.1)';
        toggleBtn.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.4)';
    };
    toggleBtn.onmouseleave = () => {
        toggleBtn.style.transform = 'scale(1)';
        toggleBtn.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    };
    toggleBtn.onclick = () => window.LeonardoVideoCall.toggle();
    
    document.body.appendChild(toggleBtn);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeonardoVideoCallEmbed;
}








