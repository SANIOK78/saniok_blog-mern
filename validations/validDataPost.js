// Importation méthode permettant de valider les données attendus
const { body } = require('express-validator');

// Les infos qu'on va vérifier au moment de creation d'un article
exports.postCreateValidation = [
    // On s'attend avoir: titre, description, image

    body('title', "Rentrez le titre de l'article").isLength({ min: 3 }).isString(),
    body('text', "Rentrez la description de l'article").isLength({ min: 5 }).isString(),
    body('tags', "Format tags pas correct").optional().isString(),
    body('imageUrl', "Url image pas correct").optional().isString(),
];