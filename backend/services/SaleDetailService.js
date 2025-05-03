const SaleDetailModel = require('../models/SaleDetailModel');

class SaleDetailService {
    async crearDetalleVenta(datos) {
        return await SaleDetailModel.crearDetalleVenta(datos);
    }

    async listarDetalleVentas() {
        return await SaleDetailModel.listarDetalleVentas();
    }

    async obtenerDetalleVentaPorId(id) {
        const detalle = await SaleDetailModel.obtenerDetalleVentaPorId(id);
        if (!detalle) throw new Error('Detalle de venta no encontrado');
        return detalle;
    }

    async actualizarDetalleVenta(id, datos) {
        const existente = await SaleDetailModel.obtenerDetalleVentaPorId(id);
        if (!existente) throw new Error('Detalle de venta no encontrado');
        return await SaleDetailModel.actualizarDetalleVenta(id, datos);
    }

    async eliminarDetalleVenta(id) {
        const existente = await SaleDetailModel.obtenerDetalleVentaPorId(id);
        if (!existente) throw new Error('Detalle de venta no encontrado');
        return await SaleDetailModel.eliminarDetalleVenta(id);
    }
}

module.exports = new SaleDetailService();
