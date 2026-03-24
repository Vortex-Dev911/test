# GameHub Pro - Comprehensive Information

## Project Overview
GameHub Pro is a professional-grade, full-stack multiplayer gaming portal built with a modern tech stack. It features a dark-mode UI, real-time social interactions, and a variety of integrated game engines.

## File Structure

### Frontend (`/client`)
- `/src/components`: Reusable UI components (Modals, Backgrounds, Protected Routes).
- `/src/context`: Global state management (Authentication).
- `/src/games`: Individual game engine components (Chess, Poker, Snake, etc.).
- `/src/layouts`: Main application layouts (Navigation, Footer).
- `/src/pages`: Main view components (Dashboard, Leaderboard, Friends, Profile).
- `/src/index.css`: Tailwind CSS 4.0 configuration and global styles.

### Backend (`/server`)
- `/routes`: Express API routes for Auth, Friends, Games, Messages, and User Profiles.
- `/migrations`: SQL database schema definitions using Knex.
- `/sockets`: Real-time event handling using Socket.io (Chat, Challenges, Notifications).
- `server.js`: Main entry point and server configuration.
- `db.js`: Knex database connection and configuration.

## Core Systems

### 1. Authentication & Profile System
- Uses JWT (JSON Web Tokens) for secure session management.
- Passwords are hashed using `bcryptjs`.
- `AuthContext` on the frontend manages user state and persistence via `localStorage`.
- **Profiles**: Customizable avatar URLs, real name editing, and privacy settings.

### 2. Scoring & Ranking System
- Players start with a base score of 100 XP and level 1.
- **Scoring Logic**:
  - Win: +20 XP
  - Loss: -15 XP (Protected floor at 0 XP)
  - Draw: +5 XP
- **Tiered Ranking**:
  - 1st Place: **GOD** (Animated gold badge + special effects)
  - 2nd-100th: **MASTER** (Platinum styling)
  - 101st-1000th: **PLATINUM** (Diamond styling)
  - 1001st-10000th: **DIAMOND** (Pattern continues)
- **Leveling**: Players level up every 1000 XP points.

### 3. Game Integration
All games are integrated via a standard interface:
- **Game Layout**: Viewport centered with smooth scale-in transitions and auto-scroll.
- **Logic**: Each game component accepts an `onWin` callback which reports `player`, `bot`, or `draw`.
- **Difficulty**: Support for Easy, Medium, and Hard modes (handled by game engines).
- **Validation**: Server-side validation for match recording and XP updates.

### 4. Real-time Social Features
- **Messaging**: Real-time private chat with typing indicators and read receipts.
- **Friends**: Real-time request/accept notifications and private game room challenges.
- **Search**: Dynamic username search with profile previews and level displays.
- **Invitation Links**: One-click copy invitation links for sharing externally.

## Database Schema (Key Tables)

### `users`
- `id`, `username`, `email`, `password`, `real_name`, `level`, `xp`, `avatar_url`, `is_private`, `created_at`

### `user_stats`
- `user_id`, `games_played`, `wins`, `losses`, `draws`, `win_streak`

### `match_history`
- `id`, `p1_id`, `p2_id`, `game_id`, `winner_id`, `played_at`

### `messages`
- `id`, `sender_id`, `receiver_id`, `content`, `is_read`, `created_at`

## Development Guidelines

### Editing Game Logic
1. Locate the game engine in `client/src/games/[GameName].jsx`.
2. Ensure any outcome calls `onWin(winner)` with the appropriate identifier.
3. Use the `GameOutcomeModal` for visual feedback (handled automatically in `Gameplay.jsx`).

### UI & Styling
- Built with **Tailwind CSS 4.0**.
- Use the `@theme` block in `index.css` for custom colors and variables.
- Maintain the dark-mode aesthetic (Default).

## Troubleshooting
- **Port Conflicts**: Ensure port 3000 (Backend) and 5173/5175 (Frontend) are available.
- **Database**: Run `knex migrate:latest` to apply schema changes.
- **Sockets**: Check CORS settings in `server.js` if real-time features fail to connect.

## Deployment (Vercel)

The project is configured for a Vercel Monorepo deployment.

### **Steps to Deploy:**
1.  **Repository**: Push the entire project to a GitHub repository.
2.  **Vercel Project**: Connect the repository to a new Vercel project.
3.  **Root Directory**: Set the root directory to the project root (where `vercel.json` is located).
4.  **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed Vercel project (e.g., `https://your-gamehub.vercel.app`).
    - `VITE_SOCKET_URL`: (Note: Socket.io is not supported on Vercel Serverless. For real-time features, deploy the `/server` directory to Render/Railway and provide that URL here).
    - `DATABASE_URL`: If using a cloud database (PostgreSQL), provide the connection string here.
5.  **Database**: Vercel does not support SQLite as it is read-only. For production, you **must** use a cloud SQL database (like Supabase, Neon, or PlanetScale) and update `server/db.js` accordingly.

### **Vercel Limitations:**
- **WebSockets**: Socket.io will not work on Vercel Serverless Functions. Real-time chat and game invitations require a dedicated server (Node.js/Express) or a service like Pusher.
- **SQLite**: Filesystem is ephemeral. All database data will be lost on redeploy. Use a cloud database for persistence.
