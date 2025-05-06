import api from './api';

const saleService = {
    
    listSales: async () => {
        const res = await api.get('/ventas');
        return res.data;
    },

    createService: async (data) => {
        const res = await api.post('/ventas', data);
        return res.data;
    },


};

export default saleService;