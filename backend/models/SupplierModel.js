const prisma = require('../config/prisma');

class SupplierModel {

    async crearProveedor(datos) {
        return prisma.proveedor.create({
            data: {
                nombre: datos.nombre,
                telefono: datos.telefono,
                email: datos.email,
                direccion: datos.direccion,
                ruc: datos.ruc,
            }
        });
    }

    async listarProveedores() {
        return prisma.proveedor.findMany();
    }

    async obtenerProveedorPorId(id) {
        return prisma.proveedor.findUnique({ where: { id_proveedor: Number(id) } });
    }

    async actualizarProveedor(id, datos) {
        return prisma.proveedor.update({
            where: { id_proveedor: Number(id) },
            data: {
                nombre: datos.nombre,
                telefono: datos.telefono,
                email: datos.email,
                direccion: datos.direccion,
                ruc: datos.ruc,
            }
        });
    }

    async eliminarProveedor(id) {
        return prisma.proveedor.delete({ where: { id_proveedor: Number(id) } });
    }
}

module.exports = new SupplierModel();
