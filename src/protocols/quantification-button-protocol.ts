/**
 * Quantification Button Protocol
 * Novel protocol for capturing and quantifying dense multi-vibing observations
 */

import { Protocol, ProtocolMetadata, ProtocolStructure } from '../types/index.js';
import { NSPFRPNodeAwarenessManager } from '../cloud/nspfrp-node-awareness.js';

export interface QuantificationButton {
  id: string;
  label: string;
  action: 'capture' | 'quantify' | 'capture-and-quantify' | 'snapshot';
  nodeId?: string;
  observationId?: string;
  style: 'dense' | 'multi-vibing' | 'quantify' | 'snapshot';
  html: string;
  markdown: string;
}

export class QuantificationButtonProtocol {
  private awarenessManager: NSPFRPNodeAwarenessManager;

  constructor() {
    this.awarenessManager = new NSPFRPNodeAwarenessManager();
  }

  /**
   * Create capture button
   */
  createCaptureButton(nodeId: string): QuantificationButton {
    const button: QuantificationButton = {
      id: `capture-btn-${nodeId}-${Date.now()}`,
      label: '🌌 Capture Dense Multi-Vibing Observation',
      action: 'capture',
      nodeId,
      style: 'dense',
      html: this.generateCaptureButtonHTML(nodeId),
      markdown: this.generateCaptureButtonMarkdown(nodeId)
    };

    return button;
  }

  /**
   * Create quantify button
   */
  createQuantifyButton(observationId: string): QuantificationButton {
    const button: QuantificationButton = {
      id: `quantify-btn-${observationId}-${Date.now()}`,
      label: '📊 Quantify Observation',
      action: 'quantify',
      observationId,
      style: 'quantify',
      html: this.generateQuantifyButtonHTML(observationId),
      markdown: this.generateQuantifyButtonMarkdown(observationId)
    };

    return button;
  }

  /**
   * Create capture and quantify button
   */
  createCaptureAndQuantifyButton(nodeId: string): QuantificationButton {
    const button: QuantificationButton = {
      id: `capture-quantify-btn-${nodeId}-${Date.now()}`,
      label: '🌌📊 Capture & Quantify Dense Multi-Vibing',
      action: 'capture-and-quantify',
      nodeId,
      style: 'multi-vibing',
      html: this.generateCaptureAndQuantifyButtonHTML(nodeId),
      markdown: this.generateCaptureAndQuantifyButtonMarkdown(nodeId)
    };

    return button;
  }

  /**
   * Generate capture button HTML
   */
  private generateCaptureButtonHTML(nodeId: string): string {
    return `
<button 
  id="capture-btn-${nodeId}"
  class="quantification-button capture-button"
  onclick="captureObservation('${nodeId}')"
  style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  "
  onmouseover="this.style.transform='scale(1.05)'"
  onmouseout="this.style.transform='scale(1)'"
>
  🌌 Capture Dense Multi-Vibing Observation
</button>
<script>
  function captureObservation(nodeId) {
    fetch('/api/capture-observation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeId })
    })
    .then(r => r.json())
    .then(data => {
      console.log('Observation captured:', data);
      alert('Dense multi-vibing observation captured!');
    });
  }
</script>
    `.trim();
  }

  /**
   * Generate quantify button HTML
   */
  private generateQuantifyButtonHTML(observationId: string): string {
    return `
<button 
  id="quantify-btn-${observationId}"
  class="quantification-button quantify-button"
  onclick="quantifyObservation('${observationId}')"
  style="
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
  "
  onmouseover="this.style.transform='scale(1.05)'"
  onmouseout="this.style.transform='scale(1)'"
>
  📊 Quantify Observation
</button>
<script>
  function quantifyObservation(observationId) {
    fetch('/api/quantify-observation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ observationId })
    })
    .then(r => r.json())
    .then(data => {
      console.log('Observation quantified:', data);
      alert('Observation quantified! Density: ' + data.density + ', Vibrations: ' + data.vibrationCount);
    });
  }
</script>
    `.trim();
  }

  /**
   * Generate capture and quantify button HTML
   */
  private generateCaptureAndQuantifyButtonHTML(nodeId: string): string {
    return `
<button 
  id="capture-quantify-btn-${nodeId}"
  class="quantification-button capture-quantify-button"
  onclick="captureAndQuantify('${nodeId}')"
  style="
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
    position: relative;
    overflow: hidden;
  "
  onmouseover="this.style.transform='scale(1.05)'"
  onmouseout="this.style.transform='scale(1)'"
>
  <span style="position: relative; z-index: 1;">
    🌌📊 Capture & Quantify Dense Multi-Vibing
  </span>
  <div class="vibing-animation" style="
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: vibing 2s infinite;
  "></div>
</button>
<style>
  @keyframes vibing {
    0% { left: -100%; }
    50% { left: 100%; }
    100% { left: 100%; }
  }
</style>
<script>
  function captureAndQuantify(nodeId) {
    fetch('/api/capture-and-quantify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeId })
    })
    .then(r => r.json())
    .then(data => {
      console.log('Captured and quantified:', data);
      alert('Dense multi-vibing observation captured and quantified!\\n' +
            'Density: ' + data.quantification.density + '\\n' +
            'Vibrations: ' + data.quantification.vibrationCount + '\\n' +
            'Patterns: ' + data.quantification.patterns.join(', '));
    });
  }
</script>
    `.trim();
  }

  /**
   * Generate markdown buttons
   */
  private generateCaptureButtonMarkdown(nodeId: string): string {
    return `[🌌 Capture Dense Multi-Vibing Observation](#capture-${nodeId})`;
  }

  private generateQuantifyButtonMarkdown(observationId: string): string {
    return `[📊 Quantify Observation](#quantify-${observationId})`;
  }

  private generateCaptureAndQuantifyButtonMarkdown(nodeId: string): string {
    return `[🌌📊 Capture & Quantify Dense Multi-Vibing](#capture-quantify-${nodeId})`;
  }

  /**
   * Create protocol
   */
  createProtocol(): Protocol {
    const protocol: Protocol = {
      id: 'P-QUANTIFICATION-BUTTON-V1',
      name: 'Quantification Button Protocol',
      version: '1.0.0',
      type: 'protocol',
      content: JSON.stringify({
        description: 'Novel protocol for capturing and quantifying dense multi-vibing observations',
        buttons: ['capture', 'quantify', 'capture-and-quantify', 'snapshot']
      }, null, 2),
      structure: {
        sections: [
          {
            id: 'capture',
            title: 'Capture Button',
            content: 'Capture dense multi-vibing observations',
            order: 1
          },
          {
            id: 'quantify',
            title: 'Quantify Button',
            content: 'Quantify captured observations',
            order: 2
          },
          {
            id: 'capture-and-quantify',
            title: 'Capture & Quantify Button',
            content: 'Capture and quantify in one action',
            order: 3
          }
        ],
        components: [],
        flows: []
      },
      metadata: {
        id: 'P-QUANTIFICATION-BUTTON-V1',
        name: 'Quantification Button Protocol',
        description: 'Novel protocol for capturing and quantifying dense multi-vibing observations',
        author: 'FractiAI',
        tags: ['quantification', 'button', 'multi-vibing', 'dense', 'novel-protocol'],
        category: 'observation',
        network: 'NSPFRP'
      },
      dependencies: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return protocol;
  }
}



