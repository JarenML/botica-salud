// backend/routes/UserRouter.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const verificarToken = require('../middlewares/authMiddleware');

/**
 * @openapi
 * tags:
 *   name: Usuarios
 *   description: Gestion de usuarios y autenticacion
 */

/**
 * @openapi
 * /usuarios/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Error al registrar usuario
 *       409:
 *         description: El email o username ya esta en uso
 */
router.post('/registro', UserController.registrar);

/**
 * @openapi
 * /usuarios/login:
 *   post:
 *     summary: Autenticar un usuario
 *     tags: [Usuarios]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required: [username, password]
 *     responses:
 *       200:
 *         description: Autenticacion exitosa
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Usuario'
 *                 - type: object
 *                   properties:
 *                     token:
 *                       type: string
 *       401:
 *         description: Usuario o contrasena incorrectos
 */
router.post('/login', UserController.login);

/**
 * @openapi
 * /usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autenticado
 */
router.get('/', verificarToken, UserController.obtenerTodosLosUsuarios);

module.exports = router;
