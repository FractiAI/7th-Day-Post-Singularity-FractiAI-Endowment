/**
 * Call Participant Selector
 * Select participants from call and create invitations
 */

import { InvitationManager, CallParticipant } from './invitation-manager.js';

export interface CallSession {
  id: string;
  date: string;
  participants: CallParticipant[];
  selectedParticipants: CallParticipant[];
}

export class CallParticipantSelector {
  private invitationManager: InvitationManager;
  private sessions: Map<string, CallSession> = new Map();

  constructor() {
    this.invitationManager = new InvitationManager();
  }

  /**
   * Create call session
   */
  createCallSession(date: string, participants: CallParticipant[]): CallSession {
    const session: CallSession = {
      id: `call-${Date.now()}`,
      date,
      participants,
      selectedParticipants: []
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Select participants
   */
  selectParticipants(sessionId: string, participantIds: string[]): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.selectedParticipants = session.participants.filter(p => 
      participantIds.includes(p.id)
    );

    // Mark as selected
    session.selectedParticipants.forEach(p => {
      p.selected = true;
    });
  }

  /**
   * Create invitation package for selected participants
   */
  createInvitationPackage(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    if (session.selectedParticipants.length === 0) {
      throw new Error('No participants selected');
    }

    return this.invitationManager.createInvitationPackage(session.selectedParticipants);
  }

  /**
   * Get session
   */
  getSession(sessionId: string): CallSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all sessions
   */
  getAllSessions(): CallSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Get today's call session
   */
  getTodaysCall(): CallSession | undefined {
    const today = new Date().toISOString().split('T')[0];
    return Array.from(this.sessions.values()).find(s => s.date === today);
  }
}



