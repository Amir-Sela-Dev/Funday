import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
const logoUrl = 'logo.png'

export function Header() {
    const { user } = useSelector((storeState) => storeState.userModule)
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
            <Link className='see-demo' to={`/board/63d81b6d2ee18a0037ce53d3`}>get started ⇨</Link>
        </div>
        {/* </div> */}
    </div>

}