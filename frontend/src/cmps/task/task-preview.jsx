import { useEffect, useState } from "react"
import { boardService, saveTask } from "../../services/board.service"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"

export function TaskPreview({ task, groupColor, onRemoveTask, board, group }) {

    const [lables, setLables] = useState(boardService.getDefaultLabels())
    const [isLablesOpen, setIsLablesOpen] = useState(false)


    async function onAddTaskStatus(label) {
        try {
            console.log(label)
            let taskToSave = task
            taskToSave.status = label
            await saveTask(board, group.id, task.id, taskToSave)
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }
    console.log(task)

    const openTaskIcon = 'open-item.svg'
    return (
        <div className="task-preview flex">
            <div className="checkbox-column task-column">
                <div className="colored-tag" style={{ background: groupColor }}></div>
                <input className='task-checkbox' type="checkbox" />
            </div>

            <div className="task-txt task-column flex">
                <img className="open-task-icon task-icon" src={require(`/src/assets/img/${openTaskIcon}`)} />
                <span>{task.title}</span>
            </div>

            <div className="task-persons task-column"><span>{task.persons}</span></div>

            <div className="task-status task-column"
                onClick={() => { setIsLablesOpen(!isLablesOpen) }}
                style={{ background: task.status?.color }}>
                <span>{task.status?.txt}</span>
                {isLablesOpen && <ul className="status-picker" >
                    {lables.map(lable => (<li key={lable.id}
                        className='label'
                        style={{ background: lable.color }} onClick={() => { onAddTaskStatus(lable) }}>{lable.txt}</li>)
                    )}

                </ul>
                }            </div>

            <div className="task-date task-column">{task.date}</div>
            <div className="remove-task task-column" onClick={() => { onRemoveTask(task.id) }}>
                X
            </div>


        </div>
    )
}