const Sauce = require('../models/Sauce');
const fs = require('fs');

// Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, 
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Gestion des likes/dislikes des sauces
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Utilisation d'un switch pour gérer les différents cas de figures possibles, ajout d'un like, ajout d'un dislike et suppression d'un like ou d'un dislike
        switch (req.body.like) {
            case 1:
                if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                  // Utilisation de l'opérateur '$inc' de mongoDB pour l'incrémentation du champ 'likes' à '1' dans la base de données
                  // Utilisation de l'opérateur '$push' de mongoDB pour l'ajout du 'userId' dans le champ 'usersLiked' dans la base de données
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: req.body.userId }})
                        .then(() => res.status(201).json({ message: "La sauce a été likée !" }))
                        .catch(error => res.status(400).json({ error }));
                    }
            break;
            case -1:
                if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $push: { usersDisliked: req.body.userId }})
                        .then(() => res.status(201).json({ message: "La sauce a été dislikée !" }))
                        .catch(error => res.status(400).json({ error }));
                    }
            break;
            case 0:
              if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }})
                    .then(() => res.status(201).json({ message: "Le like de la sauce a été enlevé !" }))
                    .catch(error => res.status(400).json({ error }));
            }  else if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){
              Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }})
                  .then(() => res.status(201).json({ message: "Le dislike de la sauce a été enlevé !" }))
                  .catch(error => res.status(400).json({ error }));
          }
        }
    })
    .catch(error => res.status(500).json({ error }));
};

// Suppresion d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Récupération de l'ensemble des sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};