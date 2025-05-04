const express = require('express');
const router = express.Router();
const SaleDetailController = require('../controllers/SaleDetailController');

router.post('/', SaleDetailController.crearDetalleVenta);
router.get('/', SaleDetailController.listarDetalleVentas);
router.get('/:id', SaleDetailController.obtenerDetalleVentaPorId);
router.put('/:id', SaleDetailController.actualizarDetalleVenta);
router.delete('/:id', SaleDetailController.eliminarDetalleVenta);

module.exports = router;
