//src/services/product.service.js
import api from './api';

export const obtenerProductos = () => api.get('/productos');