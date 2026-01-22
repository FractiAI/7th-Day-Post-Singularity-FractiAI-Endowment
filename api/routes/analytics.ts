/**
 * Analytics Routes
 * System metrics and user analytics
 */

import express, { Response } from 'express';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/analytics/dashboard
 * Get user dashboard analytics
 */
router.get('/dashboard', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get user's contribution stats
    const { data: contributions, count: totalContributions } = await supabase
      .from('contributions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    const qualified = contributions?.filter(c => c.status === 'qualified').length || 0;
    const pending = contributions?.filter(c => c.status === 'submitted').length || 0;

    // Get SYNTH balance
    const { data: userData } = await supabase
      .from('users')
      .select('synth_balance, tier, octave')
      .eq('id', userId)
      .single();

    // Get allocations
    const { data: allocations } = await supabase
      .from('allocations')
      .select('amount, metal_class')
      .eq('user_id', userId);

    const totalSynth = allocations?.reduce((sum, a) => sum + Number(a.amount), 0) || 0;

    res.json({
      contributions: {
        total: totalContributions || 0,
        qualified,
        pending
      },
      synth: {
        balance: userData?.synth_balance || 0,
        earned: totalSynth
      },
      user: {
        tier: userData?.tier || 'sandbox',
        octave: userData?.octave || 0
      }
    });
  } catch (error) {
    console.error('[ANALYTICS DASHBOARD ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

/**
 * GET /api/analytics/system
 * Get system-wide analytics (admin only)
 */
router.get('/system', requireAuth, requireRole(['admin', 'operator']), async (req: AuthRequest, res: Response) => {
  try {
    // Total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Total contributions
    const { count: totalContributions } = await supabase
      .from('contributions')
      .select('*', { count: 'exact', head: true });

    // Qualified contributions
    const { count: qualifiedContributions } = await supabase
      .from('contributions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'qualified');

    // Total sandboxes
    const { count: totalSandboxes } = await supabase
      .from('sandboxes')
      .select('*', { count: 'exact', head: true });

    // Total SYNTH allocated
    const { data: allocations } = await supabase
      .from('allocations')
      .select('amount');

    const totalSynth = allocations?.reduce((sum, a) => sum + Number(a.amount), 0) || 0;

    res.json({
      users: totalUsers || 0,
      contributions: {
        total: totalContributions || 0,
        qualified: qualifiedContributions || 0
      },
      sandboxes: totalSandboxes || 0,
      synth: {
        totalAllocated: totalSynth
      }
    });
  } catch (error) {
    console.error('[ANALYTICS SYSTEM ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch system analytics' });
  }
});

export default router;
