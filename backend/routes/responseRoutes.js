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

// Route handler for creating a response (POST /api/responses and POST /api/response)
const createResponseHandler = async (req, res) => {
  try {
    const { sessionId, selectedOption, twoDayRequests } = req.body;

    // Validation
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing sessionId' });
    }

    const validOptions = ['Tonight', '1 Day', '2 Days'];
    if (!selectedOption || !validOptions.includes(selectedOption)) {
      return res.status(400).json({
        success: false,
        message: `Invalid option selected. Must be one of: ${validOptions.join(', ')}`
      });
    }

    // Check 2-day limit server side for this session
    if (selectedOption === '2 Days') {
      const currentCount = await getTwoDayCountForSession(sessionId);
      if (currentCount >= 5) {
        return res.status(400).json({
          success: false,
          message: 'Limit of 5 requests for 2 Days reached for this session'
        });
      }
    }

    let countForRecord = twoDayRequests || 0;
    if (selectedOption === '2 Days') {
      const currentCount = await getTwoDayCountForSession(sessionId);
      countForRecord = currentCount + 1;
    }

    const newResponse = new Response({
      sessionId,
      selectedOption,
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
};

router.post('/responses', createResponseHandler);
router.post('/response', createResponseHandler);

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

// Admin Route handler (GET /api/responses or GET /api/admin/responses)
const getAdminResponsesHandler = async (req, res) => {
  try {
    const adminSecret = req.headers['x-admin-secret'] || req.query.secret;
    const configuredSecret = process.env.ADMIN_SECRET || 'apology-secret-123';

    if (!adminSecret || adminSecret !== configuredSecret) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid admin secret' });
    }

    const responses = await Response.find().sort({ createdAt: -1 });

    const totalResponses = responses.length;
    const tonightCount = responses.filter((r) => r.selectedOption === 'Tonight').length;
    const oneDayCount = responses.filter((r) => r.selectedOption === '1 Day').length;
    const twoDaysCount = responses.filter((r) => r.selectedOption === '2 Days').length;

    res.json({
      success: true,
      counts: {
        tonight: tonightCount,
        oneDay: oneDayCount,
        twoDays: twoDaysCount,
        total: totalResponses
      },
      metrics: {
        totalResponses,
        tonightCount,
        oneDayCount,
        twoDaysCount
      },
      responses
    });
  } catch (error) {
    console.error('Error fetching admin responses:', error);
    res.status(500).json({ success: false, message: 'Server error fetching responses' });
  }
};

router.get('/responses', getAdminResponsesHandler);
router.get('/admin/responses', getAdminResponsesHandler);

export default router;

