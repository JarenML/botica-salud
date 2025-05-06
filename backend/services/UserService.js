// backend/services/UserService.js

const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

class UserService {
    async registrarUsuario(datos) {
        const hash = await bcrypt.hash(datos.password, 10);
        const result = await UserModel.crearUsuario({ ...datos, password: hash });
        return result.rows[0];
    }

    async autenticarUsuario(username, password) {
        const usuario = await UserModel.buscarPorUsername(username);
        if (!usuario) throw new Error('Usuario no encontrado');

        const valido = await bcrypt.compare(password, usuario.password);
        if (!valido) throw new Error('Credenciales inválidas');

        return {
            id: usuario.id_usuario,
            username: usuario.username,
            rol: usuario.rol
        };
    }

    async listarUsuarios() {
        return await UserModel.listarUsuarios();
    } 
}

module.exports = new UserService();