//src/services/product.service.js
import api from './api';

export const obtenerProductos = (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    return api.get(`/productos?${params}`);
};