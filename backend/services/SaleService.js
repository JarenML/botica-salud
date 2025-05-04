const SaleModel = require('../models/SaleModel');

class SaleService {
    async crearVenta(datos) {
        return await SaleModel.crearVenta(datos);
    }

    async listarVentas(codigo_venta) {
        return await SaleModel.listarVentas(codigo_venta);
    }

    async obtenerVentaPorId(id) {
        const venta = await SaleModel.obtenerVentaPorId(id);
        if (!venta) {
            throw new Error('Venta no encontrada');
        }
        return venta;
    }

    async actualizarVenta(id, datos) {
        const ventaExistente = await SaleModel.obtenerVentaPorId(id);
        if (!ventaExistente) {
            throw new Error('Venta no encontrada');
        }
        return await SaleModel.actualizarVenta(id, datos);
    }

    async eliminarVenta(id) {
        const ventaExistente = await SaleModel.obtenerVentaPorId(id);
        if (!ventaExistente) {
            throw new Error('Venta no encontrada');
        }
        return await SaleModel.eliminarVenta(id);
    }
}

module.exports = new SaleService();