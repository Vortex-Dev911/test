const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middlewares/auth');

// Send Friend Request
router.post('/request', authenticateToken, async (req, res) => {
    const { friendId } = req.body;
    const userId = req.user.userId;

    if (userId === friendId) return res.status(400).json({ error: "You can't add yourself" });

    try {
        const existing = await db('friends')
            .where({ user_id1: Math.min(userId, friendId), user_id2: Math.max(userId, friendId) })
            .first();

        if (existing) return res.status(400).json({ error: 'Request already exists or already friends' });

        await db('friends').insert({
            user_id1: Math.min(userId, friendId),
            user_id2: Math.max(userId, friendId),
            status: 'pending'
        });

        res.json({ message: 'Friend request sent' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Accept Friend Request
router.post('/accept', authenticateToken, async (req, res) => {
    const { friendId } = req.body;
    const userId = req.user.userId;

    try {
        await db('friends')
            .where({ user_id1: Math.min(userId, friendId), user_id2: Math.max(userId, friendId) })
            .update({ status: 'accepted' });

        res.json({ message: 'Friend request accepted' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Friends List
router.get('/list', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const friends = await db('friends')
            .where(function() {
                this.where('user_id1', userId).orWhere('user_id2', userId);
            })
            .andWhere('status', 'accepted')
            .join('users', function() {
                this.on('users.id', '=', 'friends.user_id1').andOn('friends.user_id1', '!=', userId)
                    .orOn('users.id', '=', 'friends.user_id2').andOn('friends.user_id2', '!=', userId);
            })
            .select('users.id', 'users.username', 'users.real_name', 'users.level');

        res.json(friends);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
