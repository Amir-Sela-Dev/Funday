import { DialogContentContainer, ListItem, ListItemIcon } from "monday-ui-react-core";
import { Board, Menu } from "monday-ui-react-core/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { boardService } from "../../services/board.service";
import { socketService, SOCKET_EMIT_LOAD_BOARD, SOCKET_EMIT_SET_TOPIC } from "../../services/socket.service";
import { loadBoard, removeBoard, saveBoard } from "../../store/board.action"

export function BoardListMenu({ setBoardListModal }) {
    let { boards } = useSelector((storeState) => storeState.boardModule)
    const navigate = useNavigate()
    const [isClicked, setIsClicked] = useState(false)
    const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false)
    const [modalTransform, setModalTransform] = useState('')
    const [borad, setBoard] = useState(null)
    console.log(boards)

    async function onLoadBoard(boardId) {
        await loadBoard(boardId)
        closeModal()
        navigate(`/board/${boardId}`)
        setIsClicked(boardId)
        console.log(isClicked);
    }

    function onCloseInviteModal() {
        setBoardListModal(false)
    }
    async function onRemoveBoard(boardId) {
        try {
            await removeBoard(boardId)
            closeModal()
            setIsClicked(boards[0]._id)
        } catch (err) {
            console.log(err)
        }
    }

    async function onDuplicateBoard(boardId) {
        try {
            let duplicateBoard = await boardService.get(boardId)
            delete duplicateBoard._id
            duplicateBoard.title = 'Copy ' + duplicateBoard.title
            await saveBoard(duplicateBoard)
            closeModal()
        } catch (err) {
            console.log(err)
        }

    }

    function openOptionModal(boardId, i) {
        setModalTransform(25 + (29 * i))
        const currBoard = boards.find(board => board._id === boardId)
        setBoard(currBoard)
        setIsBoardOptionsOpen(!isBoardOptionsOpen)
    }

    function closeModal() {
        setBoard(null)
        setIsBoardOptionsOpen(!isBoardOptionsOpen)
    }

    const loader2 = 'Loader2.svg'

    if (!boards) return <img className="loader" src={require(`/src/assets/img/${loader2}`)} />
    return (
        <div className="invite-modal">
            <div onClick={onCloseInviteModal} className="dark-screen static" />
            <DialogContentContainer className="invite-menu" type={DialogContentContainer.types.MODAL}
                style={
                    {
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'

                    }
                }>
                <span className="boards-title-mobile">Boards</span>
                <ul className="boards-list">
                    {
                        boards.map((board, i) =>
                            <ListItem className={`board-item ${(isClicked === board._id) ? 'isClicked' : ''}`} key={board._id}>
                                <div className='board-wrap' onClick={() => { onLoadBoard(board._id) }} >
                                    <ListItemIcon icon={Board} />
                                    <span className="board-preview-link" onClick={() => { onLoadBoard(board._id) }}>{board.title}</span>
                                </div>
                                <div onClick={() => { openOptionModal(board._id, i) }}>
                                    <ListItemIcon className="board-menu-icon" icon={Menu} />
                                </div>
                            </ListItem>
                        )}
                </ul >
            </DialogContentContainer>
        </div>
    )
}