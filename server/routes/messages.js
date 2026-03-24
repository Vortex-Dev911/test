const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middlewares/auth');

// Send Message
router.post('/send', authenticateToken, async (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.user.userId;

    try {
        const [messageId] = await db('messages').insert({
            sender_id: senderId,
            receiver_id: receiverId,
            content
        });

        res.status(201).json({ messageId, message: 'Message sent' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Messages
router.get('/:friendId', authenticateToken, async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user.userId;

    try {
        const messages = await db('messages')
            .where(function() {
                this.where({ sender_id: userId, receiver_id: friendId })
                    .orWhere({ sender_id: friendId, receiver_id: userId });
            })
            .orderBy('created_at', 'asc');

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
