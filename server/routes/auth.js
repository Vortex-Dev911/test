const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

router.post('/signup', async (req, res) => {
    const { username, email, password, realName } = req.body;
    console.log('Signup attempt:', { username, email, realName });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [userId] = await db('users').insert({
            username,
            email,
            password: hashedPassword,
            real_name: realName,
            xp: 100
        });
        
        await db('user_stats').insert({ user_id: userId });
        
        console.log('Signup successful, userId:', userId);
        const token = jwt.sign({ userId, username }, SECRET_KEY, { expiresIn: '7d' });
        res.status(201).json({ token, username, userId });
    } catch (err) {
        console.error('Signup error:', err);
        if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Username or Email already exists' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', username);
    try {
        const user = await db('users').where({ username }).orWhere({ email: username }).first();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log('Invalid credentials for:', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        console.log('Login successful for:', username);
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '7d' });
        res.json({ token, username: user.username, userId: user.id });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
