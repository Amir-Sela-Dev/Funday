import { Tooltip } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showSuccessMsg } from "../../services/event-bus.service";
import { saveGroup } from "../../store/board.action";
import { TaskList } from "../task/task-list"
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { KanbanTaskList } from "./kanban-task-list";

export function KanbanGroupPreview({ board, group, toggleModal, onRemoveGroup, index }) {
    const [groupToSend, setGroupToSend] = useState({ ...group })
    // let { board } = useSelector((storeState) => storeState.boardModule)
    const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false)
    const [tasks, setTasks] = useState(group.tasks)

    useEffect(() => {
        setTasks(group.tasks)
    }, [board])

    async function saveGroupAfterDrag(tasks) {
        try {
            await saveGroup(board, group.id, { ...group, tasks: tasks })
            showSuccessMsg('Group updated')
        } catch (err) {
            console.log('error adding task', err)
        }
    }

    function setNewTasks(tasks) {
        setTasks(tasks)
    }

    async function onRenameGroup(event) {
        event.preventDefault()
        if (!groupToSend?.title.length) setGroupToSend(prevGroup => ({ ...prevGroup }))
        try {
            group.title = groupToSend.title
            await saveGroup(board, group.id, group)
            showSuccessMsg('Group updated')
        } catch (err) {
            console.log('error adding task', err)
        }
    }

    function handleInputChange(event) {
        setGroupToSend({ ...groupToSend, title: event.target.value })
    }

    function openOptionModal() {
        setIsBoardOptionsOpen(!isBoardOptionsOpen)
    }

    const boardIcon = 'board.svg'
    const optionIcon = 'option-icon.svg'
    const duplicateIcon = 'duplicate.svg'
    const openNewIcon = 'open-new.svg'
    const renameIcon = 'rename.svg'
    const deleteIcon = 'delete.svg'



    return (
        // <DragDropContext onDragEnd={handleOnDragEnd}>
        <section className="kanban-group-preview flex">
            {/* <div className="wrap-group-modal">
                {(isBoardOptionsOpen && board) && <ul className={"menu-modal group-modal "}>
                    <div className="menu-modal-option flex">
                        <img className="filter-icon board-icon" src={require(`/src/assets/img/${duplicateIcon}`)}
                            onClick={() => { }} />
                        <p className="menu-modal-option-text">Duplicate</p>
                    </div>
                    <div className="menu-modal-option flex">
                        <img className="filter-icon board-icon" src={require(`/src/assets/img/${deleteIcon}`)}
                            onClick={() => { onRemoveGroup(group.id) }} />
                        <p className="menu-modal-option-text" >Delete</p>
                    </div>
                </ul>}
            </div> */}

            <div className="kanban-tittle-wrapper flex justify-center">
                <div className="kanban-group-title flex align-center">
                    {group.title}
                </div>
            </div>

            <div className="kanban-card-container">
                aaaaa
            </div>

            {/* <TaskList group={group} tasks={tasks} setNewTasks={setNewTasks} toggleModal={toggleModal} index={index} /> */}
            <KanbanTaskList group={group} tasks={tasks} setNewTasks={setNewTasks} toggleModal={toggleModal} index={index} />

            <div className="add-task">
                + Add item
            </div>

            <div className="kanban-color"></div>

        </section>
    )
}