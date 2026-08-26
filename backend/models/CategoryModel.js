const prisma = require('../config/prisma');

class CategoryModel {

    async crearCategoria(datos) {
        return prisma.categoria.create({
            data: {
                nombre: datos.nombre,
                descripcion: datos.descripcion,
            }
        });
    }

    async listarCategorias() {
        return prisma.categoria.findMany({
            orderBy: { fecha_creacion: 'desc' }
        });
    }

    async obtenerCategoriaPorId(id) {
        return prisma.categoria.findUnique({ where: { id_categoria: Number(id) } });
    }

    async actualizarCategoria(id, datos) {
        return prisma.categoria.update({
            where: { id_categoria: Number(id) },
            data: {
                nombre: datos.nombre,
                descripcion: datos.descripcion,
            }
        });
    }

    async eliminarCategoria(id) {
        return prisma.categoria.delete({ where: { id_categoria: Number(id) } });
    }
}

module.exports = new CategoryModel();
