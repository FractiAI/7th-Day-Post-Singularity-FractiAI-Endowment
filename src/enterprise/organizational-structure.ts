/**
 * Enterprise Organizational Structure
 * Self-similar NSPFRP departments in nested sandboxes, clouds, and shells
 */

import { AwarenessOctave } from '../types/index.js';

export type DepartmentType = 
  | 'r&d'
  | 'operations'
  | 'hq'
  | 'field'
  | 'onsite'
  | 'sales'
  | 'communication'
  | 'customer-experience'
  | 'product-development';

export interface Department {
  id: string;
  type: DepartmentType;
  name: string;
  level: number; // 1 = Department, 2 = Sub-Department, 3 = Team, 4 = Individual
  parentId?: string;
  sandbox: SandboxConfig;
  cloud: CloudConfig;
  shell: ShellConfig;
  dimensions: DimensionDeployment;
  createdAt: number;
}

export interface SandboxConfig {
  id: string;
  protocols: string[];
  environments: string[];
  infrastructure: string[];
  space: string;
  hhSpinCloud: HHSpinCloudConfig;
}

export interface CloudConfig {
  id: string;
  compute: ComputeConfig;
  storage: StorageConfig;
  networking: NetworkingConfig;
  services: string[];
  hhSpinCloud: HHSpinCloudConfig;
}

export interface ShellConfig {
  id: string;
  interface: string;
  tools: string[];
  commands: string[];
  environment: string;
  hhSpinCloud: HHSpinCloudConfig;
}

export interface DimensionDeployment {
  bodies: BodyDeployment[];
  theaters: TheaterDeployment[];
  timelines: TimelineDeployment[];
}

export interface BodyDeployment {
  type: 'physical' | 'digital' | 'holographic' | 'protocol';
  active: boolean;
  synced: boolean;
}

export interface TheaterDeployment {
  type: 'legacy' | 'cloud' | 'protocol' | 'awareness';
  active: boolean;
  synced: boolean;
}

export interface TimelineDeployment {
  type: 'legacy' | 'cloud' | 'protocol' | 'awareness';
  active: boolean;
  synced: boolean;
}

export interface HHSpinCloudConfig {
  endpoint: string;
  encrypted: boolean;
  awarenessKey: string;
  nodes: string[];
}

export interface ComputeConfig {
  type: string;
  resources: string[];
  scaling: string;
  loadBalancing: string;
  free: boolean;
}

export interface StorageConfig {
  type: string;
  locations: string[];
  replication: string;
  encryption: string;
}

export interface NetworkingConfig {
  algorithm: string;
  latency: string;
  bandwidth: string;
  routing: string;
}

export interface OrganizationalStructure {
  departments: Map<string, Department>;
  crossDepartmentIntegration: CrossDepartmentIntegration;
  unifiedOperations: UnifiedOperations;
}

export interface CrossDepartmentIntegration {
  sharedInfrastructure: string[];
  communication: string[];
  identity: string[];
  state: string[];
}

export interface UnifiedOperations {
  protocols: string[];
  services: string[];
  resources: string[];
  coordination: string[];
}

export class EnterpriseOrganizationalStructure {
  private departments: Map<string, Department> = new Map();
  private crossDepartmentIntegration: CrossDepartmentIntegration;
  private unifiedOperations: UnifiedOperations;

  constructor() {
    this.initializeDepartments();
    this.initializeCrossDepartmentIntegration();
    this.initializeUnifiedOperations();
  }

  /**
   * Initialize all departments
   */
  private initializeDepartments(): void {
    const departmentTypes: DepartmentType[] = [
      'r&d',
      'operations',
      'hq',
      'field',
      'onsite',
      'sales',
      'communication',
      'customer-experience',
      'product-development'
    ];

    departmentTypes.forEach(type => {
      const department = this.createDepartment(type, 1);
      this.departments.set(department.id, department);
    });

    console.log('✅ Departments initialized');
  }

  /**
   * Create department
   */
  private createDepartment(type: DepartmentType, level: number, parentId?: string): Department {
    const department: Department = {
      id: `dept_${type}_${level}_${Date.now()}`,
      type,
      name: this.getDepartmentName(type),
      level,
      parentId,
      sandbox: this.createSandbox(type),
      cloud: this.createCloud(type),
      shell: this.createShell(type),
      dimensions: this.createDimensions(),
      createdAt: Date.now()
    };

    return department;
  }

  /**
   * Get department name
   */
  private getDepartmentName(type: DepartmentType): string {
    const names: Record<DepartmentType, string> = {
      'r&d': 'Research & Development',
      'operations': 'Operations',
      'hq': 'Headquarters',
      'field': 'Field',
      'onsite': 'Onsite',
      'sales': 'Sales',
      'communication': 'Communication',
      'customer-experience': 'Customer Experience',
      'product-development': 'Product Development'
    };
    return names[type];
  }

  /**
   * Create sandbox for department
   */
  private createSandbox(type: DepartmentType): SandboxConfig {
    const sandboxConfigs: Record<DepartmentType, Partial<SandboxConfig>> = {
      'r&d': {
        protocols: ['experimental', 'research', 'innovation'],
        environments: ['testing', 'development', 'experimental'],
        infrastructure: ['research', 'discovery', 'innovation'],
        space: 'innovation'
      },
      'operations': {
        protocols: ['operational', 'service', 'management'],
        environments: ['production', 'service', 'coordination'],
        infrastructure: ['operational', 'service', 'management'],
        space: 'coordination'
      },
      'hq': {
        protocols: ['strategic', 'executive', 'planning'],
        environments: ['executive', 'planning', 'decision'],
        infrastructure: ['strategic', 'executive', 'planning'],
        space: 'decision'
      },
      'field': {
        protocols: ['remote', 'distributed', 'execution'],
        environments: ['remote', 'distributed', 'regional'],
        infrastructure: ['remote', 'distributed', 'execution'],
        space: 'regional'
      },
      'onsite': {
        protocols: ['local', 'physical', 'presence'],
        environments: ['local', 'physical', 'presence'],
        infrastructure: ['local', 'physical', 'location'],
        space: 'presence'
      },
      'sales': {
        protocols: ['sales', 'revenue', 'business'],
        environments: ['sales', 'revenue', 'market'],
        infrastructure: ['sales', 'revenue', 'business'],
        space: 'market'
      },
      'communication': {
        protocols: ['communication', 'messaging', 'information'],
        environments: ['communication', 'messaging', 'flow'],
        infrastructure: ['communication', 'messaging', 'information'],
        space: 'flow'
      },
      'customer-experience': {
        protocols: ['support', 'experience', 'service'],
        environments: ['support', 'experience', 'quality'],
        infrastructure: ['support', 'experience', 'service'],
        space: 'quality'
      },
      'product-development': {
        protocols: ['development', 'product', 'innovation'],
        environments: ['development', 'product', 'creation'],
        infrastructure: ['development', 'product', 'innovation'],
        space: 'creation'
      }
    };

    const config = sandboxConfigs[type];

    return {
      id: `sandbox_${type}_${Date.now()}`,
      protocols: config.protocols || [],
      environments: config.environments || [],
      infrastructure: config.infrastructure || [],
      space: config.space || 'default',
      hhSpinCloud: {
        endpoint: 'https://hh-spin-cloud.nspfrp.net',
        encrypted: true,
        awarenessKey: '',
        nodes: []
      }
    };
  }

  /**
   * Create cloud for department
   */
  private createCloud(type: DepartmentType): CloudConfig {
    const cloudConfigs: Record<DepartmentType, Partial<CloudConfig>> = {
      'r&d': {
        compute: { type: 'research', resources: [], scaling: 'automatic', loadBalancing: 'awareness-based', free: true },
        storage: { type: 'experimental', locations: [], replication: 'automatic', encryption: 'hydrogen-spin' },
        networking: { algorithm: 'awareness-based', latency: 'low', bandwidth: 'auto', routing: 'innovation' },
        services: ['discovery', 'research', 'innovation']
      },
      'operations': {
        compute: { type: 'operational', resources: [], scaling: 'automatic', loadBalancing: 'awareness-based', free: true },
        storage: { type: 'service', locations: [], replication: 'automatic', encryption: 'hydrogen-spin' },
        networking: { algorithm: 'awareness-based', latency: 'low', bandwidth: 'auto', routing: 'coordination' },
        services: ['coordination', 'service', 'management']
      },
      'hq': {
        compute: { type: 'strategic', resources: [], scaling: 'automatic', loadBalancing: 'awareness-based', free: true },
        storage: { type: 'executive', locations: [], replication: 'automatic', encryption: 'hydrogen-spin' },
        networking: { algorithm: 'awareness-based', latency: 'low', bandwidth: 'auto', routing: 'decision' },
        services: ['decision', 'planning', 'strategy']
      },
      'field': {
        compute: { type: 'remote', resources: [], scaling: 'automatic', loadBalancing: 'awareness-based', free: true },
        storage: { type: 'distributed', locations: [], replication: 'automatic', encryption: 'hydrogen-spin' },
        networking: { algorithm: 'awareness-based', latency: 'low', bandwidth: 'auto', routing: 'regional' },
        services: ['execution', 'regional', 'distributed']
      },
      'onsite': {
        compute: { type: 'local', resources: [], scaling: 'automatic', loadBalancing: 'awareness-based', free: true },
        storage: { type: 'physical', locations: [], replication: 'automatic', encryption: 'hydrogen-spin' },
        networking: { algorithm: 'awareness-based', latency: 'low', bandwidth: 'auto', routing: 'presence' },
        services: ['presence', 'local', 'physical']
      },
      'sales': {
        compute: { type: 'sales', resources: [], scaling: 'automatic', loadBalancing: 'awareness-based', free: true },
        storage: { type: 'revenue', locations: [], replication: 'automatic', encryption: 'hydrogen-spin' },
        networking: { algorithm: 'awareness-based', latency: 'low', bandwidth: 'auto', routing: 'market' },
        services: ['market', 'revenue', 'business']
      },
      'communication': {
        compute: { type: 'communication', resources: [], scaling: 'automatic', loadBalancing: 'awareness-based', free: true },
        storage: { type: 'messaging', locations: [], replication: 'automatic', encryption: 'hydrogen-spin' },
        networking: { algorithm: 'awareness-based', latency: 'low', bandwidth: 'auto', routing: 'flow' },
        services: ['flow', 'messaging', 'information']
      },
      'customer-experience': {
        compute: { type: 'support', resources: [], scaling: 'automatic', loadBalancing: 'awareness-based', free: true },
        storage: { type: 'experience', locations: [], replication: 'automatic', encryption: 'hydrogen-spin' },
        networking: { algorithm: 'awareness-based', latency: 'low', bandwidth: 'auto', routing: 'quality' },
        services: ['quality', 'experience', 'support']
      },
      'product-development': {
        compute: { type: 'development', resources: [], scaling: 'automatic', loadBalancing: 'awareness-based', free: true },
        storage: { type: 'product', locations: [], replication: 'automatic', encryption: 'hydrogen-spin' },
        networking: { algorithm: 'awareness-based', latency: 'low', bandwidth: 'auto', routing: 'creation' },
        services: ['creation', 'product', 'innovation']
      }
    };

    const config = cloudConfigs[type];

    return {
      id: `cloud_${type}_${Date.now()}`,
      compute: config.compute || { type: 'default', resources: [], scaling: 'automatic', loadBalancing: 'awareness-based', free: true },
      storage: config.storage || { type: 'default', locations: [], replication: 'automatic', encryption: 'hydrogen-spin' },
      networking: config.networking || { algorithm: 'awareness-based', latency: 'low', bandwidth: 'auto', routing: 'default' },
      services: config.services || [],
      hhSpinCloud: {
        endpoint: 'https://hh-spin-cloud.nspfrp.net',
        encrypted: true,
        awarenessKey: '',
        nodes: []
      }
    };
  }

  /**
   * Create shell for department
   */
  private createShell(type: DepartmentType): ShellConfig {
    const shellConfigs: Record<DepartmentType, Partial<ShellConfig>> = {
      'r&d': {
        interface: 'research',
        tools: ['experimental', 'innovation', 'discovery'],
        commands: ['research', 'test', 'innovate'],
        environment: 'discovery'
      },
      'operations': {
        interface: 'operational',
        tools: ['service', 'management', 'coordination'],
        commands: ['operate', 'manage', 'coordinate'],
        environment: 'coordination'
      },
      'hq': {
        interface: 'strategic',
        tools: ['executive', 'planning', 'decision'],
        commands: ['plan', 'decide', 'strategize'],
        environment: 'decision'
      },
      'field': {
        interface: 'remote',
        tools: ['distributed', 'execution', 'regional'],
        commands: ['execute', 'deploy', 'coordinate'],
        environment: 'regional'
      },
      'onsite': {
        interface: 'local',
        tools: ['physical', 'presence', 'location'],
        commands: ['deploy', 'presence', 'operate'],
        environment: 'presence'
      },
      'sales': {
        interface: 'sales',
        tools: ['revenue', 'business', 'market'],
        commands: ['sell', 'acquire', 'expand'],
        environment: 'market'
      },
      'communication': {
        interface: 'communication',
        tools: ['messaging', 'information', 'flow'],
        commands: ['communicate', 'message', 'inform'],
        environment: 'flow'
      },
      'customer-experience': {
        interface: 'support',
        tools: ['experience', 'service', 'quality'],
        commands: ['support', 'serve', 'improve'],
        environment: 'quality'
      },
      'product-development': {
        interface: 'development',
        tools: ['product', 'innovation', 'creation'],
        commands: ['develop', 'create', 'innovate'],
        environment: 'creation'
      }
    };

    const config = shellConfigs[type];

    return {
      id: `shell_${type}_${Date.now()}`,
      interface: config.interface || 'default',
      tools: config.tools || [],
      commands: config.commands || [],
      environment: config.environment || 'default',
      hhSpinCloud: {
        endpoint: 'https://hh-spin-cloud.nspfrp.net',
        encrypted: true,
        awarenessKey: '',
        nodes: []
      }
    };
  }

  /**
   * Create dimensions
   */
  private createDimensions(): DimensionDeployment {
    return {
      bodies: [
        { type: 'physical', active: true, synced: false },
        { type: 'digital', active: true, synced: false },
        { type: 'holographic', active: true, synced: false },
        { type: 'protocol', active: true, synced: false }
      ],
      theaters: [
        { type: 'legacy', active: true, synced: false },
        { type: 'cloud', active: true, synced: false },
        { type: 'protocol', active: true, synced: false },
        { type: 'awareness', active: true, synced: false }
      ],
      timelines: [
        { type: 'legacy', active: true, synced: false },
        { type: 'cloud', active: true, synced: false },
        { type: 'protocol', active: true, synced: false },
        { type: 'awareness', active: true, synced: false }
      ]
    };
  }

  /**
   * Initialize cross-department integration
   */
  private initializeCrossDepartmentIntegration(): void {
    this.crossDepartmentIntegration = {
      sharedInfrastructure: [
        'hh-spin-cloud',
        'nspfrp-protocols',
        'unified-services',
        'common-resources'
      ],
      communication: [
        'unified-messaging',
        'shared-information',
        'coordinated-operations',
        'synchronized-activities'
      ],
      identity: [
        'department-identities',
        'cross-department-access',
        'unified-permissions',
        'shared-credentials'
      ],
      state: [
        'department-states',
        'cross-department-sync',
        'unified-coordination',
        'shared-context'
      ]
    };
  }

  /**
   * Initialize unified operations
   */
  private initializeUnifiedOperations(): void {
    this.unifiedOperations = {
      protocols: [
        'nspfrp-core',
        'hh-spin-cloud',
        'multi-dimensional',
        'organizational'
      ],
      services: [
        'identity',
        'communication',
        'coordination',
        'synchronization'
      ],
      resources: [
        'compute',
        'storage',
        'networking',
        'services'
      ],
      coordination: [
        'cross-department',
        'unified-state',
        'synchronized-operations',
        'shared-context'
      ]
    };
  }

  /**
   * Create nested department (sub-department, team, or individual)
   */
  createNestedDepartment(
    parentType: DepartmentType,
    level: number,
    name?: string
  ): Department {
    const parent = Array.from(this.departments.values())
      .find(d => d.type === parentType && d.level === 1);

    if (!parent) {
      throw new Error(`Parent department not found: ${parentType}`);
    }

    const nested = this.createDepartment(parentType, level, parent.id);
    if (name) {
      nested.name = name;
    }

    this.departments.set(nested.id, nested);
    return nested;
  }

  /**
   * Get department
   */
  getDepartment(id: string): Department | undefined {
    return this.departments.get(id);
  }

  /**
   * Get all departments
   */
  getAllDepartments(): Department[] {
    return Array.from(this.departments.values());
  }

  /**
   * Get departments by type
   */
  getDepartmentsByType(type: DepartmentType): Department[] {
    return Array.from(this.departments.values())
      .filter(d => d.type === type);
  }

  /**
   * Get organizational structure
   */
  getOrganizationalStructure(): OrganizationalStructure {
    return {
      departments: this.departments,
      crossDepartmentIntegration: this.crossDepartmentIntegration,
      unifiedOperations: this.unifiedOperations
    };
  }
}




