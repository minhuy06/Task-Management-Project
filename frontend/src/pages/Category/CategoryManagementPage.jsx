import React, { useState, useEffect } from 'react';
import axiosClient from '../../services/axiosClient';
import './CategoryManagementPage.css';

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    // Form state
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await axiosClient.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error loading the list of categories:', error);
            alert('Unable to load the list of categories');
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setCurrentCategory(category);
            setFormData({
                name: category.name
            });
        } else {
            setCurrentCategory(null);
            setFormData({ name: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
        setFormData({ name: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Please enter the category name!');
            return;
        }

        try {
            if (currentCategory) {
                await axiosClient.put(`/categories/${currentCategory.id}`, formData);
            } else {
                await axiosClient.post('/categories', formData);
            }

            closeModal();
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('An error occurred while saving. The category name may already exist!');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await axiosClient.delete(`/categories/${id}`);
            setCategories(categories.filter(category => category.id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Cannot delete this category. It might be linked to existing tasks!');
        }
    };

    return (
        <div className="category-page-container">
            <div className="category-page-header">
                <h2>Category Management</h2>
                <button className="btn-primary" onClick={() => openModal()}>
                    + Add New Category
                </button>
            </div>

            <div className="category-table-wrapper">
                <table className="category-table">
                    <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Task Count</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="empty-state">
                                You don't have any categories yet. Click "Add New Category" to get started!
                            </td>
                        </tr>
                    ) : (
                        categories.map(category => (
                            <tr key={category.id}>
                                <td><strong>{category.name}</strong></td>
                                <td>{category.count || 0}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-edit" onClick={() => openModal(category)}>Edit</button>
                                        <button className="btn-delete" onClick={() => handleDelete(category.id)}>Delete</button>
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
                        <h3>{currentCategory ? 'Edit Category' : 'Create New Category'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Personal, Work, Finance..."
                                    autoFocus
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {currentCategory ? 'Update' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagementPage;