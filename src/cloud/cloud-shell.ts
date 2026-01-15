/**
 * Cloud Shell Connection
 * High-octave secure connection to internet cloud shell
 */

import crypto from 'crypto';
import fetch from 'node-fetch';

export interface CloudShellConfig {
  endpoint: string;
  apiKey: string;
  secret: string;
  encryptionKey: string;
  timeout?: number;
}

export interface CloudShellSession {
  id: string;
  endpoint: string;
  encrypted: boolean;
  createdAt: number;
  lastActivity: number;
}

export interface CloudShellCommand {
  command: string;
  args: string[];
  env?: Record<string, string>;
  timeout?: number;
}

export interface CloudShellResponse {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
  duration: number;
}

export class CloudShellManager {
  private config: CloudShellConfig;
  private sessions: Map<string, CloudShellSession>;
  private encryptionKey: Buffer;

  constructor(config: CloudShellConfig) {
    this.config = config;
    this.sessions = new Map();
    this.encryptionKey = crypto.scryptSync(config.encryptionKey, 'cloud-shell-salt', 32);
  }

  /**
   * Create a new cloud shell session
   */
  async createSession(): Promise<CloudShellSession> {
    const sessionId = this.generateSessionId();
    
    const session: CloudShellSession = {
      id: sessionId,
      endpoint: this.config.endpoint,
      encrypted: true,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };

    // Initialize session on cloud shell
    try {
      const response = await fetch(`${this.config.endpoint}/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          encrypted: true
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create cloud shell session: ${response.statusText}`);
      }

      this.sessions.set(sessionId, session);
      return session;
    } catch (error) {
      throw new Error(`Cloud shell connection failed: ${error}`);
    }
  }

  /**
   * Execute command in cloud shell
   */
  async executeCommand(
    sessionId: string,
    command: CloudShellCommand
  ): Promise<CloudShellResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const startTime = Date.now();

    try {
      // Encrypt command if needed
      const encryptedCommand = this.encryptCommand(command);

      const response = await fetch(`${this.config.endpoint}/sessions/${sessionId}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'X-Encrypted': 'true'
        },
        body: JSON.stringify({
          command: encryptedCommand,
          timeout: command.timeout || this.config.timeout || 30000
        })
      });

      if (!response.ok) {
        throw new Error(`Command execution failed: ${response.statusText}`);
      }

      const result = await response.json() as any;
      
      // Decrypt response if needed
      const decryptedOutput = this.decryptResponse(result.output);

      session.lastActivity = Date.now();

      return {
        success: result.exitCode === 0,
        output: decryptedOutput,
        error: result.error ? this.decryptResponse(result.error) : undefined,
        exitCode: result.exitCode,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        exitCode: 1,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Encrypt command
   */
  private encryptCommand(command: CloudShellCommand): string {
    const data = JSON.stringify(command);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  }

  /**
   * Decrypt response
   */
  private decryptResponse(encrypted: string): string {
    const [ivHex, encryptedData, authTagHex] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Close session
   */
  async closeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    try {
      await fetch(`${this.config.endpoint}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });
    } catch (error) {
      console.error(`Failed to close session: ${error}`);
    }

    this.sessions.delete(sessionId);
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `SESSION-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  }

  /**
   * Get active sessions
   */
  getActiveSessions(): CloudShellSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Cleanup inactive sessions
   */
  cleanupInactiveSessions(maxAge: number = 3600000): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > maxAge) {
        this.closeSession(sessionId);
      }
    }
  }
}


