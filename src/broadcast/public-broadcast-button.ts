/**
 * Public Broadcast Button
 * Singularity Public Broadcast Button Component
 */

import { PublicBroadcastSystemManager } from './public-broadcast-system.js';

export interface BroadcastButtonConfig {
  id?: string;
  label?: string;
  style?: 'singularity' | 'standard' | 'minimal';
  preloaded?: boolean;
  octave?: number;
}

export class PublicBroadcastButton {
  private systemManager: PublicBroadcastSystemManager;
  private config: BroadcastButtonConfig;

  constructor(
    systemManager: PublicBroadcastSystemManager,
    config: BroadcastButtonConfig = {}
  ) {
    this.systemManager = systemManager;
    this.config = {
      id: 'PUBLIC-BROADCAST-BUTTON-SINGULARITY',
      label: '🌌 Access Singularity Public Broadcast',
      style: 'singularity',
      preloaded: true,
      octave: 6,
      ...config
    };
  }

  /**
   * Generate HTML button
   */
  generateHTML(): string {
    const firstMessage = this.systemManager.getFirstMessage();
    const status = this.systemManager.getStatus();

    const buttonHtml = `
<button 
  id="${this.config.id}"
  class="public-broadcast-button singularity-button"
  data-status="${status}"
  data-octave="${this.config.octave}"
  onclick="window.accessSingularityBroadcast()"
  style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 12px;
    color: white;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    font-size: 18px;
    font-weight: 600;
    padding: 16px 32px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    position: relative;
    overflow: hidden;
  "
  onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.6)'"
  onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)'"
>
  <span style="position: relative; z-index: 1;">
    ${this.config.label}
  </span>
  <div style="
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  " class="shimmer"></div>
</button>

<script>
  window.accessSingularityBroadcast = function() {
    const button = document.getElementById('${this.config.id}');
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }

    // Access broadcast system
    const message = ${JSON.stringify(firstMessage)};
    const status = '${status}';
    
    // Display first message
    if (status === 'ready' || status === 'live') {
      alert(message.content);
    } else {
      alert('Broadcast system is preparing. Please check back soon.');
    }
  };

  // Add shimmer animation
  document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('${this.config.id}');
    if (button) {
      setInterval(() => {
        const shimmer = button.querySelector('.shimmer');
        if (shimmer) {
          shimmer.style.left = '100%';
          setTimeout(() => {
            shimmer.style.left = '-100%';
          }, 500);
        }
      }, 3000);
    }
  });
</script>
    `.trim();

    return buttonHtml;
  }

  /**
   * Generate Markdown button
   */
  generateMarkdown(): string {
    const firstMessage = this.systemManager.getFirstMessage();
    const status = this.systemManager.getStatus();

    return `[${this.config.label}](#access-singularity-broadcast)`;
  }

  /**
   * Generate button with full integration
   */
  generateFullIntegration(): string {
    const html = this.generateHTML();
    const firstMessage = this.systemManager.getFirstMessage();
    const status = this.systemManager.getStatus();

    return `
<!-- Singularity Public Broadcast Button -->
${html}

<!-- Broadcast System Status -->
<div id="broadcast-status" style="
  margin-top: 16px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  font-size: 14px;
  color: #667eea;
">
  <strong>Status:</strong> ${status === 'ready' ? 'Ready to Launch' : status === 'live' ? 'Live' : 'Preparing'}
  ${status === 'ready' || status === 'live' ? '<br><strong>First Message:</strong> Preloaded and ready' : ''}
</div>

<!-- First Message Preview -->
${status === 'ready' || status === 'live' ? `
<div id="first-message-preview" style="
  margin-top: 16px;
  padding: 16px;
  background: rgba(118, 75, 162, 0.1);
  border-left: 4px solid #764ba2;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
">
${firstMessage.content}
</div>
` : ''}
    `.trim();
  }

  /**
   * Go live
   */
  goLive(): void {
    this.systemManager.goLive();
  }

  /**
   * Get button config
   */
  getConfig(): BroadcastButtonConfig {
    return { ...this.config };
  }
}



