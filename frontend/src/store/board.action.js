import { boardService } from '../services/board.service.js'
import { store } from './store.js'
import { REMOVE_BOARD, SET_BOARDS, ADD_BOARD, UPDATE_BOARD, UNDO_REMOVE_BOARD, SET_BOARD } from '../store/board.reducer.js'
import { LOADING_DONE, LOADING_START } from './system.reducer.js'
import { utilService } from '../services/util.service.js'

export async function loadBoards(filterBy) {
    store.dispatch({ type: LOADING_START })
    try {
        const boards = await boardService.query(filterBy)
        store.dispatch({ type: SET_BOARDS, boards })
    } catch (err) {
        console.log('Had issues loading boards', err)
        throw err
    } finally {
        store.dispatch({ type: LOADING_DONE })
    }
}


// Example for Optimistic mutation:
export async function removeBoard(boardId) {
    try {
        await boardService.remove(boardId)
        let boards = await boardService.query()
        let board = boards[0]
        store.dispatch({ type: SET_BOARD, board })
        store.dispatch({ type: REMOVE_BOARD, boardId })
    } catch (err) {
        store.dispatch({ type: UNDO_REMOVE_BOARD })
        console.log('Had issues Removing board', err)
        throw err
    }
}


// export function removeBoardNormal(boardId) {
//     return boardService.remove(boardId)
//         .then(() => {
//             store.dispatch({ type: REMOVE_BOARD, boardId })
//         })
//         .catch(err => {
//             console.log('Had issues Removing board', err)
//             throw err
//         })
// }

export async function saveBoard(board) {
    try {
        const type = (board._id) ? UPDATE_BOARD : ADD_BOARD
        const savedBoard = await boardService.save(board)
        store.dispatch({ type, board: savedBoard })
        return savedBoard
    } catch (err) {
        console.error('Cannot save board:', err)
        throw err
    }
}


export async function loadBoard(boardId) {
    try {
        const board = await boardService.get(boardId)
        store.dispatch({ type: SET_BOARD, board })
        return board
    } catch (err) {
        console.log('Had issues loading board', err)
        throw err
    }
}

export async function addTask(board, groupId, task) {
    let boardToSave = board
    if (!task.id) task.id = utilService.makeId(5)
    let groupToSave = boardToSave.groups.find(group => group.id === groupId)
    groupToSave.tasks.push(task)
    saveBoard(boardToSave)
}

export async function removeTask(board, groupId, taskId) {
    let boardToSave = board
    let currGroup = boardToSave.groups.find(group => group.id === groupId)
    let taksIdx = currGroup.tasks.findIndex(task => task.id === taskId)
    currGroup.tasks.splice(taksIdx, 1)
    saveBoard(boardToSave)
}

export async function saveTask(board, groupId, taskId, taskToUpdate) {
    let boardToSave = board
    let currGroup = boardToSave.groups.find(group => group.id === groupId)
    let taksIdx = currGroup.tasks.findIndex(task => task.id === taskId)
    console.log(taksIdx);
    currGroup.tasks.splice(taksIdx, 1, taskToUpdate)
    saveBoard(boardToSave)
}

