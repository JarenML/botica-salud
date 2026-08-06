// backend/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Botica Salud API',
            version: '1.0.0',
            description: 'Documentacion de la API REST de Botica Salud',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}/api`,
                description: 'Servidor local',
            },
        ],
        components: {
            parameters: {
                IdParam: {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' },
                    description: 'Identificador del recurso',
                },
            },
            schemas: {
                Categoria: {
                    type: 'object',
                    properties: {
                        id_categoria: { type: 'integer', readOnly: true },
                        nombre: { type: 'string', maxLength: 50 },
                        descripcion: { type: 'string', maxLength: 255, nullable: true },
                        fecha_creacion: { type: 'string', format: 'date-time', readOnly: true },
                    },
                    required: ['nombre'],
                },
                Cliente: {
                    type: 'object',
                    properties: {
                        id_cliente: { type: 'integer', readOnly: true },
                        dni: { type: 'string', maxLength: 20, nullable: true },
                        nombre: { type: 'string', maxLength: 50 },
                        apellido: { type: 'string', maxLength: 50 },
                        telefono: { type: 'string', maxLength: 15, nullable: true },
                        email: { type: 'string', format: 'email', maxLength: 100 },
                        direccion: { type: 'string', maxLength: 255, nullable: true },
                        fecha_nacimiento: { type: 'string', format: 'date', nullable: true },
                        fecha_creacion: { type: 'string', format: 'date-time', readOnly: true },
                    },
                    required: ['nombre', 'apellido', 'email'],
                },
                Proveedor: {
                    type: 'object',
                    properties: {
                        id_proveedor: { type: 'integer', readOnly: true },
                        nombre: { type: 'string', maxLength: 100 },
                        telefono: { type: 'string', maxLength: 20 },
                        email: { type: 'string', format: 'email', maxLength: 100 },
                        direccion: { type: 'string', maxLength: 255, nullable: true },
                        ruc: { type: 'string', maxLength: 20 },
                        fecha_creacion: { type: 'string', format: 'date-time', readOnly: true },
                    },
                    required: ['nombre', 'telefono', 'email', 'ruc'],
                },
                Producto: {
                    type: 'object',
                    properties: {
                        id_producto: { type: 'integer', readOnly: true },
                        codigo: { type: 'string', maxLength: 20, nullable: true },
                        nombre: { type: 'string', maxLength: 150 },
                        imagen: { type: 'string', maxLength: 255, nullable: true },
                        descripcion: { type: 'string', nullable: true },
                        precio_venta: { type: 'number', format: 'decimal' },
                        precio_compra: { type: 'number', format: 'decimal' },
                        categoria_id: { type: 'integer' },
                        proveedor_id: { type: 'integer' },
                        fecha_vencimiento: { type: 'string', format: 'date' },
                        requiere_receta: { type: 'boolean', default: false },
                        stock_actual: { type: 'integer', default: 0 },
                        stock_minimo: { type: 'integer', default: 5 },
                        ubicacion: { type: 'string', maxLength: 255, nullable: true },
                        fecha_creacion: { type: 'string', format: 'date-time', readOnly: true },
                    },
                    required: ['nombre', 'precio_venta', 'precio_compra', 'categoria_id', 'proveedor_id', 'fecha_vencimiento'],
                },
                Usuario: {
                    type: 'object',
                    properties: {
                        id_usuario: { type: 'integer', readOnly: true },
                        nombre: { type: 'string', maxLength: 50 },
                        apellidos: { type: 'string', maxLength: 50 },
                        email: { type: 'string', format: 'email', maxLength: 100 },
                        username: { type: 'string', maxLength: 70 },
                        password: { type: 'string', writeOnly: true },
                        rol: { type: 'string', enum: ['admin', 'farmaceutico', 'cajero'] },
                        fecha_creacion: { type: 'string', format: 'date-time', readOnly: true },
                    },
                    required: ['nombre', 'apellidos', 'email', 'username', 'password', 'rol'],
                },
                Venta: {
                    type: 'object',
                    properties: {
                        id_venta: { type: 'integer', readOnly: true },
                        codigo_venta: { type: 'string', maxLength: 15, nullable: true },
                        usuario_id: { type: 'integer' },
                        cliente_id: { type: 'integer' },
                        total: { type: 'number', format: 'decimal' },
                        metodo_pago: { type: 'string', enum: ['efectivo', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'otros'] },
                        estado: { type: 'string', enum: ['pendiente', 'pagado', 'anulado'], nullable: true },
                        observaciones: { type: 'string', maxLength: 255, nullable: true },
                        fecha_creacion: { type: 'string', format: 'date-time', readOnly: true },
                    },
                    required: ['usuario_id', 'cliente_id', 'total', 'metodo_pago'],
                },
                DetalleVenta: {
                    type: 'object',
                    properties: {
                        id_detalle: { type: 'integer', readOnly: true },
                        venta_id: { type: 'integer' },
                        producto_id: { type: 'integer' },
                        cantidad: { type: 'integer' },
                        precio_unitario: { type: 'number', format: 'decimal' },
                        subtotal: { type: 'number', format: 'decimal' },
                        fecha_creacion: { type: 'string', format: 'date-time', readOnly: true },
                    },
                    required: ['venta_id', 'producto_id', 'cantidad', 'precio_unitario', 'subtotal'],
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
