import { Draggable } from '@hello-pangea/dnd';
import './TaskItem.css'

const TaskItem = ({ task, index }) => {
    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided) => (
                <div
                    className="task-item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className="task-item-left">
                        {task.status === 'COMPLETED' && (
                            <input type="checkbox" checked readOnly />
                        )}
                    </div>

                    <div className="task-item-main">
                        <div className="task-title">{task.title}</div>
                        <div className="task-meta">
                            (due <span className={`due-date ${task.isUrgent ? 'text-red' : ''}`}>{task.dueDate}</span>,
                            in {task.category})
                        </div>
                    </div>

                    <div className="task-item-right">
                        {task.tags && task.tags.map(tag => (
                            <span key={tag.id} className="tag-pill" style={{backgroundColor:tag.color, color:'#ffffff'}}>
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </Draggable>
    );
}
export default TaskItem;