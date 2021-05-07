const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const boardService = require('./board.service')

async function getBoards(req, res) {
    try {
        console.log('query!');
        const boards = await boardService.query(req.query)
        res.send(boards)
    } catch (err) {
        logger.error('Cannot get boards', err)
        res.status(500).send({ err: 'Failed to get boards' })
    }
}

async function getBoardById(req, res) {
    try {
        const board = await boardService.getBoardById(req.params.id)
        const boardReady = _readyForSend(board)
        res.send(boardReady)
    } catch (err) {
        logger.error('Cannot get boards', err)
        res.status(500).send({ err: 'Failed to get boards' })
    }
}

async function deleteBoard(req, res) {
    try {
        await boardService.removeBoard(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete board', err)
        res.status(500).send({ err: 'Failed to delete board' })
    }
}


async function addBoard(req, res) {
    try {
        var board = req.body
        board.byUserId = req.session.user._id
        board = await boardService.add(board)
        board.byUser = req.session.user
        board.aboutUser = await userService.getBoardById(board.aboutUserId)
        res.send(board)

    } catch (err) {
        logger.error('Failed to add board', err)
        res.status(500).send({ err: 'Failed to add board' })
    }
}

function _readyForSend(board) {
    board.members = JSON.parse(board.members)
    board.activity = JSON.parse(board.activity)
    board.cards = JSON.parse(board.cards)
    return board;
}

module.exports = {
    getBoards,
    deleteBoard,
    getBoardById,
    addBoard
}