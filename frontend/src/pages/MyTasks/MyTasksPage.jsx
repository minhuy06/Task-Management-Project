import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskHeader from './components/TaskHeader';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import './MyTasksPage.css';

const MyTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({
        searchQuery: '',
        status: 'All',
        category: 'All',
        tag: 'All'
    });

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [error, setError] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const pendingTasks = tasks.filter(task => task.status === 'PENDING');
    const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS');
    const completedTasks = tasks.filter(task => task.status === 'COMPLETED');

    const fetchTasks = async () => {
        try {
            setError(null);
            const queryParams = new URLSearchParams({
                search: filters.searchQuery,
                category: filters.category === 'All' ? '' : filters.category,
                status: filters.status === 'All' ? '' : filters.status,
                tag: filters.tag === 'All' ? '' : filters.tag
            }).toString();

            const response = await fetch(`http://localhost:8080/api/tasks?${queryParams}`);
            if (!response.ok) throw new Error('Unable to load data from server');

            const data = await response.json();
            setTasks(data);
        } catch (err) {
            console.error("Fetch API error: ", err);
            setError(err.message);
        }
    };

    const fetchFilterData = async () => {
        try {
            const [tagsRes, categoriesRes] = await Promise.all([
                fetch('http://localhost:8080/api/tags'),
                fetch('http://localhost:8080/api/categories')
            ]);

            if (tagsRes.ok && categoriesRes.ok) {
                setTags(await tagsRes.json());
                setCategories(await categoriesRes.json());
            }
        } catch (error) {
            setError("Unable to load Tag & Category");
        }
    };

    useEffect(() => {
        fetchFilterData();
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: value
        }));
    };

    const handleCreateTask = async (newTaskData) => {
        try {
            setError(null);
            const response = await fetch('http://localhost:8080/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTaskData)
            });

            if (response.ok) {
                setIsCreateModalOpen(false);
                fetchTasks();
            } else {
                setError("Unable to create new task");
            }
        } catch (err) {
            setError("Internet trouble");
        }
    };

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId;
        const taskId = draggableId;

        setTasks(prevTasks => prevTasks.map(task =>
            task.id.toString() === taskId ? { ...task, status: newStatus } : task
        ));

        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error("Lỗi cập nhật trên server");
            }
        } catch (error) {
            console.error(error);
            setError("Lỗi kết nối. Đang tải lại dữ liệu...");
            fetchTasks();
        }
    };

    return (
        <div className="my-tasks-page">
            <TaskHeader
                activeCount={pendingTasks.length + inProgressTasks.length}
                onNewTask={() => setIsCreateModalOpen(true)}
            />

            {error && <div className="error-banner">{error}</div>}

            <TaskFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                availableTags={tags}
                availableCategories={categories}
            />

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="task-lists-container">
                    <TaskList
                        title="To do"
                        statusId="PENDING"
                        tasks={pendingTasks}
                        isCollapsible={true}
                    />

                    <TaskList
                        title="In Progress"
                        statusId="IN_PROGRESS"
                        tasks={inProgressTasks}
                    />

                    {completedTasks.length > 0 && (
                        <TaskList
                            title="Completed"
                            statusId="COMPLETED"
                            tasks={completedTasks}
                            isCollapsible={true}
                        />
                    )}

                    {isCreateModalOpen && (
                        <TaskFormModal
                            onSubmit={handleCreateTask}
                            onClose={() => setIsCreateModalOpen(false)}
                        />
                    )}
                </div>
            </DragDropContext>
        </div>
    );
};
export default MyTasksPage;