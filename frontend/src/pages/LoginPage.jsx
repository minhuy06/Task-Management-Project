import {useState} from 'react';

const LoginPage = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Data prepared for submission to the backend: ", {username, password});
    }

    return(
        <div style={{ padding: '50px', maxWidth: '300px', margin: '0 auto' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>

                <div style={{marginBottom: '15px'}}>
                    <label>User name: </label> <br />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        />
                </div>

                <div tyle={{ marginBottom: '15px' }}>
                    <label>Password: </label> <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                </div>

                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginPage;