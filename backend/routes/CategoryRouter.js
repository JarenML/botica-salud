const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

router.post('/', CategoryController.crearCategoria);          
router.get('/', CategoryController.obtenerTodasLasCategorias); 
router.get('/:id', CategoryController.obtenerCategoriaPorId);  
router.put('/:id', CategoryController.actualizarCategoria);    
router.delete('/:id', CategoryController.eliminarCategoria);   

module.exports = router;