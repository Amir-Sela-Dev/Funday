import { useEffect } from 'react'
import { useSelector } from 'react-redux'
// import { loadBoards, addBoard, updateBoard, removeBoard, addToBoardt } from '../store/board.actions.js'

// import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { SideNav } from '../cmps/side-nav.jsx'
import { WorkSpace } from '../cmps/work-space.jsx'
import { BoardDetails } from '../cmps/board/board-details.jsx'
import { Navigate } from 'react-router-dom'

export function AppIndex() {

    // const boards = useSelector(storeState => storeState.boardModule.boards)



    function onOpenBoard(boardId) {
        // setIsBoardOpen(!isMenuOpen)
        Navigate(`/board/${boardId}`)
    }



    return <section className="app-index">

        <SideNav />
        <WorkSpace />
        <BoardDetails />
    </section>

}