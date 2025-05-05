// src/services/category.service.js

import api from './api';

const categoryService = {
    listCategories: async () => {
        const res = await api.get('/categorias');
        return res.data;
    },
    createCategory: async (data) => {
        const res = await api.post('/categorias', data);
        return res.data;
    },
    updateCategory: async (id, data) => {
        const res = await api.put(`/categorias/${id}`, data);
        return res.data;
    },
    deleteCategory: async (id) => {
        const res = await api.delete(`/categorias/${id}`);
        return res.data;
    },
};

export default categoryService;