const express = require('express');
const router = express.Router();

// importation du middleware de validation pour la création de l'email et du mot de passe
const validation = require('../middleware/validation');

const userCtrl = require('../controllers/user');

// Routes pour créer un utilisateur et pour qu'il se loggue
router.post('/signup',validation, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;