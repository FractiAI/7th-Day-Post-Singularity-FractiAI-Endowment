/**
 * Chat Routes
 * Handle real-time chat and messaging
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
 * GET /api/chat/rooms
 * List user's chat rooms
 */
router.get('/rooms', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get rooms where user is a participant
    const { data: participations } = await supabase
      .from('chat_participants')
      .select('room_id, status, last_read_at')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (!participations || participations.length === 0) {
      return res.json({ rooms: [] });
    }

    const roomIds = participations.map(p => p.room_id);

    const { data: rooms } = await supabase
      .from('chat_rooms')
      .select('*')
      .in('id', roomIds);

    res.json({ rooms: rooms || [] });
  } catch (error) {
    console.error('[CHAT ROOMS ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
});

/**
 * GET /api/chat/rooms/:roomId/messages
 * Get messages for a room
 */
router.get('/rooms/:roomId/messages', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, before } = req.query;
    const userId = req.user!.id;

    // Check if user is participant
    const { data: participant } = await supabase
      .from('chat_participants')
      .select('status')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .single();

    if (!participant || participant.status !== 'active') {
      return res.status(403).json({ error: 'Access denied' });
    }

    let query = supabase
      .from('chat_messages')
      .select('*, users(id, name, avatar_url)')
      .eq('room_id', roomId)
      .eq('deleted', false)
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (before) {
      query = query.lt('created_at', before as string);
    }

    const { data: messages, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ messages: messages || [] });
  } catch (error) {
    console.error('[CHAT MESSAGES ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * POST /api/chat/rooms/:roomId/messages
 * Send message to room
 */
router.post('/rooms/:roomId/messages', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { roomId } = req.params;
    const { content, messageType = 'text', imageUrl, fileUrl, fileName } = req.body;
    const userId = req.user!.id;

    if (!content) {
      return res.status(400).json({ error: 'Message content required' });
    }

    // Check if user is participant
    const { data: participant } = await supabase
      .from('chat_participants')
      .select('status')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .single();

    if (!participant || participant.status !== 'active') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create message
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        content,
        message_type: messageType,
        image_url: imageUrl,
        file_url: fileUrl,
        file_name: fileName
      })
      .select('*, users(id, name, avatar_url)')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message });
  } catch (error) {
    console.error('[CHAT SEND MESSAGE ERROR]', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
