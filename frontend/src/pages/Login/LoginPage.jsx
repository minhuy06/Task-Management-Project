import { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    // error state
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        setErrorMessage('')

        try{

        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo">
                    <span style={{ color: '#1a4a84', fontSize: '36px', fontWeight: '900', letterSpacing: '-2px' }}>TM</span><br />
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a4a84' }}>CoreTask</span>
                </div>

                <h2 className="login-title">LOGIN</h2>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>User name</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                type="text"
                                placeholder="your.name@email.com"
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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

                    <div className="options">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" className="forgot-link">Forgot Password?</a>
                    </div>

                    <button type="submit" className="login-btn">LOGIN</button>
                </form>

                <div className="signup-text">
                    Don't have an account? <a href="#" className="signup-link">Sign Up</a>
                </div>

                <div className="social-login">
                    <a href="#">Sign In with Google</a>
                    <a href="#">Sign In with Apple</a>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;