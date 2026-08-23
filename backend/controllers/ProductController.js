const fs = require('fs/promises');
const path = require('path');
const ProductService = require('../services/ProductService');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

async function guardarImagen(file) {
    await fs.writeFile(path.join(IMAGES_DIR, file.originalname), file.buffer);
}

class ProductController {

    async crearProducto(req, res) {
        try {
            const datos = req.body;
            if (req.file) {
                datos.imagen = req.file.originalname;
            }
            const nuevoProducto = await ProductService.crearProducto(datos);
            if (req.file) {
                await guardarImagen(req.file);
            }
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
            console.log(productos);
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
            const datos = req.body
            if (req.file) {
                datos.imagen = req.file.originalname;
            }
            const productoActualizado = await ProductService.actualizarProducto(req.params.id, datos);
            if (req.file) {
                await guardarImagen(req.file);
            }
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

    async actualizarStock(req, res) {
        try {
            const { stock_actual } = req.body;
            const productoActualizado = await ProductService.actualizarStock(req.params.id, stock_actual);
            res.status(200).json(productoActualizado); 
        } catch (error) {
            res.status(400).json({ message: `Error al actualizar el stock: ${error.message}` });
        }
    }
}

module.exports = new ProductController();