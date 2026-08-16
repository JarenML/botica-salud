// backend/services/UserService.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

class UserService {
    async registrarUsuario(datos) {
        const existente = await UserModel.buscarPorEmailOUsername(datos.email, datos.username);
        if (existente) {
            const campo = existente.email === datos.email ? 'email' : 'username';
            const error = new Error(`El ${campo} ya está en uso`);
            error.status = 409;
            throw error;
        }

        const hash = await bcrypt.hash(datos.password, 10);
        return await UserModel.crearUsuario({ ...datos, password: hash });
    }

    async autenticarUsuario(username, password) {
        const usuario = await UserModel.buscarPorUsername(username);
        if (!usuario) throw new Error('Usuario no encontrado');

        const valido = await bcrypt.compare(password, usuario.password);
        if (!valido) throw new Error('Credenciales inválidas');

        const payload = {
            id: usuario.id_usuario,
            username: usuario.username,
            rol: usuario.rol
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        return { ...payload, token };
    }

    async listarUsuarios() {
        return await UserModel.listarUsuarios();
    } 
}

module.exports = new UserService();