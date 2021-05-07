var dbService = require('../../services/db.service.js')

module.exports = {
    query,
    getBoardById,
    addBoard,
    updateBoard,
    removeBoard,
}

async function query(filter) {
    try {
        var query = (Object.keys(filter).length) ? `SELECT * FROM board WHERE name LIKE '%${filter}%'` : `SELECT * FROM board`
        const boards = await dbService.runSQL(query)
        return boards;
    } catch (err) {
        console.log('err:', err)
    }
}

async function getBoardById(boardId) {
    var query = `SELECT * FROM board WHERE _id = ${boardId}`;
    var board = await dbService.runSQL(query);
    if (board.length === 1) return board[0];
    else if (board.length > 1) throw new Error(`multiple id found! ${boardId}`);
    throw new Error(`board id ${boardId} not found`);
}

async function addBoard(board) {
    try {
        board.members = JSON.stringify(board.members)
        board.activity = JSON.stringify(board.activity)
        board.cards = JSON.stringify(board.cards)
        console.log('board:', board)
        var query = `INSERT INTO board 
        (_id, title, members, activity, cards, backgroundColor, backgroundImg) VALUES 
        ('${board._id}', '${board.title}', '${board.members}','${board.activity}',
        '${board.cards}', '${board.backgroundColor}', '${board.backgroundImg}')`;
        const res = await dbService.runSQL(query)
        console.log('res:', res)
    } catch (err) {
        console.log('err:', err)
    }
}

async function updateBoard(board) {
    console.log('start //////////////////////////////////////////////////////////////////////')
    board.members = JSON.stringify(board.members)
    board.activity = JSON.stringify(board.activity)
    board.cards = JSON.stringify(board.cards)
    var query = `UPDATE board SET
    _id = '${board._id}',
    title = '${board.title}',
    members = '${board.members}',
    activity = '${board.activity}',
    cards = '${board.cards}',
    backgroundColor = '${board.backgroundColor}',
    backgroundImg = '${board.backgroundImg}'
    WHERE board._id = '${board._id}'`;

    var okPacket = await dbService.runSQL(query);
    console.log('End ///////////////////////////////////////////////////////////////////////')
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