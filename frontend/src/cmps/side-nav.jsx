import { useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { logout } from '../store/user.actions.js'

export function SideNav() {
    const navigate = useNavigate()
    const user = useSelector(storeState => storeState.userModule.user)
    const [isUserModalOpen, setIsUderModalOpen] = useState(false)

    function toggleModal() {
        setIsUderModalOpen(!isUserModalOpen)
    }

    async function onLogout() {
        try {
            await logout()
            // setIsUderModalOpen(!isUserModalOpen)
            navigate(`/board/uPD5q`)
            showSuccessMsg(`Bye now`)
        } catch (err) {
            showErrorMsg('Cannot logout')
        }
    }

    const logoUrl = 'logo.png'
    const workManagmentUrl = 'work-managment.svg'
    const componemtUrl = 'icon-component.svg'
    const profileUrl = 'my-profile.svg'
    const logoutUrl = 'logout.svg'
    const loginUrl = 'login.svg'

    return (

        <nav className="side-nav">
            <div className="high-nav">
                <Link to='/'>
                    <img className="main-logo" src={require(`../assets/img/${logoUrl}`)} />
                </Link>
                <div className="logo-hr"></div>
                <img className="work-managment-icon" src={require(`../assets/img/${workManagmentUrl}`)} />
            </div>

            <div className="low-nav flex">

                <div className="logo-hr"></div>

                <img className="component-icon" src={require(`../assets/img/${componemtUrl}`)} />

                {!user && <img src='https://res.cloudinary.com/dp3tok7wg/image/upload/v1674331758/g-profile_zylwbg.png'
                    onClick={toggleModal} alt="" className="main-user-nav" />}

                {user && <img src={user.imgUrl} alt="" className="main-user-nav" onClick={toggleModal} />}

                {isUserModalOpen && <div className="user-modal">

                    {!user && <Link to="/auth/login">
                        <div className="login-wrap flex">
                            <img className="nav-icon login-icon" src={require(`../assets/img/${loginUrl}`)} />
                            <p> Login</p>
                        </div>
                    </Link>}

                    {user && <Link to={`/user/${user._id}`}>
                        <div className="profile-wrap flex">
                            <img className="nav-icon profile-icon" src={require(`../assets/img/${profileUrl}`)} />
                            <p>My profile</p>
                        </div>
                    </Link>}

                    {user && <div className="logout-wrap flex" onClick={onLogout}>
                        <img className="nav-icon logout-icon" src={require(`../assets/img/${logoutUrl}`)} />
                        <p >Logout</p>
                    </div>}
                </div>}

            </div>
        </nav >
    )
}
