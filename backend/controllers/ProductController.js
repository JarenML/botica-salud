const ProductService = require('../services/ProductService');

class ProductController {
    
    async crearProducto(req, res) {
        try {
            const nuevoProducto = await ProductService.crearProducto(req.body);
            res.status(201).json(nuevoProducto); 
        } catch (error) {
            res.status(400).json({ message: `Error al crear el producto: ${error.message}` });
        }
    }

    async listarProductos(req, res) {
        try {
            const { codigo, categoria_id, nombre } = req.query;
            const filtros = { codigo, categoria_id, nombre }
            const productos = await ProductService.listarProductos(filtros);
            res.status(200).json(productos); 
        } catch (error) {
            res.status(500).json({ message: `Error al listar los productos: ${error.message}` });
        }
    }

    async obtenerProductoPorId(req, res) {
        try {
            const producto = await ProductService.obtenerProductoPorId(req.params.id);
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.status(200).json(producto); 
        } catch (error) {
            res.status(400).json({ message: `Error al obtener el producto: ${error.message}` });
        }
    }

    async actualizarProducto(req, res) {
        try {
            const productoActualizado = await ProductService.actualizarProducto(req.params.id, req.body);
            res.status(200).json(productoActualizado); 
        } catch (error) {
            res.status(400).json({ message: `Error al actualizar el producto: ${error.message}` });
        }
    }

    async eliminarProducto(req, res) {
        try {
            const productoEliminado = await ProductService.eliminarProducto(req.params.id);
            res.status(200).json({
                message: 'Producto eliminado correctamente',
                producto: productoEliminado
            });
        } catch (error) {
            res.status(400).json({ message: `Error al eliminar el producto: ${error.message}` });
        }
    }
}

module.exports = new ProductController();