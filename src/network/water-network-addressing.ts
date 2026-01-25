/**
 * 💧 WATER Network Addressing & Naming Registration System
 * 
 * WATER is the branding of our new VIBEVERSE network - not water.
 * This system provides www-like addressing for the VIBEVERSE network.
 * 
 * Similar to World Wide Web (www), but for the VIBEVERSE network powered by WATER.
 */

export interface WaterNetworkAddress {
  /** Full WATER network address (e.g., "example.water" or "www.example.water") */
  address: string;
  
  /** Subdomain (e.g., "www", "api", "app") */
  subdomain?: string;
  
  /** Domain name (e.g., "example") */
  domain: string;
  
  /** Top-level domain - always "water" */
  tld: 'water';
  
  /** Port (optional, defaults to standard WATER port) */
  port?: number;
  
  /** Path (optional, for resource addressing) */
  path?: string;
  
  /** Query parameters (optional) */
  query?: Record<string, string>;
  
  /** Fragment identifier (optional) */
  fragment?: string;
  
  /** Full URL format */
  url?: string;
}

export interface WaterDomainRegistration {
  /** Unique registration ID */
  registrationId: string;
  
  /** Domain name being registered */
  domain: string;
  
  /** Registrant information */
  registrant: {
    /** User/entity ID */
    id: string;
    /** Name */
    name: string;
    /** Email */
    email: string;
    /** WATER network wallet address */
    walletAddress?: string;
  };
  
  /** Registration status */
  status: 'pending' | 'active' | 'suspended' | 'expired' | 'transferred';
  
  /** Registration dates */
  registeredAt: number;
  expiresAt: number;
  
  /** Registration duration (years) */
  duration: number;
  
  /** Registration fee paid */
  fee: WaterRegistrationFee;
  
  /** Payment status */
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  
  /** DNS records */
  dnsRecords: WaterDNSRecord[];
  
  /** NSPFRNP address mapping (optional) */
  nspfrnpAddress?: string;
  
  /** Metadata */
  metadata: {
    /** Registration source */
    source?: string;
    /** Notes */
    notes?: string;
    /** Tags */
    tags?: string[];
    /** Custom data */
    custom?: Record<string, any>;
  };
}

export interface WaterDNSRecord {
  /** Record type */
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV' | 'WATER';
  
  /** Record name */
  name: string;
  
  /** Record value */
  value: string;
  
  /** TTL (Time To Live) in seconds */
  ttl: number;
  
  /** Priority (for MX, SRV records) */
  priority?: number;
  
  /** Created timestamp */
  createdAt: number;
  
  /** Updated timestamp */
  updatedAt: number;
}

export interface WaterRegistrationFee {
  /** Base registration fee (in WATER tokens or USD) */
  baseFee: number;
  
  /** Currency type */
  currency: 'WATER' | 'USD' | 'SYNTH' | 'ETH' | 'BTC';
  
  /** Premium domain fee (if applicable) */
  premiumFee?: number;
  
  /** Renewal fee */
  renewalFee: number;
  
  /** Transfer fee */
  transferFee: number;
  
  /** Total fee paid */
  totalFee: number;
  
  /** Fee tier */
  tier: 'standard' | 'premium' | 'enterprise' | 'founder';
  
  /** Payment method */
  paymentMethod: 'WATER' | 'stripe' | 'crypto' | 'credit';
  
  /** Transaction hash (if crypto) */
  transactionHash?: string;
}

export interface WaterNetworkConfig {
  /** Default WATER network port */
  defaultPort: number;
  
  /** Supported protocols */
  protocols: ('water' | 'water-secure' | 'water-ws' | 'water-wss')[];
  
  /** Registration fee structure */
  feeStructure: {
    /** Standard domain fee (per year) */
    standard: number;
    /** Premium domain fee (per year) */
    premium: number;
    /** Enterprise domain fee (per year) */
    enterprise: number;
    /** Founder domain fee (one-time) */
    founder: number;
    /** Renewal discount percentage */
    renewalDiscount: number;
    /** Early registration discount */
    earlyBirdDiscount?: number;
  };
  
  /** Domain name rules */
  domainRules: {
    /** Minimum length */
    minLength: number;
    /** Maximum length */
    maxLength: number;
    /** Allowed characters (regex) */
    allowedChars: string;
    /** Reserved domains */
    reserved: string[];
    /** Premium domains */
    premium: string[];
  };
  
  /** Registration duration options (years) */
  durationOptions: number[];
}

/**
 * WATER Network Addressing System
 * 
 * Provides www-like addressing for the VIBEVERSE network.
 * Format: [subdomain.]domain.water[:port][/path][?query][#fragment]
 * 
 * Examples:
 * - example.water
 * - www.example.water
 * - api.example.water:8080
 * - app.example.water/vibeverse/dashboard?octave=5
 */
export class WaterNetworkAddressing {
  private config: WaterNetworkConfig;

  constructor(config?: Partial<WaterNetworkConfig>) {
    this.config = {
      defaultPort: 443,
      protocols: ['water', 'water-secure', 'water-ws', 'water-wss'],
      feeStructure: {
        standard: 10, // $10 or 10 WATER per year
        premium: 100, // $100 or 100 WATER per year
        enterprise: 1000, // $1000 or 1000 WATER per year
        founder: 10000, // $10,000 or 10,000 WATER one-time
        renewalDiscount: 0.1, // 10% discount on renewal
        earlyBirdDiscount: 0.2, // 20% discount for early registrations
      },
      domainRules: {
        minLength: 3,
        maxLength: 63,
        allowedChars: '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$',
        reserved: [
          'www', 'api', 'app', 'admin', 'mail', 'ftp', 'localhost',
          'test', 'dev', 'staging', 'prod', 'root', 'ns', 'dns',
          'registry', 'registrar', 'water', 'vibeverse', 'nspfrnp'
        ],
        premium: [
          'ai', 'tech', 'cloud', 'data', 'net', 'web', 'app', 'dev',
          'io', 'co', 'pro', 'biz', 'store', 'shop', 'blog', 'news'
        ],
      },
      durationOptions: [1, 2, 3, 5, 10],
      ...config,
    };
  }

  /**
   * Parse a WATER network address
   */
  parseAddress(address: string): WaterNetworkAddress {
    // Remove protocol if present
    address = address.replace(/^(water|water-secure|water-ws|water-wss):\/\//, '');
    
    // Parse URL components
    const urlPattern = /^(?:([^:]+):)?(?:\/\/(?:([^@]+)@)?([^\/:]+)(?::(\d+))?)?([^?#]*)(?:\?([^#]*))?(?:#(.+))?$/;
    const match = address.match(urlPattern);
    
    if (!match) {
      throw new Error(`Invalid WATER network address: ${address}`);
    }
    
    const [, , , host, portStr, path, queryStr, fragment] = match;
    
    // Parse host (subdomain.domain.water)
    const hostParts = host.split('.');
    const tld = hostParts[hostParts.length - 1];
    
    if (tld !== 'water') {
      throw new Error(`Invalid TLD. WATER network addresses must end with .water`);
    }
    
    const domain = hostParts[hostParts.length - 2];
    const subdomain = hostParts.length > 2 ? hostParts.slice(0, -2).join('.') : undefined;
    
    // Parse query parameters
    const query: Record<string, string> = {};
    if (queryStr) {
      queryStr.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key) query[decodeURIComponent(key)] = decodeURIComponent(value || '');
      });
    }
    
    const port = portStr ? parseInt(portStr, 10) : this.config.defaultPort;
    
    // Build URL
    const url = this.buildURL({
      subdomain,
      domain,
      tld: 'water',
      port,
      path,
      query,
      fragment,
    });
    
    return {
      address: host,
      subdomain,
      domain,
      tld: 'water',
      port,
      path,
      query: Object.keys(query).length > 0 ? query : undefined,
      fragment,
      url,
    };
  }

  /**
   * Build a WATER network address from components
   */
  buildAddress(components: Partial<WaterNetworkAddress>): string {
    const parts: string[] = [];
    
    if (components.subdomain) {
      parts.push(components.subdomain);
    }
    
    if (components.domain) {
      parts.push(components.domain);
    }
    
    parts.push('water');
    
    let address = parts.join('.');
    
    if (components.port && components.port !== this.config.defaultPort) {
      address += `:${components.port}`;
    }
    
    if (components.path) {
      address += components.path.startsWith('/') ? components.path : `/${components.path}`;
    }
    
    if (components.query) {
      const queryStr = Object.entries(components.query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      address += `?${queryStr}`;
    }
    
    if (components.fragment) {
      address += `#${encodeURIComponent(components.fragment)}`;
    }
    
    return address;
  }

  /**
   * Build full URL from address components
   */
  private buildURL(components: Partial<WaterNetworkAddress>): string {
    const protocol = 'water-secure';
    const hostParts: string[] = [];
    
    if (components.subdomain) {
      hostParts.push(components.subdomain);
    }
    
    if (components.domain) {
      hostParts.push(components.domain);
    }
    
    hostParts.push('water');
    
    const host = hostParts.join('.');
    const port = components.port && components.port !== this.config.defaultPort
      ? `:${components.port}`
      : '';
    
    let url = `${protocol}://${host}${port}`;
    
    if (components.path) {
      url += components.path.startsWith('/') ? components.path : `/${components.path}`;
    }
    
    if (components.query) {
      const queryStr = Object.entries(components.query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      url += `?${queryStr}`;
    }
    
    if (components.fragment) {
      url += `#${encodeURIComponent(components.fragment)}`;
    }
    
    return url;
  }

  /**
   * Validate domain name
   */
  validateDomain(domain: string): { valid: boolean; error?: string } {
    // Check length
    if (domain.length < this.config.domainRules.minLength) {
      return {
        valid: false,
        error: `Domain must be at least ${this.config.domainRules.minLength} characters`,
      };
    }
    
    if (domain.length > this.config.domainRules.maxLength) {
      return {
        valid: false,
        error: `Domain must be at most ${this.config.domainRules.maxLength} characters`,
      };
    }
    
    // Check allowed characters
    const regex = new RegExp(this.config.domainRules.allowedChars);
    if (!regex.test(domain)) {
      return {
        valid: false,
        error: 'Domain contains invalid characters. Only lowercase letters, numbers, and hyphens are allowed.',
      };
    }
    
    // Check reserved domains
    if (this.config.domainRules.reserved.includes(domain.toLowerCase())) {
      return {
        valid: false,
        error: `Domain "${domain}" is reserved and cannot be registered`,
      };
    }
    
    return { valid: true };
  }

  /**
   * Check if domain is premium
   */
  isPremiumDomain(domain: string): boolean {
    return this.config.domainRules.premium.includes(domain.toLowerCase());
  }

  /**
   * Calculate registration fee
   */
  calculateFee(
    domain: string,
    duration: number,
    tier: 'standard' | 'premium' | 'enterprise' | 'founder' = 'standard',
    isRenewal: boolean = false,
    isEarlyBird: boolean = false
  ): WaterRegistrationFee {
    const isPremium = this.isPremiumDomain(domain);
    const baseTier = isPremium ? 'premium' : tier;
    
    let baseFee = this.config.feeStructure[baseTier];
    
    // Apply duration multiplier
    const totalBaseFee = baseFee * duration;
    
    // Apply discounts
    let discount = 0;
    if (isRenewal) {
      discount += this.config.feeStructure.renewalDiscount;
    }
    if (isEarlyBird && this.config.feeStructure.earlyBirdDiscount) {
      discount += this.config.feeStructure.earlyBirdDiscount;
    }
    
    const totalFee = totalBaseFee * (1 - discount);
    
    return {
      baseFee,
      currency: 'WATER',
      premiumFee: isPremium ? this.config.feeStructure.premium : undefined,
      renewalFee: baseFee * (1 - this.config.feeStructure.renewalDiscount),
      transferFee: baseFee * 0.5, // 50% of base fee for transfers
      totalFee: Math.round(totalFee * 100) / 100, // Round to 2 decimals
      tier: baseTier,
      paymentMethod: 'WATER',
    };
  }
}

/**
 * WATER Domain Registration System
 * 
 * Manages domain registrations on the WATER network.
 */
export class WaterDomainRegistry {
  private addressing: WaterNetworkAddressing;
  private registrations: Map<string, WaterDomainRegistration>;

  constructor(addressing?: WaterNetworkAddressing) {
    this.addressing = addressing || new WaterNetworkAddressing();
    this.registrations = new Map();
  }

  /**
   * Register a new domain
   */
  async registerDomain(
    domain: string,
    registrant: WaterDomainRegistration['registrant'],
    duration: number = 1,
    tier: 'standard' | 'premium' | 'enterprise' | 'founder' = 'standard',
    paymentInfo: {
      method: WaterRegistrationFee['paymentMethod'];
      transactionHash?: string;
      amount: number;
    }
  ): Promise<WaterDomainRegistration> {
    // Validate domain
    const validation = this.addressing.validateDomain(domain);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // Check if domain is already registered
    if (this.registrations.has(domain)) {
      const existing = this.registrations.get(domain)!;
      if (existing.status === 'active' && existing.expiresAt > Date.now()) {
        throw new Error(`Domain "${domain}" is already registered`);
      }
    }
    
    // Calculate fee
    const fee = this.addressing.calculateFee(domain, duration, tier, false, false);
    
    // Verify payment
    if (paymentInfo.amount < fee.totalFee) {
      throw new Error(`Insufficient payment. Required: ${fee.totalFee}, Provided: ${paymentInfo.amount}`);
    }
    
    // Create registration
    const registration: WaterDomainRegistration = {
      registrationId: `WATER-REG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      domain,
      registrant,
      status: 'active',
      registeredAt: Date.now(),
      expiresAt: Date.now() + (duration * 365 * 24 * 60 * 60 * 1000),
      duration,
      fee: {
        ...fee,
        paymentMethod: paymentInfo.method,
        transactionHash: paymentInfo.transactionHash,
      },
      paymentStatus: 'paid',
      dnsRecords: [
        {
          type: 'A',
          name: '@',
          value: '0.0.0.0', // Default - should be updated by registrant
          ttl: 3600,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      metadata: {},
    };
    
    // Store registration
    this.registrations.set(domain, registration);
    
    return registration;
  }

  /**
   * Renew domain registration
   */
  async renewDomain(
    domain: string,
    duration: number = 1,
    paymentInfo: {
      method: WaterRegistrationFee['paymentMethod'];
      transactionHash?: string;
      amount: number;
    }
  ): Promise<WaterDomainRegistration> {
    const existing = this.registrations.get(domain);
    if (!existing) {
      throw new Error(`Domain "${domain}" is not registered`);
    }
    
    // Calculate renewal fee
    const fee = this.addressing.calculateFee(domain, duration, existing.fee.tier, true, false);
    
    // Verify payment
    if (paymentInfo.amount < fee.totalFee) {
      throw new Error(`Insufficient payment. Required: ${fee.totalFee}, Provided: ${paymentInfo.amount}`);
    }
    
    // Update registration
    existing.expiresAt = existing.expiresAt + (duration * 365 * 24 * 60 * 60 * 1000);
    existing.duration += duration;
    existing.fee = {
      ...fee,
      paymentMethod: paymentInfo.method,
      transactionHash: paymentInfo.transactionHash,
    };
    existing.paymentStatus = 'paid';
    existing.status = 'active';
    
    return existing;
  }

  /**
   * Get domain registration
   */
  getRegistration(domain: string): WaterDomainRegistration | undefined {
    return this.registrations.get(domain);
  }

  /**
   * Check domain availability
   */
  isAvailable(domain: string): boolean {
    const validation = this.addressing.validateDomain(domain);
    if (!validation.valid) {
      return false;
    }
    
    const existing = this.registrations.get(domain);
    if (!existing) {
      return true;
    }
    
    // Domain is available if expired
    return existing.status === 'expired' || existing.expiresAt < Date.now();
  }

  /**
   * Update DNS records
   */
  updateDNSRecords(domain: string, records: WaterDNSRecord[]): WaterDomainRegistration {
    const registration = this.registrations.get(domain);
    if (!registration) {
      throw new Error(`Domain "${domain}" is not registered`);
    }
    
    registration.dnsRecords = records.map(record => ({
      ...record,
      updatedAt: Date.now(),
    }));
    
    return registration;
  }

  /**
   * Transfer domain
   */
  async transferDomain(
    domain: string,
    newRegistrant: WaterDomainRegistration['registrant'],
    paymentInfo: {
      method: WaterRegistrationFee['paymentMethod'];
      transactionHash?: string;
      amount: number;
    }
  ): Promise<WaterDomainRegistration> {
    const existing = this.registrations.get(domain);
    if (!existing) {
      throw new Error(`Domain "${domain}" is not registered`);
    }
    
    // Calculate transfer fee
    const transferFee = existing.fee.transferFee;
    
    // Verify payment
    if (paymentInfo.amount < transferFee) {
      throw new Error(`Insufficient payment. Required: ${transferFee}, Provided: ${paymentInfo.amount}`);
    }
    
    // Update registrant
    existing.registrant = newRegistrant;
    existing.fee.transactionHash = paymentInfo.transactionHash;
    existing.paymentStatus = 'paid';
    
    return existing;
  }
}

/**
 * WATER Network Resolver
 * 
 * Resolves WATER network addresses to NSPFRNP addresses and resources.
 */
export class WaterNetworkResolver {
  private addressing: WaterNetworkAddressing;
  private registry: WaterDomainRegistry;

  constructor(
    addressing?: WaterNetworkAddressing,
    registry?: WaterDomainRegistry
  ) {
    this.addressing = addressing || new WaterNetworkAddressing();
    this.registry = registry || new WaterDomainRegistry(this.addressing);
  }

  /**
   * Resolve WATER address to NSPFRNP address
   */
  async resolveToNSPFRNP(waterAddress: string): Promise<string | null> {
    const parsed = this.addressing.parseAddress(waterAddress);
    const registration = this.registry.getRegistration(parsed.domain);
    
    if (!registration || !registration.nspfrnpAddress) {
      return null;
    }
    
    return registration.nspfrnpAddress;
  }

  /**
   * Resolve WATER address to DNS records
   */
  async resolveDNS(waterAddress: string): Promise<WaterDNSRecord[]> {
    const parsed = this.addressing.parseAddress(waterAddress);
    const registration = this.registry.getRegistration(parsed.domain);
    
    if (!registration) {
      return [];
    }
    
    return registration.dnsRecords;
  }

  /**
   * Resolve WATER address to resource endpoint
   */
  async resolveResource(waterAddress: string): Promise<string | null> {
    const dnsRecords = await this.resolveDNS(waterAddress);
    const aRecord = dnsRecords.find(r => r.type === 'A' && r.name === '@');
    
    if (!aRecord) {
      return null;
    }
    
    return aRecord.value;
  }
}
