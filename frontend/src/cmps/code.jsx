export async function saveTask(board, groupId, task, type, txt) {
    const boardToSave = structuredClone(board)
    const groupToSave = groupId ? boardToSave.groups.find(group => group.id === groupId) : boardToSave.groups[0]
    const taskToSave = { ...task }
    if (!taskToSave.id) {
        taskToSave.id = utilService.makeId(5)
        groupToSave.tasks[groupId ? 'push' : 'unshift'](taskToSave)
    }
    else {
        const taskIdx = groupToSave.tasks.findIndex(currTask => currTask.id === taskToSave.id)
        groupToSave.tasks.splice(taskIdx, 1, taskToSave)
    }
    addActivity(boardToSave, type, txt, task)
    saveBoard(boardToSave)
}

export async function saveBoard(board) {
    try {
        const type = (board._id) ? UPDATE_BOARD : ADD_BOARD
        const boardToSave = await boardService.save(board)
        socketService.emit(SOCKET_EVENT_BOARD_UPDATED, boardToSave._id)
        store.dispatch({ type: SET_BOARD, boardToSave })
        store.dispatch({ type, board: boardToSave })
        return boardToSave
    } catch (err) {
        console.error('Cannot save board:', err)
        throw err
    }
}