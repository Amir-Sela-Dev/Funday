import { useEffect } from 'react'
import { useSelector } from 'react-redux'
// import { loadBoards, addBoard, updateBoard, removeBoard, addToBoardt } from '../store/board.actions.js'

// import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { SideNav } from '../cmps/side-nav.jsx'
import { WorkSpace } from '../cmps/work-space/work-space'
import { BoardDetails } from '../cmps/board/board-details.jsx'

export function AppIndex() {

    // const boards = useSelector(storeState => storeState.boardModule.boards)






    return <section className="app-index">

        <SideNav />
        <WorkSpace />
        <BoardDetails />
    </section>

}