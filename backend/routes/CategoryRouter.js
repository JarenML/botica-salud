const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const verificarToken = require('../middlewares/authMiddleware');

router.use(verificarToken);

/**
 * @openapi
 * tags:
 *   name: Categorias
 *   description: Gestion de categorias de productos
 */

/**
 * @openapi
 * /categorias:
 *   post:
 *     summary: Crear una categoria
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       201:
 *         description: Categoria creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *   get:
 *     summary: Listar todas las categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 */
router.post('/', CategoryController.crearCategoria);
router.get('/', CategoryController.obtenerTodasLasCategorias);

/**
 * @openapi
 * /categorias/{id}:
 *   get:
 *     summary: Obtener una categoria por id
 *     tags: [Categorias]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoria no encontrada
 *   put:
 *     summary: Actualizar una categoria
 *     tags: [Categorias]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoria actualizada
 *   delete:
 *     summary: Eliminar una categoria
 *     tags: [Categorias]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Categoria eliminada
 */
router.get('/:id', CategoryController.obtenerCategoriaPorId);
router.put('/:id', CategoryController.actualizarCategoria);
router.delete('/:id', CategoryController.eliminarCategoria);

module.exports = router;
