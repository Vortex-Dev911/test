const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middlewares/auth');

router.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q || q.length < 3) return res.json([]);
    try {
        const users = await db('users')
            .where('username', 'like', `%${q}%`)
            .orWhere('real_name', 'like', `%${q}%`)
            .select('id', 'username', 'real_name', 'level')
            .limit(10);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/profile/:userId', async (req, res) => {
    try {
        const user = await db('users')
            .where('users.id', req.params.userId)
            .join('user_stats', 'users.id', '=', 'user_stats.user_id')
            .first();
        if (!user) return res.status(404).json({ error: 'User not found' });
        delete user.password;
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/profile', authenticateToken, async (req, res) => {
    const { realName, avatarUrl, isPrivate } = req.body;
    const userId = req.user.userId;
    try {
        await db('users')
            .where({ id: userId })
            .update({ 
                real_name: realName, 
                avatar_url: avatarUrl, 
                is_private: isPrivate 
            });
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/matches', authenticateToken, async (req, res) => {
    try {
        const matches = await db('match_history')
            .where('p1_id', req.user.userId)
            .orWhere('p2_id', req.user.userId)
            .orderBy('played_at', 'desc')
            .limit(10);
        res.json(matches);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await db('users')
            .join('user_stats', 'users.id', '=', 'user_stats.user_id')
            .orderBy('user_stats.wins', 'desc')
            .limit(10);
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
