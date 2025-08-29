const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
require('dotenv').config()

// Log environment status
console.log('🔧 Environment Configuration:')
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
console.log(`   PORT: ${process.env.PORT || 3001}`)
console.log(`   OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✓ Configured' : '✗ Missing'}`)
console.log(`   Firebase Project: ${process.env.VITE_FIREBASE_PROJECT_ID || 'Not configured'}`)

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
})

const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Store active games and players
const activeGames = new Map()
const activePlayers = new Map()

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`)
    
    // Player joins matchmaking queue
    socket.on('join_queue', (playerData) => {
        activePlayers.set(socket.id, {
            ...playerData,
            socketId: socket.id,
            inQueue: true,
            inGame: false
        })
        
        console.log(`Player ${playerData.name} joined queue`)
        
        // Try to find a match
        findMatch(socket.id)
    })
    
    // Player leaves queue
    socket.on('leave_queue', () => {
        const player = activePlayers.get(socket.id)
        if (player) {
            player.inQueue = false
            console.log(`Player ${player.name} left queue`)
        }
    })
    
    // Game actions
    socket.on('play_card', (gameData) => {
        handleGameAction(socket.id, 'play_card', gameData)
    })
    
    socket.on('attack', (gameData) => {
        handleGameAction(socket.id, 'attack', gameData)
    })
    
    socket.on('end_turn', (gameData) => {
        handleGameAction(socket.id, 'end_turn', gameData)
    })
    
    socket.on('forfeit', (gameData) => {
        handleGameAction(socket.id, 'forfeit', gameData)
    })
    
    // Disconnect handling
    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`)
        
        const player = activePlayers.get(socket.id)
        if (player && player.gameId) {
            // Handle player disconnection from active game
            handlePlayerDisconnect(socket.id, player.gameId)
        }
        
        activePlayers.delete(socket.id)
    })
})

function findMatch(playerId) {
    const currentPlayer = activePlayers.get(playerId)
    if (!currentPlayer || !currentPlayer.inQueue) return
    
    // Find another player in queue
    for (const [socketId, player] of activePlayers) {
        if (socketId !== playerId && player.inQueue && !player.inGame) {
            // Match found!
            startGame(playerId, socketId)
            return
        }
    }
    
    // No match found, player stays in queue
    io.to(playerId).emit('queue_status', { 
        status: 'waiting',
        message: 'Searching for opponent...'
    })
}

function startGame(player1Id, player2Id) {
    const player1 = activePlayers.get(player1Id)
    const player2 = activePlayers.get(player2Id)
    
    if (!player1 || !player2) return
    
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Update player states
    player1.inQueue = false
    player1.inGame = true
    player1.gameId = gameId
    
    player2.inQueue = false
    player2.inGame = true
    player2.gameId = gameId
    
    // Create game state
    const gameState = {
        id: gameId,
        player1: {
            id: player1Id,
            name: player1.name,
            deck: player1.deck || []
        },
        player2: {
            id: player2Id,
            name: player2.name,
            deck: player2.deck || []
        },
        currentPlayer: player1Id,
        turn: 1,
        phase: 'main',
        createdAt: new Date()
    }
    
    activeGames.set(gameId, gameState)
    
    // Notify both players
    io.to(player1Id).emit('game_started', {
        gameId,
        opponent: { name: player2.name },
        yourTurn: true
    })
    
    io.to(player2Id).emit('game_started', {
        gameId,
        opponent: { name: player1.name },
        yourTurn: false
    })
    
    console.log(`Game started: ${player1.name} vs ${player2.name}`)
}

function handleGameAction(playerId, action, data) {
    const player = activePlayers.get(playerId)
    if (!player || !player.gameId) return
    
    const game = activeGames.get(player.gameId)
    if (!game) return
    
    // Validate it's the player's turn (except for forfeit)
    if (action !== 'forfeit' && game.currentPlayer !== playerId) {
        io.to(playerId).emit('game_error', { message: 'Not your turn' })
        return
    }
    
    // Get opponent
    const opponentId = game.player1.id === playerId ? game.player2.id : game.player1.id
    
    // Handle different actions
    switch (action) {
        case 'play_card':
            // Broadcast card play to opponent
            io.to(opponentId).emit('opponent_played_card', {
                cardId: data.cardId,
                targetId: data.targetId
            })
            break
            
        case 'attack':
            // Broadcast attack to opponent
            io.to(opponentId).emit('opponent_attack', {
                attackerId: data.attackerId,
                targetId: data.targetId
            })
            break
            
        case 'end_turn':
            // Switch turns
            game.currentPlayer = opponentId
            game.turn++
            
            io.to(playerId).emit('turn_ended', { yourTurn: false })
            io.to(opponentId).emit('turn_started', { yourTurn: true })
            break
            
        case 'forfeit':
            // End game
            endGame(player.gameId, opponentId, 'forfeit')
            break
    }
}

function handlePlayerDisconnect(playerId, gameId) {
    const game = activeGames.get(gameId)
    if (!game) return
    
    const opponentId = game.player1.id === playerId ? game.player2.id : game.player1.id
    
    // Notify opponent of disconnection
    io.to(opponentId).emit('opponent_disconnected', {
        message: 'Your opponent has disconnected. You win!'
    })
    
    // End the game
    endGame(gameId, opponentId, 'disconnect')
}

function endGame(gameId, winnerId, reason) {
    const game = activeGames.get(gameId)
    if (!game) return
    
    const player1 = activePlayers.get(game.player1.id)
    const player2 = activePlayers.get(game.player2.id)
    
    // Update player states
    if (player1) {
        player1.inGame = false
        player1.gameId = null
    }
    
    if (player2) {
        player2.inGame = false
        player2.gameId = null
    }
    
    // Notify players of game end
    io.to(game.player1.id).emit('game_ended', {
        winner: winnerId,
        reason,
        won: game.player1.id === winnerId
    })
    
    io.to(game.player2.id).emit('game_ended', {
        winner: winnerId,
        reason,
        won: game.player2.id === winnerId
    })
    
    // Clean up
    activeGames.delete(gameId)
    
    console.log(`Game ${gameId} ended. Winner: ${winnerId}, Reason: ${reason}`)
}

// REST API endpoints
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        activeGames: activeGames.size,
        activePlayers: activePlayers.size
    })
})

app.get('/api/stats', (req, res) => {
    res.json({
        activeGames: activeGames.size,
        activePlayers: activePlayers.size,
        playersInQueue: Array.from(activePlayers.values()).filter(p => p.inQueue).length
    })
})

// Start server
server.listen(PORT, () => {
    console.log(`Technorox server running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
