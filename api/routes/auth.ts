/**
 * Authentication Routes
 * Handle user authentication and profile management
 */

import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user!.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

/**
 * PUT /api/auth/me
 * Update current user profile
 */
router.put('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar_url } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({
        name,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.user!.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ user: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * POST /api/auth/verify
 * Verify JWT token
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ 
        valid: false, 
        error: 'Invalid token' 
      });
    }

    res.json({ 
      valid: true, 
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;
