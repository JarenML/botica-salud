const db = require('../config/db');

class SaleModel {
    async crearVenta(datos) {
        const query = `
        INSERT INTO Venta (codigo_venta, usuario_id, cliente_id, total, metodo_pago, estado, observaciones)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
        const result = await db.query(query, [
            datos.codigo_venta,
            datos.usuario_id,
            datos.cliente_id,
            datos.total,
            datos.metodo_pago,
            datos.estado,
            datos.observaciones
        ]);
        return result.rows[0]; 
    }

    async listarVentas() {
        const query = `
        SELECT 
            v.*, 
            u.nombre AS usuario_nombre, 
            c.nombre AS cliente_nombre 
        FROM Venta v
        JOIN Usuario u ON v.usuario_id = u.id_usuario
        JOIN Cliente c ON v.cliente_id = c.id_cliente`;
        const result = await db.query(query);
        return result.rows; 
    }

    async obtenerVentaPorId(id) {
        const query = `
        SELECT 
            v.*, 
            u.nombre AS usuario_nombre, 
            c.nombre AS cliente_nombre 
        FROM Venta v
        JOIN Usuario u ON v.usuario_id = u.id_usuario
        JOIN Cliente c ON v.cliente_id = c.id_cliente
        WHERE v.id_venta = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0]; 
    }

    async actualizarVenta(id, datos) {
        const query = `
        UPDATE Venta
        SET codigo_venta = $1, usuario_id = $2, cliente_id = $3, total = $4, 
            metodo_pago = $5, estado = $6, observaciones = $7
        WHERE id_venta = $8
        RETURNING *`;
        const result = await db.query(query, [
            datos.codigo_venta,
            datos.usuario_id,
            datos.cliente_id,
            datos.total,
            datos.metodo_pago,
            datos.estado,
            datos.observaciones,
            id
        ]);
        return result.rows[0]; 
    }

    async eliminarVenta(id) {
        const query = `DELETE FROM Venta WHERE id_venta = $1 RETURNING *`;
        const result = await db.query(query, [id]);
        return result.rows[0]; 
    }
}

module.exports = new SaleModel();