// backend/server.js
const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/UserRouter'); 
const productRouter = require('./routes/ProductRouter'); 
const categoryRouter = require('./routes/CategoryRouter');
const supplierRouter = require('./routes/SupplierRouter');
const clientRouter = require('./routes/ClientRouter');
const saleRouter = require('./routes/SaleRouter');
const saleDetailRouter = require('./routes/SaleDetailRouter')

class Server {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes() {
        this.app.use('/api/usuarios', userRouter);
        this.app.use('/api/productos', productRouter); 
        this.app.use('/api/categorias', categoryRouter);
        this.app.use('/api/proveedores', supplierRouter);
        this.app.use('/api/clientes', clientRouter);
        this.app.use('/api/ventas', saleRouter);
        this.app.use('/api/sale_detail', saleDetailRouter)
    }

    start() {
        const PORT = process.env.PORT || 3000;
        this.app.listen(PORT, () => {
            console.log(`Servidor activo en http://localhost:${PORT}`);
        });
    }
}

new Server().start();