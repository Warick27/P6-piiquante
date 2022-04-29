const mongoose = require('mongoose');
// module mongoose vérifiant que l'email utilisé n'existe pas déjà dans la base de donnée
const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma d'un utilisateur
const userSchema = mongoose.Schema({
    // adresse e-mail de l'utilisateur [unique]
    email: { type: String, required: true, unique: true },
    // mot de passe de l'utilisateur qui sera haché dans la base de données
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);