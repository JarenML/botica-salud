const express = require('express');
const router = express.Router();
const SaleDetailController = require('../controllers/SaleDetailController');
const verificarToken = require('../middlewares/authMiddleware');

router.use(verificarToken);

/**
 * @openapi
 * tags:
 *   name: DetalleVentas
 *   description: Gestion de detalles de venta
 */

/**
 * @openapi
 * /sale_detail:
 *   post:
 *     summary: Crear un detalle de venta
 *     tags: [DetalleVentas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleVenta'
 *     responses:
 *       201:
 *         description: Detalle de venta creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleVenta'
 *   get:
 *     summary: Listar todos los detalles de venta
 *     tags: [DetalleVentas]
 *     responses:
 *       200:
 *         description: Lista de detalles de venta
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DetalleVenta'
 */
router.post('/', SaleDetailController.crearDetalleVenta);
router.get('/', SaleDetailController.listarDetalleVentas);

/**
 * @openapi
 * /sale_detail/{id}:
 *   get:
 *     summary: Obtener un detalle de venta por id
 *     tags: [DetalleVentas]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Detalle de venta encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleVenta'
 *       404:
 *         description: Detalle de venta no encontrado
 *   put:
 *     summary: Actualizar un detalle de venta
 *     tags: [DetalleVentas]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleVenta'
 *     responses:
 *       200:
 *         description: Detalle de venta actualizado
 *   delete:
 *     summary: Eliminar un detalle de venta
 *     tags: [DetalleVentas]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Detalle de venta eliminado
 */
router.get('/:id', SaleDetailController.obtenerDetalleVentaPorId);
router.put('/:id', SaleDetailController.actualizarDetalleVenta);
router.delete('/:id', SaleDetailController.eliminarDetalleVenta);

module.exports = router;
