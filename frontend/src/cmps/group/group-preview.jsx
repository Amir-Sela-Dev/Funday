import { useState } from 'react'
import { boardService } from '../../services/board.service'

import { TaskList } from "../task/task-list"

export function GroupPreview({ group }) {
    const [newTask, setNewTask] = useState(boardService.getEmptyTask())

    function handleSubmit(event) {
        event.preventDefault()
        console.log("submit", newTask)
        setNewTask(boardService.getEmptyTask())
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