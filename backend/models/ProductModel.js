const prisma = require('../config/prisma');

const toBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true';
    return Boolean(value);
};

const mapProducto = (producto) => {
    if (!producto) return producto;
    const { categoria, proveedor, ...resto } = producto;
    return {
        ...resto,
        categoria_nombre: categoria?.nombre,
        proveedor_nombre: proveedor?.nombre,
    };
};

class ProductModel {

    async crearProducto(datos) {
        datos.requiere_receta = datos.requiere_receta ?? false;

        return prisma.producto.create({
            data: {
                codigo: datos.codigo,
                nombre: datos.nombre,
                imagen: datos.imagen,
                descripcion: datos.descripcion,
                precio_venta: datos.precio_venta,
                precio_compra: datos.precio_compra,
                categoria_id: Number(datos.categoria_id),
                proveedor_id: Number(datos.proveedor_id),
                fecha_vencimiento: datos.fecha_vencimiento,
                requiere_receta: toBoolean(datos.requiere_receta),
                stock_actual: datos.stock_actual !== undefined ? Number(datos.stock_actual) : undefined,
                stock_minimo: datos.stock_minimo !== undefined ? Number(datos.stock_minimo) : undefined,
                ubicacion: datos.ubicacion,
            }
        });
    }

    async listarProductos(filtros = {}) {
        const { codigo, categoria_id, nombre } = filtros;
        const where = {};

        if (codigo) where.codigo = { contains: codigo, mode: 'insensitive' };
        if (categoria_id) where.categoria_id = Number(categoria_id);
        if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' };

        const productos = await prisma.producto.findMany({
            where,
            include: { categoria: true, proveedor: true }
        });
        return productos.map(mapProducto);
    }

    async obtenerProductoPorId(id) {
        const producto = await prisma.producto.findUnique({
            where: { id_producto: Number(id) },
            include: { categoria: true, proveedor: true }
        });
        return mapProducto(producto);
    }

    async actualizarProducto(id, datos) {
        return prisma.producto.update({
            where: { id_producto: Number(id) },
            data: {
                codigo: datos.codigo,
                nombre: datos.nombre,
                imagen: datos.imagen,
                descripcion: datos.descripcion,
                precio_venta: datos.precio_venta,
                precio_compra: datos.precio_compra,
                categoria_id: Number(datos.categoria_id),
                proveedor_id: Number(datos.proveedor_id),
                fecha_vencimiento: datos.fecha_vencimiento,
                requiere_receta: toBoolean(datos.requiere_receta),
                stock_actual: Number(datos.stock_actual),
                stock_minimo: Number(datos.stock_minimo),
                ubicacion: datos.ubicacion,
            }
        });
    }

    async eliminarProducto(id) {
        return prisma.producto.delete({ where: { id_producto: Number(id) } });
    }

    async actualizarStock(id, stock_actual) {
        return prisma.producto.update({
            where: { id_producto: Number(id) },
            data: { stock_actual: Number(stock_actual) }
        });
    }
}

module.exports = new ProductModel();
