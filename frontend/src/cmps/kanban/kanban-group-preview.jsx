import { useState, useEffect } from "react";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
import { saveGroup, saveTask } from "../../store/board.action";
import { KanbanTaskList } from "./kanban-task-list";
import { boardService } from "../../services/board.service";

export function KanbanGroupPreview({ board, group, toggleModal, index, setIsDarkScreen }) {
    const [groupToSend, setGroupToSend] = useState({ ...group })
    const [tasks, setTasks] = useState(group.tasks)
    const [newTask, setNewTask] = useState(boardService.getEmptyTask())
    const [isAddItem, setIsAddItem] = useState(false)
    useEffect(() => {
        function handleClickOutside(event) {
            if (event.target.closest('.task-input-row') === null) {
                setIsAddItem(false)
            }
        }

        if (isAddItem) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [isAddItem]);


    useEffect(() => {
        setTasks(group.tasks)
    }, [board])

    function setNewTasks(tasks) {
        setTasks(tasks)
    }

    async function onSaveTask(event) {
        event.preventDefault()
        if (!newTask.title) return
        try {
            await saveTask(board, group.id, newTask)
            setNewTask(boardService.getEmptyTask())
            setIsAddItem(false)
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

    return (
        <section className="kanban-group-preview flex" >


            <div className="kanban-tittle-wrapper flex justify-center" style={{ background: group.style?.color || '#FFF000', border: 'none' }} >
                <div className="kanban-group-title flex align-center">
                    {group.title}
                </div>
            </div>

            <div className="kanban-card-container">
                <KanbanTaskList group={group} tasks={tasks} setNewTasks={setNewTasks} toggleModal={toggleModal} index={index} setIsDarkScreen={setIsDarkScreen} />

            </div>

            <div className="add-task">
                {!isAddItem && <h4 onClick={() => { setIsAddItem(true) }}>+ Add item</h4>}

                {isAddItem && <form className='task-input-row' onSubmit={onSaveTask} >
                    <input
                        className="add-task-input"
                        placeholder=''
                        type="text"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        onBlur={ev => onSaveTask(ev)}
                    />
                    <button> +Add </button>
                </form>
                }
            </div>
            <div className="kanban-color" style={{ background: group.style?.color || '#FFF000', border: 'none' }}></div>
        </section>
    )
}