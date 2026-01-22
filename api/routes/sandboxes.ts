/**
 * Sandboxes Routes
 * Handle enterprise sandboxes and team workspaces
 */

import express, { Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/sandboxes
 * List user's sandboxes
 */
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get sandboxes where user is owner or member
    const { data: ownedSandboxes } = await supabase
      .from('sandboxes')
      .select('*')
      .eq('owner_id', userId);

    const { data: memberSandboxes } = await supabase
      .from('sandbox_members')
      .select('sandbox_id')
      .eq('user_id', userId);

    const memberIds = memberSandboxes?.map(m => m.sandbox_id) || [];

    const { data: sharedSandboxes } = memberIds.length > 0 
      ? await supabase
          .from('sandboxes')
          .select('*')
          .in('id', memberIds)
      : { data: [] };

    res.json({
      owned: ownedSandboxes || [],
      shared: sharedSandboxes || []
    });
  } catch (error) {
    console.error('[SANDBOXES LIST ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch sandboxes' });
  }
});

/**
 * POST /api/sandboxes
 * Create new sandbox
 */
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, type = 'personal', isPublic = false } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Sandbox name required' });
    }

    const { data, error } = await supabase
      .from('sandboxes')
      .insert({
        owner_id: req.user!.id,
        name,
        description,
        type,
        is_public: isPublic
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ sandbox: data });
  } catch (error) {
    console.error('[SANDBOX CREATE ERROR]', error);
    res.status(500).json({ error: 'Failed to create sandbox' });
  }
});

/**
 * GET /api/sandboxes/:id
 * Get sandbox details
 */
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const { data: sandbox, error } = await supabase
      .from('sandboxes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !sandbox) {
      return res.status(404).json({ error: 'Sandbox not found' });
    }

    // Check access
    const isOwner = sandbox.owner_id === userId;
    const { data: membership } = await supabase
      .from('sandbox_members')
      .select('role')
      .eq('sandbox_id', id)
      .eq('user_id', userId)
      .single();

    if (!isOwner && !membership && !sandbox.is_public) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get members
    const { data: members } = await supabase
      .from('sandbox_members')
      .select('*, users(id, name, email, avatar_url)')
      .eq('sandbox_id', id);

    res.json({
      sandbox,
      members: members || [],
      userRole: isOwner ? 'owner' : membership?.role || 'viewer'
    });
  } catch (error) {
    console.error('[SANDBOX GET ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch sandbox' });
  }
});

export default router;
