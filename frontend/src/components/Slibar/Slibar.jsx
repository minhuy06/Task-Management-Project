import React, {useState, useEffect} from 'react'
import './Slibar.css'

const Slibar = () => {

    // State
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])

    // State for category form
    const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')

    // State for tag form
    const [isTagPopupOpen, setIsTagPopupOpen] = useState(false)
    const [newTagName, setNewTagName] = useState('')
    const [newTagColor, setNewTagColor] = useState('007bff') // default green

    useEffect(() => {
        fetchCategory()
        fetchTag()
    }, []);

    const fetchCategory = async () => {
        try{
            const response = await fetch('http://localhost:8080/api/categories')
            const data = await response.json()
            setCategories(data)
        } catch (error){
            console.error("Catched trouble when loading Category: ", error)
        }
    }

    const fetchTag = async () => {
        try{
            const response = await fetch('http://localhost:8080/api/tags')
            const data = await response.json()
            setTags(data)
        } catch (error){
            console.error("Catched trouble when loading Tag: ", error)
        }
    }

    // Create new Category
    const handleCreateCategory = async (e) => {
        e.preventDefault()
        try{
            const response = await fetch('http://localhost:8080/api/categories', {
                method : 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: newCategoryName})
            })

            if(response.ok){
                const newCategory = await response.json()
                setCategories([...categories, newCategory])
                setNewCategoryName('')
                setIsCategoryPopupOpen(false)
            }
        } catch (error){
            console.error("Can't create a new Category")
        }
    }

    // Create new Tag
    const handleCreateTag = async (e) => {
        e.preventDefault()
        try{
            const response = await fetch('http://localhost:8080/api/tags', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: newTagName, color: newTagColor})
            })

            if(response.ok){
                const newTag = await response.json()
                setTags([...tags, newTag])
                setNewTagName('')
                setNewTagColor('007bff')
                setIsTagPopupOpen(false)
            }
        } catch (error){
            console.error("Can't create a new Tag")
        }
    }

    return(
        <div className="slibar">

            {/* Tasks */}
            <div className="section-tasks">
                <ul>
                    <li style={{ fontWeight: 'bold', color: '#007bff', cursor: 'pointer', fontSize: '18px' }}>
                        Tasks
                    </li>
                </ul>
            </div>

            <hr className="divider" />

            {/* Category */}
            <div className="section-categories">
                <h3>Category</h3>
                <ul>
                    {categories.map(category => (
                        <li key={category.id}>
                            {category.name} <span>({category.count})</span>
                        </li>
                    ))}
                </ul>
                <button className="btn-add" onClick={() => setIsCategoryPopupOpen(true)}>
                    + Add Category
                </button>
            </div>

            <hr className="divider" />

            {/* Tag */}
            <div className="section-tags">
                <h3>Tag</h3>
                {tags.map(tag => (
                    <li key={tag.id} style={{ display: 'flex', alignItems: 'center', margin: '12px 0' }}>
                        <span
                            className="tag-badge"
                            style={{ backgroundColor: tag.color }}
                        >
                            {tag.name}
                        </span>

                        <span style={{ marginLeft: '8px', color: 'gray', fontSize: '14px' }}>
                            ({tag.count})
                        </span>
                    </li>
                ))}
            </div>

            {/* Popup create Category */}
            {isCategoryPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <div className="popup-content">
                            <h4>Create new Category</h4>
                            <form onSubmit={handleCreateCategory}>
                                <input
                                    type="text"
                                    placeholder="Category name..."
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    required
                                />
                                <div className="popup-actions">
                                    <button type="submit" className="btn-save">Save</button>
                                    <button type="button" className="btn-cancel" onClick={() => setIsCategoryPopupOpen(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup create Tag */}
            {isTagPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h4>Create new Tag</h4>
                        <form onSubmit={handleCreateTag}>
                            <input
                                type="text"
                                placeholder="Tag name..."
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                required
                            />
                            <label style={{ display: 'block', margin: '10px 0 5px', fontSize: '14px', color: '#555' }}>
                                Select color:
                            </label>
                            <input
                                type="color"
                                value={newTagColor}
                                onChange={(e) => setNewTagColor(e.target.value)}
                                style={{ width: '100%', height: '40px', padding: '0', cursor: 'pointer', border: '1px solid #ccc' }}
                            />
                            <div className="popup-actions" style={{ marginTop: '15px' }}>
                                <button type="submit" className="btn-save">Save</button>
                                <button type="button" className="btn-cancel" onClick={() => setIsTagPopupOpen(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Sidebar;