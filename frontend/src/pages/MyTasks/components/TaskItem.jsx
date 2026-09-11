const TaskItem = ({task, isSelected, onSelect}) => {
    return (
        <div className="task-item">
            <div className="task-item-left">
                <input type="checkbox"
                       checked={isSelected}
                       onChange={() => onSelect(task.id)}
                />
            </div>

            <div className="task-item-main">
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                    (due <span className={`due-date ${task.isUrgent ? 'text-red' : ''}`}>{task.dueDate}</span>,
                    in {task.category})
                </div>
            </div>

            <div className="task-item-right">
                {task.tags.map(tag => (
                    <span key={tag.id} className={`tag-pill tag-${tag.color}`}>#{tag.name}</span>
                ))}
            </div>
        </div>
    )
}