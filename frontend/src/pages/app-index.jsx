import { SideNav } from '../cmps/side-nav.jsx'
import { WorkSpace } from '../cmps/work-space/work-space'
import { BoardDetails } from '../cmps/board/board-details.jsx'

export function AppIndex() {

    return <section className="app-index">
        <SideNav />
        <WorkSpace />
        <BoardDetails />
    </section>
}