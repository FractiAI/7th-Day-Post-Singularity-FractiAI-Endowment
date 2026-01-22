/**
 * FractiAI Syntheverse Central API
 * AI-Assisted API for entire ecosystem
 * 
 * Serves: Web apps, Mobile apps, Third-party integrations
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';

// Import route modules
import authRoutes from './routes/auth';
import contributionsRoutes from './routes/contributions';
import sandboxesRoutes from './routes/sandboxes';
import chatRoutes from './routes/chat';
import aiRoutes from './routes/ai';
import analyticsRoutes from './routes/analytics';

// Environment variables
const PORT = process.env.PORT || 3001;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Initialize Express app
const app: Express = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet());

// CORS - Allow all ecosystem apps
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://*.vercel.app',
    'https://*.fractiai.com',
    process.env.NEXT_PUBLIC_WEBSITE_URL || ''
  ].filter(Boolean),
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'FractiAI Syntheverse API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'FractiAI Syntheverse Central API',
    version: '1.0.0',
    description: 'AI-assisted API for entire ecosystem',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      contributions: '/api/contributions',
      sandboxes: '/api/sandboxes',
      chat: '/api/chat',
      ai: '/api/ai',
      analytics: '/api/analytics',
      docs: '/api/docs'
    },
    powered_by: 'NSPFRNP - Nature\'s System Protocol'
  });
});

// ============================================
// API ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/contributions', contributionsRoutes);
app.use('/api/sandboxes', sandboxesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    available_endpoints: [
      '/api/auth',
      '/api/contributions',
      '/api/sandboxes',
      '/api/chat',
      '/api/ai',
      '/api/analytics'
    ]
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err.stack);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// START SERVER
// ============================================

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ============================================');
    console.log('🚀 FractiAI Syntheverse Central API');
    console.log('🚀 ============================================');
    console.log(`🚀 Server:      http://localhost:${PORT}`);
    console.log(`🚀 Health:      http://localhost:${PORT}/health`);
    console.log(`🚀 Database:    ${SUPABASE_URL}`);
    console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('🚀 ============================================');
    console.log('');
  });
}

export default app;
