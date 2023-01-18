import { useEffect } from "react"
import { TaskTitle } from "./task-title"

export function TaskPreview({ group, task }) {


    const openTaskIcon = 'open-item.svg'
    return (
        <div className="task-preview flex">

            <div className="checkbox-column task-column">
                <div className="colored-tag" style={{ background: group.style?.color || '#FFF000' }}></div>
                <input className='task-checkbox' type="checkbox" />
            </div>

            <div className="task-txt task-column flex">
                <img className="open-task-icon task-icon" src={require(`/src/assets/img/${openTaskIcon}`)} />
                <TaskTitle group={group} task={task} />
            </div>

            <div className="task-persons task-column"><span>{task.persons}</span></div>

            <div className="task-status task-column"
                style={{ background: task.status?.color }}>
                <span>{task.status?.txt}</span>
            </div>

            <div className="task-date task-column">{task.date}</div>

        </div>
    )
}