
export function SideNav() {
    const logoUrl = 'logo.png'
    const workManagmentUrl = 'work-managment.svg'
    return (
        <nav className="side-nav">
            <img className="main-logo" src={require(`../assets/img/${logoUrl}`)} />
            <div className="logo-hr"></div>
            <img className="work-managment-icon" src={require(`../assets/img/${workManagmentUrl}`)} />
        </nav>
    )
}
