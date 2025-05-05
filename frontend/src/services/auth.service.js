// src/services/auth.service.js
import api from './api';

export const login = (data) => api.post('/usuarios/login', data);
export const register = (data) => api.post('/usuarios/registro', data);
