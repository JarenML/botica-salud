const CategoryService = require('../services/CategoryService');

class CategoryController {
    async crearCategoria(req, res) {
        try {
            const nuevaCategoria = await CategoryService.crearCategoria(req.body);
            res.status(201).json(nuevaCategoria); 
        } catch (error) {
            res.status(400).json({ message: `Error al crear la categoría: ${error.message}` });
        }
    }

    async obtenerTodasLasCategorias(req, res) {
        try {
            const categorias = await CategoryService.listarCategorias();
            res.status(200).json(categorias); 
        } catch (error) {
            res.status(500).json({ message: `Error al listar las categorías: ${error.message}` });
        }
    }

    async obtenerCategoriaPorId(req, res) {
        try {
            const categoria = await CategoryService.obtenerCategoriaPorId(req.params.id);
            if (!categoria) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }
            res.status(200).json(categoria); 
        } catch (error) {
            res.status(400).json({ message: `Error al obtener la categoría: ${error.message}` });
        }
    }

    async actualizarCategoria(req, res) {
        try {
            const categoriaActualizada = await CategoryService.actualizarCategoria(req.params.id, req.body);
            res.status(200).json(categoriaActualizada); 
        } catch (error) {
            res.status(400).json({ message: `Error al actualizar la categoría: ${error.message}` });
        }
    }

    async eliminarCategoria(req, res) {
        try {
            const categoriaEliminada = await CategoryService.eliminarCategoria(req.params.id);
            res.status(200).json({ 
                message: 'Categoría eliminada correctamente',
                categoria: categoriaEliminada 
            });
        } catch (error) {
            res.status(400).json({ message: `Error al eliminar la categoría: ${error.message}` });
        }
    }
}

module.exports = new CategoryController();