const db = require('../config/db');

class CategoryModel {

    async crearCategoria(datos) {
        const query = `
        INSERT INTO Categoria (nombre, descripcion)
        VALUES ($1, $2)
        RETURNING *`;
        const result = await db.query(query, [datos.nombre, datos.descripcion]);
        return result.rows[0]; 
    }

    async listarCategorias() {
        const query = `SELECT * FROM Categoria`;
        const result = await db.query(query);
        return result.rows; 
    }

    async obtenerCategoriaPorId(id) {
        const query = `SELECT * FROM Categoria WHERE id_categoria = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0]; 
    }

    async actualizarCategoria(id, datos) {
        const query = `
        UPDATE Categoria
        SET nombre = $1, descripcion = $2
        WHERE id_categoria = $3
        RETURNING *`;
        const result = await db.query(query, [datos.nombre, datos.descripcion, id]);
        return result.rows[0]; 
    }

    async eliminarCategoria(id) {
        const query = `DELETE FROM Categoria WHERE id_categoria = $1 RETURNING *`;
        const result = await db.query(query, [id]);
        return result.rows[0]; 
    }
}

module.exports = new CategoryModel();