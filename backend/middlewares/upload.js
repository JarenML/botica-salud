const multer = require('multer');
const path = require('path');

// Carpeta destino
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);  
    }
});

const upload = multer({ storage });

module.exports = upload;
