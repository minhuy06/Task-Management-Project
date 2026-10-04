import React, {useState, useEffect} from 'react'
import './Sidebar.css'
import {NavLink} from 'react-router-dom'
import axiosClient from '../../services/axiosClient'

const Sidebar = () => {

    // Data States
    const [categoryCount, setCategoryCount] = useState([])
    const [tagCount, setTagCount] = useState([])

    useEffect(() => {
        fetchSummaryData()
    }, []);

    const fetchSummaryData = async () => {
        try{
            const [categoriesData, tagsData] = await Promise.all([
                axiosClient.get('/categories'),
                axiosClient.get('/tags')
            ])
            setCategoryCount(categoriesData.length)
            setTagCount(tagsData.length)
        } catch (error){
            consol.error("Unable to load summary data", error)
        }
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header" style={{ padding: '20px', fontSize: '24px', fontWeight: 'bold', color: '#1a4a84' }}>
                TM CoreTask
            </div>

            <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 15px' }}>
                <NavLink
                    to="/tasks"
                    style={({isActive}) => ({
                        padding: '12px 15px', textDecoration: 'none', color: isActive ? '#007bff' : '#333',
                        fontWeight: isActive ? 'bold' : 'normal', backgroundColor: isActive ? '#e6f2ff' : 'transparent',
                        borderRadius: '8px'
                    })}
                >
                    My Tasks
                </NavLink>

                <NavLink
                    to="/categories"
                    style={({isActive}) => ({
                        padding: '12px 15px', textDecoration: 'none', color: isActive ? '#007bff' : '#333',
                        fontWeight: isActive ? 'bold' : 'normal', backgroundColor: isActive ? '#e6f2ff' : 'transparent',
                        borderRadius: '8px', display: 'flex', justifyContent: 'space-between'
                    })}
                >
                    <span>Categories</span>
                    <span style={{ background: '#eee', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
                        {categoryCount}
                    </span>
                </NavLink>

                <NavLink
                    to="/tags"
                    style={({isActive}) => ({
                        padding: '12px 15px', textDecoration: 'none', color: isActive ? '#007bff' : '#333',
                        fontWeight: isActive ? 'bold' : 'normal', backgroundColor: isActive ? '#e6f2ff' : 'transparent',
                        borderRadius: '8px', display: 'flex', justifyContent: 'space-between'
                    })}
                >
                    <span>Tags</span>
                    <span style={{ background: '#eee', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
                        {tagCount}
                    </span>
                </NavLink>
            </nav>
        </div>
    )
}
export default Sidebar;