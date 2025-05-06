// src/components/category/CategoryList.jsx
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaBoxes, FaSearch } from 'react-icons/fa';
import categoryService from '../../services/category.service';
import '../../styles/category.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const filtered = categories.filter(cat => 
            cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchTerm, categories]);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await categoryService.listCategories();
            setCategories(data);
            setFilteredCategories(data);
            setError('');
        } catch (err) {
            setError('Error al cargar las categorías');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id_categoria, formData);
                setEditingCategory(null);
            } else {
                await categoryService.createCategory(formData);
            }
            setFormData({ nombre: '', descripcion: '' });
            setShowForm(false);
            await fetchCategories();
        } catch (err) {
            setError('Error al guardar la categoría');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ nombre: category.nombre, descripcion: category.descripcion });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
        
        try {
            await categoryService.deleteCategory(id);
            await fetchCategories();
        } catch (err) {
            setError('Error al eliminar la categoría');
        }
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        setFormData({ nombre: '', descripcion: '' });
        setShowForm(false);
    };

    return (
        <div className="cat-container">
            <div className="cat-header">
                <div className="cat-title-container">
                    <FaBoxes className="cat-title-icon" />
                    <h1>Gestión de Categorías</h1>
                </div>

                <div className="cat-search-container">
                    <div className="cat-search-box">
                        <FaSearch className="cat-search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar categorías..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="cat-search-input"
                        />
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)} 
                        className="cat-btn-toggle-form"
                    >
                        {showForm ? <FaTimes /> : <FaPlus />}
                        {showForm ? 'Ocultar formulario' : 'Nueva categoría'}
                    </button>
                </div>
            </div>

            {/* Formulario compacto */}
            {showForm && (
                <div className="cat-form-container">
                    <form onSubmit={handleSubmit} className="cat-form">
                        <div className="cat-form-row">
                            <div className="cat-form-group compact">
                                <input
                                    name="nombre"
                                    placeholder="Nombre de categoría"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="cat-form-input"
                                />
                            </div>
                            
                            <div className="cat-form-group compact">
                                <input
                                    name="descripcion"
                                    placeholder="Descripción (opcional)"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    className="cat-form-input"
                                />
                            </div>

                            <div className="cat-form-actions compact">
                                <button type="submit" className="cat-btn-primary">
                                    {editingCategory ? <FaSave /> : <FaPlus />}
                                    {editingCategory ? 'Guardar' : 'Crear'}
                                </button>
                                
                                {editingCategory && (
                                    <button type="button" onClick={cancelEdit} className="cat-btn-cancel">
                                        <FaTimes /> Cancelar
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {error && <div className="cat-error-message">{error}</div>}
                    </form>
                </div>
            )}

            <div className="cat-content">
                <div className="cat-stats">
                    <div className="cat-total-categories">
                        {filteredCategories.length} {filteredCategories.length === 1 ? 'categoría' : 'categorías'}
                    </div>
                </div>

                {isLoading ? (
                    <div className="cat-loading-spinner">
                        <div className="cat-spinner"></div>
                        <p>Cargando categorías...</p>
                    </div>
                ) : (
                    <div className="cat-grid-container">
                        {filteredCategories.length === 0 ? (
                            <div className="cat-empty-state">
                                {searchTerm ? (
                                    <>
                                        <h3>No se encontraron resultados</h3>
                                        <p>No hay categorías que coincidan con "{searchTerm}"</p>
                                    </>
                                ) : (
                                    <>
                                        <h3>No hay categorías registradas</h3>
                                        <p>Crea tu primera categoría usando el botón "Nueva categoría"</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="cat-grid">
                                {filteredCategories.map((category) => (
                                    <div key={category.id_categoria} className="cat-card">
                                        <div className="cat-badge">
                                            {category.nombre.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="cat-info">
                                            <h3>{category.nombre}</h3>
                                            {category.descripcion && (
                                                <p>{category.descripcion}</p>
                                            )}
                                        </div>
                                        
                                        <div className="cat-actions">
                                            <button 
                                                onClick={() => handleEdit(category)}
                                                className="cat-btn-edit"
                                                title="Editar"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(category.id_categoria)}
                                                className="cat-btn-delete"
                                                title="Eliminar"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryList;