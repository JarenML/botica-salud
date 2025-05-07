const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const upload = require('../middlewares/upload');

router.post('/', upload.single('imagen'), ProductController.crearProducto);
router.get('/', ProductController.listarProductos);        
router.get('/:id', ProductController.obtenerProductoPorId); 
router.put('/:id', upload.single('imagen'), ProductController.actualizarProducto);   
router.delete('/:id', ProductController.eliminarProducto);  
router.patch('/:id/stock', ProductController.actualizarStock);

module.exports = router;