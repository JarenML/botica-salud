const prisma = require('../config/prisma');

const mapVenta = (venta) => {
    if (!venta) return venta;
    const { usuario, cliente, detalle_venta, ...resto } = venta;
    return {
        ...resto,
        usuario_nombre: usuario?.nombre,
        cliente_nombre: cliente?.nombre,
        ...(detalle_venta && {
            detalle_venta: detalle_venta.map(({ producto, ...detalle }) => ({
                ...detalle,
                producto_nombre: producto?.nombre,
                producto_codigo: producto?.codigo,
            })),
        }),
    };
};

class SaleModel {
    async crearVenta(datos) {
        if (!Array.isArray(datos.items) || datos.items.length === 0) {
            throw new Error('La venta debe incluir al menos un producto');
        }

        return prisma.$transaction(async (tx) => {
            const lineas = [];
            let total = 0;

            for (const item of datos.items) {
                const producto = await tx.producto.findUnique({
                    where: { id_producto: Number(item.producto_id) }
                });

                if (!producto) {
                    throw new Error(`Producto ${item.producto_id} no encontrado`);
                }

                const cantidad = Number(item.cantidad);
                if (!cantidad || cantidad < 1) {
                    throw new Error(`Cantidad invalida para ${producto.nombre}`);
                }

                const subtotal = Number(producto.precio_venta) * cantidad;
                total += subtotal;
                lineas.push({ producto, cantidad, precio_unitario: producto.precio_venta, subtotal });
            }

            const IGV_TASA = 0.18;
            const igv = Number((total - total / (1 + IGV_TASA)).toFixed(2));

            const venta = await tx.venta.create({
                data: {
                    codigo_venta: datos.codigo_venta,
                    usuario_id: Number(datos.usuario_id),
                    cliente_id: Number(datos.cliente_id),
                    total,
                    igv,
                    metodo_pago: datos.metodo_pago,
                    estado: datos.estado ?? 'pendiente',
                    observaciones: datos.observaciones,
                }
            });

            for (const linea of lineas) {
                const descontado = await tx.producto.updateMany({
                    where: {
                        id_producto: linea.producto.id_producto,
                        stock_actual: { gte: linea.cantidad }
                    },
                    data: { stock_actual: { decrement: linea.cantidad } }
                });

                if (descontado.count === 0) {
                    throw new Error(`Stock insuficiente para ${linea.producto.nombre}`);
                }

                await tx.detalle_venta.create({
                    data: {
                        venta_id: venta.id_venta,
                        producto_id: linea.producto.id_producto,
                        cantidad: linea.cantidad,
                        precio_unitario: linea.precio_unitario,
                        subtotal: linea.subtotal,
                    }
                });
            }

            return tx.venta.findUnique({
                where: { id_venta: venta.id_venta },
                include: { usuario: true, cliente: true, detalle_venta: true }
            });
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
            include: { usuario: true, cliente: true, detalle_venta: { include: { producto: true } } }
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
                igv: datos.igv,
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
