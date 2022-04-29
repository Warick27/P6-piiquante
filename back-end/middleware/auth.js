// Middleware gérant l'authentification
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Utilisation de variable d'environnement qui contient la clé secrète
const secret = process.env.SECRET_TOKEN;

module.exports = (req, res, next) => {
  try {
    // Comparaison du token de la reqête et de celui de la base de données
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${secret}`);
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};