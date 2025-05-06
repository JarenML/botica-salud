import api from './api';

const saleService = {
    createService: async (data) => {
        const res = await api.post('/ventas', data);
        return res.data;
    },
};

export default saleService;