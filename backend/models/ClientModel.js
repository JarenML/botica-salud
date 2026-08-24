const prisma = require('../config/prisma');

const toDate = (value) => (value ? new Date(value) : value);

class ClientModel {

    async crearCliente(datos) {
        return prisma.cliente.create({
            data: {
                dni: datos.dni,
                nombre: datos.nombre,
                apellido: datos.apellido,
                telefono: datos.telefono,
                email: datos.email,
                direccion: datos.direccion,
                fecha_nacimiento: toDate(datos.fecha_nacimiento),
            }
        });
    }

    async listarClientes() {
        return prisma.cliente.findMany();
    }

    async obtenerClientePorId(id) {
        return prisma.cliente.findUnique({ where: { id_cliente: Number(id) } });
    }

    async actualizarCliente(id, datos) {
        return prisma.cliente.update({
            where: { id_cliente: Number(id) },
            data: {
                dni: datos.dni,
                nombre: datos.nombre,
                apellido: datos.apellido,
                telefono: datos.telefono,
                email: datos.email,
                direccion: datos.direccion,
                fecha_nacimiento: toDate(datos.fecha_nacimiento),
            }
        });
    }

    async eliminarCliente(id) {
        return prisma.cliente.delete({ where: { id_cliente: Number(id) } });
    }
}

module.exports = new ClientModel();
