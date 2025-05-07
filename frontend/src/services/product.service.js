// src/services/product.service.js
import api from './api';

const productService = {
    listProducts: async (filtros = {}) => {
        const params = new URLSearchParams(filtros).toString();
        return api.get(`/productos?${params}`);
    },

    createProduct: async (producto) => {
        const isFormData = producto instanceof FormData;
        if(isFormData) {
            console.log("Es formData") ;
        }else {
            console.log("No esa FormData");
            
        }

        for (let [clave, valor] of producto.entries()) {
            console.log(clave, valor);
        }
        return await api.post('/productos', producto);
    },

    updateProduct: async (id, data) => {
        const res = await api.put(`/productos/${id}`, data);
        return res.data;
    },

    deleteProduct: async (id) => {
        const res = await api.delete(`/productos/${id}`);
        return res.data;
    },

    updateStock: async (id, stock_actual) => {
        const res = await api.patch(`/productos/${id}/stock`, { stock_actual });
        return res.data;
    }
};

export default productService;