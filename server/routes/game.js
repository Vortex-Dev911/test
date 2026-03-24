const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middlewares/auth');

router.get('/all', async (req, res) => {
    try {
        const games = await db('games').select('*');
        res.json(games);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/challenge', authenticateToken, async (req, res) => {
    const { friendId, gameId } = req.body;
    const userId = req.user.userId;
    try {
        const roomId = `room_${userId}_${friendId}_${Date.now()}`;
        await db('game_rooms').insert({
            id: roomId,
            host_id: userId,
            guest_id: friendId,
            game_id: gameId,
            status: 'waiting'
        });
        res.json({ roomId });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/record_match', async (req, res) => {
    const { p1_id, p2_id, game_id, winner_id } = req.body;
    try {
        await db.transaction(async trx => {
            // Insert match history
            await trx('match_history').insert({ 
                p1_id, 
                p2_id: p2_id || null, 
                game_id, 
                winner_id: winner_id === 'player' ? p1_id : (winner_id === 'bot' ? null : winner_id) 
            });
            
            // Update stats for Player 1
            const p1Stats = await trx('user_stats').where({ user_id: p1_id }).first();
            if (!p1Stats) {
                await trx('user_stats').insert({ user_id: p1_id, games_played: 1 });
            } else {
                await trx('user_stats').where({ user_id: p1_id }).increment('games_played', 1);
            }

            // Update stats for Player 2 (if exists and not bot)
            if (p2_id && p2_id !== 'bot') {
                const p2Stats = await trx('user_stats').where({ user_id: p2_id }).first();
                if (!p2Stats) {
                    await trx('user_stats').insert({ user_id: p2_id, games_played: 1 });
                } else {
                    await trx('user_stats').where({ user_id: p2_id }).increment('games_played', 1);
                }
            }

            // XP and Win/Loss logic
            if (winner_id === 'player') {
                // P1 Wins
                await trx('users').where({ id: p1_id }).increment('xp', 20);
                await trx('user_stats').where({ user_id: p1_id }).increment('wins', 1).increment('win_streak', 1);
                
                if (p2_id && p2_id !== 'bot') {
                    await trx('users').where({ id: p2_id }).decrement('xp', 15);
                    await trx('user_stats').where({ user_id: p2_id }).increment('losses', 1).update('win_streak', 0);
                }
            } else if (winner_id === 'bot' || (p2_id && winner_id === p2_id)) {
                // P1 Loses
                await trx('users').where({ id: p1_id }).decrement('xp', 15);
                await trx('user_stats').where({ user_id: p1_id }).increment('losses', 1).update('win_streak', 0);
                
                if (p2_id && p2_id !== 'bot') {
                    await trx('users').where({ id: p2_id }).increment('xp', 20);
                    await trx('user_stats').where({ user_id: p2_id }).increment('wins', 1).increment('win_streak', 1);
                }
            } else {
                // Draw
                await trx('users').where({ id: p1_id }).increment('xp', 5);
                await trx('user_stats').where({ user_id: p1_id }).increment('draws', 1);
                
                if (p2_id && p2_id !== 'bot') {
                    await trx('users').where({ id: p2_id }).increment('xp', 5);
                    await trx('user_stats').where({ user_id: p2_id }).increment('draws', 1);
                }
            }

            // Prevent XP from going below 0
            await trx('users').where('xp', '<', 0).update('xp', 0);

            // Level up logic: Level = floor(sqrt(xp / 100)) + 1 or similar
            // For simplicity: Level up every 1000 XP
            const user = await trx('users').where({ id: p1_id }).first();
            const newLevel = Math.floor(user.xp / 1000) + 1;
            if (newLevel > user.level) {
                await trx('users').where({ id: p1_id }).update('level', newLevel);
            }
        });
        res.status(201).json({ message: 'Match recorded and scores updated' });
    } catch (err) {
        console.error('Match record error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
