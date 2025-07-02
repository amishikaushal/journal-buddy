import express from 'express';
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();

router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    const response = await geminiResponse(message);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;