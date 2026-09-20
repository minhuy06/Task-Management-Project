import React, {useState} from 'react'
import './TaskFormModal.css'

const TaskFormModal = ({onSubmit, onClose}) => {

    const [availableTags, setAvailableTags] = useState([])
    const [availableCategories, setAvailableCategories] = useState([])
    const [fetchError, setFetchError] = useState(null)
    const [isLoadingForm, setIsLoadingForm] = useState(true)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        tagIds: [],
        dueDate: ''
    })

    useEffect(() => {
        const fetchFormResources = async () => {
            try{
                const [tagsResponse, categoriesResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/tags'),
                    fetch('http://localhost:8080/api/categories')
                ])

                if(!tagsResponse.ok || !categoriesResponse.ok){
                    throw new Error('Unable to load data')
                }

                const tagsData = await tagsResponse.json()
                const categoriesData = await categoriesResponse.json()

                setAvailableTags(tagsData)
                setAvailableCategories(categoriesData)

                // default category
                if(categoriesData.length < 0){
                    setFormData(prev => ({
                        ...prev,
                        category: categoriesData[0].name
                    }))
                }
            } catch (err){
                setFetchError('Unable to load data')
            } finally {
                setIsLoadingForm(false)
            }
        }
        fetchFormResources()
    }, []);

    // data change on form
    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // tag change on form
    const handleToggleTag = (tagId) => {
        setFormData(prev => {
            const isSelected = prev.tagIds.includes(tagId)
            return{
                ...prev,
                tagIds: isSelected
                    ? prev.tagIds.filter(id => id !== tagId)
                    : [...prev.tagIds, tagId]
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!formData.title.trim()){
            alert("Title must be filled!")
            return
        }
        onSubmit(formData)
    }

    if(isLoadingForm){
        return(
            <div className="modal-overlay">
                <div className="modal-content loading-spinner">Loading data ...</div>
            </div>
        )
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Create new Task</h3>
                <button className="btn-close-icon" onClick={onClose}>&times;</button>
            </div>

            {fetchError && <div className="error-banner">{fetchError}</div>}

            <form onSubmit={handleSubmit} className="task-form">
                {/* title input */}
                <div className="form-group">
                    <label>Title<span className="text-red">*</span></label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Task name..."
                        autoFocus />
                </div>

                {/* category input and due date */}
                <div className="form-row">
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            {availableCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Due date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}/>
                    </div>
                </div>

                <div className="form-group">
                    <label>Tags</label>
                    <div className="tags-selection-container">
                        {availableTags.map(tag => {
                            const isSelected = formData.tagIds.includes(tag.id)
                            return(
                                <span
                                    key={tag.id}
                                    className={`tag-option ${isSelected ? 'selected' : ''}`}
                                    style={{
                                        backgroundColor: isSelected ? tag.color : '#f0f0f0',
                                        borderColor: isSelected ? '#ccc' : 'transparent'
                                    }}
                                    onClick={() => handleToggleTag(tag.id)}>
                                #{tag.name}
                                </span>
                            )
                        })}
                    </div>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description..."
                        rows="3"
                    />
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn-submit">Save</button>
                </div>
            </form>
        </div>
    )
}
export default TaskFormModal