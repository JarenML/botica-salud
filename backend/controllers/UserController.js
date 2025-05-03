// backend/controllers/UserController.js

const UserService = require('../services/UserService');

class UserController {
    async registrar(req, res) {
        try {
            const user = await UserService.registrarUsuario(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: 'Error al registrar usuario' });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await UserService.autenticarUsuario(username, password);
            res.json(user);
        } catch (error) {
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    }
}

module.exports = new UserController();