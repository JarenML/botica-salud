// backend/models/UserModel.js

const prisma = require('../config/prisma');

class UserModel {
    async crearUsuario(datos) {
        return prisma.usuario.create({
            data: {
                nombre: datos.nombre,
                apellidos: datos.apellidos,
                email: datos.email,
                username: datos.username,
                password: datos.password,
                rol: datos.rol,
            },
            select: { id_usuario: true, username: true, rol: true }
        });
    }

    async buscarPorUsername(username) {
        return prisma.usuario.findUnique({ where: { username } });
    }

    async listarUsuarios() {
        return prisma.usuario.findMany();
    }
}

module.exports = new UserModel();
