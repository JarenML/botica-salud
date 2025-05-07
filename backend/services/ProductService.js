const ProductModel = require('../models/ProductModel');

class ProductService {

    async crearProducto(datos) {
        return await ProductModel.crearProducto(datos);
    }

    async listarProductos(filtros) {
        return await ProductModel.listarProductos(filtros);
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

    async actualizarStock(id, stock_actual) {
        const productoExistente = await ProductModel.obtenerProductoPorId(id);
        if (!productoExistente) {
            throw new Error('Producto no encontrado');
        }
        return await ProductModel.actualizarStock(id, stock_actual);
    }
}

module.exports = new ProductService();