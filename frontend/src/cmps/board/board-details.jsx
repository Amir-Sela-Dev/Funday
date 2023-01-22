import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { loadBoard } from "../../store/board.action"
import { useSelector } from 'react-redux'
import { GroupList } from "../group/group-list"
import { TaskDetails } from "../task/task-details"
import { boardService } from "../../services/board.service"
import { saveBoard } from "../../store/board.action";
import { showSuccessMsg } from "../../services/event-bus.service"
import { Tab } from "monday-ui-react-core";
import { Home } from "monday-ui-react-core/icons";

export function BoardDetails() {
    let { board } = useSelector((storeState) => storeState.boardModule)
    const [boardTitle, setBoardTitle] = useState('')
    const [modalState, setModalState] = useState(false)
    const [task, setTask] = useState(null)
    const [group, setGroup] = useState(null)
    const [filterByToEdit, setFilterByToEdit] = useState(boardService.getDefaultGroupFilter())
    const { boardId } = useParams()

    useEffect(() => {
        onLoadBoard(filterByToEdit)
        setBoardTitle('')
    }, [])


    function toggleModal(board, group, task = '') {
        setTask(task)
        setGroup(group)
        setModalState(!modalState)
    }

    function closeModal() {
        setModalState(!modalState)
    }

    async function onLoadBoard(filterBy) {
        try {
            await loadBoard(boardId, filterBy)
            setBoardTitle(board.title)
            console.log('Loaded board successfully', board);
        } catch (err) {
            console.log('Couldn\'t load board..', err);
        }
    }

    function setFilter(filterBy) {
        onLoadBoard(filterBy)
    }

    async function onRenameBoard(event) {
        event.preventDefault()
        console.log('rename board');
        if (!board?.title.length) return
        try {
            await saveBoard({ ...board, title: boardTitle })
            setBoardTitle('')
            showSuccessMsg('Board updated')
        } catch (err) {
            console.log('error changing board name', err)
        }
    }

    function handleInputChange(event) {
        setBoardTitle(event.target.value)
    }

    const infoIcon = 'info.svg'
    const starIcon = 'star.svg'

    if (!board) return <div>Loading...</div>
    return <section className="board-details">

        <div className="board-title-wrap flex">
            <form onSubmit={onRenameBoard} >
                <input
                    className="board-title"
                    style={{
                        width: `${(board?.title?.length - 1.5 || 10)}ch`
                    }}
                    type="text"
                    value={boardTitle || board.title}
                    onChange={handleInputChange}
                    onBlur={ev => { onRenameBoard(ev) }}
                />
            </form>
            <img className="info-icon title-icon" src={require(`/src/assets/img/${infoIcon}`)} />
            <img className="star-icon title-icon" src={require(`/src/assets/img/${starIcon}`)} />
        </div>
        <Tab className='board-details-tab' style={{ color: "  #0070e5" }} icon={Home} active>
            Main Table
        </Tab>
        <GroupList board={board} toggleModal={toggleModal} setFilter={setFilter} />
        <TaskDetails closeModal={closeModal} modalState={modalState} task={task} group={group} board={board} />
    </section>
}