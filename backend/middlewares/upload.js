const multer = require('multer');

// Se guarda en memoria; el controlador recién escribe el archivo a disco
// una vez que la operacion en base de datos tuvo exito.
const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload;
