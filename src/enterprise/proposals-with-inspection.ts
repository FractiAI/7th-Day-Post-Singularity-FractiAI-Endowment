/**
 * Proposals with Inspection Integration
 * Sales proposals with embedded IEEE inspection reports
 */

import {
  SalesOffer,
  IEEEInspectionReport,
  InspectionButton
} from '../inspection/ieee-inspection.js';
import { IEEEInspectionSystem } from '../inspection/ieee-inspection.js';
import { InspectionButtonManager } from '../inspection/inspection-button.js';
import { GitSeedPitch } from './gitseed-pitch-unpacker.js';

export interface Proposal {
  id: string;
  title: string;
  clientId: string;
  offer: SalesOffer;
  pitch?: GitSeedPitch;
  inspectionReport?: IEEEInspectionReport;
  inspectionButton?: InspectionButton;
  status: 'draft' | 'pending-inspection' | 'inspected' | 'approved' | 'rejected';
  createdAt: number;
  updatedAt: number;
}

export interface ProposalPackage {
  proposal: Proposal;
  pitchPrompt?: string;
  inspectionReport?: IEEEInspectionReport;
  inspectionButton?: InspectionButton;
  deploymentButtons?: Array<{
    id: string;
    label: string;
    buttonMarkdown: string;
  }>;
  metadata: ProposalMetadata;
}

export interface ProposalMetadata {
  version: string;
  includesInspection: boolean;
  includesPitch: boolean;
  includesDeployment: boolean;
  octave: number;
}

export class ProposalsWithInspection {
  private inspectionSystem: IEEEInspectionSystem;
  private inspectionButtonManager: InspectionButtonManager;
  private proposals: Map<string, Proposal>;

  constructor(
    inspectionSystem: IEEEInspectionSystem,
    inspectionButtonManager: InspectionButtonManager
  ) {
    this.inspectionSystem = inspectionSystem;
    this.inspectionButtonManager = inspectionButtonManager;
    this.proposals = new Map();
  }

  /**
   * Create proposal with inspection
   */
  async createProposal(
    offer: SalesOffer,
    clientId: string,
    options?: {
      generateInspection?: boolean;
      inspector?: any;
      includePitch?: boolean;
      pitch?: GitSeedPitch;
    }
  ): Promise<ProposalPackage> {
    // Create proposal
    const proposal: Proposal = {
      id: this.generateProposalId(),
      title: offer.title,
      clientId,
      offer,
      status: options?.generateInspection ? 'pending-inspection' : 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Generate inspection if requested
    let inspectionReport: IEEEInspectionReport | undefined;
    let inspectionButton: InspectionButton | undefined;

    if (options?.generateInspection && options?.inspector) {
      // Create inspection button
      inspectionButton = await this.inspectionButtonManager.createInspectionButton(
        offer,
        {
          inspector: options.inspector,
          includeCodeReview: true,
          includeDetailedAnalysis: true,
          autoApprove: false
        }
      );

      // Generate report
      inspectionReport = await this.inspectionSystem.generateInspectionReport(
        offer,
        options.inspector,
        {
          includeCodeReview: true,
          includeDetailedAnalysis: true
        }
      );

      proposal.inspectionReport = inspectionReport;
      proposal.inspectionButton = inspectionButton;
      proposal.status = 'inspected';

      // Update status based on approval
      if (inspectionReport.approvalStatus.status === 'approved') {
        proposal.status = 'approved';
      } else if (inspectionReport.approvalStatus.status === 'rejected') {
        proposal.status = 'rejected';
      }
    }

    // Add pitch if provided
    if (options?.includePitch && options?.pitch) {
      proposal.pitch = options.pitch;
    }

    this.proposals.set(proposal.id, proposal);

    // Build proposal package
    const package_: ProposalPackage = {
      proposal,
      inspectionReport,
      inspectionButton,
      metadata: {
        version: '1.0.0',
        includesInspection: !!inspectionReport,
        includesPitch: !!options?.pitch,
        includesDeployment: false,
        octave: 0
      }
    };

    return package_;
  }

  /**
   * Add inspection to existing proposal
   */
  async addInspectionToProposal(
    proposalId: string,
    inspector: any
  ): Promise<{
    proposal: Proposal;
    inspectionReport: IEEEInspectionReport;
    inspectionButton: InspectionButton;
  }> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal not found: ${proposalId}`);
    }

    // Create inspection button
    const inspectionButton = await this.inspectionButtonManager.createInspectionButton(
      proposal.offer,
      {
        inspector,
        includeCodeReview: true,
        includeDetailedAnalysis: true,
        autoApprove: false
      }
    );

    // Generate report
    const inspectionReport = await this.inspectionSystem.generateInspectionReport(
      proposal.offer,
      inspector,
      {
        includeCodeReview: true,
        includeDetailedAnalysis: true
      }
    );

    // Update proposal
    proposal.inspectionReport = inspectionReport;
    proposal.inspectionButton = inspectionButton;
    proposal.status = 'inspected';
    proposal.updatedAt = Date.now();

    // Update status based on approval
    if (inspectionReport.approvalStatus.status === 'approved') {
      proposal.status = 'approved';
    } else if (inspectionReport.approvalStatus.status === 'rejected') {
      proposal.status = 'rejected';
    }

    return {
      proposal,
      inspectionReport,
      inspectionButton
    };
  }

  /**
   * Generate proposal document
   */
  generateProposalDocument(package_: ProposalPackage): string {
    const lines: string[] = [];

    lines.push('='.repeat(80));
    lines.push('SALES PROPOSAL');
    lines.push('='.repeat(80));
    lines.push(`Title: ${package_.proposal.title}`);
    lines.push(`Client ID: ${package_.proposal.clientId}`);
    lines.push(`Status: ${package_.proposal.status.toUpperCase()}`);
    lines.push(`Created: ${new Date(package_.proposal.createdAt).toISOString()}`);
    lines.push('');

    lines.push('OFFER DETAILS');
    lines.push('-'.repeat(80));
    lines.push(package_.proposal.offer.description);
    lines.push('');

    if (package_.inspectionReport) {
      lines.push('IEEE INSPECTION REPORT');
      lines.push('-'.repeat(80));
      lines.push(`Report Number: ${package_.inspectionReport.reportNumber}`);
      lines.push(`Approval Status: ${package_.inspectionReport.approvalStatus.status.toUpperCase()}`);
      lines.push('');
      lines.push('Executive Summary:');
      lines.push(package_.inspectionReport.executiveSummary.overview);
      lines.push('');
      lines.push('Key Findings:');
      package_.inspectionReport.executiveSummary.keyFindings.forEach(f => {
        lines.push(`  - ${f}`);
      });
      lines.push('');
      lines.push('Critical Issues:');
      package_.inspectionReport.executiveSummary.criticalIssues.forEach(i => {
        lines.push(`  - ${i}`);
      });
      lines.push('');

      if (package_.inspectionButton) {
        lines.push('INSPECTION BUTTON');
        lines.push('-'.repeat(80));
        lines.push(package_.inspectionButton.buttonMarkdown);
        lines.push('');
      }
    }

    lines.push('TECHNICAL SPECIFICATIONS');
    lines.push('-'.repeat(80));
    lines.push(`Architecture: ${package_.proposal.offer.technicalSpecs.architecture}`);
    lines.push(`Technologies: ${package_.proposal.offer.technicalSpecs.technologies.join(', ')}`);
    lines.push('');

    lines.push('PRICING');
    lines.push('-'.repeat(80));
    lines.push(`Base Price: ${package_.proposal.offer.pricing.currency} ${package_.proposal.offer.pricing.basePrice}`);
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Get proposal
   */
  getProposal(proposalId: string): Proposal | undefined {
    return this.proposals.get(proposalId);
  }

  /**
   * List all proposals
   */
  listProposals(): Proposal[] {
    return Array.from(this.proposals.values());
  }

  /**
   * Generate proposal ID
   */
  private generateProposalId(): string {
    return `PROPOSAL-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
}


