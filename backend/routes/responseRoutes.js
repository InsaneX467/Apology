import express from 'express';
import Response from '../models/Response.js';

const router = express.Router();

// Helper to count 2-day selections for a session
const getTwoDayCountForSession = async (sessionId) => {
  const count = await Response.countDocuments({
    sessionId,
    selectedOption: '2 Days'
  });
  return count;
};

// GET /api/session-count?sessionId=xxx
router.get('/session-count', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID required' });
    }
    const count = await getTwoDayCountForSession(sessionId);
    res.json({ success: true, twoDayCount: count });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/response
router.post('/response', async (req, res) => {
  try {
    const { sessionId, selectedOption, selectedGift, twoDayRequests } = req.body;

    // Validation
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing session ID' });
    }

    if (!selectedOption || typeof selectedOption !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid option selected' });
    }

    // Check 2-day limit server side for this session
    if (selectedOption === '2 Days' || selectedOption.includes('2 Days')) {
      const currentCount = await getTwoDayCountForSession(sessionId);
      if (currentCount >= 5) {
        return res.status(400).json({
          success: false,
          message: '2-day option limit reached for this session'
        });
      }
    }

    // Determine count for record
    let countForRecord = twoDayRequests || 0;
    if (selectedOption === '2 Days' || selectedOption.includes('2 Days')) {
      const currentCount = await getTwoDayCountForSession(sessionId);
      countForRecord = currentCount + 1;
    }

    const newResponse = new Response({
      sessionId,
      selectedOption,
      selectedGift: selectedGift || '',
      twoDayRequests: countForRecord
    });

    await newResponse.save();

    res.status(201).json({
      success: true,
      message: 'Response recorded successfully',
      data: newResponse
    });
  } catch (error) {
    console.error('Error recording response:', error);
    res.status(500).json({ success: false, message: 'Server error saving response' });
  }
});

// GET /api/admin/responses (Protected by ADMIN_SECRET)
router.get('/admin/responses', async (req, res) => {
  try {
    const adminSecret = req.headers['x-admin-secret'] || req.query.secret;
    const configuredSecret = process.env.ADMIN_SECRET || 'apology-secret-123';

    if (!adminSecret || adminSecret !== configuredSecret) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid admin secret' });
    }

    const responses = await Response.find().sort({ createdAt: -1 });

    const totalResponses = responses.length;
    const twoDayRequestsTotal = responses.filter((r) => r.selectedOption === '2 Days').length;

    res.json({
      success: true,
      metrics: {
        totalResponses,
        twoDayRequestsTotal
      },
      responses
    });
  } catch (error) {
    console.error('Error fetching admin responses:', error);
    res.status(500).json({ success: false, message: 'Server error fetching responses' });
  }
});

export default router;
