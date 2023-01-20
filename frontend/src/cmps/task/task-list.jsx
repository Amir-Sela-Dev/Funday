import { useState } from "react";
import { boardService } from "../../services/board.service";
import { TaskPreview } from "./task-preview";
import { removeTask, saveTask } from "../../store/board.action"
import { useSelector } from "react-redux";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";

export function TaskList({ group, toggleModal }) {

    const [newTask, setNewTask] = useState(boardService.getEmptyTask())
    let { board } = useSelector((storeState) => storeState.boardModule)

    async function onSaveTask(event) {
        event.preventDefault()
        if (!newTask.title) return
        try {
            await saveTask(board, group.id, newTask)
            setNewTask(boardService.getEmptyTask())
            showSuccessMsg('Task added')
        } catch (err) {
            showErrorMsg('Cannot add task')
        }
    }


    function handleInputChange({ target }) {
        let { value, name: field } = target
        console.log('target', target);
        setNewTask((prevTask) => {
            return { ...prevTask, [field]: value }
        })
    }

    async function onRemoveTask(taskId) {
        try {
            await removeTask(board, group.id, taskId)
            showSuccessMsg('Task removed')
        } catch (err) {
            showErrorMsg('Cannot remove task')
        }
    }

    return (
        <div className="task-list">

            <div className="task-title-row flex">
                <div className="checkbox-column task-column">
                    <div className="colored-tag first-tag" style={{ background: group.style?.color }}></div>
                    <input className='task-checkbox' type="checkbox" />
                </div>

                <div className="task-title task-column">Item</div>
                <div className="task-persons task-column"><span>Person</span></div>
                <div className="task-status task-column">Status</div>
                <div className="task-date task-column">Date</div>
            </div>

            {group.tasks.map(currTask => {
                return <TaskPreview
                    key={currTask.id}
                    task={currTask}
                    onRemoveTask={onRemoveTask}
                    setNewTask={setNewTask}
                    onTitleInputChange={handleInputChange}
                    group={group}
                    board={board}
                    toggleModal={toggleModal}
                />
            })}

            <div className="add-task-wrap flex">
                <div className="checkbox-column task-column">
                    <div className="colored-tag last-tag" style={{ background: group.style?.color }}></div>
                    <input className='task-checkbox' type="checkbox" />
                </div>

                <form className='task-input-row' onSubmit={onSaveTask}>
                    <input
                        className="add-task-input"
                        placeholder='+ Add item'
                        type="text"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        onBlur={ev => onSaveTask(ev)}
                    />
                </form>
            </div>
        </div>
    )
}
