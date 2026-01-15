/**
 * High-Octave Environment Configuration
 * Secure, encrypted environment variable management
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

export interface HighOctaveEnvConfig {
  encryptionKey: string;
  envFile: string;
  encryptedEnvFile: string;
  ignoreFile: string;
}

export class HighOctaveEnvManager {
  private config: HighOctaveEnvConfig;
  private encryptionKey: Buffer;
  private env: Map<string, string>;

  constructor(config: HighOctaveEnvConfig) {
    this.config = config;
    this.encryptionKey = crypto.scryptSync(config.encryptionKey, 'env-salt', 32);
    this.env = new Map();
  }

  /**
   * Load and decrypt environment variables
   */
  async load(): Promise<void> {
    try {
      // Try to load encrypted env file first
      if (await this.fileExists(this.config.encryptedEnvFile)) {
        await this.loadEncrypted();
      } else if (await this.fileExists(this.config.envFile)) {
        // Fallback to plain .env
        const result = dotenv.config({ path: this.config.envFile });
        if (result.parsed) {
          Object.entries(result.parsed).forEach(([key, value]) => {
            this.env.set(key, value);
          });
        }
      }
    } catch (error) {
      console.error('Failed to load environment:', error);
      throw error;
    }
  }

  /**
   * Load encrypted environment file
   */
  private async loadEncrypted(): Promise<void> {
    const encryptedData = await fs.readFile(this.config.encryptedEnvFile, 'utf-8');
    const decrypted = this.decrypt(encryptedData);
    const envVars = JSON.parse(decrypted);

    Object.entries(envVars).forEach(([key, value]) => {
      this.env.set(key, value as string);
      process.env[key] = value as string;
    });
  }

  /**
   * Save environment variables (encrypted)
   */
  async save(envVars: Record<string, string>): Promise<void> {
    // Update internal map
    Object.entries(envVars).forEach(([key, value]) => {
      this.env.set(key, value);
    });

    // Encrypt and save
    const encrypted = this.encrypt(JSON.stringify(envVars));
    await fs.writeFile(this.config.encryptedEnvFile, encrypted, 'utf-8');

    // Also update process.env
    Object.entries(envVars).forEach(([key, value]) => {
      process.env[key] = value;
    });
  }

  /**
   * Get environment variable
   */
  get(key: string): string | undefined {
    return this.env.get(key) || process.env[key];
  }

  /**
   * Set environment variable
   */
  async set(key: string, value: string, save: boolean = false): Promise<void> {
    this.env.set(key, value);
    process.env[key] = value;

    if (save) {
      const current = Object.fromEntries(this.env.entries());
      await this.save(current);
    }
  }

  /**
   * Encrypt data
   */
  private encrypt(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  }

  /**
   * Decrypt data
   */
  private decrypt(encrypted: string): string {
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
   * Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Initialize from .env.example and create encrypted version
   */
  async initializeFromExample(): Promise<void> {
    const examplePath = path.join(process.cwd(), '.env.example');
    
    if (!(await this.fileExists(examplePath))) {
      throw new Error('.env.example not found');
    }

    const exampleContent = await fs.readFile(examplePath, 'utf-8');
    const envVars: Record<string, string> = {};

    // Parse .env.example format
    exampleContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          envVars[key.trim()] = value.trim();
        }
      }
    });

    // Save encrypted
    await this.save(envVars);
  }

  /**
   * Get all environment variables (for seed inclusion)
   */
  getAll(): Record<string, string> {
    return Object.fromEntries(this.env.entries());
  }

  /**
   * Get public environment variables (safe to include in seeds)
   */
  getPublic(): Record<string, string> {
    const publicKeys = [
      'NODE_ENV',
      'PORT',
      'AUTO_SYNC_ENABLED',
      'AUTO_SYNC_INTERVAL',
      'MIN_DISCOVERY_CONFIDENCE',
      'CARE_NETWORK_REPOS'
    ];

    const public: Record<string, string> = {};
    publicKeys.forEach(key => {
      const value = this.get(key);
      if (value) {
        public[key] = value;
      }
    });

    return public;
  }
}


