import { useState } from "react"
import { boardService } from "../../services/board.service"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { saveTask } from "../../store/board.action"
import { DatePicker } from 'antd'
import dayjs from "dayjs"

export function TaskPreview({ task, onRemoveTask, board, group, toggleModal }) {

    const [lables, setLables] = useState(boardService.getDefaultLabels())
    const [isLablesOpen, setIsLablesOpen] = useState(false)

    async function onAddTaskStatus(label) {
        try {
            let taskToSave = task
            taskToSave.status = label
            await saveTask(board, group.id, taskToSave)
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    async function onAddTaskDate(date, dateString) {
        try {
            let taskToSave = task
            taskToSave.date = dateString
            await saveTask(board, group.id, taskToSave)
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    const openTaskIcon = 'open-item.svg'
    
    return (
        <div className="task-preview flex">

            <div className="checkbox-column task-column">
                <div className='colored-tag' style={{ background: group.style?.color || '#FFF000' }}></div>
                <input className='task-checkbox' type="checkbox" />
            </div>

            <div className="task-txt task-column flex" onClick={() => toggleModal(task.id)}>
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
                    )}</ul>}
            </div>

            <div className="task-date task-column">
                <DatePicker
                    defaultValue={task.date ? dayjs(task.date, 'YYYY-MM-DD') : ''}
                    bordered={false}
                    onChange={onAddTaskDate}
                    placeholder="" />
            </div>
            <div className="remove-task task-column"
                onClick={() => { onRemoveTask(task.id) }}> X </div>
        </div>
    )
}