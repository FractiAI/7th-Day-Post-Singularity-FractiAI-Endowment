/**
 * Contributions Routes
 * Handle user contributions and content submissions
 */

import express, { Response } from 'express';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const router = express.Router();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/contributions
 * List contributions (public qualified or user's own)
 */
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;
    
    let query = supabase
      .from('contributions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status as string);
    } else {
      // Show only qualified contributions to non-authenticated users
      if (!req.user) {
        query = query.eq('status', 'qualified');
      }
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      contributions: data,
      total: count,
      limit: Number(limit),
      offset: Number(offset)
    });
  } catch (error) {
    console.error('[CONTRIBUTIONS LIST ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch contributions' });
  }
});

/**
 * GET /api/contributions/:id
 * Get single contribution
 */
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    // Check if user can view this contribution
    if (data.status !== 'qualified' && (!req.user || req.user.id !== data.user_id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ contribution: data });
  } catch (error) {
    console.error('[CONTRIBUTION GET ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch contribution' });
  }
});

/**
 * POST /api/contributions
 * Create new contribution
 */
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, content, contentType = 'text', category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    // Generate content hash for deduplication
    const contentHash = crypto.createHash('sha256').update(content).digest('hex');

    // Check for duplicate
    const { data: existing } = await supabase
      .from('contributions')
      .select('id')
      .eq('content_hash', contentHash)
      .single();

    if (existing) {
      return res.status(409).json({ 
        error: 'Duplicate content',
        existingId: existing.id 
      });
    }

    // Create contribution
    const { data, error } = await supabase
      .from('contributions')
      .insert({
        user_id: req.user!.id,
        title,
        description,
        content,
        content_type: contentType,
        content_hash: contentHash,
        category,
        tags,
        status: 'submitted'
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      contribution: data,
      message: 'Contribution submitted successfully' 
    });
  } catch (error) {
    console.error('[CONTRIBUTION CREATE ERROR]', error);
    res.status(500).json({ error: 'Failed to create contribution' });
  }
});

/**
 * PUT /api/contributions/:id
 * Update contribution (owner only)
 */
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, content, category, tags } = req.body;

    // Check ownership
    const { data: existing } = await supabase
      .from('contributions')
      .select('user_id, status')
      .eq('id', id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    if (existing.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (existing.status !== 'submitted') {
      return res.status(400).json({ error: 'Cannot edit evaluated contributions' });
    }

    // Update
    const updates: any = { updated_at: new Date().toISOString() };
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (content) {
      updates.content = content;
      updates.content_hash = crypto.createHash('sha256').update(content).digest('hex');
    }
    if (category) updates.category = category;
    if (tags) updates.tags = tags;

    const { data, error } = await supabase
      .from('contributions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ contribution: data });
  } catch (error) {
    console.error('[CONTRIBUTION UPDATE ERROR]', error);
    res.status(500).json({ error: 'Failed to update contribution' });
  }
});

/**
 * DELETE /api/contributions/:id
 * Delete contribution (owner only)
 */
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check ownership
    const { data: existing } = await supabase
      .from('contributions')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    if (existing.user_id !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { error } = await supabase
      .from('contributions')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Contribution deleted successfully' });
  } catch (error) {
    console.error('[CONTRIBUTION DELETE ERROR]', error);
    res.status(500).json({ error: 'Failed to delete contribution' });
  }
});

export default router;
