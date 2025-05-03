// backend/config/db.js

const { Pool } = require('pg');

class Database {
    constructor() {
        this.pool = new Pool({
            user: 'postgres',         
            host: 'localhost',      
            database: 'farmacia_system',   
            password: 'admin', 
            port: 5433,           
        });
    }

    query(text, params) {
        return this.pool.query(text, params);
    }
}

module.exports = new Database();
