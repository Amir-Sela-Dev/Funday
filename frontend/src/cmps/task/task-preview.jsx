import { useEffect, useState, React } from "react"
import { boardService } from "../../services/board.service"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { saveGroup, saveTask } from "../../store/board.action"
import { DatePicker, Space, } from 'antd'
import dayjs from "dayjs"
import { PersonDetails } from "./person-details"
import { DynamicModal } from "../dynamicModal"
import { Check, AddUpdate, Update, Menu } from "monday-ui-react-core/icons";
import { AvatarGroup, Icon, Avatar } from "monday-ui-react-core";
import { ImgUploader } from "../img-uploader"
import { socketService, SOCKET_EMIT_CHANGE_TASK, SOCKET_EVENT_TASK_UPDATED } from "../../services/socket.service"


export function TaskPreview({
    task,
    onRemoveTask,
    board,
    group,
    toggleModal,
    isAllSelected,
    updateSelectedTasks,
    index,
    columes,
    tasks,
    setIsDarkScreen

}) {
    const [taskToUpdate, setTaskToUpdate] = useState(task)
    const [isTaskSelected, setIsTaskSelected] = useState(false)
    const [lables, setLables] = useState(boardService.getDefaultLabels())
    const [prioreties, setPriorety] = useState(boardService.getDefaultPriorities())
    const [isPriorityOpen, setIsPriorityOpen] = useState(false)
    const [isPersonsOpen, setIsPersonsOpen] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false)
    const { RangePicker } = DatePicker
    const [size, setSize] = useState('small')
    const [isOpen, setIsOpen] = useState(false)
    const [isMark, setIsMark] = useState(false)
    const [date, setDate] = useState(null)
    const [isImgOpen, setIsImgOpen] = useState(false)

    const handleSizeChange = (e) => {
        setSize(e.target.value)
    }
    const monthFormat = 'MM/DD'

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
                setIsImgOpen(false)
            }
        }

        if (isOpen || isPriorityOpen || isPersonsOpen || isBoardOptionsOpen || isImgOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, [isOpen, isPriorityOpen, isPersonsOpen, isBoardOptionsOpen, isImgOpen]);


    async function onAddTaskDate(date) {
        try {
            let taskToSave = structuredClone(task)
            taskToSave.date = date
            date = dayjs(date).format('MMM D')
            console.log(date);
            await saveTask(board, group.id, { ...taskToSave, date }, 'Date', 'Change date to', date)
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
            await saveTask(board, group.id, { ...taskToSave, timeline }, 'Timeline', timeline, timeline)
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    async function onAddTaskPerson(person) {
        try {
            // setTaskToUpdate({ ...taskToUpdate, persons: [...taskToUpdate.persons, person] })
            let taskToSave = structuredClone(task)

            await saveTask(board, group.id, { ...taskToSave, persons: [...taskToSave.persons, person] }, 'Person', 'Add person', person)
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    async function onRemoveTaskPerson(person) {
        try {
            let taskToSave = structuredClone(task);
            taskToSave.persons = taskToSave.persons.filter(currPerson => currPerson._id !== person._id);
            await saveTask(board, group.id, taskToSave, 'Person', 'Remove person', person);
            showSuccessMsg('Task update');
        } catch (err) {
            showErrorMsg('Cannot update task');
        }
    }

    function handleNameInputChange(event) {

        setTaskToUpdate({ ...taskToUpdate, title: event.target.value })
    }

    async function onRenameTask(event) {
        event.preventDefault()
        try {
            let taskToSave = structuredClone(task)
            let PrevTitle = taskToSave.title
            taskToSave.title = taskToUpdate.title
            await saveTask(board, group.id, taskToSave, 'Text', PrevTitle, taskToSave.title)
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
            await saveTask(board, group.id, taskToSave, 'File', 'Add file', taskToSave.file)
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
            await saveTask(board, group.id, taskToSave, 'Check', 'change Check value to', taskToSave.isMark)
        } catch (err) {
            showErrorMsg('Cannot upload file')
        }

    }
    function onOpenImg() {
        setIsDarkScreen(true)
        setIsImgOpen(true)
    }

    const openTaskIcon = 'open-item.svg'
    const bubble = 'bubble.svg'
    const plusBubble = 'plus-bubble.svg'
    const boardIcon = 'board.svg'
    const optionIcon = 'option-icon.svg'
    const duplicateIcon = 'duplicate.svg'
    const openNewIcon = 'open-new.svg'
    const renameIcon = 'rename.svg'
    const deleteIcon = 'delete.svg'

    const style = { color: ' rgba(0, 0, 0, 0.192)' };
    style.color = ' rgba(0, 0, 0, 0.192)'


    return (
        <div className="orens-div">
            <div className="flex">
                <div className="wrap-modal">
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
                    {isImgOpen && <div className="img-menu-modal modal">
                        <img src={task.file} alt="" />

                    </div>}
                </div>

                <div className="sticky-grid flex">
                    <div className="white-background"></div>
                    <Icon icon={Menu} iconLabel="my bolt svg icon" style={{ width: '22px', height: '22px' }} iconSize={17} ignoreFocusStyle className="task-option-icon board-icon" onClick={() => { openOptionModal() }} />

                    <div className='colored-tag task-column' style={{ background: group.style?.color || '#FFF000', border: 'none' }} />
                    <div className="checkbox-wrap">
                        <div
                            className="checkbox-column task-column"
                            onClick={() => { setIsTaskSelected(!isTaskSelected) }}>

                            <input className='task-checkbox' type="checkbox"
                                checked={isAllSelected || isTaskSelected || false}
                                onChange={ev => {
                                    ev.stopPropagation()
                                    if (!isTaskSelected) updateSelectedTasks(taskToUpdate)
                                    setIsTaskSelected(!isTaskSelected)
                                }} />
                        </div>
                    </div>

                    <div className="task-txt task-column flex" onClick={() => toggleModal(board, group, task)}>
                        {/* <div style={{ width: '30px', backgroundColor: 'red', display: 'flex' }} /> */}
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
                        <div className="comments-bubble flex" onClick={() => toggleModal(board, group, task)}>
                            {/* <img className="task-icon" src={require(`/src/assets/img/${(task.comments.length) ? bubble : plusBubble}`)} alt="" /> */}
                            {(task.comments?.length === 0) && <Icon icon={AddUpdate} style={{ color: '#c5c7d0', }} iconLabel="my bolt svg icon" iconSize={22} ignoreFocusStyle />}
                            {task.comments?.length > 0 && <Icon icon={Update} style={{ color: '#0073ea', margin: '6px' }} iconLabel="my bolt svg icon" iconSize={22} ignoreFocusStyle />}
                            {task.comments?.length > 0 && <span className={`comments-num${(task.comments.length) ? '' : 'none'}`}> {(task.comments.length) ? task.comments.length : ''}</span>}
                        </div>
                    </div>
                </div>

                {board.cmpsOrder.map(cmp => {
                    switch (cmp) {
                        case 'person':
                            return <div className="task-persons task-column flex align-center justify-center"
                                onClick={() => setIsPersonsOpen(!isPersonsOpen)}>

                                {task.persons &&

                                    <AvatarGroup size={Avatar.sizes.SMALL} max={3} vertical >
                                        {task.persons.map(person => <Avatar type={Avatar.types.IMG} size="small" src={person.imgUrl} ariaLabel={person.fullname} />)}
                                    </AvatarGroup>
                                }
                                {isPersonsOpen &&
                                    <div className="user-preview open">
                                        <PersonDetails onAddTaskPerson={onAddTaskPerson} onRemoveTaskPerson={onRemoveTaskPerson} persons={task.persons} />
                                    </div>}
                            </div>
                        case 'status':
                            return <div className="preview-task-status  task-column"
                                onClick={() => { setIsOpen(!isOpen) }}
                                style={{ background: `${(task.status.txt === 'Default') ? 'rgb(185, 185, 185)' : task.status.color}` }}>

                                <span>{`${(task.status.txt === 'Default' || !task.status.txt) ? '' : task.status.txt}`}</span>

                                {isOpen && <DynamicModal task={task} lables={lables} board={board} group={group} lableName='status' />}
                            </div>
                        case 'date':
                            return <div className="task-date task-column">

                                <Space direction="vertical" >
                                    <DatePicker
                                        defaultValue={task.date ? (dayjs(task.date, 'MMM D')) : ''}
                                        bordered={false}
                                        onChange={onAddTaskDate}
                                        placeholder=''
                                        format={'MMM D'}

                                    />
                                </Space>
                            </div>
                        case 'timeline':
                            return <div className="preview-timeline task-column">
                                <Space direction="vertical" >
                                    <RangePicker bordered={false}
                                        style={{ color: '#fff' }}
                                        size={size}
                                        defaultValue={task.timeline ? [dayjs(task.timeline.start, 'MMM D'), dayjs(task.timeline.end, 'MMM D')] : []}
                                        onChange={onAddTaskTimeline}
                                        format={'MMM D'}
                                    // style={{ width: '70%' }} 
                                    />
                                </Space>
                            </div>
                        case 'priority':
                            return <div className="preview-task-status  task-column"
                                onClick={() => { setIsPriorityOpen(!isPriorityOpen) }}
                                style={{ background: `${(task.priority.txt === 'Default') ? 'transparent' : task.priority.color}` }}>

                                <span>{`${(task.priority.txt === 'Default' || !task.priority.txt) ? '' : task.priority.txt}`}</span>
                                {isPriorityOpen && <DynamicModal task={task} lables={prioreties} board={board} group={group} lableName='priority' />}

                            </div>
                        case 'files':
                            return <div className="preview-files  task-column flex align-center justify-center">
                                {!task.file && <ImgUploader onUploaded={onUploaded} />}
                                {task.file && <img src={task.file} style={{ width: '30px', height: '30px' }} onClick={onOpenImg} />}
                            </div>
                        case 'checkbox':
                            return <div className="preview-checkbox  task-column flex align-center justify-center" onClick={() => { onSetMark() }}>
                                {task.isMark && <Icon icon={Check} style={{ color: 'green' }} iconLabel="my bolt svg icon" iconSize={20} ignoreFocusStyle />}
                            </div>
                        default:
                            return <div className="task-persons task-column"><span>Person</span></div>
                    }
                })}
                <div className="preview-add-colume task-column "> </div>
            </div>

        </div>
    )
}
