const db = require('./config/db');

(async () => {
    try {
        const result = await db.query('SELECT NOW()');
        console.log('Conexión exitosa a la fecha y hora actual:', result.rows[0]);
    } catch (error) {
        console.error('Error de conexión:', error);
    }
})();
