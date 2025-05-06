//src/services/client.service.js

import api from './api';

const clientService = {
    listClients: async () => {
        const res = await api.get('/clientes');
        return res.data;
    },
    createClient: async (data) => {
        const res = await api.post('/clientes', data);
        return res.data;
    },
    updateClient: async (id, data) => {
        const res = await api.put(`/clientes/${id}`, data);
        return res.data;
    },
    deleteClient: async (id) => {
        const res = await api.delete(`/clientes/${id}`);
        return res.data;
    },
};

export default clientService;