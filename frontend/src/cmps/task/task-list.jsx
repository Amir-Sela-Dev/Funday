import { useState } from "react";
import { boardService } from "../../services/board.service";
import { TaskPreview } from "./task-preview";
import { removeTask, saveBoard, addTask } from "../../store/board.action"
import { useSelector } from "react-redux";
import { TaskTitle } from "./task-title";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
export function TaskList({ group, groupColor }) {

    const [newTask, setNewTask] = useState(boardService.getEmptyTask())

    let { board } = useSelector((storeState) => storeState.boardModule)

    async function OnAddTask(event) {
        event.preventDefault()
        if (!newTask.title) return
        try {
            await addTask(board, group.id, newTask)
            setNewTask(boardService.getEmptyTask())
            showSuccessMsg('Task added')
        } catch (err) {
            showErrorMsg('Cannot add task')
        }
    }

    function handleInputChange({ target }) {
        let { value, name: field } = target
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
                    <div className="colored-tag first-tag" style={{ background: groupColor }}></div>
                    <input className='task-checkbox' type="checkbox" />
                </div>

                <div className="task-title task-column">Item</div>
                <div className="task-persons task-column"><span>Person</span></div>
                <div className="task-status task-column">Status</div>
                <div className="task-date task-column">Date</div>
            </div>

            {group.tasks.map(currTask => {
                return <TaskPreview task={currTask}
                    groupColor={groupColor}
                    onRemoveTask={onRemoveTask}
                    group={group}
                    board={board}

                />
            })}

            <div className="add-task-wrap flex">
                <div className="checkbox-column task-column">
                    <div className="colored-tag last-tag" style={{ background: groupColor }}></div>
                    <input className='task-checkbox' type="checkbox" />
                </div>

                <form className='task-input-row' onSubmit={OnAddTask}>
                    <input
                        className="add-task-input"
                        placeholder='+ Add item'
                        type="text"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        onBlur={ev => OnAddTask(ev)}
                    />
                </form>
            </div>
        </div>
    )
}
