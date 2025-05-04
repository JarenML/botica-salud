const SaleDetailService = require('../services/SaleDetailService');

class SaleDetailController {
    async crearDetalleVenta(req, res) {
        try {
            const nuevoDetalle = await SaleDetailService.crearDetalleVenta(req.body);
            res.status(201).json(nuevoDetalle);
        } catch (err) {
            res.status(400).json({ message: `Error al crear: ${err.message}` });
        }
    }

    async listarDetalleVentas(req, res) {
        try {
            const detalles = await SaleDetailService.listarDetalleVentas();
            res.status(200).json(detalles);
        } catch (err) {
            res.status(500).json({ message: `Error al listar: ${err.message}` });
        }
    }

    async obtenerDetalleVentaPorId(req, res) {
        try {
            const detalle = await SaleDetailService.obtenerDetalleVentaPorId(req.params.id);
            res.status(200).json(detalle);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    async actualizarDetalleVenta(req, res) {
        try {
            const actualizado = await SaleDetailService.actualizarDetalleVenta(req.params.id, req.body);
            res.status(200).json(actualizado);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async eliminarDetalleVenta(req, res) {
        try {
            const eliminado = await SaleDetailService.eliminarDetalleVenta(req.params.id);
            res.status(200).json({ message: 'Eliminado correctamente', detalle: eliminado });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

module.exports = new SaleDetailController();
