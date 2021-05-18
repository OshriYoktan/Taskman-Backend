var dbService = require('../../services/db.service.js')

module.exports = {
    removeBoard,
    getBoardById,
    query,
    addBoard,
    updateBoard,
}

async function query(filter) {
    try {
        var query = (Object.keys(filter).length) ? `SELECT * FROM board WHERE name LIKE '%${filter}%'` : `SELECT * FROM board`
        const boards = await dbService.runSQL(query)
        const boardsToReturn = boards.map(board => {
            return _readyForSend(board)
        })
        return boardsToReturn;
    } catch (err) {
        console.log('err:', err)
    }
}

async function getBoardById(boardId) {
    var query = `SELECT * FROM board WHERE _id = ${boardId}`;
    var board = await dbService.runSQL(query);
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
        board._id = makeId()
        var query = `INSERT INTO board 
        (_id, title, members, activity, cards, background, labels) VALUES 
        ('${board._id}', '${board.title}', '${board.members}','${board.activity}',
        '${board.cards}', '${board.background}', '${board.labels}')`;
        await dbService.runSQL(query)
    } catch (err) {
        console.log('err:', err)
    }
}

async function updateBoard(board) {
    board.members = JSON.stringify(board.members)
    board.activity = JSON.stringify(board.activity)
    board.cards = JSON.stringify(board.cards)
    board.background = JSON.stringify(board.background)
    board.labels = JSON.stringify(board.labels)
    var query = `UPDATE board SET
    _id = '${board._id}',
    title = '${board.title}',
    members = '${board.members}',
    activity = '${board.activity}',
    cards = '${board.cards}',
    background = '${board.background}',
    labels = '${board.labels}'
    WHERE board._id = '${board._id}'`;
    var okPacket = await dbService.runSQL(query);
    if (okPacket.affectedRows !== 0) return okPacket;
    throw new Error(`No board updated - board id ${board._id}`);
}

async function removeBoard(boardId) {
    var query = `DELETE FROM board WHERE board._id = ${boardId}`;
    const res = await dbService.runSQL(query)
        .then(okPacket => okPacket.affectedRows === 1
            ? okPacket
            : Promise.reject(new Error(`No board deleted - board id ${boardId}`)));
    console.log('res:', res)
}

function _readyForSend(board) {
    if (board.background) board.background = JSON.parse(board.background)
    board.members = JSON.parse(board.members)
    board.activity = JSON.parse(board.activity)
    board.cards = JSON.parse(board.cards)
    console.log('board.cards:', board.cards)
    board.labels = JSON.parse(board.labels)
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