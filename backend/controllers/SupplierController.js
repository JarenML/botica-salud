const SupplierService = require('../services/SupplierService');

class SupplierController {

    async crearProveedor(req, res) {
        try {
            const nuevoProveedor = await SupplierService.crearProveedor(req.body);
            res.status(201).json(nuevoProveedor); 
        } catch (error) {
            res.status(400).json({ message: `Error al crear el proveedor: ${error.message}` });
        }
    }

    async listarProveedores(req, res) {
        try {
            const proveedores = await SupplierService.listarProveedores();
            res.status(200).json(proveedores); 
        } catch (error) {
            res.status(500).json({ message: `Error al listar los proveedores: ${error.message}` });
        }
    }

    async obtenerProveedorPorId(req, res) {
        try {
            const proveedor = await SupplierService.obtenerProveedorPorId(req.params.id);
            if (!proveedor) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }
            res.status(200).json(proveedor); 
        } catch (error) {
            res.status(400).json({ message: `Error al obtener el proveedor: ${error.message}` });
        }
    }

    async actualizarProveedor(req, res) {
        try {
            const proveedorActualizado = await SupplierService.actualizarProveedor(req.params.id, req.body);
            res.status(200).json(proveedorActualizado); 
        } catch (error) {
            res.status(400).json({ message: `Error al actualizar el proveedor: ${error.message}` });
        }
    }

    async eliminarProveedor(req, res) {
        try {
            const proveedorEliminado = await SupplierService.eliminarProveedor(req.params.id);
            res.status(200).json({
                message: 'Proveedor eliminado correctamente',
                proveedor: proveedorEliminado
            });
        } catch (error) {
            res.status(400).json({ message: `Error al eliminar el proveedor: ${error.message}` });
        }
    }
}

module.exports = new SupplierController();