import { useEffect, useState, React } from "react"
import { boardService } from "../../services/board.service"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { saveGroup, saveTask } from "../../store/board.action"
import { DatePicker } from 'antd'
import dayjs from "dayjs"
import { AddUpdate, Update, Menu } from "monday-ui-react-core/icons";
import { Icon } from "monday-ui-react-core";
import { socketService, SOCKET_EMIT_CHANGE_TASK, SOCKET_EVENT_TASK_UPDATED } from "../../services/socket.service"
import { KanbanTaskModal } from "./kanban-task-modal"

export function KanbanTaskPreview({
    task,
    onRemoveTask,
    board,
    group,
    toggleModal,
    tasks,
    setIsDarkScreen
}) {
    const [taskToUpdate, setTaskToUpdate] = useState(task)
    const [isPriorityOpen, setIsPriorityOpen] = useState(false)
    const [isPersonsOpen, setIsPersonsOpen] = useState(false)
    const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false)
    const { RangePicker } = DatePicker;
    const [size, setSize] = useState('small');
    const [isOpen, setIsOpen] = useState(false);
    const [isMark, setIsMark] = useState(false);
    const [isKanbanModalOpen, setIsKanbanModalOpen] = useState(false);

    useEffect(() => {
        setTaskToUpdate(task)
        socketService.on(SOCKET_EMIT_CHANGE_TASK, renameTaskTitleToAll)
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (event.target.closest('.modal') === null) {
                setIsOpen(false);
                setIsPriorityOpen(false)
                setIsPersonsOpen(false)
                setIsBoardOptionsOpen(false)
            }
        }

        if (isOpen || isPriorityOpen || isPersonsOpen || isBoardOptionsOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [isOpen, isPriorityOpen, isPersonsOpen, isBoardOptionsOpen])

    function handleNameInputChange(event) {
        setTaskToUpdate({ ...taskToUpdate, title: event.target.value })
    }

    async function onRenameTask(event) {
        event.preventDefault()
        try {
            let taskToSave = structuredClone(task)
            taskToSave.title = taskToUpdate.title
            await saveTask(board, group.id, taskToSave, 'Text', `Rename task to ${taskToUpdate.title}`)
            socketService.emit(SOCKET_EVENT_TASK_UPDATED, taskToSave)
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    function renameTaskTitleToAll(task) {
        if (task.id === taskToUpdate.id) setTaskToUpdate(task)
        return
    }

    function openOptionModal() {
        setIsBoardOptionsOpen(!isBoardOptionsOpen)
    }

    async function onDuplicateTask(task) {
        try {
            let copyTask = structuredClone(task)
            copyTask.id = ''
            copyTask.title = 'Copy ' + copyTask.title
            await saveTask(board, group.id, copyTask,)
        } catch (err) {
            showErrorMsg('Cannot duplicate task')
        }
    }


    function onKanbanModal() {
        setIsKanbanModalOpen(true)
        setIsDarkScreen(true)
    }


    const duplicateIcon = 'duplicate.svg'
    const deleteIcon = 'delete.svg'

    const style = { color: ' rgba(0, 0, 0, 0.192)' };
    style.color = ' rgba(0, 0, 0, 0.192)'

    return (
        <div className="orens-div flex" >
            <div className="flex">
                {(isBoardOptionsOpen && board) && <ul className={"menu-modal task-modal modal"} >
                    <div className="menu-modal-option flex " onClick={() => { onDuplicateTask(task) }}>
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
            </div>

            <div className="kanban-task-txt task-column flex"  >
                <div onClick={onKanbanModal}>
                    <form onSubmit={onRenameTask} >
                        <input
                            className="task-title-input"
                            type="text"
                            value={taskToUpdate.title}
                            onChange={handleNameInputChange}
                            onBlur={ev => { onRenameTask(ev) }}
                            onClick={ev => { ev.stopPropagation() }}
                        />
                    </form>
                </div>
                <div className="comments-bubble task-column flex" >
                    <div className="buuble-icon flex justify-center" onClick={() => toggleModal(board, group, task)}>
                        {(task.comments?.length === 0) && <Icon icon={AddUpdate} style={{ color: '#c5c7d0', }} iconLabel="my bolt svg icon" iconSize={22} ignoreFocusStyle />}
                        {task.comments?.length > 0 && <Icon icon={Update} style={{ color: '#0073ea', margin: '6px' }} iconLabel="my bolt svg icon" iconSize={22} ignoreFocusStyle />}
                        {task.comments?.length > 0 && <span className={`comments-num${(task.comments.length) ? '' : 'none'}`}> {(task.comments.length) ? task.comments.length : ''}</span>}
                    </div>
                    <Icon icon={Menu} iconLabel="my bolt svg icon" style={{ width: '22px', height: '22px', color: '#676879' }} iconSize={17} ignoreFocusStyle className="kanban-task-option-icon board-icon" onClick={() => { openOptionModal() }} />
                </div>
            </div>
            {isKanbanModalOpen && <KanbanTaskModal board={board} group={group} task={task} setIsKanbanModalOpen={setIsKanbanModalOpen} isKanbanModalOpen={isKanbanModalOpen} setIsDarkScreen={setIsDarkScreen} />
            }
        </div>
    )
}
