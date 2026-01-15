/**
 * Invitation Manager
 * Manages invitations for call participants with button sharing
 */

import { FullDisclosureInvitationProtocol, InvitationRecipient } from '../protocols/full-disclosure-invitation.js';

export interface CallParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  selected: boolean;
}

export interface InvitationPackage {
  invitation: any;
  emails: Array<{ to: string; subject: string; html: string }>;
  messages: Array<{ to: string; message: string }>;
  buttons: {
    html: string;
    markdown: string;
  };
}

export class InvitationManager {
  private invitationProtocol: FullDisclosureInvitationProtocol;
  private invitations: Map<string, any> = new Map();

  constructor() {
    this.invitationProtocol = new FullDisclosureInvitationProtocol();
  }

  /**
   * Create invitation package for call participants
   */
  createInvitationPackage(participants: CallParticipant[]): InvitationPackage {
    // Convert to invitation recipients
    const recipients: InvitationRecipient[] = participants
      .filter(p => p.selected)
      .map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        method: p.email ? 'email' : 'message',
        selected: true
      }));

    // Create invitation
    const invitation = this.invitationProtocol.createInvitation(recipients);

    // Generate emails
    const emails = recipients
      .filter(r => r.email && r.method === 'email')
      .map(r => this.invitationProtocol.generateEmailInvitation(r, invitation));

    // Generate messages
    const messages = recipients
      .filter(r => (r.phone || r.email) && r.method === 'message')
      .map(r => this.invitationProtocol.generateMessageInvitation(r, invitation));

    // Store invitation
    this.invitations.set(invitation.invitationId, invitation);

    return {
      invitation,
      emails,
      messages,
      buttons: {
        html: invitation.button.html,
        markdown: invitation.button.markdown
      }
    };
  }

  /**
   * Get invitation by ID
   */
  getInvitation(invitationId: string): any {
    return this.invitations.get(invitationId);
  }

  /**
   * Get all invitations
   */
  getAllInvitations(): any[] {
    return Array.from(this.invitations.values());
  }

  /**
   * Export invitation for sharing
   */
  exportInvitationForSharing(invitationId: string): {
    html: string;
    markdown: string;
    emailHtml: string;
    messageText: string;
    fullDisclosure: string;
  } {
    const invitation = this.invitations.get(invitationId);
    if (!invitation) {
      throw new Error(`Invitation not found: ${invitationId}`);
    }

    return {
      html: invitation.button.html,
      markdown: invitation.button.markdown,
      emailHtml: invitation.button.emailHtml,
      messageText: invitation.button.messageText,
      fullDisclosure: invitation.fullDisclosure.content
    };
  }
}




