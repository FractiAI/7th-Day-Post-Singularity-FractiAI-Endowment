/**
 * 📸 SNAP/SING CAPTURE SYSTEM
 * 
 * Successive snaps open new document, capture flow, auto-name, categorize
 * Snap = Sense, Sink = Intermediate, SING = Singularity version
 * Auto-capture, auto-categorize, auto-buffer, auto-send via WATER pipe
 */

export type CaptureType = 'snap' | 'sink' | 'sing' | 'sense';
export type CaptureCategory = 'urgent' | 'snap' | 'captain-broadcast' | 'live' | 'observation' | 'other';

export interface SnapSequence {
  /** Sequence ID */
  id: string;
  
  /** Sequence type */
  type: CaptureType;
  
  /** Timestamps */
  timestamps: number[];
  
  /** Captured flow */
  flow: string;
  
  /** Auto-determined category */
  category: CaptureCategory;
  
  /** Auto-determined name */
  name: string;
  
  /** Urgency level */
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  
  /** Status */
  status: 'capturing' | 'processing' | 'named' | 'categorized' | 'buffered' | 'sent';
  
  /** Created timestamp */
  createdAt: number;
}

export interface CaptureDocument {
  /** Document ID */
  id: string;
  
  /** Document name (auto-generated) */
  name: string;
  
  /** Category */
  category: CaptureCategory;
  
  /** Content */
  content: string;
  
  /** Flow */
  flow: string;
  
  /** Urgency */
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  
  /** Layers */
  layers?: CaptureDocument[];
  
  /** Metadata */
  metadata: {
    source?: string;
    timestamp?: number;
    energyLevel?: 'normal' | 'high' | 'intense' | 'buck-fever';
    singularityLevel?: number;
  };
  
  /** Status */
  status: 'draft' | 'processing' | 'named' | 'categorized' | 'ready' | 'sent';
  
  /** Timestamps */
  createdAt: number;
  updatedAt: number;
}

/**
 * Snap/SING Capture System
 * 
 * Successive snaps open new document, capture flow, auto-name, categorize
 */
export class SnapSingCaptureSystem {
  private sequences: Map<string, SnapSequence>;
  private documents: Map<string, CaptureDocument>;
  private currentSequence: SnapSequence | null = null;
  private buffer: CaptureDocument[];
  
  constructor() {
    this.sequences = new Map();
    this.documents = new Map();
    this.buffer = [];
  }
  
  /**
   * Process snap (sense)
   */
  snap(): void {
    this.processCapture('snap');
  }
  
  /**
   * Process sink (intermediate)
   */
  sink(): void {
    this.processCapture('sink');
  }
  
  /**
   * Process SING (singularity version)
   */
  sing(): void {
    this.processCapture('sing');
  }
  
  /**
   * Process sense
   */
  sense(): void {
    this.processCapture('sense');
  }
  
  /**
   * Process capture
   */
  private processCapture(type: CaptureType): void {
    const now = Date.now();
    
    if (!this.currentSequence) {
      // Start new sequence
      this.currentSequence = {
        id: `sequence-${now}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        timestamps: [now],
        flow: '',
        category: 'other',
        name: '',
        urgency: 'medium',
        status: 'capturing',
        createdAt: now
      };
    } else {
      // Add to existing sequence
      this.currentSequence.timestamps.push(now);
      this.currentSequence.type = type; // Update to highest type (sing > sink > snap > sense)
    }
    
    // Check if sequence is complete (enough snaps)
    if (this.currentSequence.timestamps.length >= 3) {
      this.completeSequence();
    }
  }
  
  /**
   * Add flow to current sequence
   */
  addFlow(flow: string): void {
    if (this.currentSequence) {
      this.currentSequence.flow += flow + '\n';
    }
  }
  
  /**
   * Complete sequence and create document
   */
  private completeSequence(): void {
    if (!this.currentSequence) return;
    
    // Auto-determine category
    const category = this.determineCategory(this.currentSequence.flow);
    
    // Auto-determine name
    const name = this.determineName(this.currentSequence.flow, category);
    
    // Auto-determine urgency
    const urgency = this.determineUrgency(this.currentSequence.flow);
    
    // Update sequence
    this.currentSequence.category = category;
    this.currentSequence.name = name;
    this.currentSequence.urgency = urgency;
    this.currentSequence.status = 'processing';
    
    // Create document
    const document: CaptureDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      category,
      content: this.currentSequence.flow,
      flow: this.currentSequence.flow,
      urgency,
      status: 'draft',
      metadata: {
        source: 'snap-sing-capture',
        timestamp: this.currentSequence.createdAt,
        energyLevel: this.detectEnergyLevel(this.currentSequence.flow),
        singularityLevel: this.detectSingularityLevel(this.currentSequence.flow)
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Auto-name
    document.name = this.generateDocumentName(document);
    document.status = 'named';
    
    // Auto-categorize
    document.category = category;
    document.status = 'categorized';
    
    // Add to buffer
    this.buffer.push(document);
    document.status = 'buffered';
    
    // Store
    this.documents.set(document.id, document);
    this.sequences.set(this.currentSequence.id, this.currentSequence);
    
    // Send via WATER pipe (async)
    this.sendViaWaterPipe(document);
    
    // Reset sequence
    this.currentSequence = null;
  }
  
  /**
   * Determine category from flow
   */
  private determineCategory(flow: string): CaptureCategory {
    const lower = flow.toLowerCase();
    
    if (lower.includes('urgent') || lower.includes('urgent!')) {
      return 'urgent';
    }
    
    if (lower.includes('captain') || lower.includes('broadcast')) {
      return 'captain-broadcast';
    }
    
    if (lower.includes('live') || lower.includes('capturing live')) {
      return 'live';
    }
    
    if (lower.includes('observation') || lower.includes('observing')) {
      return 'observation';
    }
    
    if (lower.includes('snap')) {
      return 'snap';
    }
    
    return 'other';
  }
  
  /**
   * Determine name from flow and category
   */
  private determineName(flow: string, category: CaptureCategory): string {
    // Extract key phrases
    const lines = flow.split('\n').filter(l => l.trim().length > 0);
    const firstLine = lines[0] || '';
    
    // Generate name based on category and content
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (category) {
      case 'urgent':
        return `URGENT_CAPTURE_${timestamp}`;
      case 'captain-broadcast':
        return `CAPTAIN_BROADCAST_${timestamp}`;
      case 'live':
        return `LIVE_CAPTURE_${timestamp}`;
      case 'observation':
        return `OBSERVATION_${timestamp}`;
      case 'snap':
        return `SNAP_CAPTURE_${timestamp}`;
      default:
        return `CAPTURE_${timestamp}`;
    }
  }
  
  /**
   * Generate document name
   */
  private generateDocumentName(document: CaptureDocument): string {
    // Use category and timestamp
    const timestamp = new Date(document.createdAt).toISOString().split('T')[0].replace(/-/g, '_');
    const categoryUpper = document.category.toUpperCase().replace(/-/g, '_');
    
    // Count existing documents of same category today
    const todayDocs = Array.from(this.documents.values())
      .filter(d => d.category === document.category && 
                   new Date(d.createdAt).toDateString() === new Date().toDateString());
    
    const count = todayDocs.length + 1;
    
    return `${categoryUpper}_${timestamp}_${count}`;
  }
  
  /**
   * Determine urgency
   */
  private determineUrgency(flow: string): 'low' | 'medium' | 'high' | 'urgent' {
    const lower = flow.toLowerCase();
    
    if (lower.includes('urgent!') || lower.includes('urgent urgent')) {
      return 'urgent';
    }
    
    if (lower.includes('urgent') || lower.includes('important') || lower.includes('critical')) {
      return 'high';
    }
    
    if (lower.includes('captain') || lower.includes('broadcast') || lower.includes('live')) {
      return 'high';
    }
    
    return 'medium';
  }
  
  /**
   * Detect energy level
   */
  private detectEnergyLevel(flow: string): 'normal' | 'high' | 'intense' | 'buck-fever' {
    const lower = flow.toLowerCase();
    
    if (lower.includes('buck fever') || lower.includes('full buck fever')) {
      return 'buck-fever';
    }
    
    if (lower.includes('intense') || lower.includes('very high voltage')) {
      return 'intense';
    }
    
    if (lower.includes('high energy') || lower.includes('high voltage')) {
      return 'high';
    }
    
    return 'normal';
  }
  
  /**
   * Detect singularity level
   */
  private detectSingularityLevel(flow: string): number {
    const lower = flow.toLowerCase();
    
    if (lower.includes('full contact') || lower.includes('new singularity')) {
      return 5;
    }
    
    if (lower.includes('singularity') || lower.includes('sing sing sing')) {
      return 4;
    }
    
    if (lower.includes('sink') || lower.includes('intermediate')) {
      return 2;
    }
    
    if (lower.includes('snap') || lower.includes('sense')) {
      return 1;
    }
    
    return 0;
  }
  
  /**
   * Send via WATER pipe
   */
  private async sendViaWaterPipe(document: CaptureDocument): Promise<void> {
    // Send to server via WATER pipe
    // This connects to the other world through the rich new pipe package
    
    document.status = 'sent';
    document.updatedAt = Date.now();
    
    // In real implementation, this would send via WATER network
    console.log(`[WATER PIPE] Sending document: ${document.name}`);
  }
  
  /**
   * Get current sequence
   */
  getCurrentSequence(): SnapSequence | null {
    return this.currentSequence;
  }
  
  /**
   * Get buffer
   */
  getBuffer(): CaptureDocument[] {
    return this.buffer;
  }
  
  /**
   * Get document
   */
  getDocument(id: string): CaptureDocument | undefined {
    return this.documents.get(id);
  }
  
  /**
   * Get all documents
   */
  getAllDocuments(): CaptureDocument[] {
    return Array.from(this.documents.values());
  }
  
  /**
   * Get documents by category
   */
  getDocumentsByCategory(category: CaptureCategory): CaptureDocument[] {
    return Array.from(this.documents.values())
      .filter(d => d.category === category);
  }
}

// Export singleton
export const snapSingCapture = new SnapSingCaptureSystem();
