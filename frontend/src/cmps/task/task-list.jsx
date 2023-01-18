import { useState } from "react";
import { boardService } from "../../services/board.service";
import { TaskPreview } from "./task-preview";

export function TaskList({ group }) {

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
        <div className="task-list">

            <div className="task-title-row flex">
                <div className="checkbox-column task-column">
                    <input className='task-checkbox' type="checkbox" />
                </div>

                <div className="task-title task-column">Item</div>
                <div className="task-persons task-column"><span>Person</span></div>
                <div className="task-status task-column">Status</div>
                <div className="task-date task-column">Date</div>
            </div>

            {group.tasks.map(currTask => {
                return <TaskPreview task={currTask} />
            })}

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
    )
}
