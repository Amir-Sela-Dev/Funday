import { useState } from "react";
import { boardService } from "../../services/board.service";
import { TaskPreview } from "./task-preview";
import { removeTask, saveBoard, saveTask } from "../../store/board.action"
import { useSelector } from "react-redux";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
import { Add } from "monday-ui-react-core/icons";
import { Icon } from "monday-ui-react-core";
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { GroupBottomBar } from "../group/group-bottom-bar";

export function TaskList({ group, tasks, toggleModal, setIsDarkScreen }) {
    let { board } = useSelector((storeState) => storeState.boardModule)
    const [newTask, setNewTask] = useState(boardService.getEmptyTask())
    const [isAllSelected, setIsAllSelected] = useState(false)
    const [selectedTasks, setSelectedTasks] = useState([])
    const [columes, setColumes] = useState(boardService.getDefualtBoardColumes())

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

    function updateSelectedTasks(task) {
        setSelectedTasks([...selectedTasks, task])
    }

    return (
        <div>
            <div className="task-list">
                <div className="sticky-group-title">
                    <div className="task-title-row flex">
                        <div className="sticky-grid flex">
                            <div className="white-background"></div>
                            <div className='colored-tag task-column first-tag' style={{ background: group.style?.color || '#FFF000', border: 'none' }} />
                            <div className="checkbox-column task-column upper-task"
                                onClick={() => { setIsAllSelected(!isAllSelected) }}>
                                <input className='task-checkbox'
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={ev => {
                                        ev.stopPropagation()
                                        setIsAllSelected(!isAllSelected)
                                    }} />
                            </div>
                            <div className="task-title task-column upper-task">Item</div>
                        </div>
                        {board.cmpsOrder.map(cmp => {
                            switch (cmp) {
                                case 'person':
                                    return <div key={cmp} className="task-persons task-column upper-task"><span>Person</span></div>
                                case 'status':
                                    return <div key={cmp} className="task-status task-column upper-task">Status</div>
                                case 'date':
                                    return <div key={cmp} className="task-date task-column upper-task">Date</div>
                                case 'timeline':
                                    return <div key={cmp} className="task-timeline task-column upper-task">Timeline</div>
                                case 'priority':
                                    return <div key={cmp} className="task-status task-column upper-task">Priority</div>
                                case 'files':
                                    return <div key={cmp} className="task-files task-column upper-task">Files</div>
                                case 'checkbox':
                                    return <div key={cmp} className="checkbox task-column upper-task">Check</div>
                                default:
                                    return <div key={cmp} className="task-persons task-column"><span>Person</span></div>
                            }
                        })}
                        <div className="add-colume task-column flex align-center justify-center upper-task">
                            <Icon icon={Add} iconLabel="my bolt svg icon" iconSize={20} ignoreFocusStyle />
                        </div>
                    </div>
                </div>

                <Droppable droppableId={group.id} type="task">
                    {(provided) => (

                        <div className="drag-tasks-container"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {
                                tasks.map((currTask, index) => {
                                    return (
                                        <div onClick={(ev) => { ev.stopPropagation() }} key={currTask.id}>
                                            <Draggable draggableId={currTask?.id} index={index} type="task" key={currTask.id}>
                                                {(provided) => (
                                                    <div

                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        className="task-preview flex"
                                                    >
                                                        <TaskPreview
                                                            index={index}
                                                            key={currTask.id}
                                                            task={currTask}
                                                            onRemoveTask={onRemoveTask}
                                                            setNewTask={setNewTask}
                                                            onTitleInputChange={handleInputChange}
                                                            group={group}
                                                            board={board}
                                                            toggleModal={toggleModal}
                                                            isAllSelected={isAllSelected}
                                                            updateSelectedTasks={updateSelectedTasks}
                                                            columes={columes}
                                                            tasks={tasks}
                                                            setIsDarkScreen={setIsDarkScreen}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        </div>
                                    )
                                })
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <div className="add-task-wrap flex">
                    <div className="sticky-grid flex">
                        <div className="white-background"></div>
                        <div className='colored-tag task-column last-tag' style={{ background: group.style?.color || '#FFF000', border: 'none' }} />

                        <div className="checkbox-column task-column disabled">
                            <input className='task-checkbox disabled' type="checkbox" disabled={true} />
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
                    <div className="filler-div"></div>
                    <div className="mobile-only">
                        <GroupBottomBar board={board} group={group} />
                    </div>
                </div>
                <div className="only-desktop">
                    <GroupBottomBar board={board} group={group} />
                </div>
            </div>
        </div>
    )
}
