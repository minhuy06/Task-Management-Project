const TaskFilter = ({filters, onFilterChange, availableCategories, availableTags}) => {
    return (
        <div className="task-filter-bar">
            <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search all tasks, categories, tags..."
                    value={filters.searchQuerry}
                    onChange={(e) => onFilterChange('searchFilter', e.target.value)}/>
            </div>

            <div className="dropdowns">
                <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)}>
                    <option value="">All Status</option>
                    <option value="todo">To Do</option>
                    <option value="completed">Completed</option>
                </select>

                <select value={availableCategories} onChange={(e) => onFilterChange('category', e.target.value)}>
                    <option value="">All Categories</option>
                    {availableCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <select value={availableTags} onChange={(e) => onFilterChange('tag', e.target.value)}>
                    <option value="">All Tags</option>
                    {availableTags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                            {tag.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}
export default TaskFilter