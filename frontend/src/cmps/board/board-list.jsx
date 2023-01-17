import { Link } from "react-router-dom"

export function BoardList({ boards }) {

    return (
        <ul className="boards-list">
            {boards.map(board =>
                <li className="board-preview flex" key={board._id}>
                    <div>
                        <Link className="board-preview-link" to={`/board/${board._id}`}>{board.title}</Link>
                        <button className="option-btn" onClick={() => { }}>...</button>
                    </div>
                </li>)}
        </ul>
    )
}