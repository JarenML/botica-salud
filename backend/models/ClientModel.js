const db = require('../config/db');

class ClientModel {

    async crearCliente(datos) {
        const query = `
        INSERT INTO Cliente (dni, nombre, apellido, telefono, email, direccion, fecha_nacimiento)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
        const result = await db.query(query, [
            datos.dni,
            datos.nombre,
            datos.apellido,
            datos.telefono,
            datos.email,
            datos.direccion,
            datos.fecha_nacimiento
        ]);
        return result.rows[0]; 
    }

    async listarClientes() {
        const query = `SELECT * FROM Cliente`;
        const result = await db.query(query);
        return result.rows; 
    }

    async obtenerClientePorId(id) {
        const query = `SELECT * FROM Cliente WHERE id_cliente = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0]; 
    }

    async actualizarCliente(id, datos) {
        const query = `
        UPDATE Cliente
        SET dni = $1, nombre = $2, apellido = $3, telefono = $4, email = $5, direccion = $6, fecha_nacimiento = $7
        WHERE id_cliente = $8
        RETURNING *`;
        const result = await db.query(query, [
            datos.dni,
            datos.nombre,
            datos.apellido,
            datos.telefono,
            datos.email,
            datos.direccion,
            datos.fecha_nacimiento,
            id
        ]);
        return result.rows[0]; 
    }

    async eliminarCliente(id) {
        const query = `DELETE FROM Cliente WHERE id_cliente = $1 RETURNING *`;
        const result = await db.query(query, [id]);
        return result.rows[0]; 
    }
}

module.exports = new ClientModel();