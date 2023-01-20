import { useState } from "react"
import { boardService } from "../../services/board.service"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { saveTask } from "../../store/board.action"
import { DatePicker } from 'antd'
import dayjs from "dayjs"
import { TaskTitle } from "./task-title"
import { TaskPerson } from "./task-person"
import { PersonDetails } from "./person-details"

export function TaskPreview({ task, setNewTask, onRemoveTask, board, group, toggleModal }) {

    const [newTaskName, setNewTaskName] = useState('')
    const [lables, setLables] = useState(boardService.getDefaultLabels())
    const [isLablesOpen, setIsLablesOpen] = useState(false)
    const [isPersonsOpen, setIsPersonsOpen] = useState(false)
    const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false)

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

    async function onAddTaskDate(date) {
        try {
            let taskToSave = task
            taskToSave.date = date
            await saveTask(board, group.id, taskToSave)
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }


    function handleNameInputChange(event) {
        setNewTaskName(event.target.value)
    }

    async function onRenameTask(event) {
        event.preventDefault()
        try {
            await saveTask(board, group.id, { ...task, title: newTaskName })
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    function openOptionModal() {
        setIsBoardOptionsOpen(!isBoardOptionsOpen)
    }

    async function onDuplicateTask(task) {
        try {
            let copyTask = structuredClone(task)
            copyTask.id = ''
            copyTask.title = 'Copy ' + copyTask.title
            await saveTask(board, group.id, copyTask)
        } catch (err) {
            showErrorMsg('Cannot duplicate toy')
        }

    }


    const openTaskIcon = 'open-item.svg'
    const bubble = 'bubble.svg'
    const plusBubble = 'plus-bubble.svg'
    const boardIcon = 'board.svg'
    const optionIcon = 'option-icon.svg'
    const duplicateIcon = 'duplicate.svg'
    const openNewIcon = 'open-new.svg'
    const renameIcon = 'rename.svg'
    const deleteIcon = 'delete.svg'

    console.log(task.date);
    return (
        <div className="task-preview flex">
            {(isBoardOptionsOpen && board) && <ul className={"menu-modal task-modal "} >
                <div className="menu-modal-option flex" onClick={() => { onDuplicateTask(task) }}>
                    <img className="filter-icon board-icon" src={require(`/src/assets/img/${duplicateIcon}`)}
                    />
                    <p className="menu-modal-option-text">Duplicate</p>
                </div>
                <div className="menu-modal-option flex" onClick={() => { onRemoveTask(task.id) }}>
                    <img className="filter-icon board-icon" src={require(`/src/assets/img/${deleteIcon}`)}
                    />
                    <p className="menu-modal-option-text" >Delete</p>
                </div>
            </ul>}
            <img className="task-option-icon board-icon" src={require(`/src/assets/img/${optionIcon}`)}
                onClick={() => { openOptionModal() }} />

            <div className="checkbox-column task-column">
                <div className='colored-tag' style={{ background: group.style?.color || '#FFF000' }}></div>
                <input className='task-checkbox' type="checkbox" />
            </div>

            <div className="task-txt task-column flex" onClick={() => toggleModal(board, group, task)}>
                {/* <img className="open-task-icon task-icon" src={require(`/src/assets/img/${openTaskIcon}`)} /> */}
                {/* <span>{task.title}</span> */}
                <form onSubmit={onRenameTask} >
                    <input
                        className="task-title"
                        style={{
                            width: `${(task?.title?.length) * 1.2}ch`
                        }}
                        type="text"
                        value={newTaskName || task?.title}
                        onChange={handleNameInputChange}
                        onBlur={ev => { onRenameTask(ev) }}
                        onClick={ev => { ev.stopPropagation() }}
                    />
                </form>
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
                    placeholder=""
                    format={'MMM D'} />
            </div>
            <div className="remove-task task-column"
                onClick={() => { onRemoveTask(task.id) }}> X </div>
        </div>
    )
}