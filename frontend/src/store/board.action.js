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
        let boardToSave = boards[0]
        store.dispatch({ type: SET_BOARD, boardToSave })
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
        const boardToSave = await boardService.save(board)
        store.dispatch({ type: SET_BOARD, boardToSave })
        store.dispatch({ type, board: boardToSave })
        return boardToSave
    } catch (err) {
        console.error('Cannot save board:', err)
        throw err
    }
}

export async function loadBoard(boardId, filterBy = boardService.getDefaultGroupFilter()) {
    console.log(filterBy);
    try {
        const board = await boardService.get(boardId)
        let boardToSave = structuredClone(board)
        let boardGroups = boardToSave.groups
        if (filterBy.title) {
            const regex = new RegExp(filterBy.title, 'i')
            boardGroups = boardGroups.filter(group => {
                if (regex.test(group.title)) return true
                let tasks = group.tasks.filter(task => regex.test(task.title))
                if (!tasks.length) return false
                group.tasks = tasks
                return group
            })
            boardToSave.groups = boardGroups
        }

        if (filterBy.lables.length) {
            boardGroups = boardToSave.groups
            console.log('boardGroups', boardGroups)
            boardGroups = boardGroups.filter(group => {
                let tasks = group.tasks.filter(task => filterBy.lables.includes(task.status.txt))
                if (!tasks.length) return false
                group.tasks = tasks
                return group
            })
            boardToSave.groups = boardGroups
        }
        store.dispatch({ type: SET_BOARD, boardToSave })
        return boardToSave
    } catch (err) {
        throw err
    }
}

// Groups
export async function addGroup(group, board) {
    let fullBoard = await boardService.get(board._id)
    let boardToSave = structuredClone(fullBoard)
    console.log('got here')
    boardToSave.groups.unshift(group)
    saveBoard(boardToSave)
}

export async function saveGroup(board, groupId, groupToUpdate) {
    let fullBoard = await boardService.get(board._id)
    let boardToSave = structuredClone(fullBoard)
    const groupIndex = boardToSave.groups.findIndex(group => group.id === groupId)
    if (groupIndex === -1) console.log('Could not find group to update')
    boardToSave.groups.splice(groupIndex, 1, groupToUpdate)
    saveBoard(boardToSave)
}

export async function removeGroup(board, groupId) {
    let fullBoard = await boardService.get(board._id)
    let boardToSave = fullBoard
    const groupIndex = boardToSave.groups.findIndex(group => group.id === groupId)
    if (groupIndex === -1) console.log('Could not find group to remove')
    boardToSave.groups.splice(groupIndex, 1)
    saveBoard(boardToSave)
}

// Tasks
export async function saveTask(board, groupId, task) {
    let fullBoard = await boardService.get(board._id)
    let boardToSave = structuredClone(fullBoard)
    let groupToSave = groupId ? boardToSave.groups.find(group => group.id === groupId) : boardToSave.groups[0]

    if (!task.id) {
        console.log('from action no id', task);
        task.id = utilService.makeId(5)
        groupToSave.tasks[groupId ? 'push' : 'unshift'](task)
    }
    else {
        console.log('from action', task);
        const taskIdx = groupToSave.tasks.findIndex(currTask => currTask.id === task.id)
        groupToSave.tasks.splice(taskIdx, 1, task)
    }
    saveBoard(boardToSave)
}

export async function removeTask(board, groupId, taskId) {
    let fullBoard = await boardService.get(board._id)
    let boardToSave = structuredClone(fullBoard)
    let currGroup = boardToSave.groups.find(group => group.id === groupId)
    let taksIdx = currGroup.tasks.findIndex(task => task.id === taskId)
    currGroup.tasks.splice(taksIdx, 1)
    saveBoard(boardToSave)
}
