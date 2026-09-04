import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
// import LoginPage from './pages/Login/LoginPage';

function App() {
    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
            <Sidebar />
        </div>
    );
}

export default App;