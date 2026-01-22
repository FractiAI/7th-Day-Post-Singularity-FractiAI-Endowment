/**
 * VIBEBLOCK API
 * Push anything to VibeChain Pre-Post Singularity Bridge
 * Input: Whatever is getting dropped
 * Output: Confirmation report or error
 * WITH BBHE GRAMMAR TAG SEQUENCING
 */

import { 
  vibeChain,
  BlockDropItem,
  DropConfirmation,
  NodeDropTier
} from './hhf-ai-spin-blockchain.js';
import { routeWithTags, parseTag } from '../bbhe/grammar-tag-system.js';

export interface VibeBlockRequest {
  // What to drop
  item: {
    type: 'node' | 'vchip' | 'key' | 'property' | 'system' | 'contract' | 'data';
    tier?: NodeDropTier;  // Auto-detected if not provided
    name: string;
    description?: string;
    payload: any;
  };
  
  // Drop options
  options?: {
    immediate?: boolean;      // Force immediate drop (bypass batching)
    priority?: number;        // 1-10 (10 = highest)
  };
  
  // BBHE Grammar Tags
  bbheTags?: string[];        // Auto-generated if not provided
}

export interface VibeBlockResponse {
  success: boolean;
  stagedId?: string;
  dropType: 'STANDALONE' | 'BATCHED' | 'IMMEDIATE';
  status: 'STAGED' | 'DROPPED' | 'FAILED';
  confirmation?: DropConfirmation;
  error?: string;
  stackInfo: {
    position: number;
    totalInStack: number;
    estimatedDropTime?: string;
  };
  bbheTags?: string[];        // Tags applied during routing
  attentionHeads?: string[];  // Which heads processed this
}

/**
 * VIBEBLOCK - Main API endpoint
 * Push anything to VibeChain
 */
export async function vibeBlock(
  request: VibeBlockRequest
): Promise<VibeBlockResponse> {
  
  console.log('\n⚡ VIBEBLOCK PRESSED → VIBECHAIN');
  console.log(`   Item: ${request.item.name}`);
  console.log(`   Type: ${request.item.type}`);
  
  try {
    // Auto-detect tier if not provided
    const tier = request.item.tier || autoDetectTier(request.item);
    
    // Auto-generate BBHE tags if not provided
    const bbheTags = request.bbheTags || autoGenerateBBHETags(request.item, tier);
    
    // Route through BBHE grammar system
    console.log(`   🏷️ BBHE Tags: ${bbheTags.join(', ')}`);
    const sequencedData = await routeWithTags(request.item.payload, bbheTags);
    
    // Create drop item
    const dropItem: Omit<BlockDropItem, 'id' | 'stagedAt'> = {
      itemType: request.item.type,
      tier,
      payload: request.item.payload,
      metadata: {
        name: request.item.name,
        description: request.item.description,
        size: JSON.stringify(request.item.payload).length,
        priority: request.options?.priority || 5
      }
    };
    
    // Stage in drop stack
    const staged = vibeChain.stageForDrop(dropItem);
    
    // Get stack status
    const stackStatus = vibeChain.getStackStatus();
    
    // Determine if immediate drop
    const isStandalone = ['CHAIRMAN', 'QUEEN', 'SEED', 'EDGE'].includes(tier);
    const forceImmediate = request.options?.immediate === true;
    
    let response: VibeBlockResponse;
    
    if (forceImmediate || isStandalone) {
      // Immediate drop
      console.log('🚀 Executing immediate drop to VibeChain...\n');
      
      const confirmation = await vibeChain.aiAssistedDrop(staged);
      const conf = Array.isArray(confirmation) ? confirmation[0] : confirmation;
      
      response = {
        success: conf.success,
        stagedId: staged.id,
        dropType: isStandalone ? 'STANDALONE' : 'IMMEDIATE',
        status: conf.success ? 'DROPPED' : 'FAILED',
        confirmation: conf,
        stackInfo: {
          position: 0,
          totalInStack: stackStatus.totalStaged
        },
        bbheTags,
        attentionHeads: extractAttentionHeadsFromTags(bbheTags)
      };
      
    } else {
      // Batched drop (staged for later)
      console.log('📚 Staged for batch drop\n');
      
      response = {
        success: true,
        stagedId: staged.id,
        dropType: 'BATCHED',
        status: 'STAGED',
        stackInfo: {
          position: stackStatus.archivalBatch.length,
          totalInStack: stackStatus.totalStaged,
          estimatedDropTime: estimateDropTime(stackStatus)
        },
        bbheTags,
        attentionHeads: extractAttentionHeadsFromTags(bbheTags)
      };
    }
    
    console.log(`✅ VibeBlock complete: ${response.status}\n`);
    return response;
    
  } catch (error) {
    console.error('❌ VibeBlock error:', error);
    
    return {
      success: false,
      dropType: 'BATCHED',
      status: 'FAILED',
      error: error instanceof Error ? error.message : String(error),
      stackInfo: {
        position: -1,
        totalInStack: vibeChain.getStackStatus().totalStaged
      }
    };
  }
}

// Legacy alias for backward compatibility
export const blockButton = vibeBlock;

/**
 * BATCH OPERATIONS
 */

// Process next drop in stack
export async function processNextDrop(): Promise<{
  processed: boolean;
  confirmations?: DropConfirmation | DropConfirmation[];
}> {
  const result = await vibeChain.dropNext();
  
  return {
    processed: result !== null,
    confirmations: result || undefined
  };
}

// Force batch drop now
export async function forceBatchDropNow(): Promise<{
  processed: boolean;
  count: number;
  confirmations?: DropConfirmation[];
}> {
  const confirmations = await vibeChain.forceBatchDrop();
  
  return {
    processed: confirmations !== null,
    count: confirmations?.length || 0,
    confirmations: confirmations || undefined
  };
}

/**
 * STATUS & MONITORING
 */

// Get current stack
export function getDropStack() {
  return vibeChain.getStackStatus();
}

// Get VibeChain status
export function getVibeChainStatus() {
  return vibeChain.getBlockchainStatus();
}

// Get drop history
export function getDropHistory(limit: number = 10) {
  return vibeChain.getDropHistory(limit);
}

// Clear stack (emergency)
export function clearDropStack() {
  return vibeChain.clearStack();
}

/**
 * HELPER FUNCTIONS
 */

function autoDetectTier(item: BlockButtonRequest['item']): NodeDropTier {
  const name = item.name.toLowerCase();
  
  // Major nodes = standalone
  if (name.includes('chairman')) return 'CHAIRMAN';
  if (name.includes('queen')) return 'QUEEN';
  if (name.includes('seed')) return 'SEED';
  if (name.includes('edge')) return 'EDGE';
  
  // Foundation
  if (name.includes('foundation') || name.includes('infrastructure')) {
    return 'FOUNDATION';
  }
  
  // Everything else = standard
  return 'STANDARD';
}

function estimateDropTime(stackStatus: ReturnType<typeof vibeChain.getStackStatus>): string {
  const threshold = stackStatus.threshold;
  const currentBatch = stackStatus.archivalBatch.length;
  const remaining = threshold - currentBatch;
  
  if (remaining <= 0) {
    return 'Next batch cycle (~1 min)';
  }
  
  // Rough estimate: 1 item every 30 seconds
  const estimatedMinutes = Math.ceil(remaining * 0.5);
  
  return `~${estimatedMinutes} min (when batch reaches ${threshold})`;
}

function autoGenerateBBHETags(
  item: VibeBlockRequest['item'],
  tier: NodeDropTier
): string[] {
  const tags: string[] = [];
  
  // Add type-based tags
  tags.push(`#NODES:VIBECHAIN:${tier}:${item.type.toUpperCase()}`);
  
  // Add deployment tags
  tags.push('#REALITY:DEPLOYMENT:VIBEBLOCK:PUSH');
  
  // Add tier-specific tags
  if (['CHAIRMAN', 'QUEEN', 'SEED', 'EDGE'].includes(tier)) {
    tags.push('#CORE:PROTECTED:SYNTHEVERSE:SHELL');
    tags.push('#INFRASTRUCTURE:ONCHAIN:IMMUTABLE:SECURE');
  } else {
    tags.push('#INFRASTRUCTURE:SUPPORTING:AVAILABLE:PUBLIC');
  }
  
  return tags;
}

function extractAttentionHeadsFromTags(tags: string[]): string[] {
  const heads: string[] = [];
  
  tags.forEach(tag => {
    const parsed = parseTag(tag);
    
    // Map layer to attention head
    const headMap: Record<number, string> = {
      1: 'core-foundation-head',
      2: 'protocol-sequencing-head',
      3: 'awareness-consciousness-head',
      4: 'infrastructure-coordination-head',
      5: 'node-management-head',
      6: 'experience-delivery-head',
      7: 'attention-streaming-head',
      8: 'reality-manifestation-head'
    };
    
    const head = headMap[parsed.layer];
    if (head && !heads.includes(head)) {
      heads.push(head);
    }
  });
  
  return heads;
}

/**
 * CONVENIENCE WRAPPERS - Quick drop functions
 */

export async function dropNode(
  name: string,
  tier: NodeDropTier,
  nodeData: any,
  immediate: boolean = false
): Promise<VibeBlockResponse> {
  return vibeBlock({
    item: {
      type: 'node',
      tier,
      name,
      payload: nodeData
    },
    options: { immediate }
  });
}

export async function dropVCHIP(
  name: string,
  vchipData: any,
  immediate: boolean = true
): Promise<VibeBlockResponse> {
  return vibeBlock({
    item: {
      type: 'vchip',
      tier: 'EDGE',
      name,
      payload: vchipData
    },
    options: { immediate }
  });
}

export async function dropKey(
  name: string,
  keyData: any,
  immediate: boolean = true
): Promise<VibeBlockResponse> {
  return vibeBlock({
    item: {
      type: 'key',
      tier: 'SEED',
      name,
      payload: keyData
    },
    options: { immediate }
  });
}

export async function dropProperty(
  name: string,
  propertyData: any
): Promise<VibeBlockResponse> {
  return vibeBlock({
    item: {
      type: 'property',
      name,
      payload: propertyData
    }
  });
}

export async function dropContract(
  name: string,
  contractData: any,
  priority: number = 8
): Promise<VibeBlockResponse> {
  return vibeBlock({
    item: {
      type: 'contract',
      tier: 'FOUNDATION',
      name,
      payload: contractData
    },
    options: { priority }
  });
}

export async function dropData(
  name: string,
  data: any
): Promise<VibeBlockResponse> {
  return vibeBlock({
    item: {
      type: 'data',
      name,
      payload: data
    }
  });
}
