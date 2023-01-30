import { Tooltip } from "antd";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showSuccessMsg } from "../../services/event-bus.service";
import { saveGroup } from "../../store/board.action";
import { TaskList } from "../task/task-list"
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ColorPicker } from 'monday-ui-react-core'

export function GroupPreview({ board, group, toggleModal, onRemoveGroup, index, setIsDarkScreen }) {
    const [groupToSend, setGroupToSend] = useState({ ...group })
    // let { board } = useSelector((storeState) => storeState.boardModule)
    const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false)
    const [isColorModalOpen, setIsColorModalOpen] = useState(false)
    const [tasks, setTasks] = useState(group.tasks)

    useEffect(() => {
        setTasks(group.tasks)
    }, [board])

    useEffect(() => {
        function handleClickOutside(event) {
            if (event.target.closest('.wrap-group-modal') === null) {
                setIsBoardOptionsOpen(false)
            }
        }

        if (isBoardOptionsOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [isBoardOptionsOpen]);


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

    async function onChangeGroupColor(color) {
        try {
            group.style.color = `var(--color-${color})`
            console.log('changed color to', group.style.color)
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


    // async function onDragEnd(result) {
    //     if (!result.destination) {
    //         return
    //     }
    //     const { draggableId, destination } = result
    //     const id = draggableId
    //     const newIndex = destination.index

    //     const newItems = [...items]
    //     const [removed] = newItems.splice(items.findIndex(i => i.id === id), 1)
    //     newItems.splice(newIndex, 0, removed)
    //     // setItems(newItems)
    //     console.log('newItems@@@@@@@@@@@@@@@@@@@', newItems)

    //     // try {
    //     //     await saveGroup(board, group.id, { ...group, tasks: newItems })
    //     //     // showSuccessMsg('Group updated')
    //     // } catch (err) {
    //     //     // console.log('error adding task', err)
    //     // }
    // }

    function handleOnDragEnd(result) {
        const items = Array.from(tasks)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setTasks(items)
        saveGroupAfterDrag(items)
    }

    function updateTask(tasks) {
        setTasks(tasks)
    }

    return (
        // <DragDropContext onDragEnd={handleOnDragEnd}>
        <section className="group-preview">
            <div className="wrap-group-modal">
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
            </div>
            {/* {(isBoardOptionsOpen && board) && <ul className={"menu-modal group-modal "}>
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
                </ul>} */}

            <div className="sticky-group-title-down flex">
                <div className="group-title-container flex align-center">
                    <img className="option-icon board-icon" src={require(`/src/assets/img/${optionIcon}`)}
                        onClick={() => { openOptionModal() }} />
                </div>

                <form className="sticky-grid" onSubmit={onRenameGroup} >
                    <input
                        className="group-title"
                        style={{
                            color: group.style?.color || "#FFF000",
                            width: `${groupToSend.title.length * 1.125}ch`
                        }}
                        type="text"
                        value={groupToSend.title}
                        onChange={handleInputChange}
                        onBlur={ev => {
                            onRenameGroup(ev, ev.target.value)
                            setIsColorModalOpen(false)
                        }}
                        onClick={() => setIsColorModalOpen(true)}
                    />
                </form>

                <span className='number-of-tasks'>{group.tasks.length} items</span>
            </div>
            {isColorModalOpen &&
                <div style={{ position: 'relative' }}>
                    <ColorPicker
                        className="color-picker"
                        colorList={["red", "blue", "green"]}
                        onSave={val => { onChangeGroupColor(val[0]) }}
                        colorSize={ColorPicker.sizes.SMALL}
                        numberOfColorsInLine={8}
                    />
                </div>
            }
            <TaskList group={group} tasks={tasks} setNewTasks={setNewTasks} toggleModal={toggleModal} index={index} setIsDarkScreen={setIsDarkScreen} />

            <div className="add-task">
            </div>

        </section>
    )
}