/**
 * Wallet System
 * Cryptographic wallet for NSPFRP identity and transactions
 */

import crypto from 'crypto';

export interface Wallet {
  address: string;
  publicKey: string;
  encryptedPrivateKey: string;
  balance: number;
  transactions: Transaction[];
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: 'seed' | 'protocol' | 'pob' | 'discovery' | 'synthesis';
  from: string;
  to: string;
  amount: number;
  metadata: Record<string, any>;
  timestamp: number;
  signature: string;
}

export class WalletManager {
  private wallets: Map<string, Wallet>;
  private encryptionKey: string;

  constructor(encryptionKey: string) {
    this.wallets = new Map();
    this.encryptionKey = encryptionKey;
  }

  /**
   * Create a new wallet
   */
  createWallet(): Wallet {
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    const address = this.generateAddress(keyPair.publicKey);
    const encryptedPrivateKey = this.encryptPrivateKey(keyPair.privateKey);

    const wallet: Wallet = {
      address,
      publicKey: keyPair.publicKey,
      encryptedPrivateKey,
      balance: 0,
      transactions: [],
      createdAt: Date.now()
    };

    this.wallets.set(address, wallet);
    return wallet;
  }

  /**
   * Generate wallet address from public key
   */
  private generateAddress(publicKey: string): string {
    const hash = crypto.createHash('sha256').update(publicKey).digest('hex');
    return `NSPFRP-${hash.substring(0, 16).toUpperCase()}`;
  }

  /**
   * Encrypt private key
   */
  private encryptPrivateKey(privateKey: string): string {
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      crypto.scryptSync(this.encryptionKey, 'salt', 32),
      crypto.randomBytes(16)
    );

    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return `${encrypted}:${authTag.toString('hex')}`;
  }

  /**
   * Decrypt private key
   */
  decryptPrivateKey(encryptedPrivateKey: string): string {
    const [encrypted, authTagHex] = encryptedPrivateKey.split(':');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      crypto.scryptSync(this.encryptionKey, 'salt', 32),
      crypto.randomBytes(16)
    );

    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Get wallet by address
   */
  getWallet(address: string): Wallet | undefined {
    return this.wallets.get(address);
  }

  /**
   * Sign transaction
   */
  signTransaction(transaction: Omit<Transaction, 'signature'>, walletAddress: string): string {
    const wallet = this.getWallet(walletAddress);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletAddress}`);
    }

    const privateKey = this.decryptPrivateKey(wallet.encryptedPrivateKey);
    const sign = crypto.createSign('RSA-SHA256');
    
    const transactionData = JSON.stringify({
      id: transaction.id,
      type: transaction.type,
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
      metadata: transaction.metadata,
      timestamp: transaction.timestamp
    });

    sign.update(transactionData);
    return sign.sign(privateKey, 'hex');
  }

  /**
   * Verify transaction signature
   */
  verifyTransaction(transaction: Transaction): boolean {
    const wallet = this.getWallet(transaction.from);
    if (!wallet) {
      return false;
    }

    const verify = crypto.createVerify('RSA-SHA256');
    const transactionData = JSON.stringify({
      id: transaction.id,
      type: transaction.type,
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
      metadata: transaction.metadata,
      timestamp: transaction.timestamp
    });

    verify.update(transactionData);
    return verify.verify(wallet.publicKey, transaction.signature, 'hex');
  }

  /**
   * Add transaction to wallet
   */
  addTransaction(walletAddress: string, transaction: Transaction): void {
    const wallet = this.getWallet(walletAddress);
    if (!wallet) {
      throw new Error(`Wallet not found: ${walletAddress}`);
    }

    if (!this.verifyTransaction(transaction)) {
      throw new Error('Invalid transaction signature');
    }

    wallet.transactions.push(transaction);
    
    if (transaction.from === walletAddress) {
      wallet.balance -= transaction.amount;
    } else if (transaction.to === walletAddress) {
      wallet.balance += transaction.amount;
    }
  }
}


