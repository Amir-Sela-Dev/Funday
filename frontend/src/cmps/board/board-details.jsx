import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { loadBoard } from "../../store/board.action"
import { useSelector } from 'react-redux'
import { GroupList } from "../group/group-list"
import { TaskDetails } from "../task/task-details"
import { boardService } from "../../services/board.service"
import { saveBoard } from "../../store/board.action";
import { showSuccessMsg } from "../../services/event-bus.service"

export function BoardDetails() {
    const [boardToSend, setBoardToSend] = useState(null)
    const [modalState, setModalState] = useState(false)
    const [taskId, setTaskId] = useState(null)
    const [filterByToEdit, setFilterByToEdit] = useState(boardService.getDefaultGroupFilter())
    const { boardId } = useParams()

    useEffect(() => {
        onLoadBoard(filterByToEdit)
    }, [])


    function toggleModal(taskId = '') {
        setTaskId(taskId)
        setModalState(!modalState)
    }

    function closeModal() {
        setModalState(!modalState)
    }



    async function onLoadBoard(filterBy) {
        try {
            let board = await loadBoard(boardId, filterBy)
            setBoardToSend({ ...board })
            console.log('Loaded board successfully');
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
        if (!boardToSend?.title.length) setBoardToSend(prevBoard => ({ ...prevBoard }))
        try {
            await saveBoard(boardToSend)
            showSuccessMsg('Group updated')
        } catch (err) {
            console.log('error adding task', err)
        }
    }

    function handleInputChange(event) {
        setBoardToSend({ ...boardToSend, title: event.target.value })
        console.log('boardToSend', boardToSend)
    }

    const infoIcon = 'info.svg'
    const starIcon = 'star.svg'

    if (!boardToSend) return <div>Loading...</div>
    return <section className="board-details">

        <div className="board-title-wrap flex">
            <form onSubmit={onRenameBoard} >
                <input
                    className="board-title"
                    style={{
                        width: `${(boardToSend?.title?.length || 10)}ch`
                    }}
                    type="text"
                    value={boardToSend.title}
                    onChange={handleInputChange}
                    onBlur={ev => { onRenameBoard(ev) }}
                />
            </form>
            <img className="info-icon title-icon" src={require(`/src/assets/img/${infoIcon}`)} />
            <img className="star-icon title-icon" src={require(`/src/assets/img/${starIcon}`)} />
        </div>
        <GroupList board={boardToSend} groups={boardToSend.groups} toggleModal={toggleModal} setFilter={setFilter} />
        <TaskDetails closeModal={closeModal} modalState={modalState} taskId={taskId} />
    </section>
}