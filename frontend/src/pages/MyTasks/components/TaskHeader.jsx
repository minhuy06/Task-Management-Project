const TaskHeader = ({activeCount, onNewTask}) => {
    return (
        <div className="task-header">
            <h2>My Tasks <span>({activeCount} Active)</span></h2>
            <button className="btn-new-task" onClick={onNewTask}>
                New Task +
            </button>
        </div>
    )
}