const express = require('express');
const router = express.Router();
const SaleController = require('../controllers/SaleController');

/**
 * @openapi
 * tags:
 *   name: Ventas
 *   description: Gestion de ventas
 */

/**
 * @openapi
 * /ventas:
 *   post:
 *     summary: Crear una venta
 *     tags: [Ventas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       201:
 *         description: Venta creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *   get:
 *     summary: Listar todas las ventas
 *     tags: [Ventas]
 *     responses:
 *       200:
 *         description: Lista de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venta'
 */
router.post('/', SaleController.crearVenta);
router.get('/', SaleController.listarVentas);

/**
 * @openapi
 * /ventas/{id}:
 *   get:
 *     summary: Obtener una venta por id
 *     tags: [Ventas]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Venta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *       404:
 *         description: Venta no encontrada
 *   put:
 *     summary: Actualizar una venta
 *     tags: [Ventas]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       200:
 *         description: Venta actualizada
 *   delete:
 *     summary: Eliminar una venta
 *     tags: [Ventas]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Venta eliminada
 */
router.get('/:id', SaleController.obtenerVentaPorId);
router.put('/:id', SaleController.actualizarVenta);
router.delete('/:id', SaleController.eliminarVenta);

/**
 * @openapi
 * /ventas/{id}/estado:
 *   patch:
 *     summary: Actualizar el estado de una venta
 *     tags: [Ventas]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, pagado, anulado]
 *             required: [estado]
 *     responses:
 *       200:
 *         description: Estado de la venta actualizado
 */
router.patch('/:id/estado', SaleController.actualizarEstadoVenta);

module.exports = router;
