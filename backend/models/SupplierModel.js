const db = require('../config/db');

class SupplierModel {

    async crearProveedor(datos) {
        const query = `
        INSERT INTO Proveedor (nombre, telefono, email, direccion, ruc)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;
        const result = await db.query(query, [
            datos.nombre,
            datos.telefono,
            datos.email,
            datos.direccion,
            datos.ruc
        ]);
        return result.rows[0]; 
    }

    async listarProveedores() {
        const query = `SELECT * FROM Proveedor`;
        const result = await db.query(query);
        return result.rows; 
    }

    async obtenerProveedorPorId(id) {
        const query = `SELECT * FROM Proveedor WHERE id_proveedor = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0]; 
    }

    async actualizarProveedor(id, datos) {
        const query = `
        UPDATE Proveedor
        SET nombre = $1, telefono = $2, email = $3, direccion = $4, ruc = $5
        WHERE id_proveedor = $6
        RETURNING *`;
        const result = await db.query(query, [
            datos.nombre,
            datos.telefono,
            datos.email,
            datos.direccion,
            datos.ruc,
            id
        ]);
        return result.rows[0]; 
    }

    async eliminarProveedor(id) {
        const query = `DELETE FROM Proveedor WHERE id_proveedor = $1 RETURNING *`;
        const result = await db.query(query, [id]);
        return result.rows[0]; 
    }
}

module.exports = new SupplierModel();