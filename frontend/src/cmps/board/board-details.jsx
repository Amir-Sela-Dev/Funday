import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { loadBoard } from "../../store/board.action"
import { useSelector } from 'react-redux'
import { GroupList } from "../group/group-list"
import { TaskDetails } from "../task/task-details"

export function BoardDetails() {
    const [currboard, setBoard] = useState(null)
    const [modalState, setModalState] = useState(false)
    const [taskId, setTaskId] = useState(null)
    let { board } = useSelector((storeState) => storeState.boardModule)

    function toggleModal(taskId = '') {
        setTaskId(taskId)
        setModalState(!modalState)
    }

    function closeModal() {
        setModalState(!modalState)
    }

    const { boardId } = useParams()

    useEffect(() => {
        onLoadBoard()
    }, [])

    async function onLoadBoard() {
        let board = await loadBoard(boardId)
        setBoard(board)
    }

    const infoIcon = 'info.svg'
    const starIcon = 'star.svg'

    if (!board) return <div>Loading...</div>
    const { groups } = board
    return <section className="board-details">

        <div className="board-title-wrap flex">
            <h1 className="board-title">{board.title}</h1>
            <img className="info-icon title-icon" src={require(`/src/assets/img/${infoIcon}`)} />
            <img className="star-icon title-icon" src={require(`/src/assets/img/${starIcon}`)} />
        </div>
        <GroupList board={board} groups={groups} toggleModal={toggleModal} />
        <TaskDetails closeModal={closeModal} modalState={modalState} taskId={taskId} />
    </section>
}