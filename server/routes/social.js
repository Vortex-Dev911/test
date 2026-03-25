const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middlewares/auth');

// --- User Profile & Stats ---
router.get('/search', authenticateToken, async (req, res) => {
  const { q } = req.query; if (!q || q.length < 3) return res.json([]);
  try {
    const users = await db('users').where('username', 'like', `%${q}%`).orWhere('real_name', 'like', `%${q}%`).select('id', 'username', 'real_name', 'level').limit(10);
    res.json(users);
  } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
});

router.get('/profile/:userId', authenticateToken, async (req, res) => {
  try {
    const user = await db('users').where('users.id', req.params.userId).join('user_stats', 'users.id', '=', 'user_stats.user_id').first();
    if (!user) return res.status(404).json({ error: 'User not found' });
    delete user.password; res.json(user);
  } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
});

router.put('/profile', authenticateToken, async (req, res) => {
  const { realName, avatarUrl, isPrivate } = req.body;
  try {
    await db('users').where({ id: req.user.userId }).update({ real_name: realName, avatar_url: avatarUrl, is_private: isPrivate });
    res.json({ message: 'Profile updated successfully' });
  } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
});

router.get('/matches', authenticateToken, async (req, res) => {
  try {
    const matches = await db('match_history').where('p1_id', req.user.userId).orWhere('p2_id', req.user.userId).orderBy('played_at', 'desc').limit(10);
    res.json(matches);
  } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await db('users').join('user_stats', 'users.id', '=', 'user_stats.user_id').orderBy('user_stats.wins', 'desc').limit(10);
    res.json(leaderboard);
  } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
});

// --- Friends System ---
router.post('/friends/request', authenticateToken, async (req, res) => {
  const { friendId } = req.body; const userId = req.user.userId;
  if (userId === friendId) return res.status(400).json({ error: "You can't add yourself" });
  try {
    const u1 = Math.min(userId, friendId), u2 = Math.max(userId, friendId);
    const existing = await db('friends').where({ user_id1: u1, user_id2: u2 }).first();
    if (existing) return res.status(400).json({ error: 'Already exists' });
    await db('friends').insert({ user_id1: u1, user_id2: u2, status: 'pending' });
    res.json({ message: 'Friend request sent' });
  } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
});

router.post('/friends/accept', authenticateToken, async (req, res) => {
  const { friendId } = req.body; const u1 = Math.min(req.user.userId, friendId), u2 = Math.max(req.user.userId, friendId);
  try {
    await db('friends').where({ user_id1: u1, user_id2: u2 }).update({ status: 'accepted' });
    res.json({ message: 'Accepted' });
  } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
});

router.get('/friends/list', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const friends = await db('friends').where(function() { this.where('user_id1', userId).orWhere('user_id2', userId); }).andWhere('status', 'accepted')
      .join('users', function() { this.on('users.id', '=', 'friends.user_id1').andOn('friends.user_id1', '!=', userId).orOn('users.id', '=', 'friends.user_id2').andOn('friends.user_id2', '!=', userId); })
      .select('users.id', 'users.username', 'users.real_name', 'users.level');
    res.json(friends);
  } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
});

// --- Messaging System ---
router.post('/messages/send', authenticateToken, async (req, res) => {
  const { receiverId, content } = req.body;
  try {
    const [id] = await db('messages').insert({ sender_id: req.user.userId, receiver_id: receiverId, content });
    res.status(201).json({ id, message: 'Sent' });
  } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
});

router.get('/messages/:friendId', authenticateToken, async (req, res) => {
  const { friendId } = req.params; const userId = req.user.userId;
  try {
    const msgs = await db('messages').where(function() { this.where({ sender_id: userId, receiver_id: friendId }).orWhere({ sender_id: friendId, receiver_id: userId }); }).orderBy('created_at', 'asc');
    res.json(msgs);
  } catch (err) { res.status(500).json({ error: 'Internal Server Error' }); }
});

module.exports = router;
