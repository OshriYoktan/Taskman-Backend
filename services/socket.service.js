const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null
var gSocketBySessionIdMap = {}

function connectSockets(http, session) {
    gIo = require('socket.io')(http);

    const sharedSession = require('express-socket.io-session');

    gIo.use(sharedSession(session, {
        autoSave: true
    }));

    gIo.on('connection', socket => {
        console.log('Someone connected')
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        // if (socket.handshake?.session?.user) socket.join(socket.handshake.session.user._id)
        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null
            }
        })
        socket.on('board topic', topic => {
            if (socket.myTopic === topic) return;
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            // logger.debug('Session ID is', socket.handshake.sessionID)
            socket.myTopic = topic
        })
        socket.on("add-member-to-task", member => {
            console.log('member:', member)
            // emits to all sockets:
            // emits only to sockets in the same room
            console.log('socket.myTopic:', socket.myTopic)
            gIo.emit("add-member-to-task-from-back", member);
            // gIo.to(socket.myTopic).emit('add-member-to-task-from-back', member)
        })
        socket.on('task to-add-task', task => {
            socket.broadcast.emit('task add-task', task)
        })
        socket.on('task to-update-task', data => {
            socket.broadcast.emit('task update-task', data)
        })
        socket.on('card to-add-card', card => {
            socket.broadcast.emit('card add-card', card)
        })
        socket.on('card to-delete-card', cardIdx => {
            socket.broadcast.emit('card delete-card', cardIdx)
        })
        socket.on('card to-update-card', data => {
            socket.broadcast.emit('card update-card', data)
        })
        socket.on('card to-update-card-title', data => {
            socket.broadcast.emit('card update-card-title', data)
        })
        socket.on('board to-add-label', data => {
            socket.broadcast.emit('board add-label', data)
        })
        socket.on('board to-add-activity', data => {
            socket.broadcast.emit('board add-activity', data)
        })
    })
}

function emitToAll({ type, data, room = null }) {
    if (room) gIo.to(room).emit(type, data)
    else gIo.emit(type, data)
}

function emit({ type, data }) {
    gIo.emit(type, data)
}

function emitToUser({ type, data, userId }) {
    gIo.to(userId).emit(type, data)
}

// Send to all sockets BUT not the current socket
function broadcast({ type, data }) {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
    const excludedSocket = gSocketBySessionIdMap[sessionId]
    if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map', gSocketBySessionIdMap)
    excludedSocket.broadcast.emit(type, data)
}

module.exports = {
    connectSockets,
    emit,
    emitToAll,
    broadcast
}