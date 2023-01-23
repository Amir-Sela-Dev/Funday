import { useEffect, useState, React } from "react"
import { boardService } from "../../services/board.service"
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service"
import { addActivity, saveTask } from "../../store/board.action"
import { DatePicker, Space, } from 'antd'
import dayjs from "dayjs"
import { TaskTitle } from "./task-title"
import { TaskPerson } from "./task-person"
import { PersonDetails } from "./person-details"
import { utilService } from "../../services/util.service"
import { DynamicModal } from "../dynamicModal"
import { File, Check } from "monday-ui-react-core/icons";
import { Icon } from "monday-ui-react-core";
import { ImgUploader } from "../img-uploader"


export function TaskPreview({
    task,
    onRemoveTask,
    board,
    group,
    toggleModal,
    isAllSelected,
    updateSelectedTasks,
    columes }) {
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
    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };
    const monthFormat = 'MM/DD';

    useEffect(() => {
        setTaskToUpdate(task)
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
            console.log('lalalal', taskToSave);
            await saveTask(board, group.id, { ...taskToSave, date }, 'Date', 'Change date')
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    async function onAddTaskPerson(person) {
        console.log('person added', person)
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

            await saveTask(board, group.id, taskToSave, 'Text', 'Rename task')
            showSuccessMsg('Task update')
        } catch (err) {
            showErrorMsg('Cannot update task')
        }
    }

    function openOptionModal() {
        setIsBoardOptionsOpen(!isBoardOptionsOpen)
    }

    async function onDuplicateTask(task) {
        try {
            let copyTask = structuredClone(task)
            copyTask.id = ''
            copyTask.title = 'Copy ' + copyTask.title
            await saveTask(board, group.id, copyTask)
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






    console.log(task.status.txt);

    // function showTimeLine() {
    //     return <DialogContentContainer className={styles.datepickerDialogContentContainer}>
    //         <DatePicker date={date.startDate} endDate={date.endDate} range data-testid="date-picker" onPickDate={d => setDate(d)} />
    //     </DialogContentContainer>;
    // }

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
        <div
            className="task-preview flex"
        >
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

            {/* {showOptions && <img className="task-option-icon board-icon" src={require(`/src/assets/img/${optionIcon}`)}
                onClick={() => { openOptionModal() }} />} */}

            <img className="task-option-icon board-icon" src={require(`/src/assets/img/${optionIcon}`)}
                onClick={() => { openOptionModal() }} />

            <div
                className="checkbox-column task-column"
                onClick={() => { setIsTaskSelected(!isTaskSelected) }}>
                <div className='colored-tag' style={{ background: group.style?.color || '#FFF000' }} />
                <input className='task-checkbox' type="checkbox"
                    checked={isAllSelected || isTaskSelected || false}
                    onChange={ev => {
                        ev.stopPropagation()
                        if (!isTaskSelected) updateSelectedTasks(taskToUpdate)
                        setIsTaskSelected(!isTaskSelected)
                    }} />
            </div>

            <div className="task-txt task-column flex" onClick={() => toggleModal(board, group, task)}>
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
                <div className="comments-bubble task-column">
                    <img className="task-icon" src={require(`/src/assets/img/${(task.comments.length) ? bubble : plusBubble}`)} alt="" />
                    <span className={`comments-num${(task.comments.length) ? '' : 'none'}`}> {(task.comments.length) ? task.comments.length : ''}</span>
                </div>
            </div>


            {columes.includes('person') && <div className="task-persons task-column flex align-center justify-center"
                onClick={() => setIsPersonsOpen(!isPersonsOpen)}>
                {task.persons && !isPersonsOpen &&
                    task.persons.map(currPerson => {
                        return <TaskPerson key={currPerson.id} person={currPerson} />
                    })}
                {isPersonsOpen &&
                    <div className="user-preview open">
                        <PersonDetails onAddTaskPerson={onAddTaskPerson} onRemoveTaskPerson={onRemoveTaskPerson} persons={task.persons} />
                    </div>}
            </div>}

            {columes.includes('status') && <div className="preview-task-status  task-column"
                onClick={() => { setIsOpen(!isOpen) }}
                style={{ background: `${(task.status.txt === 'Default') ? 'transparent' : task.status.color}` }}>

                <span>{`${(task.status.txt === 'Default' || !task.status.txt) ? '' : task.status.txt}`}</span>

                {isOpen && <DynamicModal task={task} lables={lables} board={board} group={group} lableName='status' />}
            </div>}

            {columes.includes('date') && <div className="task-date task-column">
                {/* {(task.date - Date.now() > 0)  && 'x'} */}
                <DatePicker
                    defaultValue={task.date ? dayjs(task.date) : ''}
                    bordered={false}
                    onChange={onAddTaskDate}
                    placeholder=""
                    format={'MMM D'}
                    suffixIcon
                />
            </div>}

            {columes.includes('timeline') && <div className="preview-timeline task-column">
                <Space direction="vertical" >
                    <RangePicker bordered={false}
                        size={size}
                        defaultValue={dayjs('2015/01', monthFormat)}
                        format={'MMM D'}
                    // style={{ width: '70%' }} 
                    />
                </Space>
            </div>}

            {columes.includes('priority') && <div className="preview-task-status  task-column"
                onClick={() => { setIsPriorityOpen(!isPriorityOpen) }}
                style={{ background: `${(task.priority.txt === 'Default') ? 'transparent' : task.priority.color}` }}>

                <span>{`${(task.priority.txt === 'Default' || !task.priority.txt) ? '' : task.priority.txt}`}</span>
                {isPriorityOpen && <DynamicModal task={task} lables={prioreties} board={board} group={group} lableName='priority' />}

            </div>}

            {columes.includes('files') && <div className="preview-files  task-column flex align-center justify-center">
                {!task.file && <ImgUploader onUploaded={onUploaded} />}
                {task.file && <img src={task.file} style={{ width: '30px', height: '30px' }} />}
            </div>}

            {columes.includes('checkbox') && <div className="preview-checkbox  task-column flex align-center justify-center" onClick={() => { setIsMark(!isMark) }}>
                {isMark && <Icon icon={Check} style={{ color: 'green' }} iconLabel="my bolt svg icon" iconSize={20} ignoreFocusStyle />}
            </div>
            }
            <div className="preview-add-colume task-column "> </div>

        </div>
    )
}
