import React, { useState, useEffect } from 'react'
import axiosClient from '../../services/axiosClient'
import './TagManagementPage.css'

const TagManagementPage = () => {
    const [tags, setTags] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTag, setCurrentTag] = useState(null);

    // Form state
    const [formData, setFormData] = useState({ name: '', color: '#ff0000' });

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const data = await axiosClient.get('/tags');
            setTags(data);
        } catch (error) {
            console.error('Error loading the list of tags:', error);
            alert('Unable to load the list of tags');
        }
    };

    const openModal = (tag = null) => {
        if (tag) {
            setCurrentTag(tag);
            setFormData({ name: tag.name, color: tag.color });
        } else {
            setCurrentTag(null);
            setFormData({ name: '', color: '#007bff' })
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTag(null);
        setFormData({ name: '', color: '#007bff' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Please enter the tag name!');
            return;
        }

        try {
            if (currentTag) {
                await axiosClient.put(`/tags/${currentTag.id}`, formData);
            } else {
                await axiosClient.post('/tags', formData);
            }

            closeModal();
            fetchTags();
        } catch (error) {
            console.error('Error saving tag:', error);
            alert('An error occurred while saving the tag. The tag name may already exist!');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tag?')) return;

        try {
            await axiosClient.delete(`/tags/${id}`);
            setTags(tags.filter(tag => tag.id !== id));
        } catch (error) {
            console.error('Error deleting tag:', error);
            alert('Cannot delete this tag!');
        }
    };

    return (
        <div className="tag-page-container">
            <div className="tag-page-header">
                <h2>Tag Management</h2>
                <button className="btn-primary" onClick={() => openModal()}>
                    + Add New Tag
                </button>
            </div>

            <div className="tag-table-wrapper">
                <table className="tag-table">
                    <thead>
                    <tr>
                        <th>Tag Name</th>
                        <th>Color Code</th>
                        <th>Task Count</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tags.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="empty-state">
                                You don't have any tags yet. Click "Add New Tag" to get started!
                            </td>
                        </tr>
                    ) : (
                        tags.map(tag => (
                            <tr key={tag.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span
                                                className="color-preview"
                                                style={{ backgroundColor: tag.color }}
                                            ></span>
                                        <strong>{tag.name}</strong>
                                    </div>
                                </td>
                                <td><code>{tag.color}</code></td>
                                <td>{tag.count}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-edit" onClick={() => openModal(tag)}>Edit</button>
                                        <button className="btn-delete" onClick={() => handleDelete(tag.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{currentTag ? 'Edit Tag' : 'Create New Tag'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Tag Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Study, Work..."
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label>Color</label>
                                <input
                                    type="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {currentTag ? 'Update' : 'Save Tag'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagManagementPage;