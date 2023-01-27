import { SideNav } from '../cmps/side-nav.jsx'
import { WorkSpace } from '../cmps/work-space/work-space'
import { BoardDetails } from '../cmps/board/board-details.jsx'
import { useState } from 'react'

export function AppIndex() {

    const [isMenuClose, setIsMenuClose] = useState(false)

    function toggleWorkspace() {
        setIsMenuClose(!isMenuClose)
    }

    return <section className={`app-index ${isMenuClose ? 'closeMenu' : ''}`}>
        <SideNav />
        <WorkSpace toggleWorkspace={toggleWorkspace} />
        <BoardDetails />
    </section>
}