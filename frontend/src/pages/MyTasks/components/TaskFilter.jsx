import './TaskFilter.css'

const TaskFilter = ({filters, onFilterChange, availableCategories, availableTags}) => {
    return (
        <div className="task-filter-bar">
            <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search all tasks..."
                    value={filters.searchQuery}
                    onChange={(e) => onFilterChange('searchQuery', e.target.value)}
                />
            </div>

            <div className="dropdowns">
                <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)}>
                    <option value="All">All Status</option>
                    <option value="PENDING">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                </select>

                <select value={filters.category} onChange={(e) => onFilterChange('category', e.target.value)}>
                    <option value="All">All Categories</option>
                    {availableCategories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <select value={filters.tag} onChange={(e) => onFilterChange('tag', e.target.value)}>
                    <option value="All">All Tags</option>
                    {availableTags.map((tag) => (
                        <option key={tag.id} value={tag.name}>
                            {tag.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}
export default TaskFilter