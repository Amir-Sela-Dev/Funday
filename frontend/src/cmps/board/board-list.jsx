import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loadBoard, removeBoard, saveBoard } from "../../store/board.action"
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'
import { boardService } from "../../services/board.service"


export function BoardList({ boards }) {
    const navigate = useNavigate()
    const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false)


    const boardIcon = 'board.svg'
    const optionIcon = 'option-icon.svg'

    async function onLoadBoard(boardId) {
        await loadBoard(boardId)
        navigate(`/board/${boardId}`)
    }

    async function onRemoveBoard(boardId) {
        try {
            await removeBoard(boardId)
            showSuccessMsg('Board removed')
        } catch (err) {
            showErrorMsg('Cannot remove toy')
        }
    }

    async function onDuplicateBoard(boardId) {
        try {
            let duplicateBoard = await boardService.get(boardId)
            duplicateBoard._id = ''
            duplicateBoard.title = 'Copy ' + duplicateBoard.title
            await saveBoard(duplicateBoard)
        } catch (err) {
            showErrorMsg('Cannot duplicate toy')
        }

    }


    const duplicate = 'duplicate.svg'

    return (
        <ul className="boards-list">
            {boards.map(board =>
                <li className="board-preview flex" key={board._id}>
                    <div className="board-wrap">
                        <img className="board-icon" src={require(`/src/assets/img/${boardIcon}`)} />
                        <div className="board-preview-link" onClick={() => { onLoadBoard(board._id) }}>{board.title}</div>
                    </div>
                    <div className="optins flex">
                        <img className="duplicate-icon board-icon" src={require(`/src/assets/img/${duplicate}`)} onClick={() => { onDuplicateBoard(board._id) }} />
                        <div className="delete-board" onClick={() => { onRemoveBoard(board._id) }}>X</div>
                        <img className="option-icon board-icon" src={require(`/src/assets/img/${optionIcon}`)} onClick={() => { setIsBoardOptionsOpen(true) }} />

                    </div>
                    {/* {isBoardOptionsOpen && <div className="board-optins">
                        <div className="delete-board">Delete-board</div>
                        <div className="duplicate-board">Duplicate board</div>
                    </div>
                    } */}
                </li>)}
        </ul>
    )
}

