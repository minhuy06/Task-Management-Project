import TaskItem from './TaskItem'
import React, { useState } from 'react';

const TaskList = ({title, tasks, selectedTaskIds, onSelectTask, isCollapsible = false}) => {
    const initialOpenState = isCollapsible ? tasks.length <= 5 : true
    const [isOpen, setIsOpen] = useState()

    return (
        <div className="task-list-section">
            <div
                className={`task-list-header ${isCollapsible ? 'cursor-pointer' : ''}`}
                onClick={() => isCollapsible && setIsOpen(!isOpen)}
            >
                {isCollapsible && (<span className="collapse-icon">{isOpen ? '⌄' : '›'}</span>)}
                <h3>{title}</h3>
                {isCollapsible && <span className="count-badge">{tasks.length}</span>}
            </div>

            {isOpen && (
                <div className="task-items-container">
                    {tasks.length === 0 ? (
                        <p className="empty-text">Don't have any task</p>
                    ) : (
                        tasks.map(task => (
                            <TaskItem key={task.id}
                                      task={task}
                                      isSelected={selectedTaskIds.includes(task.id)}
                                      onSelect={onSelectTask}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
export default TaskList