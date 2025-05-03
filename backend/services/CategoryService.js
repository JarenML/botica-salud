const CategoryModel = require('../models/CategoryModel');

class CategoryService {

    async crearCategoria(datos) {
        return await CategoryModel.crearCategoria(datos);
    }

    async listarCategorias() {
        return await CategoryModel.listarCategorias();
    }

    async obtenerCategoriaPorId(id) {
        const categoria = await CategoryModel.obtenerCategoriaPorId(id);
        if (!categoria) {
            throw new Error('Categoría no encontrada');
        }
        return categoria;
    }

    async actualizarCategoria(id, datos) {
        const categoriaExistente = await CategoryModel.obtenerCategoriaPorId(id);
        if (!categoriaExistente) {
            throw new Error('Categoría no encontrada');
        }
        return await CategoryModel.actualizarCategoria(id, datos);
    }

    async eliminarCategoria(id) {
        const categoriaExistente = await CategoryModel.obtenerCategoriaPorId(id);
        if (!categoriaExistente) {
            throw new Error('Categoría no encontrada');
        }
        return await CategoryModel.eliminarCategoria(id);
    }
}

module.exports = new CategoryService();