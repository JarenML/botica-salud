//src/services/user.service.js

import api from './api';

const userService = {
    listUsers: async () => {
        const res = await api.get('/usuarios');
        return res.data;
    },
    
};

export default userService;