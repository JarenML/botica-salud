const SupplierModel = require('../models/SupplierModel');

class SupplierService {

    async crearProveedor(datos) {
        return await SupplierModel.crearProveedor(datos);
    }

    async listarProveedores() {
        return await SupplierModel.listarProveedores();
    }

    async obtenerProveedorPorId(id) {
        const proveedor = await SupplierModel.obtenerProveedorPorId(id);
        if (!proveedor) {
            throw new Error('Proveedor no encontrado');
        }
        return proveedor;
    }

    async actualizarProveedor(id, datos) {
        const proveedorExistente = await SupplierModel.obtenerProveedorPorId(id);
        if (!proveedorExistente) {
            throw new Error('Proveedor no encontrado');
        }
        return await SupplierModel.actualizarProveedor(id, datos);
    }

    async eliminarProveedor(id) {
        const proveedorExistente = await SupplierModel.obtenerProveedorPorId(id);
        if (!proveedorExistente) {
            throw new Error('Proveedor no encontrado');
        }
        return await SupplierModel.eliminarProveedor(id);
    }
}

module.exports = new SupplierService();