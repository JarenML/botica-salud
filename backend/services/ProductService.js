const ProductModel = require('../models/ProductModel');

class ProductService {

    async crearProducto(datos) {
        return await ProductModel.crearProducto(datos);
    }

    async listarProductos() {
        return await ProductModel.listarProductos();
    }

    async obtenerProductoPorId(id) {
        const producto = await ProductModel.obtenerProductoPorId(id);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        return producto;
    }

    async actualizarProducto(id, datos) {
        const productoExistente = await ProductModel.obtenerProductoPorId(id);
        if (!productoExistente) {
            throw new Error('Producto no encontrado');
        }
        return await ProductModel.actualizarProducto(id, datos);
    }

    async eliminarProducto(id) {
        const productoExistente = await ProductModel.obtenerProductoPorId(id);
        if (!productoExistente) {
            throw new Error('Producto no encontrado');
        }
        return await ProductModel.eliminarProducto(id);
    }
}

module.exports = new ProductService();