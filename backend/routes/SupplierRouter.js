const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/SupplierController');

/**
 * @openapi
 * tags:
 *   name: Proveedores
 *   description: Gestion de proveedores
 */

/**
 * @openapi
 * /proveedores:
 *   post:
 *     summary: Crear un proveedor
 *     tags: [Proveedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proveedor'
 *     responses:
 *       201:
 *         description: Proveedor creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proveedor'
 *   get:
 *     summary: Listar todos los proveedores
 *     tags: [Proveedores]
 *     responses:
 *       200:
 *         description: Lista de proveedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proveedor'
 */
router.post('/', SupplierController.crearProveedor);
router.get('/', SupplierController.listarProveedores);

/**
 * @openapi
 * /proveedores/{id}:
 *   get:
 *     summary: Obtener un proveedor por id
 *     tags: [Proveedores]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Proveedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proveedor'
 *       404:
 *         description: Proveedor no encontrado
 *   put:
 *     summary: Actualizar un proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proveedor'
 *     responses:
 *       200:
 *         description: Proveedor actualizado
 *   delete:
 *     summary: Eliminar un proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Proveedor eliminado
 */
router.get('/:id', SupplierController.obtenerProveedorPorId);
router.put('/:id', SupplierController.actualizarProveedor);
router.delete('/:id', SupplierController.eliminarProveedor);

module.exports = router;
