// backend/routes/user.js
import express from 'express';
import { getCurrentUserId } from './login'; // Adjust import path as needed

const router = express.Router();

router.get('/current-user-id', async (req, res) => {
    try {
        const userId = getCurrentUserId(); // Function to get current user ID
        res.json({ userId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;