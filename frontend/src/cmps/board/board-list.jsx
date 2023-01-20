import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loadBoard, removeBoard, saveBoard } from "../../store/board.action"
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'
import { boardService } from "../../services/board.service"

export function BoardList({ boards }) {
    const navigate = useNavigate()
    const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false)
    const [board, setBoard] = useState(null)

    async function onLoadBoard(boardId) {
        await loadBoard(boardId)
        closeModal()
        navigate(`/board/${boardId}`)
    }

    async function onRemoveBoard(boardId) {
        try {
            await removeBoard(boardId)
            closeModal()
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
            closeModal()
        } catch (err) {
            showErrorMsg('Cannot duplicate toy')
        }

    }

    function openOptionModal(boardId) {
        const currBoard = boards.find(board => board._id === boardId)
        setBoard(currBoard)
        setIsBoardOptionsOpen(!isBoardOptionsOpen)
    }

    function closeModal() {
        setBoard(null)
        setIsBoardOptionsOpen(!isBoardOptionsOpen)
    }

    const boardIcon = 'board.svg'
    const optionIcon = 'option-icon.svg'
    const duplicateIcon = 'duplicate.svg'
    const openNewIcon = 'open-new.svg'
    const renameIcon = 'rename.svg'
    const deleteIcon = 'delete.svg'

    return (
        <ul className="boards-list">

            {(isBoardOptionsOpen && board) && <ul className="menu-modal board-list-modal" >
                <div className="menu-modal-option first flex">
                    <img className="filter-icon board-icon" src={require(`/src/assets/img/${openNewIcon}`)}
                        onClick={() => { onLoadBoard(board._id) }} />
                    <p className="menu-modal-option-text">Open Board in New Tab</p>
                </div>
                <hr />
                <div className="menu-modal-option flex">
                    <img className="filter-icon board-icon" src={require(`/src/assets/img/${renameIcon}`)} />
                    <p className="menu-modal-option-text">Rename</p>
                </div>
                <div className="menu-modal-option flex">
                    <img className="filter-icon board-icon" src={require(`/src/assets/img/${duplicateIcon}`)}
                        onClick={() => { onDuplicateBoard(board._id) }} />
                    <p className="menu-modal-option-text">Duplicate</p>
                </div>
                <div className="menu-modal-option flex">
                    <img className="filter-icon board-icon" src={require(`/src/assets/img/${deleteIcon}`)}
                        onClick={() => { onRemoveBoard(board._id) }} />
                    <p className="menu-modal-option-text" >Delete</p>
                </div>
            </ul>}

            {boards.map(board =>
                <li className="board-preview flex" key={board._id}>
                    <div className="board-wrap">
                        <img className="board-icon" src={require(`/src/assets/img/${boardIcon}`)} />
                        <div className="board-preview-link" onClick={() => { onLoadBoard(board._id) }}>{board.title}</div>
                    </div>

                    <img className="option-icon board-icon" src={require(`/src/assets/img/${optionIcon}`)}
                        onClick={() => { openOptionModal(board._id) }} />
                </li>)}
        </ul>
    )
}
