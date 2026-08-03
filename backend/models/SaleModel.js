const prisma = require('../config/prisma');

const mapVenta = (venta) => {
    if (!venta) return venta;
    const { usuario, cliente, ...resto } = venta;
    return {
        ...resto,
        usuario_nombre: usuario?.nombre,
        cliente_nombre: cliente?.nombre,
    };
};

class SaleModel {
    async crearVenta(datos) {
        return prisma.venta.create({
            data: {
                codigo_venta: datos.codigo_venta,
                usuario_id: Number(datos.usuario_id),
                cliente_id: Number(datos.cliente_id),
                total: datos.total,
                metodo_pago: datos.metodo_pago,
                estado: datos.estado,
                observaciones: datos.observaciones,
            }
        });
    }

    async listarVentas(codigo_venta = null) {
        const where = {};
        if (codigo_venta) {
            where.codigo_venta = { contains: codigo_venta, mode: 'insensitive' };
        }

        const ventas = await prisma.venta.findMany({
            where,
            include: { usuario: true, cliente: true }
        });
        return ventas.map(mapVenta);
    }

    async obtenerVentaPorId(id) {
        const venta = await prisma.venta.findUnique({
            where: { id_venta: Number(id) },
            include: { usuario: true, cliente: true }
        });
        return mapVenta(venta);
    }

    async actualizarVenta(id, datos) {
        return prisma.venta.update({
            where: { id_venta: Number(id) },
            data: {
                codigo_venta: datos.codigo_venta,
                usuario_id: Number(datos.usuario_id),
                cliente_id: Number(datos.cliente_id),
                total: datos.total,
                metodo_pago: datos.metodo_pago,
                estado: datos.estado,
                observaciones: datos.observaciones,
            }
        });
    }

    async eliminarVenta(id) {
        return prisma.venta.delete({ where: { id_venta: Number(id) } });
    }

    async actualizarEstadoVenta(id, estado) {
        return prisma.venta.update({
            where: { id_venta: Number(id) },
            data: { estado }
        });
    }
}

module.exports = new SaleModel();
