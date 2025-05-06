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
            console.log("No es FormData");
            
        }

        for (let [clave, valor] of producto.entries()) {
            console.log(clave, valor);
        }
        return await api.post('/productos', producto);
    }
};

export default productService;