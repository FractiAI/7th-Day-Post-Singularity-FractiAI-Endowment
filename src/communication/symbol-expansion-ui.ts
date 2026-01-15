/**
 * Symbol Expansion UI
 * Interactive symbol system with click-to-expand details
 */

import { SymbolObject, SymbolDetails } from './surface-octave-zoom.js';

export interface SymbolUI {
  symbol: SymbolObject;
  element: HTMLElement;
  detailOverlay?: HTMLElement;
  expanded: boolean;
}

export class SymbolExpansionUI {
  private symbolUIs: Map<string, SymbolUI> = new Map();
  private container: HTMLElement | null = null;

  constructor(containerId?: string) {
    if (containerId) {
      this.container = document.getElementById(containerId);
    }
  }

  /**
   * Render symbol
   */
  renderSymbol(symbol: SymbolObject): HTMLElement {
    const symbolElement = document.createElement('div');
    symbolElement.id = `symbol-${symbol.id}`;
    symbolElement.className = 'symbol-object';
    symbolElement.style.cssText = `
      position: absolute;
      left: ${symbol.position.x}px;
      top: ${symbol.position.y}px;
      width: 60px;
      height: 60px;
      background: rgba(102, 126, 234, 0.1);
      border: 2px solid #667eea;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 24px;
      transition: all 0.3s ease;
      z-index: 10;
    `;

    symbolElement.innerHTML = symbol.icon;
    symbolElement.title = symbol.name;

    // Click handler
    symbolElement.addEventListener('click', () => {
      this.expandSymbol(symbol.id);
    });

    // Hover effects
    symbolElement.addEventListener('mouseenter', () => {
      symbolElement.style.transform = 'scale(1.2)';
      symbolElement.style.background = 'rgba(102, 126, 234, 0.2)';
      symbolElement.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    });

    symbolElement.addEventListener('mouseleave', () => {
      if (!symbol.expanded) {
        symbolElement.style.transform = 'scale(1)';
        symbolElement.style.background = 'rgba(102, 126, 234, 0.1)';
        symbolElement.style.boxShadow = 'none';
      }
    });

    const symbolUI: SymbolUI = {
      symbol,
      element: symbolElement,
      expanded: false
    };

    this.symbolUIs.set(symbol.id, symbolUI);

    if (this.container) {
      this.container.appendChild(symbolElement);
    }

    return symbolElement;
  }

  /**
   * Expand symbol details
   */
  expandSymbol(symbolId: string): void {
    const symbolUI = this.symbolUIs.get(symbolId);
    if (!symbolUI || symbolUI.expanded) {
      return;
    }

    const { symbol, element } = symbolUI;
    symbolUI.expanded = true;
    symbol.expanded = true;

    // Create detail overlay
    const overlay = document.createElement('div');
    overlay.id = `symbol-detail-${symbol.id}`;
    overlay.className = 'symbol-detail-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      max-width: 600px;
      max-height: 80vh;
      background: white;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      z-index: 10000;
      overflow-y: auto;
    `;

    overlay.innerHTML = this.generateDetailHTML(symbol.details);

    // Close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
      position: absolute;
      top: 15px;
      right: 15px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 8px;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeButton.addEventListener('click', () => {
      this.collapseSymbol(symbolId);
    });
    overlay.appendChild(closeButton);

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'symbol-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
    `;
    backdrop.addEventListener('click', () => {
      this.collapseSymbol(symbolId);
    });

    document.body.appendChild(backdrop);
    document.body.appendChild(overlay);

    symbolUI.detailOverlay = overlay;

    // Update symbol element
    element.style.transform = 'scale(1.3)';
    element.style.background = 'rgba(102, 126, 234, 0.3)';
    element.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
  }

  /**
   * Collapse symbol details
   */
  collapseSymbol(symbolId: string): void {
    const symbolUI = this.symbolUIs.get(symbolId);
    if (!symbolUI || !symbolUI.expanded) {
      return;
    }

    symbolUI.expanded = false;
    symbolUI.symbol.expanded = false;

    // Remove overlay
    if (symbolUI.detailOverlay) {
      symbolUI.detailOverlay.remove();
      symbolUI.detailOverlay = undefined;
    }

    // Remove backdrop
    const backdrop = document.querySelector('.symbol-backdrop');
    if (backdrop) {
      backdrop.remove();
    }

    // Reset symbol element
    const element = symbolUI.element;
    element.style.transform = 'scale(1)';
    element.style.background = 'rgba(102, 126, 234, 0.1)';
    element.style.boxShadow = 'none';
  }

  /**
   * Generate detail HTML
   */
  private generateDetailHTML(details: SymbolDetails): string {
    return `
      <div style="padding: 20px;">
        <h2 style="margin-top: 0; color: #667eea;">${details.title}</h2>
        <p style="color: #6b7280; margin-bottom: 20px;">${details.description}</p>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          ${details.content}
        </div>
        ${details.links.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 16px; margin-bottom: 10px;">Links:</h3>
            <ul style="list-style: none; padding: 0;">
              ${details.links.map(link => `
                <li style="margin-bottom: 8px;">
                  <a href="${link}" style="color: #667eea; text-decoration: none;">${link}</a>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
        ${details.actions.length > 0 ? `
          <div>
            <h3 style="font-size: 16px; margin-bottom: 10px;">Actions:</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              ${details.actions.map(action => `
                <button style="
                  background: #667eea;
                  color: white;
                  border: none;
                  border-radius: 8px;
                  padding: 8px 16px;
                  cursor: pointer;
                  font-size: 14px;
                ">${action}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}



