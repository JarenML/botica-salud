import api from './api';

const saleService = {
    
    listSales: async () => {
        const res = await api.get('/ventas');
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