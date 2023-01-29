const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getBoards, getBoardById, addBoard, updateBoard, removeBoard } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)
router.get('/', log, getBoards)
// router.get('/', getBoards)
router.get('/:id', log, getBoardById)
router.post('/', log, addBoard)
router.put('/:id', log, updateBoard)
// router.put('/:id', /* requireAuth, */ updateBoard)
router.delete('/:id', removeBoard)
// router.delete('/:id', requireAuth, requireAdmin, removeBoard)

// router.post('/:id/msg', requireAuth, addBoardMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeBoardMsg)

module.exports = router