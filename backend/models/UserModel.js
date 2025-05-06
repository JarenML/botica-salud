// backend/models/UserModel.js

const Database = require('../config/db');

class UserModel {
    async crearUsuario(datos) {
        const query = `
        INSERT INTO Usuario(nombre, apellidos, email, username, password, rol)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING id_usuario, username, rol`;
        return Database.query(query, [
            datos.nombre,
            datos.apellidos,
            datos.email,
            datos.username,
            datos.password,
            datos.rol
        ]);
    }

    async buscarPorUsername(username) {
        const result = await Database.query(
            'SELECT * FROM Usuario WHERE username = $1',
            [username]
        );
        return result.rows[0];
    }

    async listarUsuarios() {
        const query = `SELECT * FROM Usuario`;
        const result = await Database.query(query);
        return result.rows; 
    }
}

module.exports = new UserModel();