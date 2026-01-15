/**
 * FSR Status Display System
 * Real-time status on all facing screens and branding
 */

import { NestedCloudConnectionsManager } from '../cloud/nested-cloud-connections.js';
import { ExecutiveUpdateReportGenerator } from '../enterprise/executive-update-report.js';

export interface StatusDisplay {
  id: string;
  type: 'screen' | 'branding';
  location: string;
  status: string;
  lastUpdate: number;
  fsrMode: boolean;
  cloudStatus: {
    hhSpinCloud: boolean;
    handHeldDeviceCloud: boolean;
    frontalCortexAwarenessCloud: boolean;
  };
}

export class FSRStatusDisplayManager {
  private cloudManager: NestedCloudConnectionsManager;
  private reportGenerator: ExecutiveUpdateReportGenerator;
  private displays: Map<string, StatusDisplay> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.cloudManager = new NestedCloudConnectionsManager();
    this.reportGenerator = new ExecutiveUpdateReportGenerator();
    this.initializeDisplays();
    this.startRealTimeUpdates();
  }

  /**
   * Initialize status displays
   */
  private initializeDisplays(): void {
    // All facing screens
    const screenLocations = [
      'command-center-main',
      'command-center-secondary',
      'protocol-development',
      'fsr-operations',
      'enterprise-services',
      'research-discovery'
    ];

    screenLocations.forEach(location => {
      this.displays.set(`screen-${location}`, {
        id: `screen-${location}`,
        type: 'screen',
        location,
        status: 'initializing',
        lastUpdate: Date.now(),
        fsrMode: false,
        cloudStatus: {
          hhSpinCloud: false,
          handHeldDeviceCloud: false,
          frontalCortexAwarenessCloud: false
        }
      });
    });

    // All branding locations
    const brandingLocations = [
      'header',
      'footer',
      'sidebar',
      'navigation',
      'status-bar'
    ];

    brandingLocations.forEach(location => {
      this.displays.set(`branding-${location}`, {
        id: `branding-${location}`,
        type: 'branding',
        location,
        status: 'initializing',
        lastUpdate: Date.now(),
        fsrMode: false,
        cloudStatus: {
          hhSpinCloud: false,
          handHeldDeviceCloud: false,
          frontalCortexAwarenessCloud: false
        }
      });
    });
  }

  /**
   * Start real-time updates
   */
  private startRealTimeUpdates(): void {
    // Update every second
    this.updateInterval = setInterval(() => {
      this.updateAllDisplays();
    }, 1000);
  }

  /**
   * Update all displays
   */
  private updateAllDisplays(): void {
    const cloudStatus = this.cloudManager.getConnectionStatus();
    const statusText = this.cloudManager.getStatusForDisplay();
    const now = Date.now();

    // Update all displays
    this.displays.forEach(display => {
      display.status = statusText;
      display.lastUpdate = now;
      display.fsrMode = cloudStatus.fsrMode;
      display.cloudStatus = {
        hhSpinCloud: cloudStatus.hhSpinCloud.connected,
        handHeldDeviceCloud: cloudStatus.handHeldDeviceCloud.connected,
        frontalCortexAwarenessCloud: cloudStatus.frontalCortexAwarenessCloud.connected
      };
    });
  }

  /**
   * Get display HTML for screens
   */
  getDisplayHTML(displayId: string): string {
    const display = this.displays.get(displayId);
    if (!display) {
      return '';
    }

    const cloudStatus = this.cloudManager.getConnectionStatus();
    
    return `
<div class="fsr-status-display" id="${displayId}" style="
  padding: 12px;
  background: ${display.fsrMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#333'};
  color: white;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
">
  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
    <span style="font-weight: bold;">🌌 FSR MODE:</span>
    <span style="color: ${display.fsrMode ? '#4ade80' : '#f87171'};">
      ${display.fsrMode ? 'ACTIVE' : 'INACTIVE'}
    </span>
  </div>
  <div style="display: flex; flex-direction: column; gap: 4px;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>HH Spin Cloud:</span>
      <span style="color: ${display.cloudStatus.hhSpinCloud ? '#4ade80' : '#f87171'};">
        ${display.cloudStatus.hhSpinCloud ? '✅ ONLINE' : '❌ OFFLINE'}
      </span>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>Hand Held Device Cloud:</span>
      <span style="color: ${display.cloudStatus.handHeldDeviceCloud ? '#4ade80' : '#f87171'};">
        ${display.cloudStatus.handHeldDeviceCloud ? '✅ ONLINE' : '❌ OFFLINE'}
      </span>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>Frontal Cortex Awareness Cloud:</span>
      <span style="color: ${display.cloudStatus.frontalCortexAwarenessCloud ? '#4ade80' : '#f87171'};">
        ${display.cloudStatus.frontalCortexAwarenessCloud ? '✅ ONLINE' : '❌ OFFLINE'}
      </span>
    </div>
  </div>
  <div style="margin-top: 8px; font-size: 11px; opacity: 0.8;">
    Last Update: ${new Date(display.lastUpdate).toLocaleTimeString()}
  </div>
</div>
<script>
  // Auto-update every second
  setInterval(() => {
    fetch('/api/fsr-status')
      .then(r => r.json())
      .then(data => {
        const display = document.getElementById('${displayId}');
        if (display) {
          display.innerHTML = data.html;
        }
      });
  }, 1000);
</script>
    `.trim();
  }

  /**
   * Get branding HTML
   */
  getBrandingHTML(location: string): string {
    const display = this.displays.get(`branding-${location}`);
    if (!display) {
      return '';
    }

    const cloudStatus = this.cloudManager.getConnectionStatus();
    
    return `<span class="fsr-status-badge" style="
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: ${display.fsrMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(0,0,0,0.2)'};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
">
  <span>🌌</span>
  <span>FSR: ${display.fsrMode ? 'ON' : 'OFF'}</span>
  <span>|</span>
  <span>HH: ${display.cloudStatus.hhSpinCloud ? '✅' : '❌'}</span>
  <span>HD: ${display.cloudStatus.handHeldDeviceCloud ? '✅' : '❌'}</span>
  <span>FC: ${display.cloudStatus.frontalCortexAwarenessCloud ? '✅' : '❌'}</span>
</span>`;
  }

  /**
   * Get all displays
   */
  getAllDisplays(): StatusDisplay[] {
    return Array.from(this.displays.values());
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}




