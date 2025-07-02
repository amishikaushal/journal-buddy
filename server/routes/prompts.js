import express from 'express';
import { getRandomPrompt, getAllPrompts } from '../controllers/promptController';

const router = express.Router();

router.get('/random', getRandomPrompt);
router.get('/', getAllPrompts);

export default router;