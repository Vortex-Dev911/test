const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/all', async (req, res) => {
    try {
        const games = await db('games').select('*');
        res.json(games);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/record_match', async (req, res) => {
    const { p1_id, p2_id, game_id, winner_id } = req.body;
    try {
        await db.transaction(async trx => {
            await trx('match_history').insert({ p1_id, p2_id, game_id, winner_id });
            
            // Update stats
            await trx('user_stats').where({ user_id: p1_id }).increment('games_played', 1);
            if (p2_id) await trx('user_stats').where({ user_id: p2_id }).increment('games_played', 1);
            
            if (winner_id) {
                await trx('user_stats').where({ user_id: winner_id }).increment('wins', 1).increment('win_streak', 1);
                const loserId = (winner_id === p1_id) ? p2_id : p1_id;
                if (loserId) await trx('user_stats').where({ user_id: loserId }).increment('losses', 1).update('win_streak', 0);
            } else {
                await trx('user_stats').where({ user_id: p1_id }).increment('draws', 1);
                if (p2_id) await trx('user_stats').where({ user_id: p2_id }).increment('draws', 1);
            }
        });
        res.status(201).json({ message: 'Match recorded' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
