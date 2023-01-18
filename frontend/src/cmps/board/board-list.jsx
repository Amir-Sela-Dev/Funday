import { Link } from "react-router-dom"

export function BoardList({ boards }) {
    const boardIcon = 'board.svg'
    const optionIcon = 'option-icon.svg'
    return (
        <ul className="boards-list">
            {boards.map(board =>
                <li className="board-preview flex" key={board._id}>
                    <div className="board-wrap">
                        <img className="board-icon" src={require(`/src/assets/img/${boardIcon}`)} />
                        <Link className="board-preview-link" to={`/board/${board._id}`}>{board.title}</Link>
                    </div>
                    <img className="option-icon board-icon" src={require(`/src/assets/img/${optionIcon}`)} />
                </li>)}
        </ul>
    )
}

