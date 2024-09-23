/*

Used expose the current user's id in order for it to be retrieved and returned in a .json format.
It is used by src/backend/Chatbot/server.py to retrieve the token.

*/

import express from 'express';
import { getCurrentUserId } from './login'; 

const router = express.Router();

router.get('/current-user-id', async (req, res) => { // listens on this route, and if it detects a 'GET' request, it will execute the lines inside
    try {
        const userId = getCurrentUserId(); 
        res.json({ userId }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;