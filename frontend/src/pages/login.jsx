import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { login, logout, signup } from '../store/user.actions.js'
import { LoginSignup } from '../cmps/login-signup'
import { Header } from '../cmps/header'

export function Login() {
    const user = useSelector(storeState => storeState.userModule.user)
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const navigate = useNavigate()

    async function onLogin(credentials) {
        try {
            const user = await login(credentials)
            navigate(`/board/${boards?.length ? boards[0]._id : ''}`)
            showSuccessMsg(`Welcome: ${user.fullname}`)
        } catch (err) {
            showErrorMsg('Cannot login')
        }
    }
    async function onSignup(credentials) {
        try {
            const user = await signup(credentials)
            navigate(`/board/${boards?.length ? boards[0]._id : ''}`)
            showSuccessMsg(`Welcome new user: ${user.fullname}`)
        } catch (err) {
            showErrorMsg('Cannot signup')
        }
    }
    async function onLogout() {
        try {
            await logout()
            showSuccessMsg(`Bye now`)
        } catch (err) {
            showErrorMsg('Cannot logout')
        }
    }

    return <section className='login-container'>
        <Header />
        {!user &&
            <section className="login-signup">
                <LoginSignup onLogin={onLogin} onSignup={onSignup} onLogout={onLogout} />
            </section>
        }
    </section>
}