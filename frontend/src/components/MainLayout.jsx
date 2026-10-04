import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar/Sidebar'

const MainLayout = () => {
    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Sidebar />

            <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f4f6f8' }}>
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout