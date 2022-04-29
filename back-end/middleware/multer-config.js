// Middleware gérant les images
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  // Destination de stockage de l'image (dossier images)
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Renommage de l'image qui sera stockée
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Taille maximale des images en bits qu'acceptera Multer lors de l'importation
const maxSize = 2048000;

// module.exports = multer({storage: storage}).single('image');
module.exports = multer({storage: storage, limits: { fileSize: maxSize}}).single('image');