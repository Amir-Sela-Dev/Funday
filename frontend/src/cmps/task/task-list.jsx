import { useState } from "react";
import { boardService } from "../../services/board.service";
import { TaskPreview } from "./task-preview";
import { removeTask, saveBoard, saveTask } from "../../store/board.action"
import { useSelector } from "react-redux";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
import { Add } from "monday-ui-react-core/icons";
import { Icon, MenuButton, Menu, MenuTitle, MenuItem } from "monday-ui-react-core";
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { GroupBottomBar } from "../group/group-bottom-bar";

export function TaskList({ group, tasks, toggleModal, setNewTasks }) {

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

    async function onDuplicateSelectedTasks(isInGroup) {
        if (selectedTasks.length) {
            try {
                for (const selectedTask of selectedTasks) {
                    const { id, ...taskToSave } = selectedTask;
                    await saveTask(board, group.id, taskToSave)
                }
            }
            catch (err) {
                console.log('Could not duplicate tasks', err)
            }
        }
    }
    function updateSelectedTasks(task) {
        setSelectedTasks([...selectedTasks, task])
    }

    function onAddColume(columeName) {
        let boardToSave = structuredClone(board)
        boardToSave.cmpsOrder.push(columeName)
        saveBoard(boardToSave)
    }

    function onRemoveColume(colume) {
        let boardToSave = structuredClone(board)
        let columeIdx = boardToSave.cmpsOrder.findIndex(c => c === colume)
        boardToSave.cmpsOrder.splice(columeIdx, 1)
        saveBoard(boardToSave)
    }

    return (
        <div>
            {/* onDragEnd={handleType1} */}


            <div className="task-list">
                <div className="sticky-group-title">
                    <div className="task-title-row flex">
                        <div className="sticky-grid flex">
                            <div class="white-background"></div>
                            <div className='colored-tag task-column first-tag' style={{ background: group.style?.color || '#FFF000', border: 'none' }} />
                            <div className="checkbox-column task-column upper-task"
                                onClick={() => { setIsAllSelected(!isAllSelected) }}>
                                {/* <div className="colored-tag first-tag" style={{ background: group.style?.color }}></div> */}
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
                                    return <div className="task-persons task-column upper-task"><span>Person</span></div>
                                case 'status':
                                    return <div className="task-status task-column upper-task">Status</div>
                                case 'date':
                                    return <div className="task-date task-column upper-task">Date</div>
                                case 'timeline':
                                    return <div className="task-timeline task-column upper-task">Timeline</div>
                                case 'priority':
                                    return <div className="task-status task-column upper-task">Priority</div>
                                case 'files':
                                    return <div className="task-files task-column upper-task">Files</div>
                                case 'checkbox':
                                    return <div className="checkbox task-column upper-task">Check</div>
                                default:
                                    return <div className="task-persons task-column"><span>Person</span></div>
                            }
                        })}
                        <div className="add-colume task-column flex align-center justify-center upper-task">
                            <Icon icon={Add} iconLabel="my bolt svg icon" iconSize={20} ignoreFocusStyle />
                            <MenuButton>
                                <ul className={"menu-modal board-list-modal"}>
                                    <div className="menu-modal-option flex" onClick={() => { onAddColume('person') }}>
                                        <p className="menu-modal-option-text" >Person</p>
                                    </div>
                                    <div className="menu-modal-option flex" onClick={() => { onAddColume('status') }}>
                                        <p className="menu-modal-option-text" >Status</p>
                                    </div>
                                    <div className="menu-modal-option flex" onClick={() => { onAddColume('date') }}>
                                        <p className="menu-modal-option-text" >Date</p>
                                    </div>
                                    <div className="menu-modal-option flex" onClick={() => { onAddColume('timeline') }}>
                                        <p className="menu-modal-option-text" >Timeline</p>
                                    </div>
                                    <div className="menu-modal-option flex" onClick={() => { onAddColume('priority') }}>
                                        <p className="menu-modal-option-text">priority</p>
                                    </div>
                                    <div className="menu-modal-option flex" onClick={() => { onAddColume('files') }}>
                                        <p className="menu-modal-option-text" >files</p>
                                    </div>
                                    <div className="menu-modal-option flex" onClick={() => { onAddColume('checkbox') }}>
                                        <p className="menu-modal-option-text" >checkbox</p>
                                    </div>
                                </ul>

                            </MenuButton>
                            <MenuButton>
                                <Menu
                                    id="menu"
                                    size="medium"
                                >
                                    <MenuTitle
                                        caption="Remove item"
                                        captionPosition="top"
                                    />

                                    {board.cmpsOrder.map((colume, idx) => {
                                        return <MenuItem
                                            key={idx}
                                            icon={function noRefCheck() { }}
                                            iconType="SVG"
                                            onClick={() => { onRemoveColume(colume) }}
                                            title={`${colume}`}
                                        />
                                    })}

                                </Menu>
                            </MenuButton>
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
                                        <div onClick={(ev) => { ev.stopPropagation() }}>
                                            <Draggable draggableId={currTask.id} index={index} type="task">
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
                        <div class="white-background"></div>
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
