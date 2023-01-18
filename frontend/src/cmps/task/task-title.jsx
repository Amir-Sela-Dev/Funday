import { useState } from "react"
import { useSelector } from "react-redux"
import { boardService } from "../../services/board.service"
import { saveBoard } from "../../store/board.action"

export function TaskTitle({ group, task }) {
    const [newTask, setNewTask] = useState(task || {})
    let { board } = useSelector((storeState) => storeState.boardModule)

    async function handleSubmit(event, val) {
        event.preventDefault()
        // if (!val.length) {
        //     setNewTask({ ...boardService.getEmptyTask() })
        //     return
        // }
        const boardToSave = boardService.saveTask(board, group.id, newTask)
        try {
            saveBoard(boardToSave)
        } catch (err) {
            console.log('error adding task', err)
        }
        setNewTask(task ? newTask : {})
    }

    function handleInputChange(event) {
        setNewTask({ ...newTask, title: event.target.value })
    }

    return (
        <form className='task-input-row' onSubmit={handleSubmit}>
            <input
                className="add-task-input"
                placeholder='+ Add item'
                type="text"
                value={newTask?.title || ''}
                onChange={handleInputChange}
                onBlur={ev => { handleSubmit(ev, ev.target.value) }}
            />
        </form>
    )
}