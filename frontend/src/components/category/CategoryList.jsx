// src/components/category/CategoryList.jsx
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBoxes, FaSpinner } from 'react-icons/fa';
import categoryService from '../../services/category.service';

const fieldClass =
    'w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-primary focus:bg-white/7 focus:ring-1 focus:ring-brand-primary';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

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
            } else {
                await categoryService.createCategory(formData);
            }
            closeModal();
            await fetchCategories();
        } catch (err) {
            setError('Error al guardar la categoría');
        }
    };

    const openCreate = () => {
        setEditingCategory(null);
        setFormData({ nombre: '', descripcion: '' });
        setModalVisible(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ nombre: category.nombre, descripcion: category.descripcion || '' });
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingCategory(null);
        setFormData({ nombre: '', descripcion: '' });
    };

    const handleDelete = (category) => {
        setCategoryToDelete(category);
    };

    const confirmDelete = async () => {
        try {
            await categoryService.deleteCategory(categoryToDelete.id_categoria);
            await fetchCategories();
        } catch (err) {
            setError('Error al eliminar la categoría');
        } finally {
            setCategoryToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-brand-ink">
            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-semibold text-white">
                            <FaBoxes className="text-brand-secondary" /> Gestión de Categorías
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">Organiza los productos de la farmacia por categoría.</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
                    >
                        <FaPlus /> Nueva categoría
                    </button>
                </div>

                <div className="mb-8 flex flex-wrap items-center gap-4">
                    <div className="relative min-w-[220px] max-w-md flex-1">
                        <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar categorías..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`${fieldClass} pl-10`}
                        />
                    </div>
                    <span className="text-sm text-slate-400">
                        {filteredCategories.length} {filteredCategories.length === 1 ? 'categoría' : 'categorías'}
                    </span>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center gap-2 py-16 text-sm text-slate-400">
                        <FaSpinner className="animate-spin" /> Cargando categorías...
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="py-16 text-center">
                        {searchTerm ? (
                            <>
                                <h3 className="text-base font-semibold text-white">No se encontraron resultados</h3>
                                <p className="mt-1.5 text-sm text-slate-400">No hay categorías que coincidan con "{searchTerm}"</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-base font-semibold text-white">No hay categorías registradas</h3>
                                <p className="mt-1.5 text-sm text-slate-400">Crea tu primera categoría usando el botón "Nueva categoría"</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCategories.map((category) => (
                            <div
                                key={category.id_categoria}
                                className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-sm font-bold text-brand-secondary">
                                    {category.nombre.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-sm font-semibold text-white">{category.nombre}</h3>
                                    {category.descripcion && (
                                        <p className="mt-1 line-clamp-2 text-xs text-slate-400">{category.descripcion}</p>
                                    )}
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-brand-primary/40 hover:text-brand-secondary"
                                        >
                                            <FaEdit className="text-[10px]" /> Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                                        >
                                            <FaTrash className="text-[10px]" /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {modalVisible && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        <h2 className="mb-5 text-lg font-semibold text-white">
                            {editingCategory ? 'Editar categoría' : 'Nueva categoría'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                name="nombre"
                                placeholder="Nombre de categoría"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                className={fieldClass}
                            />
                            <input
                                name="descripcion"
                                placeholder="Descripción (opcional)"
                                value={formData.descripcion}
                                onChange={handleChange}
                                className={fieldClass}
                            />
                            <div className="mt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
                                >
                                    {editingCategory ? 'Guardar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {categoryToDelete && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        <h3 className="text-base font-semibold text-white">¿Eliminar "{categoryToDelete.nombre}"?</h3>
                        <p className="mt-1.5 text-sm text-slate-400">Esta acción no se puede deshacer.</p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setCategoryToDelete(null)}
                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500/90"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryList;
