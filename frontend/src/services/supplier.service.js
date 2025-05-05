// src/services/supplier.service.js

import api from './api';

const supplierService = {
    listSuppliers: async () => {
        const res = await api.get('/proveedores');
        return res.data;
    },
    createSupplier: async (data) => {
        const res = await api.post('/proveedores', data);
        return res.data;
    },
    updateSupplier: async (id, data) => {
        const res = await api.put(`/proveedores/${id}`, data);
        return res.data;
    },
    deleteSupplier: async (id) => {
        const res = await api.delete(`/proveedores/${id}`);
        return res.data;
    },
};

export default supplierService;