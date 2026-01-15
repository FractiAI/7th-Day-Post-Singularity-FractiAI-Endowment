/**
 * Passport System
 * Digital passport for cross-timeline and multi-node continuity
 */

import crypto from 'crypto';

export interface Passport {
  id: string;
  passportNumber: string;
  walletAddress: string;
  tradingCardId: string;
  identity: Identity;
  credentials: Credential[];
  visas: Visa[];
  stamps: Stamp[];
  metadata: Record<string, any>;
  createdAt: number;
  lastUpdated: number;
}

export interface Identity {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location?: string;
  timezone: string;
}

export interface Credential {
  type: 'github' | 'discord' | 'twitter' | 'email' | 'wallet' | 'custom';
  provider: string;
  identifier: string;
  verified: boolean;
  verifiedAt?: number;
}

export interface Visa {
  id: string;
  protocol: string;
  domain: string;
  permissions: string[];
  issuedAt: number;
  expiresAt?: number;
  active: boolean;
}

export interface Stamp {
  id: string;
  type: 'entry' | 'exit' | 'discovery' | 'synthesis' | 'achievement';
  location: string;
  timestamp: number;
  metadata: Record<string, any>;
}

export class PassportManager {
  private passports: Map<string, Passport>;
  private encryptionKey: string;

  constructor(encryptionKey: string) {
    this.passports = new Map();
    this.encryptionKey = encryptionKey;
  }

  /**
   * Create a new passport
   */
  createPassport(
    identity: Identity,
    walletAddress: string,
    tradingCardId: string
  ): Passport {
    const id = this.generatePassportId();
    const passportNumber = this.generatePassportNumber();

    const passport: Passport = {
      id,
      passportNumber,
      walletAddress,
      tradingCardId,
      identity,
      credentials: [],
      visas: [],
      stamps: [],
      metadata: {},
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    this.passports.set(id, passport);
    return passport;
  }

  /**
   * Generate unique passport ID
   */
  private generatePassportId(): string {
    return `PASSPORT-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  }

  /**
   * Generate passport number
   */
  private generatePassportNumber(): string {
    const number = this.passports.size + 1;
    const hash = crypto.createHash('sha256')
      .update(number.toString())
      .digest('hex');
    return `NSPFRP-${hash.substring(0, 8).toUpperCase()}`;
  }

  /**
   * Get passport by ID
   */
  getPassport(passportId: string): Passport | undefined {
    return this.passports.get(passportId);
  }

  /**
   * Get passport by wallet address
   */
  getPassportByWallet(walletAddress: string): Passport | undefined {
    return Array.from(this.passports.values())
      .find(p => p.walletAddress === walletAddress);
  }

  /**
   * Add credential to passport
   */
  addCredential(passportId: string, credential: Credential): void {
    const passport = this.passports.get(passportId);
    if (!passport) {
      throw new Error(`Passport not found: ${passportId}`);
    }

    // Check if credential already exists
    const existing = passport.credentials.find(
      c => c.type === credential.type && c.provider === credential.provider
    );

    if (existing) {
      // Update existing
      Object.assign(existing, credential);
    } else {
      // Add new
      passport.credentials.push(credential);
    }

    passport.lastUpdated = Date.now();
  }

  /**
   * Verify credential
   */
  verifyCredential(passportId: string, credentialType: string, provider: string): void {
    const passport = this.passports.get(passportId);
    if (!passport) {
      throw new Error(`Passport not found: ${passportId}`);
    }

    const credential = passport.credentials.find(
      c => c.type === credentialType && c.provider === provider
    );

    if (!credential) {
      throw new Error(`Credential not found: ${credentialType}@${provider}`);
    }

    credential.verified = true;
    credential.verifiedAt = Date.now();
    passport.lastUpdated = Date.now();
  }

  /**
   * Issue visa for protocol/domain access
   */
  issueVisa(
    passportId: string,
    protocol: string,
    domain: string,
    permissions: string[],
    expiresAt?: number
  ): Visa {
    const passport = this.passports.get(passportId);
    if (!passport) {
      throw new Error(`Passport not found: ${passportId}`);
    }

    const visa: Visa = {
      id: `VISA-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      protocol,
      domain,
      permissions,
      issuedAt: Date.now(),
      expiresAt,
      active: true
    };

    passport.visas.push(visa);
    passport.lastUpdated = Date.now();

    return visa;
  }

  /**
   * Revoke visa
   */
  revokeVisa(passportId: string, visaId: string): void {
    const passport = this.passports.get(passportId);
    if (!passport) {
      throw new Error(`Passport not found: ${passportId}`);
    }

    const visa = passport.visas.find(v => v.id === visaId);
    if (!visa) {
      throw new Error(`Visa not found: ${visaId}`);
    }

    visa.active = false;
    passport.lastUpdated = Date.now();
  }

  /**
   * Check if passport has valid visa
   */
  hasValidVisa(passportId: string, protocol: string, domain: string): boolean {
    const passport = this.passports.get(passportId);
    if (!passport) {
      return false;
    }

    return passport.visas.some(v => 
      v.protocol === protocol &&
      v.domain === domain &&
      v.active &&
      (!v.expiresAt || v.expiresAt > Date.now())
    );
  }

  /**
   * Add stamp to passport
   */
  addStamp(
    passportId: string,
    type: Stamp['type'],
    location: string,
    metadata?: Record<string, any>
  ): Stamp {
    const passport = this.passports.get(passportId);
    if (!passport) {
      throw new Error(`Passport not found: ${passportId}`);
    }

    const stamp: Stamp = {
      id: `STAMP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      type,
      location,
      timestamp: Date.now(),
      metadata: metadata || {}
    };

    passport.stamps.push(stamp);
    passport.lastUpdated = Date.now();

    return stamp;
  }

  /**
   * Get passport history
   */
  getPassportHistory(passportId: string): {
    stamps: Stamp[];
    visas: Visa[];
    credentials: Credential[];
  } {
    const passport = this.passports.get(passportId);
    if (!passport) {
      throw new Error(`Passport not found: ${passportId}`);
    }

    return {
      stamps: [...passport.stamps].sort((a, b) => b.timestamp - a.timestamp),
      visas: [...passport.visas].sort((a, b) => b.issuedAt - a.issuedAt),
      credentials: [...passport.credentials]
    };
  }

  /**
   * Export passport (encrypted)
   */
  exportPassport(passportId: string): string {
    const passport = this.passports.get(passportId);
    if (!passport) {
      throw new Error(`Passport not found: ${passportId}`);
    }

    const data = JSON.stringify(passport);
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      crypto.scryptSync(this.encryptionKey, 'passport-salt', 32),
      crypto.randomBytes(16)
    );

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return `${encrypted}:${authTag.toString('hex')}`;
  }

  /**
   * Import passport (decrypt)
   */
  importPassport(encryptedData: string): Passport {
    const [encrypted, authTagHex] = encryptedData.split(':');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      crypto.scryptSync(this.encryptionKey, 'passport-salt', 32),
      crypto.randomBytes(16)
    );

    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const passport = JSON.parse(decrypted) as Passport;
    this.passports.set(passport.id, passport);

    return passport;
  }
}


