import { useState } from 'react';
import './AuthPage.css';
import { useNavigate } from 'react-router-dom'

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true)

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    // for register
    const [email, setEmail] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');

    // error state
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const navigate = useNavigate()

    const toggleAuthMode = () =>{
        setIsLogin(!isLogin)
        setPassword('')
        setErrorMessage('')
        setSuccessMessage('')
        setConfirmPassword('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('')
        setSuccessMessage('')

        // check password confirmation
        if(!isLogin && password !== confirmPassword){
            setErrorMessage("Password confirm is incorrect")
            return
        }

        // chose API automatically
        const url = isLogin ? 'http://localhost:8080/api/auth/login' : 'http://localhost:8080/api/auth/register'

        // package payload automatically
        const payload = isLogin ? {username, password} : {username, email, password}

        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });

            if(response.ok){
                if(isLogin){
                    const data = await response.json()

                    localStorage.setItem('token', data.token)
                    localStorage.setItem('username', data.username)
                    navigate('/tasks')
                }
                else{
                    setSuccessMessage("Register successfully! Please login again")
                    setIsLogin(true)
                    setPassword('')
                    setConfirmPassword('')
                }
            }
            else{
                const errorText = await response.text()
                setErrorMessage(errorText || 'Having trouble')
            }

        } catch (error){
            setErrorMessage("Unable to connect to server")
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo">
                    <span style={{ color: '#1a4a84', fontSize: '36px', fontWeight: '900', letterSpacing: '-2px' }}>TM</span><br />
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a4a84' }}>CoreTask</span>
                </div>

                <h2 className="login-title">{isLogin ? 'LOGIN' : 'SIGN UP'}</h2>

                {errorMessage && <div style={{ color: 'red', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>{errorMessage}</div>}
                {successMessage && <div style={{ color: 'green', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>User name</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                type="text"
                                placeholder="your.name"
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-wrapper">
                                <span className="input-icon">✉️</span>
                                <input
                                    type="email"
                                    placeholder="your.name@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {isLogin && (
                        <div className="options">
                            <label>
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="#" className="forgot-link">Forgot Password?</a>
                        </div>
                    )}

                    <button type="submit" className="login-btn">
                        {isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                <div className="signup-text">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        className="signup-link"
                        onClick={toggleAuthMode}
                        style={{cursor: 'pointer', textDecoration: 'underline'}}
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </span>
                </div>

                {isLogin && (
                    <div className="social-login">
                        <a href="#">Sign In with Google</a>
                        <a href="#">Sign In with Apple</a>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AuthPage;