import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { boardService } from "../services/board.service"
import { showErrorMsg } from "../services/event-bus.service"
import { loadBoards, saveBoard } from "../store/board.action"
const logoUrl = 'logo.png'

export function Header() {
    const { user } = useSelector((storeState) => storeState.userModule)
    const { boards } = useSelector((storeState) => storeState.boardModule)

    useEffect(() => {
        onLoadBoards()
    }, [])

    async function onLoadBoards() {
        try {
            await loadBoards()
            if (!boards.length) {
                await loadBoards()
            }
        }
        catch (err) {
            showErrorMsg('Cannot load boards')
        }
    }

    return <div className="main-header flex">
        <div className="left-side flex">
            <Link to='/'>
                <img className="main-logo" src={require(`../assets/img/${logoUrl}`)} />
                <h1>Funday</h1>
            </Link>
        </div>
        <div className="right-side flex" style={{ alignItems: 'center' }}>
            {!user &&
                <Link className='login-link' to="/auth/login">Login</Link>
            }
            {user &&
                <span style={{ marginRight: '20px' }}>Welcome back
                    <span style={{
                        fontWeight: '600',
                        marginLeft: '6px'
                    }}>{user.fullname.split(' ')[0]}</span>
                    !
                </span>}
            <Link className='see-demo' to={`/board/${boards[0]?._id || '63d81b6d2ee18a0037ce53d3'}`}>get started ⇨</Link>
        </div>
        {/* </div> */}
    </div>

}