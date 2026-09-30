import {useState, useEffect, useCallBack} from 'react'
import axiosClient from '../services/axiosClient'

export const useTasks = (filters) => {
    const [tasks, setTasks] = useState([])
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [error, setError] = useState([])

    const fetchTasks = useCallBack(async () => {
        try{
            setError(null)
            const params = {
                search: filters.searchQuery,
                category: filters.category === 'All' ? '' : filters.category,
                status: filters.status === 'All' ? '' : filters.status,
                tag: filters.tag === 'All' ? '' : filters.tag
            }
            const data = await axiosClient.get('/tasks', {params})
            setTasks(data)
        } catch (err){
            setError("Unable to load tasks list")
        }
    }, [filters])

    const fetchFilterData = useCallBack(async () => {
        try{
            const [tagsData, categoriesData] = await Promise.all([
                axiosClient.get('/tags'),
                axiosClient.get('/categories')
            ])
            setTasks(tagsData)
            setCategories(categoriesData)
        } catch (error){
            setError("Unable to load tag and category")
        }
    }, [])

    const createTask = async (newTaskData) => {
        try{
            setError(null)
            await axiosClient.post('/tasks', {newTaskData})
            fetchTasks()
            return true
        } catch (err){
            setError("Unable to create a new Task")
            return false
        }
    }

    const updateTaskStatus = async (taskId, newStatus) => {
        setTasks(prev => prev.map(t => t.id.toString() === taskId ? { ...t, status: newStatus } : t))
        try {
            await axiosClient.patch(`/tasks/${taskId}/status`, { status: newStatus })
        } catch (error) {
            setError("Synchronization error. Reloading data...")
            fetchTasks()
        }
    }

    useEffect(() => {
        fetchFilterData()
    }, [fetchFilterData])

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    return { tasks, categories, tags, error, createTask, updateTaskStatus }
}