/**
 * Authentication Middleware
 * Validates JWT tokens from Supabase Auth
 */

import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Verify JWT token and attach user to request
 */
export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // Fetch user details from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', user.id)
      .single();

    if (userError) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch user details'
      });
    }

    // Attach user to request
    req.user = userData;

    next();
  } catch (error) {
    console.error('[AUTH ERROR]', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
};

/**
 * Require specific role
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without user
    }

    const token = authHeader.substring(7);

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!error && user) {
      const { data: userData } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('id', user.id)
        .single();

      if (userData) {
        req.user = userData;
      }
    }

    next();
  } catch (error) {
    // Continue without user on error
    next();
  }
};
