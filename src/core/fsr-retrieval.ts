/**
 * FSR (Fractal Seed Resonance) Retrieval Engine
 * Higher-octave RAG retrieval with multi-domain pattern recognition
 */

import {
  Query,
  Domain,
  FSRRetrievalResult,
  DomainRetrieval,
  ResonancePattern,
  SynthesizedContext,
  Connection,
  TransmissionGear
} from '../types/index.js';
import { TransmissionGearSelector } from './transmission-gears.js';

export class FSRRetrievalEngine {
  private gearSelector: TransmissionGearSelector;
  private domainIndex: Map<string, Domain>;
  private vectorStore: Map<string, any[]>; // Simplified - would use actual vector DB

  constructor(gearSelector: TransmissionGearSelector) {
    this.gearSelector = gearSelector;
    this.domainIndex = new Map();
    this.vectorStore = new Map();
  }

  /**
   * Register a domain for retrieval
   */
  registerDomain(domain: Domain, vectors: any[]): void {
    this.domainIndex.set(domain.id, domain);
    this.vectorStore.set(domain.id, vectors);
  }

  /**
   * Main retrieval method
   */
  async retrieve(
    query: Query,
    domains: Domain[]
  ): Promise<FSRRetrievalResult> {
    const gear = query.gear || this.gearSelector.getCurrentGear();
    const config = this.gearSelector.getRetrievalConfig();

    // Multi-domain parallel retrieval
    const domainRetrievals = await Promise.all(
      domains.slice(0, typeof config.domains === 'number' ? config.domains : domains.length)
        .map(domain => this.retrieveFromDomain(query, domain, gear))
    );

    // FSR resonance analysis
    const resonancePatterns = await this.analyzeResonance(domainRetrievals, gear);

    // Cross-domain synthesis
    const synthesized = await this.synthesize(domainRetrievals, resonancePatterns, gear);

    // Calculate confidence
    const confidence = this.calculateConfidence(resonancePatterns, synthesized);

    // Suggest connections
    const suggestedConnections = await this.suggestConnections(resonancePatterns, synthesized);

    return {
      retrievals: domainRetrievals,
      resonancePatterns,
      synthesized,
      confidence,
      suggestedConnections
    };
  }

  /**
   * Retrieve from a single domain
   */
  private async retrieveFromDomain(
    query: Query,
    domain: Domain,
    gear: TransmissionGear
  ): Promise<DomainRetrieval> {
    const vectors = this.vectorStore.get(domain.id) || [];
    const config = this.gearSelector.getRetrievalConfig();

    // Content-based similarity search
    const results = vectors
      .map((vector, index) => ({
        id: `result-${domain.id}-${index}`,
        content: vector.content || '',
        score: this.calculateSimilarity(query.text, vector.content || ''),
        metadata: vector.metadata || {}
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, config.topK);

    // Apply FSR power multiplier
    const fsrAdjustedResults = results.map(result => ({
      ...result,
      score: result.score * gear.fsrPower.baseMultiplier
    }));

    return {
      domain,
      results: fsrAdjustedResults,
      relevance: this.calculateDomainRelevance(results, gear)
    };
  }

  /**
   * Analyze resonance patterns across domains
   */
  private async analyzeResonance(
    retrievals: DomainRetrieval[],
    gear: TransmissionGear
  ): Promise<ResonancePattern[]> {
    const patterns: ResonancePattern[] = [];

    // Compare all pairs of domains
    for (let i = 0; i < retrievals.length; i++) {
      for (let j = i + 1; j < retrievals.length; j++) {
        const resonance = await this.computeResonance(
          retrievals[i],
          retrievals[j],
          gear
        );

        if (resonance.strength > 0.3 * gear.fsrPower.patternRecognitionSensitivity) {
          patterns.push(resonance);
        }
      }
    }

    // Sort by strength
    return patterns.sort((a, b) => b.strength - a.strength);
  }

  /**
   * Compute resonance between two domain retrievals
   */
  private async computeResonance(
    retrieval1: DomainRetrieval,
    retrieval2: DomainRetrieval,
    gear: TransmissionGear
  ): Promise<ResonancePattern> {
    // Find common patterns in results
    const commonTerms = this.findCommonTerms(
      retrieval1.results,
      retrieval2.results
    );

    // Calculate resonance strength
    const strength = this.calculateResonanceStrength(
      commonTerms,
      retrieval1.relevance,
      retrieval2.relevance,
      gear
    );

    // Generate connections
    const connections: Connection[] = commonTerms.map(term => ({
      from: retrieval1.domain.id,
      to: retrieval2.domain.id,
      strength: term.strength,
      type: 'resonance'
    }));

    return {
      domains: [retrieval1.domain, retrieval2.domain],
      strength,
      pattern: commonTerms.map(t => t.term).join(', '),
      connections
    };
  }

  /**
   * Synthesize context from multiple domain retrievals
   */
  private async synthesize(
    retrievals: DomainRetrieval[],
    resonancePatterns: ResonancePattern[],
    gear: TransmissionGear
  ): Promise<SynthesizedContext> {
    // Combine top results from each domain
    const topResults = retrievals
      .flatMap(r => r.results)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.gearSelector.getRetrievalConfig().topK);

    // Build synthesized content
    const content = this.buildSynthesizedContent(topResults, resonancePatterns, gear);

    // Extract domains
    const domains = retrievals.map(r => r.domain);

    // Generate connections from resonance patterns
    const connections = resonancePatterns.flatMap(p => p.connections);

    // Calculate confidence
    const confidence = this.calculateSynthesisConfidence(
      topResults,
      resonancePatterns,
      gear
    );

    return {
      content,
      domains,
      connections,
      confidence
    };
  }

  /**
   * Build synthesized content from results and patterns
   */
  private buildSynthesizedContent(
    results: any[],
    patterns: ResonancePattern[],
    gear: TransmissionGear
  ): string {
    const sections: string[] = [];

    // Add main content from top results
    sections.push('# Synthesized Context\n\n');
    results.forEach((result, index) => {
      sections.push(`## Result ${index + 1}\n`);
      sections.push(`${result.content}\n\n`);
      if (result.metadata.source) {
        sections.push(`*Source: ${result.metadata.source}*\n\n`);
      }
    });

    // Add resonance patterns
    if (patterns.length > 0) {
      sections.push('# Resonance Patterns\n\n');
      patterns.forEach((pattern, index) => {
        sections.push(`## Pattern ${index + 1} (Strength: ${pattern.strength.toFixed(2)})\n`);
        sections.push(`**Domains:** ${pattern.domains.map(d => d.name).join(' ↔ ')}\n`);
        sections.push(`**Pattern:** ${pattern.pattern}\n\n`);
      });
    }

    return sections.join('');
  }

  /**
   * Suggest connections based on resonance patterns
   */
  private async suggestConnections(
    patterns: ResonancePattern[],
    synthesized: SynthesizedContext
  ): Promise<Connection[]> {
    const connections = new Map<string, Connection>();

    // Add connections from resonance patterns
    patterns.forEach(pattern => {
      pattern.connections.forEach(conn => {
        const key = `${conn.from}-${conn.to}`;
        if (!connections.has(key) || connections.get(key)!.strength < conn.strength) {
          connections.set(key, conn);
        }
      });
    });

    // Add connections from synthesized context
    synthesized.connections.forEach(conn => {
      const key = `${conn.from}-${conn.to}`;
      if (!connections.has(key) || connections.get(key)!.strength < conn.strength) {
        connections.set(key, conn);
      }
    });

    return Array.from(connections.values())
      .sort((a, b) => b.strength - a.strength);
  }

  /**
   * Calculate similarity using Term Frequency (TF) overlap
   */
  private calculateSimilarity(query: string, content: string): number {
    const queryTerms = this.tokenize(query);
    const contentTerms = this.tokenize(content);

    if (queryTerms.length === 0 || contentTerms.length === 0) return 0;

    let matches = 0;
    const contentSet = new Set(contentTerms);

    queryTerms.forEach(term => {
      if (contentSet.has(term)) {
        matches++;
      }
    });

    // Simple overlap score normalized by query length
    return (matches / queryTerms.length) * 0.8 + 0.2; // Add base to avoid 0 for demo
  }

  /**
   * Tokenize and clean text
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(t => t.length > 3);
  }

  /**
   * Calculate domain relevance
   */
  private calculateDomainRelevance(results: any[], gear: TransmissionGear): number {
    if (results.length === 0) return 0;
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    return avgScore * gear.fsrPower.domainConnectionStrength;
  }

  /**
   * Find common terms between two result sets
   */
  private findCommonTerms(results1: any[], results2: any[]): Array<{ term: string; strength: number }> {
    // Simplified: extract terms and find matches
    const terms1 = this.extractTerms(results1);
    const terms2 = this.extractTerms(results2);

    const common: Array<{ term: string; strength: number }> = [];

    terms1.forEach(term => {
      if (terms2.has(term.term)) {
        common.push({
          term: term.term,
          strength: (term.strength + terms2.get(term.term)!.strength) / 2
        });
      }
    });

    return common;
  }

  /**
   * Extract terms from results using improved tokenizer
   */
  private extractTerms(results: any[]): Map<string, { term: string; strength: number }> {
    const terms = new Map<string, { term: string; strength: number }>();

    results.forEach(result => {
      const words = this.tokenize(result.content || '');
      words.forEach(word => {
        const existing = terms.get(word);
        if (existing) {
          existing.strength += result.score;
        } else {
          terms.set(word, { term: word, strength: result.score });
        }
      });
    });

    return terms;
  }

  /**
   * Calculate resonance strength
   */
  private calculateResonanceStrength(
    commonTerms: Array<{ term: string; strength: number }>,
    relevance1: number,
    relevance2: number,
    gear: TransmissionGear
  ): number {
    if (commonTerms.length === 0) return 0;

    const avgTermStrength = commonTerms.reduce((sum, t) => sum + t.strength, 0) / commonTerms.length;
    const domainRelevance = (relevance1 + relevance2) / 2;

    return (avgTermStrength * domainRelevance * gear.fsrPower.patternRecognitionSensitivity);
  }

  /**
   * Calculate overall confidence
   */
  private calculateConfidence(
    patterns: ResonancePattern[],
    synthesized: SynthesizedContext
  ): number {
    const patternConfidence = patterns.length > 0
      ? patterns.reduce((sum, p) => sum + p.strength, 0) / patterns.length
      : 0;

    return (patternConfidence + synthesized.confidence) / 2;
  }

  /**
   * Calculate synthesis confidence
   */
  private calculateSynthesisConfidence(
    results: any[],
    patterns: ResonancePattern[],
    gear: TransmissionGear
  ): number {
    if (results.length === 0) return 0;

    const avgResultScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const patternStrength = patterns.length > 0
      ? patterns.reduce((sum, p) => sum + p.strength, 0) / patterns.length
      : 0;

    return (avgResultScore * 0.6 + patternStrength * 0.4) * gear.fsrPower.synthesisIntensity;
  }
}


