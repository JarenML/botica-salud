// backend/server.js

const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/UserRouter'); 


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
    }

    start() {
        const PORT = process.env.PORT || 3000;
        this.app.listen(PORT, () => {
            console.log(`Servidor activo en http://localhost:${PORT}`);
        });
    }
}

new Server().start();