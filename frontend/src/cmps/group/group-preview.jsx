import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { saveBoard } from "../../store/board.action"
import { boardService } from '../../services/board.service'
import { utilService } from '../../services/util.service'
import { ADD_TASK } from '../../store/board.reducer'
import { store } from '../../store/store'
import { TaskList } from "../task/task-list"

export function GroupPreview({ group }) {
    const [newTask, setNewTask] = useState(boardService.getEmptyTask())
    let { board } = useSelector((storeState) => storeState.boardModule)

    async function handleSubmit(event) {
        event.preventDefault()
        const boardToSave = boardService.saveTask(board, group.id, newTask)
        setNewTask({ ...boardService.getEmptyTask() })
        try{
            saveBoard(boardToSave)
        }catch(err){
            console.log('error adding task', err)
        }
    }

    function handleInputChange(event) {
        setNewTask({ ...newTask, title: event.target.value })
    }


    return (
        <section className="group-preview">
            <div className="group-title"> {group.title} {group.tasks.length} </div>
            <TaskList group={group} />
            <div className="add-task">
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder='Add task'
                        type="text"
                        value={newTask.title}
                        onChange={handleInputChange}
                        onBlur={ev => handleSubmit(ev)}
                    />
                </form>
            </div>
        </section>
    )
}