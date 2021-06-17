var dbService = require('../../services/db.service.js')

module.exports = {
    removeBoard,
    getBoardById,
    query,
    addBoard,
    updateBoard,
}

async function query() {
    try {
        var sql = `SELECT * FROM board`
        const boards = await dbService.runSQL(sql)
        const boardsToReturn = boards.map(board => _readyForSend(board))
        return boardsToReturn;
    } catch (err) {
        console.log('err:', err)
    }
}

async function getBoardById(boardId) {
    var sql = `SELECT * FROM board WHERE _id = '${boardId}'`;
    var board = await dbService.runSQL(sql);
    if (board.length === 1) {
        const boardToReturn = _readyForSend(board[0])
        return boardToReturn;
    }
    else if (board.length > 1) throw new Error(`multiple id found! ${boardId}`);
    throw new Error(`board id ${boardId} not found`);
}

async function addBoard(board) {
    try {
        board.members = JSON.stringify(board.members)
        board.activity = JSON.stringify(board.activity)
        board.cards = JSON.stringify(board.cards)
        board.background = JSON.stringify(board.background)
        board.labels = JSON.stringify(board.labels)
        board.images = JSON.stringify(board.images)
        board._id = makeId(20)
        var sql = `INSERT INTO board 
        (_id, title, members, activity, cards, background, labels, images, description) VALUES 
        ('${board._id}', '${board.title}', '${board.members}', '${board.activity}',
         '${board.cards}', '${board.background}', '${board.labels}', '${board.images}', '${board.description}')`;
        await dbService.runSQL(sql);
        return _readyForSend(board)
    } catch (err) {
        console.log('err:', err)
    }
}

async function updateBoard(board) {
    try {
        board.members = JSON.stringify(board.members)
        board.activity = JSON.stringify(board.activity)
        board.cards = JSON.stringify(board.cards)
        board.background = JSON.stringify(board.background)
        board.labels = JSON.stringify(board.labels)
        board.images = JSON.stringify(board.images)
        var sql = `UPDATE board SET
        _id = '${board._id}',
        title = '${board.title}',
        members = '${board.members}',
        activity = '${board.activity}',
        cards = '${board.cards}',
        background = '${board.background}',
        labels = '${board.labels}',
        images = '${board.images}',
        description = '${board.description}'
        WHERE board._id = '${board._id}'`;
        var okPacket = await dbService.runSQL(sql);
        const boardToReturn = _readyForSend(board)
        if (okPacket.affectedRows !== 0) return boardToReturn;
        throw new Error(`No board updated - board id ${board._id}`);
    } catch (err) {
        console.log('err:', err)
    }
}

async function removeBoard(boardId) {
    try {
        var sql = `DELETE FROM board WHERE _id = '${boardId}'`;
        const res = await dbService.runSQL(sql)
            .then(okPacket => okPacket.affectedRows === 1
                ? okPacket
                : Promise.reject(new Error(`No board deleted - board id ${boardId}`)));
    } catch (err) {
        console.log('err:', err)
    }
}

function _readyForSend(board) {
    if (board.background) board.background = JSON.parse(board.background)
    board.members = JSON.parse(board.members)
    board.activity = JSON.parse(board.activity)
    board.cards = JSON.parse(board.cards)
    board.labels = JSON.parse(board.labels)
    board.images = JSON.parse(board.images)
    return board;
}

function makeId(length = 11) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}