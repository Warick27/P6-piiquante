// dotenv permet d'utiliser des variables d'environnement en lieu et place de données sensibles (mot de passe, mail, etc.)
require("dotenv").config();
// Importation d'express
const express = require('express');
// Mongoose pour gérer la liaison avec la base de données MongoDB
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser')
const sauceRoutes = require('./routes/sauce.js');
const userRoutes = require('./routes/user');
// Gestion de problèmes de CORS
const cors = require('cors');
// Contre les injections dans la base MongoDB
const mongoSanitize = require('express-mongo-sanitize');
// helmet permet de répondre aux exigences OWASP et d'aider à sécuriser les apps Express en colmatant des failles de sécurités connues
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
app.use(express.json());

// variable d'environnement
const mongo_nme = process.env.MONGODB_NAME;
const mongo_pwd = process.env.MONGODB_PASSWORD;
const mongo_data = process.env.MONGODB_D;

// Connexion à la base de données hébergée sur MongoDb
mongoose.connect(`mongodb+srv://${mongo_nme}:${mongo_pwd}@cluster0.ikdtg.mongodb.net/${mongo_data}?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Paramètre des headers pour éviter des problèmes de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.options('*', cors());

// Prise en charge du JSON
app.use(bodyParser.json());

// Helmet augmente la sécurité des headers et comble certaines failles de sécurités
app.use(helmet({crossOriginResourcePolicy: false,}));
// remplace les caractères interdits par un caractère particulier
app.use(mongoSanitize({replaceWith: '_' }));
// Morgan permet de créer des logs
app.use(morgan('combined'));

// Routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;