import { Link } from "react-router-dom"
const logoUrl = 'logo.png'

export function Header() {
    return <div className="main-header flex">
        <Link to='/'>
            <div className="flex align-center">

                <img className="main-logo" src={require(`../assets/img/${logoUrl}`)} />
                <h1>Funday</h1>
            </div>
        </Link>
    </div>

}