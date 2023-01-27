import { useState, useEffect } from 'react'
import { userService } from '../services/user.service'
import { ImgUploader } from '../cmps/img-uploader'
import { Header } from './header'
import { useNavigate } from 'react-router-dom'
import { TextField } from 'monday-ui-react-core'

export function LoginSignup(props) {
    const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })
    const [isSignup, setIsSignup] = useState(false)
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    useEffect(() => {
        loadUsers()
    }, [])


    const [inputFocus, setInputFocus] = useState(false);
    const [error, setError] = useState(false);


    const handleInputFocus = () => {
        setInputFocus(true)
    };

    const handleInputBlur = () => {
        setInputFocus(false);
    };

    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
        setIsSignup(false)
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    function handleClick() {
        setIsValidEmail(true)
    }
    async function onLoginSubmit(ev = null) {
        ev.preventDefault()
        setIsValidEmail(emailRegex.test(credentials.username))

        props.onLogin(credentials)
        clearState()
    }

    function checkEmailValidation(val) {
        if (emailRegex.test(val)) {
            setIsValidEmail(true)

        }
        else setIsValidEmail(false)
    }
    function onSignupSubmit(ev = null) {
        if (ev) ev.preventDefault()
        if (!credentials.username || !credentials.password || !credentials.fullname) return
        props.onSignup(credentials)
        toggleSignup()
        clearState()
    }

    function toggleSignup() {
        setIsSignup(!isSignup)
    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <div className="login-page">
            {!isSignup && <form className="login-form" onSubmit={onLoginSubmit}>
                <div className="login-form-title">
                    <h2 className='log-title'>Log</h2><h2 className='in-title'>in</h2>
                </div>
                <p>Welcome back</p>
                <div className="email-wrap">
                    {/* <TextField
                        className="some-input"
                        name="username"
                        validation={isValidEmail ? undefined : { status: 'error', text: 'Invalid email address' }}
                        onFocus={() => setIsValidEmail(true)}
                        title={"Name"}
                        // autoComplete="on"
                        autoFocus={true}
                        orientation="horizontal"
                    /> */}
                    <label htmlFor="username">Email</label>
                    <div className='full-input'>
                        <input
                            className={`email ${isValidEmail ? '' : 'error'} ${inputFocus ? 'focused' : ''}`}
                            placeholder='Enter email address..'
                            type="text"
                            name="username"
                            // value={username}
                            onClick={handleClick}
                            onChange={handleChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            required
                            autoFocus
                        />
                        {!isValidEmail && <div className='login-err-msg'>Invalid email!@</div>}
                    </div>
                </div>
                <div className="password-wrap">
                    <label htmlFor="password">Password</label>
                    <input
                        className='password'
                        type="password"
                        name="password"
                        placeholder='Enter password..'
                        // value={password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <p className='new-password'>Forgot your password?</p>
                <button>Login</button>
                <div className="signup-wrap">
                    <span className='separator-line'></span>
                    <hr />
                    <p>Or Sign in with</p>
                    <span className='separator-line'></span>
                </div>
                <p>
                    <button className="btn-link" type='button' onClick={toggleSignup}>{!isSignup ? 'Signup' : 'Login'}</button>
                </p>
            </form>}
            <div className="signup-section">
                {isSignup && <form className="signup-form" onSubmit={onSignupSubmit}>
                    <input
                        type="text"
                        name="fullname"
                        value={credentials.fullname}
                        placeholder="Fullname"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <ImgUploader onUploaded={onUploaded} />
                    <button >Signup!</button>
                </form>}
            </div>
        </div>
    )
}