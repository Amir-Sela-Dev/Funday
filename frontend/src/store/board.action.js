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

export async function loadBoard(boardId, filterBy = boardService.getDefaultGroupFilter()) {
    try {
        const board = await boardService.get(boardId)
        let boardToSave = structuredClone(board)
        if (filterBy.title) {
            const regex = new RegExp(filterBy.title, 'i')
            let boardGroups = boardToSave.groups
            // let boardGroupsWithTitle = boardGroups.filter(group => regex.test(group.title))
            boardGroups = boardGroups.filter(group => {
                if (regex.test(group.title)) return true
                let tasks = group.tasks.filter(task => regex.test(task.title))
                if (!tasks.length) return false
                group.tasks = tasks
                return group
            })

            console.log('boardGroups', boardGroups);
            // console.log('boardGroupsWithTitle', boardGroupsWithTitle);
            // boardGroups = [...boardGroups, ...boardGroupsWithTitle]
            console.log(boardGroups);
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
    let boardToSave = board
    console.log('got here')
    boardToSave.groups.unshift(group)
    saveBoard(boardToSave)
}

export async function saveGroup(board, groupId, groupToUpdate) {
    let boardToSave = board
    const groupIndex = boardToSave.groups.findIndex(group => group.id === groupId)
    if (groupIndex === -1) console.log('Could not find group to update')
    boardToSave.groups.splice(groupIndex, 1, groupToUpdate)
    saveBoard(boardToSave)
}

export async function removeGroup(board, groupId) {
    let boardToSave = board
    const groupIndex = boardToSave.groups.findIndex(group => group.id === groupId)
    if (groupIndex === -1) console.log('Could not find group to remove')
    boardToSave.groups.splice(groupIndex, 1)
    saveBoard(boardToSave)
}

// Tasks
export async function saveTask(board, groupId, task) {
    let boardToSave = board
    let groupToSave = boardToSave.groups.find(group => group.id === groupId)

    if (!task.id) {
        task.id = utilService.makeId(5)
        groupToSave.tasks.push(task)
    }
    else {
        const taskIdx = groupToSave.tasks.findIndex(currTask => currTask.id === task.id)
        groupToSave.tasks.splice(taskIdx, 1, task)
    }
    saveBoard(boardToSave)
}

export async function removeTask(board, groupId, taskId) {
    let boardToSave = board
    let currGroup = boardToSave.groups.find(group => group.id === groupId)
    let taksIdx = currGroup.tasks.findIndex(task => task.id === taskId)
    currGroup.tasks.splice(taksIdx, 1)
    saveBoard(boardToSave)
}
