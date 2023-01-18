import { Link, useNavigate } from "react-router-dom"
import { loadBoard } from "../../store/board.action"

export function BoardList({ boards }) {
    const navigate = useNavigate()

    const boardIcon = 'board.svg'
    const optionIcon = 'option-icon.svg'

    async function onLoadBoard(boardId) {
        await loadBoard(boardId)
        navigate(`/board/${boardId}`)
    }

    return (
        <ul className="boards-list">
            {boards.map(board =>
                <li className="board-preview flex" key={board._id}>
                    <div className="board-wrap">
                        <img className="board-icon" src={require(`/src/assets/img/${boardIcon}`)} />
                        <div className="board-preview-link" onClick={() => { onLoadBoard(board._id) }}>{board.title}</div>
                    </div>
                    <img className="option-icon board-icon" src={require(`/src/assets/img/${optionIcon}`)} />
                </li>)}
        </ul>
    )
}

