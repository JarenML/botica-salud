const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');

router.post('/', ClientController.crearCliente);          
router.get('/', ClientController.listarClientes);         
router.get('/:id', ClientController.obtenerClientePorId); 
router.put('/:id', ClientController.actualizarCliente);   
router.delete('/:id', ClientController.eliminarCliente); 

module.exports = router;