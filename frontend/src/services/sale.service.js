import api from './api';

const saleService = {
    
    listSales: async (params = {}) => {
        const res = await api.get('/ventas', { params });
        return res.data;
    },

    getSaleById: async (id) => {
        const res = await api.get(`/ventas/${id}`);
        return res.data;
    },

    createSale: async (data) => {
        const res = await api.post('/ventas', data);
        return res.data;
    },

    changeStateService: async (id, estado) => {
        const res = await api.patch(`/ventas/${id}/estado`, {estado});
        return res.data;
    },

    deleteSale: async (id) => {
        const res = await api.delete(`/ventas/${id}`);
        return res.data;
    }

};

export default saleService;