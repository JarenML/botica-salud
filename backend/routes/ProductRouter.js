const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

router.post('/', ProductController.crearProducto);          
router.get('/', ProductController.listarProductos);        
router.get('/:id', ProductController.obtenerProductoPorId); 
router.put('/:id', ProductController.actualizarProducto);   
router.delete('/:id', ProductController.eliminarProducto);  

module.exports = router;