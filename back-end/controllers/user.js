//  Bcrypt algorithme de hash 
const bcrypt = require('bcrypt');
// pour créer des Token d'identification
const jwt = require('jsonwebtoken');
// Permet d'utiliser des variables d'environnement
require("dotenv").config();
const secret = process.env.SECRET_TOKEN;
const time = process.env.EXPIRE_TOKEN;

// Importation du modèle d'utilisateur
const User = require('../models/User');

// Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  // Utilisation de bcrypt pour hasher le mot de passe
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

// Connexion d'un utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              `${secret}`,
              { expiresIn: `${time}`}
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};