import {useState} from 'react';
import TaskHeader from './components/TaskHeader'
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import './MyTasksPage.css';

const MyTasksPage = () => {
    const [tasks, setTasks] = useState([])
    const [filters, setFilters] = useState({
        searchQuery: '',
        status: 'All',
        category: 'All',
        tag: 'All'
    })
    const [selectedTaskIds, setSelectedTaskIds] = useState([])
    const [error, setError] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const todoTasks = tasks.filters(task => !task.isCompleted)
    const completedTasks = tasks.filters(task => task.isCompleted)

    const fetchTasks = async () => {
        try{
            setError(null)

            // building query string from filters object
            const queryParams = new URLSearchParams({
                search: filters.searchQuery,
                category: filters.category === 'All' ? '' : filters.category,
                status: filters.status === 'All' ? '' : filters.status,
                tag: filters.tag === 'All' ? '' : filters.tag
            }).toString()

            // spring boot end point
            const response = await fetch(`http://localhost:8080/api/tasks?${queryParams}`)
            if(!response.ok) throw new Error('Unable to load data from server')

            const data = await response.json()
            setTasks(data)
        } catch (err){
            console.error("Fetch API error: ",err)
            setError(err.message)
        }
    }

    // API call to java
    useEffect(() => {
        fetchTasks()
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: value
        }))
    }

    // selected/deselected task
    const handleSelectTask = (taskId) => {
        setSelectedTaskIds(prevIds => {

            // if Ids array include tasksId -> remove
            if(prevIds.includes(taskId)){
                return prevIds.filter(id => id !== taskId)
            }

            return [...prevIds, tasksId]
        })
    }

    // batch complete
    const handleBatchComplete = async () => {
        try{
            setError(null)
            const response = await fetch('http://localhost:8080/api/tasks/batch-complete', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({tagIds: selectedTaskIds})
            })

            if(response.ok){
                setSelectedTaskIds([])
                fetchTasks()
            }
            else{
                setError("Unable to update tasks")
            }
        } catch(err){
            setError("Trouble network connection")
        }
    }

    // create new task
    const handleCreateTask = async (newTaskData) => {
        try{
            setError(null)
            const response = await fetch('http://localhost:8080/api/tasks', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newTaskData)
            })

            if(response.ok){
                setIsCreateModalOpen(false)
                fetchTasks()
            } else{
                setError("Unable to create new task")
            }
        } catch(err){
            setError("Internet trouble")
        }
    }

    return (
        <div className="my-tasks-page">
            <TaskHeader activeCount={todoTasks.length}
            onNewTask={() => setIsCreateModalOpen(true)}/>
        </div>
    )
}