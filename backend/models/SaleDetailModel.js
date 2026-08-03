const prisma = require('../config/prisma');

class SaleDetailModel {
    async crearDetalleVenta(datos) {
        return prisma.detalle_venta.create({
            data: {
                venta_id: Number(datos.venta_id),
                producto_id: Number(datos.producto_id),
                cantidad: Number(datos.cantidad),
                precio_unitario: datos.precio_unitario,
                subtotal: datos.subtotal,
            }
        });
    }

    async listarDetalleVentas() {
        return prisma.detalle_venta.findMany();
    }

    async obtenerDetalleVentaPorId(id) {
        return prisma.detalle_venta.findUnique({ where: { id_detalle: Number(id) } });
    }

    async actualizarDetalleVenta(id, datos) {
        return prisma.detalle_venta.update({
            where: { id_detalle: Number(id) },
            data: {
                venta_id: Number(datos.venta_id),
                producto_id: Number(datos.producto_id),
                cantidad: Number(datos.cantidad),
                precio_unitario: datos.precio_unitario,
                subtotal: datos.subtotal,
            }
        });
    }

    async eliminarDetalleVenta(id) {
        return prisma.detalle_venta.delete({ where: { id_detalle: Number(id) } });
    }
}

module.exports = new SaleDetailModel();
