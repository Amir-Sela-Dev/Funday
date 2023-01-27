const logoUrl = 'logo.png'

export function Header() {
    return <div className="main-header flex">
        <img className="main-logo" src={require(`../assets/img/${logoUrl}`)} />
        <h1>Funday</h1>
    </div>

}