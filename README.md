# GameHub Pro - Modern Multiplayer Gaming Platform

A full-stack gaming portal built with Vite, React, Express, and SQL (Knex/PostgreSQL).

## Features

- **Modern Dark UI**: Pixel-perfect design using Tailwind CSS and Framer Motion.
- **Real-time Multiplayer**: Powered by Socket.io for instant interaction.
- **Modular Games**: Tic-Tac-Toe, Rock Paper Scissors, and more to come.
- **Comprehensive Backend**: SQL database (SQLite for local, PostgreSQL for production).
- **Authentication**: JWT-based login and signup.
- **Stats & Rankings**: Track wins, losses, XP, and global leaderboard.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Axios, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io, Knex.js, SQLite3 (Dev), PostgreSQL (Prod).
- **Authentication**: JWT, Bcrypt.js.

## Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
# Migrations will run automatically on start
npm start
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```env
PORT=3000
JWT_SECRET=your_secret_key
DATABASE_URL=postgres://user:password@localhost:5432/gamehub
NODE_ENV=development
```

## Database Schema
- **users**: id, username, email, password, level, xp.
- **games**: id, name, icon, category.
- **user_stats**: wins, losses, draws, win_streak.
- **match_history**: p1, p2, game, winner.
- **friends**: user1, user2, status.
