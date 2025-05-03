const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/SupplierController');

router.post('/', SupplierController.crearProveedor);          
router.get('/', SupplierController.listarProveedores);        
router.get('/:id', SupplierController.obtenerProveedorPorId); 
router.put('/:id', SupplierController.actualizarProveedor);   
router.delete('/:id', SupplierController.eliminarProveedor); 

module.exports = router;