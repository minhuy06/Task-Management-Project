import { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import TaskHeader from './components/TaskHeader';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import { useTasks } from '../../hooks/useTasks';
import './MyTasksPage.css';

const MyTasksPage = () => {
    const [filters, setFilters] = useState({
        searchQuery: '',
        status: 'All',
        category: 'All',
        tag: 'All'
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { tasks, categories, tags, error, createTask, updateTaskStatus } = useTasks(filters);

    const pendingTasks = tasks.filter(task => task.status === 'PENDING');
    const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS');
    const completedTasks = tasks.filter(task => task.status === 'COMPLETED');

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleCreateTask = async (newTaskData) => {
        const success = await createTask(newTaskData);
        if (success) setIsCreateModalOpen(false);
    };

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

        updateTaskStatus(draggableId, destination.droppableId);
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
                    <TaskList title="To do" statusId="PENDING" tasks={pendingTasks} isCollapsible={true} />
                    <TaskList title="In Progress" statusId="IN_PROGRESS" tasks={inProgressTasks} />
                    {completedTasks.length > 0 && (
                        <TaskList title="Completed" statusId="COMPLETED" tasks={completedTasks} isCollapsible={true} />
                    )}
                </div>
            </DragDropContext>

            {isCreateModalOpen && (
                <TaskFormModal
                    onSubmit={handleCreateTask}
                    onClose={() => setIsCreateModalOpen(false)}
                    availableTags={tags}
                    availableCategories={categories}
                />
            )}
        </div>
    );
};
export default MyTasksPage;