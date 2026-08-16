const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const upload = require('../middlewares/upload');
const verificarToken = require('../middlewares/authMiddleware');

router.use(verificarToken);

/**
 * @openapi
 * tags:
 *   name: Productos
 *   description: Gestion de productos
 */

/**
 * @openapi
 * /productos:
 *   post:
 *     summary: Crear un producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Producto'
 *               - type: object
 *                 properties:
 *                   imagen:
 *                     type: string
 *                     format: binary
 *     responses:
 *       201:
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *   get:
 *     summary: Listar todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.post('/', upload.single('imagen'), ProductController.crearProducto);
router.get('/', ProductController.listarProductos);

/**
 * @openapi
 * /productos/{id}:
 *   get:
 *     summary: Obtener un producto por id
 *     tags: [Productos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Producto'
 *               - type: object
 *                 properties:
 *                   imagen:
 *                     type: string
 *                     format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.get('/:id', ProductController.obtenerProductoPorId);
router.put('/:id', upload.single('imagen'), ProductController.actualizarProducto);
router.delete('/:id', ProductController.eliminarProducto);

/**
 * @openapi
 * /productos/{id}/stock:
 *   patch:
 *     summary: Actualizar el stock de un producto
 *     tags: [Productos]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock_actual:
 *                 type: integer
 *             required: [stock_actual]
 *     responses:
 *       200:
 *         description: Stock actualizado
 */
router.patch('/:id/stock', ProductController.actualizarStock);

module.exports = router;
