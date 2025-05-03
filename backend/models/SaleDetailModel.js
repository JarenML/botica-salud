const db = require('../config/db');


class SaleDetailModel {
    async crearDetalleVenta(datos) {
        const query = `
        INSERT INTO detalle_venta (
            venta_id, producto_id, cantidad, precio_unitario, subtotal
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;
        const valores = [
            datos.venta_id,
            datos.producto_id,
            datos.cantidad,
            datos.precio_unitario,
            datos.subtotal
        ];
        const result = await db.query(query, valores);
        return result.rows[0];
    }


    async listarDetalleVentas() {
        const query = `SELECT * FROM detalle_venta`;
        const result = await db.query(query);
        return result.rows;
    }

    async obtenerDetalleVentaPorId(id) {
        const query = `SELECT * FROM detalle_venta WHERE id_detalle = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async actualizarDetalleVenta(id, datos) {
        const query = `
        UPDATE detalle_venta
        SET venta_id = $1, producto_id = $2, cantidad = $3, 
            precio_unitario = $4, subtotal = $5
        WHERE id_detalle = $6
        RETURNING *`;
        const valores = [
            datos.venta_id,
            datos.producto_id,
            datos.cantidad,
            datos.precio_unitario,
            datos.subtotal,
            id
        ];
        const result = await db.query(query, valores);
        return result.rows[0];
    }

    async eliminarDetalleVenta(id) {
        const query = `DELETE FROM detalle_venta WHERE id_detalle = $1 RETURNING *`;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = new SaleDetailModel();