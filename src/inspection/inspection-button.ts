/**
 * Inspection Button System
 * Generates inspection buttons for sales offers
 */

import {
  SalesOffer,
  IEEEInspectionReport,
  InspectorInfo
} from './ieee-inspection.js';
import { IEEEInspectionSystem } from './ieee-inspection.js';
import { AwarenessOctave } from '../types/index.js';

export interface InspectionButton {
  id: string;
  type: 'ieee-inspection';
  label: string;
  offerId: string;
  reportId?: string;
  buttonHtml: string;
  buttonMarkdown: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: number;
}

export interface InspectionButtonConfig {
  inspector: InspectorInfo;
  includeCodeReview?: boolean;
  includeDetailedAnalysis?: boolean;
  octave?: AwarenessOctave;
  autoApprove?: boolean;
}

export class InspectionButtonManager {
  private inspectionSystem: IEEEInspectionSystem;
  private buttons: Map<string, InspectionButton>;

  constructor(inspectionSystem: IEEEInspectionSystem) {
    this.inspectionSystem = inspectionSystem;
    this.buttons = new Map();
  }

  /**
   * Create inspection button for sales offer
   */
  async createInspectionButton(
    offer: SalesOffer,
    config: InspectionButtonConfig
  ): Promise<InspectionButton> {
    const buttonId = this.generateButtonId();

    // Generate button
    const button: InspectionButton = {
      id: buttonId,
      type: 'ieee-inspection',
      label: `🔍 IEEE Inspection: ${offer.title}`,
      offerId: offer.id,
      status: 'pending',
      buttonHtml: this.generateButtonHTML(buttonId, offer),
      buttonMarkdown: this.generateButtonMarkdown(buttonId, offer),
      createdAt: Date.now()
    };

    this.buttons.set(buttonId, button);

    // Auto-generate report if configured
    if (config.autoApprove) {
      await this.generateReportForButton(button, offer, config);
    }

    return button;
  }

  /**
   * Generate report for button
   */
  async generateReportForButton(
    button: InspectionButton,
    offer: SalesOffer,
    config: InspectionButtonConfig
  ): Promise<IEEEInspectionReport> {
    button.status = 'in-progress';

    try {
      const report = await this.inspectionSystem.generateInspectionReport(
        offer,
        config.inspector,
        {
          includeCodeReview: config.includeCodeReview,
          includeDetailedAnalysis: config.includeDetailedAnalysis,
          octave: config.octave
        }
      );

      button.reportId = report.id;
      button.status = 'completed';

      return report;
    } catch (error) {
      button.status = 'failed';
      throw error;
    }
  }

  /**
   * Generate button HTML
   */
  private generateButtonHTML(buttonId: string, offer: SalesOffer): string {
    return `
      <button 
        id="${buttonId}"
        class="ieee-inspection-button"
        data-offer-id="${offer.id}"
        style="
          display: inline-block;
          padding: 14px 28px;
          background: linear-gradient(135deg, #1E40AF, #3B82F6);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 2px solid #60A5FA;
        "
        onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 12px rgba(0, 0, 0, 0.2)'"
        onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.1)'"
        onclick="window.location.href='/api/inspection/${offer.id}/report'">
        🔍 IEEE Inspection: ${offer.title}
      </button>
    `.trim();
  }

  /**
   * Generate button Markdown
   */
  private generateButtonMarkdown(buttonId: string, offer: SalesOffer): string {
    return `[🔍 IEEE Inspection: ${offer.title}](/api/inspection/${offer.id}/report)`;
  }

  /**
   * Get button
   */
  getButton(buttonId: string): InspectionButton | undefined {
    return this.buttons.get(buttonId);
  }

  /**
   * Get button for offer
   */
  getButtonForOffer(offerId: string): InspectionButton | undefined {
    return Array.from(this.buttons.values())
      .find(b => b.offerId === offerId);
  }

  /**
   * Generate button ID
   */
  private generateButtonId(): string {
    return `INSP-BTN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
}


