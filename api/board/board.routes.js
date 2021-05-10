const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addBoard, getBoards, deleteBoard, getBoardById, updateBoard } = require('./board.controller')
const router = express.Router()

router.get('/:id', log, getBoardById)
router.get('/', log, getBoards)
router.put('/:id', updateBoard)
router.post('/', addBoard)
router.delete('/:id', requireAuth, deleteBoard)

module.exports = router