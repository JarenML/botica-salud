const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');
const verificarToken = require('../middlewares/authMiddleware');

router.use(verificarToken);

/**
 * @openapi
 * tags:
 *   name: Clientes
 *   description: Gestion de clientes
 */

/**
 * @openapi
 * /clientes:
 *   post:
 *     summary: Crear un cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *   get:
 *     summary: Listar todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 */
router.post('/', ClientController.crearCliente);
router.get('/', ClientController.listarClientes);

/**
 * @openapi
 * /clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por id
 *     tags: [Clientes]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 *   put:
 *     summary: Actualizar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *   delete:
 *     summary: Eliminar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Cliente eliminado
 */
router.get('/:id', ClientController.obtenerClientePorId);
router.put('/:id', ClientController.actualizarCliente);
router.delete('/:id', ClientController.eliminarCliente);

module.exports = router;
