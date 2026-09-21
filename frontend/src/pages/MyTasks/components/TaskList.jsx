import TaskItem from './TaskItem';
import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';

const TaskList = ({ title, tasks, statusId, isCollapsible = false }) => {
    const initialOpenState = isCollapsible ? tasks.length <= 5 : true;
    const [isOpen, setIsOpen] = useState(initialOpenState);

    return (
        <div className="task-list-section">
            <div className={`task-list-header ${isCollapsible ? 'cursor-pointer' : ''}`}
                 onClick={() => isCollapsible && setIsOpen(!isOpen)}>
                {isCollapsible && (<span className="collapse-icon">{isOpen ? '⌄' : '›'}</span>)}
                <h3>{title}</h3>
                <span className="count-badge">{tasks.length}</span>
            </div>

            <Droppable droppableId={statusId}>
                {(provided) => (
                    <div
                        className={`task-items-container ${isOpen ? 'expanded' : 'collapsed'}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {tasks.length === 0 ? (
                            <p className="empty-text">Không có công việc nào</p>
                        ) : (
                            tasks.map((task, index) => (
                                <TaskItem key={task.id} task={task} index={index} />
                            ))
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
export default TaskList;