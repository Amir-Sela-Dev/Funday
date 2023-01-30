import { useState, useEffect } from "react";
import { showSuccessMsg } from "../../services/event-bus.service";
import { saveGroup } from "../../store/board.action";
import { TaskList } from "../task/task-list"
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ColorPicker } from 'monday-ui-react-core'

export function GroupPreview({ board, group, toggleModal, onRemoveGroup, index, setIsDarkScreen }) {
    const [groupToSend, setGroupToSend] = useState({ ...group })
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

    const optionIcon = 'option-icon.svg'
    const duplicateIcon = 'duplicate.svg'
    const deleteIcon = 'delete.svg'


    return (
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