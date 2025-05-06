// backend/routes/UserRouter.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.post('/registro', UserController.registrar);
router.post('/login', UserController.login);
router.get('/', UserController.obtenerTodosLosUsuarios);

module.exports = router; 