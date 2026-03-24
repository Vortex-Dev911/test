module.exports = (io) => {
    const onlinePlayers = new Map(); // username -> socketId
    const userSockets = new Map();   // userId -> socketId

    io.on('connection', (socket) => {
        socket.on('player_online', (userData) => {
            const { userId, username } = userData;
            onlinePlayers.set(username, socket.id);
            userSockets.set(userId, socket.id);
            io.emit('online_players_list', Array.from(onlinePlayers.keys()));
        });

        socket.on('disconnect', () => {
            for (let [username, id] of onlinePlayers.entries()) {
                if (id === socket.id) {
                    onlinePlayers.delete(username);
                    break;
                }
            }
            for (let [userId, id] of userSockets.entries()) {
                if (id === socket.id) {
                    userSockets.delete(userId);
                    break;
                }
            }
            io.emit('online_players_list', Array.from(onlinePlayers.keys()));
        });

        // Chat Messaging
        socket.on('join_chat', (userId) => {
            socket.join(`user_${userId}`);
        });

        socket.on('send_message', (data) => {
            const { receiverId } = data;
            io.to(`user_${receiverId}`).emit('receive_message', data);
        });

        // Game Challenges
        socket.on('challenge_player', (data) => {
            const { challenger, challenged, gameId } = data;
            const challengedSocketId = onlinePlayers.get(challenged);
            if (challengedSocketId) {
                io.to(challengedSocketId).emit('receive_challenge', { challenger, gameId });
            }
        });

        socket.on('accept_challenge', (data) => {
            const { challenger, challenged, gameId } = data;
            const challengerSocketId = onlinePlayers.get(challenger);
            if (challengerSocketId) {
                const roomId = `room_${challenger}_${challenged}_${Date.now()}`;
                socket.join(roomId);
                io.to(challengerSocketId).emit('challenge_accepted', { challenged, gameId, roomId });
                socket.emit('start_game', { opponent: challenger, gameId, roomId, playerType: 'O' });
            }
        });

        socket.on('join_game_room', (roomId) => {
            socket.join(roomId);
        });

        socket.on('game_move', (data) => {
            const { roomId, move, playerType } = data;
            socket.to(roomId).emit('opponent_move', { move, playerType });
        });

        socket.on('game_over', (data) => {
            const { roomId, winner, loser } = data;
            io.to(roomId).emit('game_ended', { winner, loser });
        });
    });
};
