import { useState } from "react"
import { boardService } from "../../services/board.service"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { saveTask } from "../../store/board.action"
import { DatePicker } from 'antd'
import dayjs from "dayjs"
import { TaskTitle } from "./task-title"
import { TaskPerson } from "./task-person"
import { PersonDetails } from "./person-details"

export function TaskPreview({ task, onRemoveTask, board, group, toggleModal }) {

    const [lables, setLables] = useState(boardService.getDefaultLabels())
    const [isLablesOpen, setIsLablesOpen] = useState(false)
    const [isPersonsOpen, setIsPersonsOpen] = useState(false)
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
            console.log(dayjs(dateString).format('MMM D '));
            let taskToSave = task
            taskToSave.date = dayjs(dateString).format('MMM D ')
            console.log(dayjs(dateString).format('MMM D '));
            await saveTask(board, group.id, taskToSave)
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    const openTaskIcon = 'open-item.svg'
    const bubble = 'bubble.svg'
    const plusBubble = 'plus-bubble.svg'

    console.log(task.date);
    return (
        <div className="task-preview flex">
            <div className="checkbox-column task-column">
                <div className='colored-tag' style={{ background: group.style?.color || '#FFF000' }}></div>
                <input className='task-checkbox' type="checkbox" />
            </div>

            <div className="task-txt task-column flex" onClick={() => toggleModal(board, group, task)}>
                {/* <img className="open-task-icon task-icon" src={require(`/src/assets/img/${openTaskIcon}`)} /> */}
                <span>{task.title}</span>
                <div className="comments-bubble task-column">
                    <img className="task-icon" src={require(`/src/assets/img/${(task.comments.length) ? bubble : plusBubble}`)} alt="" />
                    <span className={`comments-num${(task.comments.length) ? '' : 'none'}`}> {(task.comments.length) ? task.comments.length : ''}</span>
                </div>
            </div>


            <div className="task-persons task-column"
                onClick={() => setIsPersonsOpen(!isPersonsOpen)}>
                {task.persons &&
                    task.persons.map(currPerson => {
                        return <TaskPerson key={currPerson.id} person={currPerson} />
                    })}
                {isPersonsOpen &&
                    <div className="user-preview" >
                        <PersonDetails persons={task.persons} />
                    </div>}

            </div>

            <div className="task-status task-column"
                onClick={() => { setIsLablesOpen(!isLablesOpen) }}
                style={{ background: `${(task.status.txt === 'Default') ? '#fff' : task.status.color}` }}>

                <span>{`${(task.status.txt === 'Default' || !task.status.txt) ? '' : task.status.txt}`}</span>

                {isLablesOpen && <ul className="status-picker" >
                    <div className="arrow-up"></div>
                    {lables.map(lable => (<li key={lable.id}
                        className='label'
                        style={{ background: lable.color }} onClick={() => { onAddTaskStatus(lable) }}>{lable.txt}</li>)
                    )}</ul>}
            </div>

            <div className="task-date task-column">
                <DatePicker
                    defaultValue={task.date ? dayjs(task.date) : ''}
                    bordered={false}
                    onChange={onAddTaskDate}
                    placeholder="" />
            </div>
            <div className="remove-task task-column"
                onClick={() => { onRemoveTask(task.id) }}> X </div>
        </div>
    )
}