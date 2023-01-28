import { useEffect, useState, React } from "react"
import { boardService } from "../../services/board.service"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { addActivity, saveGroup, saveTask } from "../../store/board.action"
import { DatePicker, Space, } from 'antd'
import dayjs from "dayjs"
// import { TaskTitle } from "./task-title"
// import { TaskPerson } from "./task-person"
// import { PersonDetails } from "./person-details"
// import { utilService } from "../../services/util.service"
// import { DynamicModal } from "../dynamicModal"
import { File, Check, AddUpdate, Update, Menu } from "monday-ui-react-core/icons";
import { AvatarGroup, Icon, Avatar, StoryDescription, Flex, DialogContentContainer } from "monday-ui-react-core";
// import { ImgUploader } from "../img-uploader"
// import { ListItemIcon } from "monday-ui-react-core"
// import { DropdownChevronRight } from "monday-ui-react-core/icons";
// import { Draggable } from "react-beautiful-dnd"
import { socketService, SOCKET_EMIT_CHANGE_TASK, SOCKET_EVENT_TASK_UPDATED } from "../../services/socket.service"
import { KanbanTaskModal } from "./kanban-task-modal"


export function KanbanTaskPreview({
    task,
    onRemoveTask,
    board,
    group,
    toggleModal,
    isAllSelected,
    updateSelectedTasks,
    tasks

}) {
    const [taskToUpdate, setTaskToUpdate] = useState(task)
    const [isTaskSelected, setIsTaskSelected] = useState(false)
    const [lables, setLables] = useState(boardService.getDefaultLabels())
    const [prioreties, setPriorety] = useState(boardService.getDefaultPriorities())
    const [isPriorityOpen, setIsPriorityOpen] = useState(false)
    const [isPersonsOpen, setIsPersonsOpen] = useState(false)
    const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false)
    const [showOptions, setShowOptions] = useState(false);
    const { RangePicker } = DatePicker;
    const [size, setSize] = useState('small');
    const [isOpen, setIsOpen] = useState(false);
    const [isMark, setIsMark] = useState(false);
    const [isKanbanModalOpen, setIsKanbanModalOpen] = useState(false);
    // const [tasks, setTasks] = useState(group.tasks)
    const [date, setDate] = useState(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };
    const monthFormat = 'MM/DD';

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
    }, [isOpen, isPriorityOpen, isPersonsOpen, isBoardOptionsOpen]);


    async function onAddTaskDate(date) {
        try {
            let taskToSave = structuredClone(task)
            taskToSave.date = date
            date = dayjs(date).format('MMM D')
            console.log(date);
            await saveTask(board, group.id, { ...taskToSave, date }, 'Date', 'Change date')
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    async function onAddTaskTimeline(arrTimeline) {
        try {
            let taskToSave = structuredClone(task)

            // console.log(timeline[0]);
            let startDate = arrTimeline[0]
            let endDate = arrTimeline[1]

            let startDates = dayjs(startDate).format('MMM D')
            let endDates = dayjs(endDate).format('MMM D')
            let timeline = { start: startDates, end: endDates }
            console.log(startDates, endDates);
            await saveTask(board, group.id, { ...taskToSave, timeline }, 'Date', 'Change date')
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    async function onAddTaskPerson(person) {
        try {
            // setTaskToUpdate({ ...taskToUpdate, persons: [...taskToUpdate.persons, person] })
            let taskToSave = structuredClone(task)

            // await addActivity(board, 'Person', 'Add person', taskToSave)
            await saveTask(board, group.id, { ...taskToSave, persons: [...taskToSave.persons, person] }, 'Person', 'Add person')
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    async function onRemoveTaskPerson(person) {
        try {
            let taskToSave = structuredClone(task)
            // setTaskToUpdate({ ...taskToUpdate, persons: [...taskToUpdate.persons.filter(currPerson => currPerson.id !== person.id)] })
            // await addActivity(board, 'Person', 'Remove person', taskToSave)
            await saveTask(
                board,
                group.id,
                { ...taskToSave, persons: [...taskToSave.persons.filter(currPerson => currPerson.id !== person.id)] }, 'Person', 'Remove person')
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }
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
    async function onUploaded(imgUrl) {
        try {
            let taskToSave = structuredClone(task)
            taskToSave.file = imgUrl
            await saveTask(board, group.id, taskToSave, 'File', 'Add file')
        } catch (err) {
            showErrorMsg('Cannot upload file')
        }
    }

    function handleOnDragEnd(result) {
        const items = Array.from(tasks)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        // setTasks(items)
        saveGroupAfterDrag(items)
    }

    async function saveGroupAfterDrag(tasks) {
        try {
            await saveGroup(board, group.id, { ...group, tasks: tasks })
            showSuccessMsg('Group updated')
        } catch (err) {
            console.log('error adding task', err)
        }
    }

    async function onSetMark() {
        try {
            setIsMark(!isMark)
            let taskToSave = structuredClone(task)
            taskToSave.isMark = !taskToSave.isMark
            await saveTask(board, group.id, taskToSave, 'Check', `change value to ${isMark}`)
        } catch (err) {
            showErrorMsg('Cannot upload file')
        }

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


            <div className="kanban-task-txt task-column flex" onClick={() => { setIsKanbanModalOpen(true) }} >
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
                <div className="comments-bubble task-column flex" >
                    <div className="buuble-icon flex justify-center" onClick={() => toggleModal(board, group, task)}>
                        {/* <img className="task-icon" src={require(`/src/assets/img/${(task.comments.length) ? bubble : plusBubble}`)} alt="" /> */}
                        {(task.comments?.length === 0) && <Icon icon={AddUpdate} style={{ color: '#c5c7d0', }} iconLabel="my bolt svg icon" iconSize={22} ignoreFocusStyle />}
                        {task.comments?.length > 0 && <Icon icon={Update} style={{ color: '#0073ea', margin: '6px' }} iconLabel="my bolt svg icon" iconSize={22} ignoreFocusStyle />}
                        {task.comments?.length > 0 && <span className={`comments-num${(task.comments.length) ? '' : 'none'}`}> {(task.comments.length) ? task.comments.length : ''}</span>}
                    </div>
                    <Icon icon={Menu} iconLabel="my bolt svg icon" style={{ width: '22px', height: '22px', color: '#676879' }} iconSize={17} ignoreFocusStyle className="kanban-task-option-icon board-icon" onClick={() => { openOptionModal() }} />
                </div>

            </div>

            {isKanbanModalOpen && <KanbanTaskModal board={board} group={group} task={task} />
            }

        </div>
    )
}
