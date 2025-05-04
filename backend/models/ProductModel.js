const db = require('../config/db');

class ProductModel {

    async crearProducto(datos) {

        datos.requiere_receta = datos.requiere_receta ?? false;

        const query = `
        INSERT INTO Producto (
            codigo, nombre, imagen, descripcion, 
            precio_venta, precio_compra, categoria_id, 
            proveedor_id, fecha_vencimiento, requiere_receta, 
            stock_actual, stock_minimo, ubicacion
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`;
        const result = await db.query(query, [
            datos.codigo,
            datos.nombre,
            datos.imagen,
            datos.descripcion,
            datos.precio_venta,
            datos.precio_compra,
            datos.categoria_id,
            datos.proveedor_id,
            datos.fecha_vencimiento,
            datos.requiere_receta,
            datos.stock_actual,
            datos.stock_minimo,
            datos.ubicacion
        ]);
        return result.rows[0]; 
    }

    async listarProductos(filtros = {}) {
        const {codigo, categoria_id, nombre} = filtros;
        let query = `
        SELECT 
            p.*, 
            c.nombre AS categoria_nombre, 
            pr.nombre AS proveedor_nombre 
        FROM Producto p
        JOIN Categoria c ON p.categoria_id = c.id_categoria
        JOIN Proveedor pr ON p.proveedor_id = pr.id_proveedor`;
    
        const condiciones = [];
        const valores = [];

        if (codigo) {
            condiciones.push(`p.codigo ILIKE $${valores.length + 1}`);
            valores.push(`%${codigo}%`);
        }

        if (categoria_id) {
            condiciones.push(`p.categoria_id = $${valores.length + 1}`);
            valores.push(categoria_id);
        }

        if (nombre) {
            condiciones.push(`p.nombre ILIKE $${valores.length + 1}`);
            valores.push(`%${nombre}%`);
        }

        if (condiciones.length > 0) {
            query += ' WHERE ' + condiciones.join(' AND ');
        }


        const result = await db.query(query, valores);
        return result.rows; 
    }

    async obtenerProductoPorId(id) {
        const query = `
        SELECT 
            p.*, 
            c.nombre AS categoria_nombre, 
            pr.nombre AS proveedor_nombre 
        FROM Producto p
        JOIN Categoria c ON p.categoria_id = c.id_categoria
        JOIN Proveedor pr ON p.proveedor_id = pr.id_proveedor
        WHERE p.id_producto = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0]; 
    }

    async actualizarProducto(id, datos) {
        const query = `
        UPDATE Producto
        SET 
            codigo = $1, nombre = $2, imagen = $3, descripcion = $4,
            precio_venta = $5, precio_compra = $6, categoria_id = $7,
            proveedor_id = $8, fecha_vencimiento = $9, requiere_receta = $10,
            stock_actual = $11, stock_minimo = $12, ubicacion = $13
        WHERE id_producto = $14
        RETURNING *`;
        const result = await db.query(query, [
            datos.codigo,
            datos.nombre,
            datos.imagen,
            datos.descripcion,
            datos.precio_venta,
            datos.precio_compra,
            datos.categoria_id,
            datos.proveedor_id,
            datos.fecha_vencimiento,
            datos.requiere_receta,
            datos.stock_actual,
            datos.stock_minimo,
            datos.ubicacion,
            id
        ]);
        return result.rows[0]; 
    }

    async eliminarProducto(id) {
        const query = `DELETE FROM Producto WHERE id_producto = $1 RETURNING *`;
        const result = await db.query(query, [id]);
        return result.rows[0]; 
    }
}

module.exports = new ProductModel();