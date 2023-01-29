import { Link } from "react-router-dom"
const logoUrl = 'logo.png'

export function Header() {
    return <div className="main-header flex">
        {/* <div className="flex align-center"> */}
        <div className="left-side flex">
            <Link to='/'>
                <img className="main-logo" src={require(`../assets/img/${logoUrl}`)} />
                <h1>Funday</h1>
            </Link>
        </div>

        <div className="right-side flex">
            <Link className='login-link' to="/auth/login">Login</Link>
            <Link className='see-demo' to={`/board/63d5b54e7d97b7406caecd80`}>get started ⇨</Link>
        </div>
        {/* </div> */}
    </div>

}