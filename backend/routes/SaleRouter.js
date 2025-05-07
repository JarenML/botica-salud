const express = require('express');
const router = express.Router();
const SaleController = require('../controllers/SaleController');

router.post('/', SaleController.crearVenta);          
router.get('/', SaleController.listarVentas);        
router.get('/:id', SaleController.obtenerVentaPorId); 
router.put('/:id', SaleController.actualizarVenta);   
router.delete('/:id', SaleController.eliminarVenta);  
router.patch('/:id/estado', SaleController.actualizarEstadoVenta);

module.exports = router;