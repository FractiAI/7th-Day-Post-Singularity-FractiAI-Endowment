/**
 * AUTHENTICATION API ROUTES
 * Google OAuth with Supabase
 * Express.js endpoints for auth flow
 */

import { Router, Request, Response } from 'express';
import { GoogleAuthSystem } from '../auth/google-auth-system.js';

export interface AuthAPIConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  redirectUrl: string;
}

export function createAuthAPI(config: AuthAPIConfig): Router {
  const router = Router();
  const googleAuth = new GoogleAuthSystem({
    supabaseUrl: config.supabaseUrl,
    supabaseAnonKey: config.supabaseAnonKey,
    redirectUrl: config.redirectUrl
  });

  /**
   * POST /api/auth/google/signin
   * Initiate Google sign-in flow
   */
  router.post('/google/signin', async (req: Request, res: Response) => {
    try {
      const { url, provider } = await googleAuth.signInWithGoogle();
      
      res.json({
        success: true,
        url,
        provider
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Sign-in failed'
      });
    }
  });

  /**
   * POST /api/auth/google/signup
   * Initiate Google sign-up flow (same as sign-in for OAuth)
   */
  router.post('/google/signup', async (req: Request, res: Response) => {
    try {
      const { url, provider } = await googleAuth.signUpWithGoogle();
      
      res.json({
        success: true,
        url,
        provider
      });
    } catch (error) {
      console.error('Google sign-up error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Sign-up failed'
      });
    }
  });

  /**
   * POST /api/auth/callback
   * Handle OAuth callback after Google consent
   */
  router.post('/callback', async (req: Request, res: Response) => {
    try {
      const user = await googleAuth.handleOAuthCallback();
      
      if (!user) {
        throw new Error('Failed to authenticate user');
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          tier: user.tier,
          octave: user.octave,
          synthBalance: user.synthBalance
        }
      });
    } catch (error) {
      console.error('Auth callback error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      });
    }
  });

  /**
   * GET /api/auth/user
   * Get current authenticated user
   */
  router.get('/user', async (req: Request, res: Response) => {
    try {
      const user = await googleAuth.getCurrentUser();
      
      if (!user) {
        res.json({
          success: true,
          user: null
        });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          tier: user.tier,
          octave: user.octave,
          synthBalance: user.synthBalance,
          stripeCustomerId: user.stripeCustomerId,
          walletAddress: user.walletAddress
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user'
      });
    }
  });

  /**
   * POST /api/auth/signout
   * Sign out current user
   */
  router.post('/signout', async (req: Request, res: Response) => {
    try {
      await googleAuth.signOut();
      
      res.json({
        success: true,
        message: 'Signed out successfully'
      });
    } catch (error) {
      console.error('Sign out error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Sign out failed'
      });
    }
  });

  /**
   * PUT /api/auth/user/tier
   * Update user tier (after purchase)
   */
  router.put('/user/tier', async (req: Request, res: Response) => {
    try {
      const { userId, tier, octave, stripeCustomerId } = req.body;

      if (!userId || !tier || typeof octave !== 'number') {
        res.status(400).json({
          success: false,
          error: 'userId, tier, and octave are required'
        });
        return;
      }

      await googleAuth.updateUserTier(userId, tier, octave, stripeCustomerId);
      
      res.json({
        success: true,
        tier,
        octave
      });
    } catch (error) {
      console.error('Update tier error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update tier'
      });
    }
  });

  /**
   * PUT /api/auth/user/synth
   * Update user SYNTH balance
   */
  router.put('/user/synth', async (req: Request, res: Response) => {
    try {
      const { userId, amount, operation } = req.body;

      if (!userId || typeof amount !== 'number' || !operation) {
        res.status(400).json({
          success: false,
          error: 'userId, amount, and operation are required'
        });
        return;
      }

      if (!['add', 'subtract', 'set'].includes(operation)) {
        res.status(400).json({
          success: false,
          error: 'operation must be add, subtract, or set'
        });
        return;
      }

      const newBalance = await googleAuth.updateSynthBalance(userId, amount, operation);
      
      res.json({
        success: true,
        newBalance
      });
    } catch (error) {
      console.error('Update SYNTH balance error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update balance'
      });
    }
  });

  /**
   * PUT /api/auth/user/wallet
   * Link wallet address to user
   */
  router.put('/user/wallet', async (req: Request, res: Response) => {
    try {
      const { userId, walletAddress } = req.body;

      if (!userId || !walletAddress) {
        res.status(400).json({
          success: false,
          error: 'userId and walletAddress are required'
        });
        return;
      }

      await googleAuth.linkWalletAddress(userId, walletAddress);
      
      res.json({
        success: true,
        walletAddress
      });
    } catch (error) {
      console.error('Link wallet error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to link wallet'
      });
    }
  });

  /**
   * GET /api/auth/user/:email
   * Get user by email
   */
  router.get('/user/:email', async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const user = await googleAuth.getUserByEmail(email);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          tier: user.tier,
          octave: user.octave,
          synthBalance: user.synthBalance
        }
      });
    } catch (error) {
      console.error('Get user by email error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user'
      });
    }
  });

  /**
   * POST /api/auth/user/stripe
   * Link Stripe customer ID to user
   */
  router.post('/user/stripe', async (req: Request, res: Response) => {
    try {
      const { userId, stripeCustomerId } = req.body;

      if (!userId || !stripeCustomerId) {
        res.status(400).json({
          success: false,
          error: 'userId and stripeCustomerId are required'
        });
        return;
      }

      await googleAuth.linkStripeCustomer(userId, stripeCustomerId);
      
      res.json({
        success: true,
        stripeCustomerId
      });
    } catch (error) {
      console.error('Link Stripe customer error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to link Stripe customer'
      });
    }
  });

  return router;
}
