import { Link } from "react-router-dom"

export function SideNav() {
    const logoUrl = 'logo.png'
    const workManagmentUrl = 'work-managment.svg'
    const componemtUrl = 'icon-component.svg'
    return (
        <nav className="side-nav">
            <div className="high-nav">

                <img className="main-logo" src={require(`../assets/img/${logoUrl}`)} />
                <div className="logo-hr"></div>
                <img className="work-managment-icon" src={require(`../assets/img/${workManagmentUrl}`)} />
            </div>

            <div className="low-nav flex">
                <div class="logo-hr"></div>
                <img className="component-icon" src={require(`../assets/img/${componemtUrl}`)} />
                <Link to="/auth/login">
                    <img src='https://res.cloudinary.com/dp3tok7wg/image/upload/v1674331758/g-profile_zylwbg.png' alt="" className="main-user-nav" />
                </Link>
            </div>
        </nav>
    )
}
