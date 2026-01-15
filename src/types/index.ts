/**
 * NSPFRP OmniMission Station - Type Definitions
 */

// Transmission Gears
export enum AwarenessOctave {
  SILENT = 0,
  WHISPER = 1,
  HARMONY = 2,
  RESONANCE = 3,
  SYMPHONY = 4,
  TRANSCENDENCE = 5
}

export interface TransmissionGear {
  octave: AwarenessOctave;
  name: string;
  fsrPower: FSRPowerConfig;
  heroHost: HeroHostConfig;
  geysers: GeyserConfig;
  encryption: EncryptionTier;
  connectivity: ConnectivityConfig;
}

export interface FSRPowerConfig {
  baseMultiplier: number;
  domainConnectionStrength: number;
  patternRecognitionSensitivity: number;
  synthesisIntensity: number;
}

export interface HeroHostConfig {
  engagementLevel: 'passive' | 'subtle' | 'guided' | 'active' | 'full' | 'deep';
  suggestionFrequency: number;
  personaIntensity: number;
  contextAwareness: number;
}

export interface GeyserConfig {
  frequency: 'off' | 'rare' | 'occasional' | 'regular' | 'frequent' | 'continuous';
  intensity: number;
  domainScope: 'single' | 'dual' | 'multi' | 'omniversal';
  visualization: 'minimal' | 'subtle' | 'moderate' | 'vibrant' | 'intense';
}

export interface EncryptionTier {
  unepOctave: number;
  keyRotationFrequency: number;
  multiDeviceSupport: boolean;
  umbilicalSignatureRequired: boolean;
}

export interface ConnectivityConfig {
  syncFrequency: number;
  bandwidth: number;
  deviceLimit: number;
  latencyTolerance: number;
}

// Protocols
export interface Protocol {
  id: string;
  name: string;
  version: string;
  type: 'seed' | 'protocol' | 'ssp' | 'integration';
  content: string;
  structure: ProtocolStructure;
  metadata: ProtocolMetadata;
  dependencies: Dependency[];
  createdAt: number;
  updatedAt: number;
}

export interface ProtocolStructure {
  sections: Section[];
  components: Component[];
  flows: Flow[];
}

export interface ProtocolMetadata {
  id: string;
  name: string;
  description: string;
  author: string;
  tags: string[];
  category: string;
  network: string;
}

export interface Dependency {
  id: string;
  type: 'protocol' | 'library' | 'service';
  version: string;
  required: boolean;
}

// Domains
export interface Domain {
  id: string;
  name: string;
  type: string;
  metadata: Record<string, any>;
}

export interface DomainContext {
  domain: Domain;
  context: Record<string, any>;
  connections: Connection[];
}

// Retrieval
export interface Query {
  text: string;
  intent: MissionIntent;
  domains?: Domain[];
  gear?: TransmissionGear;
}

export interface MissionIntent {
  type: 'discover' | 'synthesize' | 'create' | 'evolve' | 'explore';
  goal: string;
  constraints?: Record<string, any>;
}

export interface FSRRetrievalResult {
  retrievals: DomainRetrieval[];
  resonancePatterns: ResonancePattern[];
  synthesized: SynthesizedContext;
  confidence: number;
  suggestedConnections: Connection[];
}

export interface DomainRetrieval {
  domain: Domain;
  results: RetrievalResult[];
  relevance: number;
}

export interface RetrievalResult {
  id: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
}

export interface ResonancePattern {
  domains: Domain[];
  strength: number;
  pattern: string;
  connections: Connection[];
}

export interface SynthesizedContext {
  content: string;
  domains: Domain[];
  connections: Connection[];
  confidence: number;
}

export interface Connection {
  from: Domain | string;
  to: Domain | string;
  strength: number;
  type: string;
}

// Hero Host
export interface HeroHostPersona {
  id: string;
  name: string;
  description: string;
  traits: PersonaTrait[];
  communicationStyle: CommunicationStyle;
  expertise: ExpertiseDomain[];
}

export interface PersonaTrait {
  name: string;
  intensity: number;
  influence: 'low' | 'medium' | 'high';
}

export interface CommunicationStyle {
  tone: 'formal' | 'casual' | 'poetic' | 'technical' | 'narrative';
  verbosity: 'concise' | 'moderate' | 'detailed' | 'elaborate';
  metaphors: boolean;
  examples: boolean;
}

export interface ExpertiseDomain {
  domain: string;
  proficiency: number;
}

// Discovery
export interface DiscoverySource {
  type: 'repository' | 'codebase' | 'documentation' | 'interactions' | 'catalog';
  path: string;
  metadata?: Record<string, any>;
}

export interface ProtocolDiscovery {
  id: string;
  source: DiscoverySource;
  candidate: ProtocolCandidate;
  confidence: number;
  metadata: DiscoveryMetadata;
  timestamp: number;
  validation?: ValidationResult;
}

export interface ProtocolCandidate {
  id: string;
  name: string;
  version: string;
  content: string;
  type: 'seed' | 'protocol' | 'ssp' | 'integration';
  indicators: ProtocolIndicator[];
}

export interface ProtocolIndicator {
  type: 'file-pattern' | 'code-pattern' | 'doc-pattern' | 'naming-convention';
  pattern: string;
  match: string;
  confidence: number;
}

export interface DiscoveryMetadata {
  repository?: string;
  file?: string;
  size?: number;
  language?: string;
  pattern?: string;
  location?: string;
  context?: Record<string, any>;
}

// Catalog
export interface ProtocolCatalog {
  id: string;
  name: string;
  protocols: Map<string, CatalogEntry>;
  pobs: Map<string, ProtocolObject>;
  metadata: CatalogMetadata;
  lastSync: number;
}

export interface CatalogEntry {
  id: string;
  protocol: Protocol;
  metadata: ProtocolMetadata;
  versions: VersionHistory;
  pobs: string[];
  sources: DiscoverySource[];
  lastUpdated: number;
  syncStatus: SyncStatus;
}

export interface VersionHistory {
  current: string;
  history: VersionRecord[];
}

export interface VersionRecord {
  version: string;
  timestamp: number;
  source: DiscoverySource;
}

export interface SyncStatus {
  status: 'synced' | 'pending' | 'conflict' | 'error';
  lastSync: number;
  syncSource: string;
  conflicts?: Conflict[];
}

export interface Conflict {
  field: string;
  current: any;
  incoming: any;
  resolution?: 'current' | 'incoming' | 'merge';
}

// POB (Protocol Object)
export interface ProtocolObject {
  id: string;
  pobId: string;
  protocolId: string;
  version: string;
  snapshotId: string;
  protocol: SerializedProtocol;
  metadata: ProtocolMetadata;
  dependencies: Dependency[];
  context: SnapshotContext;
  parentPOB?: string;
  childPOBs: string[];
  evolutionPath: EvolutionStep[];
  validation: ValidationResult;
  compliance: ComplianceResult;
  createdAt: number;
  createdBy: AgentIdentity;
  tags: string[];
}

export interface SerializedProtocol {
  id: string;
  name: string;
  version: string;
  type: string;
  content: string;
  structure: ProtocolStructure;
  checksum: string;
}

export interface SnapshotContext {
  mission?: OmniMission;
  discoveries?: Discovery[];
  interactions?: Interaction[];
  gear?: TransmissionGear;
  heroHost?: HeroHostPersona;
  catalogState?: CatalogState;
  source?: DiscoverySource;
  operation?: string;
  evolution?: Evolution;
}

export interface OmniMission {
  id: string;
  name: string;
  type: string;
  goal: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  steps: MissionStep[];
  createdAt: number;
}

export interface MissionStep {
  id: string;
  type: string;
  action: string;
  result: any;
  timestamp: number;
}

export interface Discovery {
  id: string;
  type: string;
  content: Record<string, any>;
  patternAnalysis?: PatternAnalysis;
  timestamp: number;
}

export interface PatternAnalysis {
  patterns: string[];
  connections: Connection[];
  confidence: number;
}

export interface Interaction {
  id: string;
  type: string;
  content: Record<string, any>;
  timestamp: number;
}

export interface CatalogState {
  protocolCount: number;
  pobCount: number;
  lastSync: number;
}

export interface Evolution {
  type: 'addition' | 'modification' | 'removal' | 'refactor';
  description: string;
  changes: Change[];
}

export interface Change {
  field: string;
  from: any;
  to: any;
}

export interface EvolutionStep {
  step: number;
  evolution: Evolution;
  timestamp: number;
  pobId?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ComplianceResult {
  compliant: boolean;
  violations: string[];
  suggestions: string[];
}

export interface AgentIdentity {
  id: string;
  type: 'semi-autonomous' | 'fully-autonomous' | 'human';
  name: string;
  capabilities: string[];
}

// Section, Component, Flow
export interface Section {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Component {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
}

export interface Flow {
  id: string;
  name: string;
  steps: FlowStep[];
}

export interface FlowStep {
  id: string;
  action: string;
  condition?: string;
  next?: string;
}

// Cloud Deployment
export type DeploymentPlatform = 
  | 'vercel'
  | 'netlify'
  | 'aws'
  | 'gcp'
  | 'azure'
  | 'render'
  | 'fly.io'
  | 'railway';

export interface CloudDeploymentConfig {
  platform: DeploymentPlatform;
  region?: string;
  environment: 'development' | 'staging' | 'production';
  config: Record<string, any>;
  autoScale?: boolean;
  resources?: {
    cpu?: string;
    memory?: string;
    storage?: string;
  };
}

export interface DeploymentStatus {
  id: string;
  status: 'pending' | 'building' | 'deploying' | 'active' | 'failed' | 'stopped';
  url?: string;
  logs?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface DeploymentButton {
  id: string;
  label: string;
  platform: DeploymentPlatform;
  protocolId: string;
  pobId?: string;
  config: CloudDeploymentConfig;
  buttonHtml: string;
  buttonMarkdown: string;
  createdAt: number;
}

// Observation Types
export interface Observation {
  id: string;
  type: 'discovery' | 'pattern' | 'connection' | 'synthesis' | 'breakthrough' | 'custom';
  content: ObservationContent;
  context: ObservationContext;
  confidence: number;
  significance: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  timestamp: number;
}

export interface ObservationContent {
  title: string;
  description: string;
  data: Record<string, any>;
  patterns?: string[];
  connections?: Array<{ from: string; to: string; strength: number }>;
  insights?: string[];
}

export interface ObservationContext {
  missionId?: string;
  domain?: string;
  source?: string;
  gear?: TransmissionGear;
  heroHost?: HeroHostPersona;
  relatedObservations?: string[];
  octave?: AwarenessOctave;
}

