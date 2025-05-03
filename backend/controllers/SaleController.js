const SaleService = require('../services/SaleService');

class SaleController {

    async crearVenta(req, res) {
        try {
            const nuevaVenta = await SaleService.crearVenta(req.body);
            res.status(201).json(nuevaVenta); 
        } catch (error) {
            res.status(400).json({ message: `Error al crear la venta: ${error.message}` });
        }
    }

    async listarVentas(req, res) {
        try {
            const ventas = await SaleService.listarVentas();
            res.status(200).json(ventas); 
        } catch (error) {
            res.status(500).json({ message: `Error al listar las ventas: ${error.message}` });
        }
    }

    async obtenerVentaPorId(req, res) {
        try {
            const venta = await SaleService.obtenerVentaPorId(req.params.id);
            if (!venta) {
                return res.status(404).json({ message: 'Venta no encontrada' });
            }
            res.status(200).json(venta); 
        } catch (error) {
            res.status(400).json({ message: `Error al obtener la venta: ${error.message}` });
        }
    }

    async actualizarVenta(req, res) {
        try {
            const ventaActualizada = await SaleService.actualizarVenta(req.params.id, req.body);
            res.status(200).json(ventaActualizada); 
        } catch (error) {
            res.status(400).json({ message: `Error al actualizar la venta: ${error.message}` });
        }
    }

    async eliminarVenta(req, res) {
        try {
            const ventaEliminada = await SaleService.eliminarVenta(req.params.id);
            res.status(200).json({
                message: 'Venta eliminada correctamente',
                venta: ventaEliminada
            });
        } catch (error) {
            res.status(400).json({ message: `Error al eliminar la venta: ${error.message}` });
        }
    }
}

module.exports = new SaleController();