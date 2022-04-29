// Middleware gérant les critères pour qu'un email et un password soient valides
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');

// Vérification de l'email grâce au module email-validator
module.exports = (req, res, next) => {
if (emailValidator.validate(req.body.email)) {
    // Si l'email est valide
    next()
    } else {
        // Si l'email n'est pas valide, on retourne une erreur
        return res.status(400)
        .json({ error : "Veuillez entrer une adress email valide" });
    }
}

// Vérification du mot de passe grâce au module password-validator
// Création du schéma de mot de passe
const passwordSchema = new passwordValidator();

// Le schéma à respecter dans le choix du mot de passe
passwordSchema
// Résumé des règles ci-dessous : entre 8 et 20 caractères avec au moins une majuscule, une minuscule, 2 chiffres et pas d'espaces
.is().min(8)                                    // Le mot de passe doit avoir au moins 8 caractères
.is().max(20)                                   // et pas plus de 20 caractères
.has().uppercase()                              // Doit contenir au moins une majuscule
.has().lowercase()                              // Doit contenir au moins une majuscule
.has().digits(2)                                // Doit contenir au moins 2 chiffres
.has().not().spaces()                           // Ne doit pas contenir d'espace

module.exports = (req, res, next) => {
    
    if(passwordSchema.validate(req.body.password)) {
        // si le mot de passe remplis les critères, on passe à la suite
        next()
        } else {
        // S'il ne remplis pas les critères, on envoi une erreur avec une brève explication dans la réponse en JSON
        return res.status(400)
        .json({ error : `le mot de passe n'est pas assez fort : ${passwordSchema.validate('req.body.password', { list: true })}` });
    }
}