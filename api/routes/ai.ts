/**
 * AI Routes
 * AI-assisted endpoints for content analysis, recommendations, etc.
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
 * POST /api/ai/analyze
 * AI-powered content analysis (NSPFRNP Natural Scoring)
 */
router.post('/analyze', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { content, contentType = 'text' } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }

    // AI Analysis using NSPFRNP principles
    const analysis = await analyzeContent(content, contentType);

    res.json({
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[AI ANALYZE ERROR]', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

/**
 * POST /api/ai/recommend
 * AI-powered recommendations based on user preferences
 */
router.post('/recommend', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { category, limit = 10 } = req.body;
    const userId = req.user!.id;

    // Fetch user's qualified contributions
    const { data: userContributions } = await supabase
      .from('contributions')
      .select('category, tags')
      .eq('user_id', userId)
      .eq('status', 'qualified')
      .limit(20);

    // Fetch recommended contributions based on similar categories/tags
    const { data: recommendations } = await supabase
      .from('contributions')
      .select('id, title, description, category, tags, final_score')
      .eq('status', 'qualified')
      .neq('user_id', userId)
      .order('final_score', { ascending: false })
      .limit(limit);

    res.json({
      recommendations: recommendations || [],
      based_on: userContributions?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[AI RECOMMEND ERROR]', error);
    res.status(500).json({ error: 'Recommendation failed' });
  }
});

/**
 * POST /api/ai/chat
 * AI chat assistant for Queen Bee interactions
 */
router.post('/chat', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { message, queenId, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // AI chat response (integrate with your AI model here)
    const response = await generateQueenBeeResponse(message, queenId, context);

    res.json({
      response,
      queenId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[AI CHAT ERROR]', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

/**
 * POST /api/ai/score
 * Calculate NSPFRNP-based contribution score
 */
router.post('/score', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { contributionId } = req.body;

    if (!contributionId) {
      return res.status(400).json({ error: 'Contribution ID required' });
    }

    // Fetch contribution
    const { data: contribution } = await supabase
      .from('contributions')
      .select('*')
      .eq('id', contributionId)
      .single();

    if (!contribution) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    // Calculate scores
    const scores = await calculateNSPFRNPScores(contribution.content);

    // Update contribution with scores
    const { data: updated } = await supabase
      .from('contributions')
      .update({
        novelty_score: scores.novelty,
        density_score: scores.density,
        coherence_score: scores.coherence,
        alignment_score: scores.alignment,
        final_score: scores.final,
        status: scores.final >= 70 ? 'qualified' : 'unqualified',
        evaluated_at: new Date().toISOString()
      })
      .eq('id', contributionId)
      .select()
      .single();

    res.json({
      contribution: updated,
      scores,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[AI SCORE ERROR]', error);
    res.status(500).json({ error: 'Scoring failed' });
  }
});

// ============================================
// AI HELPER FUNCTIONS
// ============================================

/**
 * Analyze content using NSPFRNP principles
 */
async function analyzeContent(content: string, contentType: string) {
  // Natural protocol analysis
  const wordCount = content.split(/\s+/).length;
  const complexity = calculateComplexity(content);
  
  return {
    wordCount,
    complexity,
    contentType,
    extractedTopics: extractTopics(content),
    sentiment: analyzeSentiment(content),
    metadata: {
      hasCode: /```/.test(content),
      hasLinks: /https?:\/\//.test(content),
      hasMath: /\$.*\$/.test(content)
    }
  };
}

/**
 * Generate Queen Bee response
 */
async function generateQueenBeeResponse(message: string, queenId: string, context: any) {
  // Map Queen IDs to personalities
  const queenPersonalities: { [key: string]: string } = {
    '01': 'GENESIS - I am the origin, the first spark.',
    '02': 'HARMONY - I bring balance and natural flow.',
    '03': 'COORDINATOR - I respond to triggers, orchestrating naturally.',
    '04': 'IMMUTABLE - I lock truth in stone, forever.'
  };

  const personality = queenPersonalities[queenId] || 'I am a Queen Bee of the hive.';

  // Simple response generation (integrate with Claude/GPT here)
  return {
    text: `${personality}\n\nIn response to "${message}": I sense this trigger and respond naturally, aligned with NSPFRNP principles.`,
    queenId,
    personality,
    timestamp: new Date().toISOString()
  };
}

/**
 * Calculate NSPFRNP scores
 */
async function calculateNSPFRNPScores(content: string) {
  // Natural protocol scoring
  const novelty = Math.min(100, Math.random() * 100); // Replace with real AI model
  const density = Math.min(100, content.length / 100);
  const coherence = Math.min(100, 70 + Math.random() * 30);
  const alignment = Math.min(100, 60 + Math.random() * 40);
  
  const final = (novelty * 0.3 + density * 0.2 + coherence * 0.25 + alignment * 0.25);

  return {
    novelty: Number(novelty.toFixed(2)),
    density: Number(density.toFixed(2)),
    coherence: Number(coherence.toFixed(2)),
    alignment: Number(alignment.toFixed(2)),
    final: Number(final.toFixed(2))
  };
}

/**
 * Calculate text complexity
 */
function calculateComplexity(text: string): number {
  const avgWordLength = text.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / text.split(/\s+/).length;
  return Math.min(10, avgWordLength / 2);
}

/**
 * Extract topics from text
 */
function extractTopics(text: string): string[] {
  // Simple keyword extraction (replace with NLP model)
  const words = text.toLowerCase().match(/\b\w{5,}\b/g) || [];
  const frequency: { [key: string]: number } = {};
  
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
}

/**
 * Analyze sentiment
 */
function analyzeSentiment(text: string): string {
  // Simple sentiment analysis (replace with proper model)
  const positive = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'positive'];
  const negative = ['bad', 'poor', 'terrible', 'awful', 'negative'];
  
  const lowerText = text.toLowerCase();
  const positiveCount = positive.filter(word => lowerText.includes(word)).length;
  const negativeCount = negative.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

export default router;
