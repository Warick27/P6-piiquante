const express = require('express');

const router = express.Router();

// Middleware gérant l'authentification
const auth = require('../middleware/auth');
// Middleware gérant l'importation et le stockage des images
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

// Les différentes routes CRUD

// Ajouter une nouvelle sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
// Liker/Disliker une sauce
router.post('/:id/like', auth, multer, sauceCtrl.likeSauce);
// Modifier une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
// Supprimer une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// Récupérer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
// Récupérer toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauce);

module.exports = router;