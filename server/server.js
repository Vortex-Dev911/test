require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const socialRoutes = require('./routes/social');
const gameRoutes = require('./routes/game');

app.use('/api/auth', authRoutes);
app.use('/api/users', socialRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/friends', socialRoutes); // Legacy support
app.use('/api/messages', socialRoutes); // Legacy support

// Socket.io
if (process.env.NODE_ENV !== 'production') {
    require('./sockets')(io);
}

// Database migration check (Only in local dev)
if (process.env.NODE_ENV !== 'production') {
    db.migrate.latest()
        .then(() => {
            console.log('Database migrated successfully');
            server.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
        .catch(err => {
            console.error('Database migration failed:', err);
            process.exit(1);
        });
}

// Export app for Vercel
module.exports = server;

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});
