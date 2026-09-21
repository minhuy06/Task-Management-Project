import {useState, useEffect} from 'react';
import TaskHeader from './components/TaskHeader'
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal'
import './MyTasksPage.css';

const MyTasksPage = () => {
    const [tasks, setTasks] = useState([])
    const [filters, setFilters] = useState({
        searchQuery: '',
        status: 'All',
        category: 'All',
        tag: 'All'
    })

    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])

    const [selectedTaskIds, setSelectedTaskIds] = useState([])
    const [error, setError] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const pendingTasks = tasks.filter(task => task.status === 'PENDING')
    const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS')
    const completedTasks = tasks.filter(task => task.status === 'COMPLETED')

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

    // Get categories & tags data
    const fetchFilterData = async () => {
        try{
            const[tags, categories] = await Promise.all([
                fetch('http://localhost:8080/api/tags'),
                fetch('http://localhost:8080/api/categories')
            ])

            if(tags.ok && categories.ok){
                setTags(await tags.json)
                setCategories(await categories.json)
            }
        } catch (error){
            setError("Unable to load Tag & Category")
        }
    }

    // API call to java
    useEffect(() => {
        fetchTasks()
        fetchFilterData()
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

            return [...prevIds, taskId]
        })
    }

    // batch complete
    const handleBatchComplete = async () => {
        try{
            setError(null)
            const response = await fetch('http://localhost:8080/api/tasks/batch-complete', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({taskIds: selectedTaskIds})
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

            {error && <div className="error-banner">{error}</div>}

            <TaskFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                availableTags={tags}
                availableCategories={categories}
            />

            {selectedTaskIds.length > 0 && (
                <div className="batch-actions" style={{ marginBottom: '20px' }}>
                    <button onClick={handleBatchComplete} className="btn-new-task">
                        Complete ({selectedTaskIds.length})
                    </button>
                </div>
            )}

            <div className="task-lists-container">
                <TaskList
                    title="To do"
                    tasks={pendingTasks}
                    selectedIds={selectedTaskIds}
                    onSelectTask={handleSelectTask}
                />

                <TaskList
                    title="In Progress"
                    tasks={inProgressTasks}
                    selectedTaskIds={selectedTaskIds}
                    onSelectTask={handleSelectTask}
                />

                {completedTasks.length > 0 && (
                    <TaskList
                        title="Completed"
                        tasks={completedTasks}
                        selectedIds={selectedTaskIds}
                        onSelectTask={handleSelectTask}
                    />
                )}

                {isCreateModalOpen && (
                    <TaskFormModal
                        onSubmit={handleCreateTask}
                        onClose={() => setIsCreateModalOpen(false)}
                    />
                )}
            </div>
        </div>
    )
}
export default MyTasksPage