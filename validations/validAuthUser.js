// Importation méthode permettant de valider les données attendus
const { body } = require('express-validator');

// Les infos qu'on va vérifier au moment d'inscription de user
exports.registerValidation = [
    // Vérification si @mail c'est vrement un @mail
    body('email', "Format email pas valid !").isEmail(),
    // Password 'minLength = 5 => OK', sinon msg erreur
    body('password', "Password : min 5 caractères !").isLength({ min: 5 }),
    body('fullName', "Nom : au moins 3 caractères").isLength({ min: 3 }),
    // avatar optionel, mais si existe verifier que c'est URL
    body('avatarUrl', "Format URL pas valid !").optional().isURL(),
];


// Les infos qu'on va vérifier au moment de connexion de user
exports.loginValidation = [
    // A la connexion on s'attend avoir que @mail et password
    // Vérification si @mail c'est vrement un @mail
    body('email', "Format email pas valid !").isEmail(),
    // Password 'minLength = 5 => OK', sinon msg erreur
    body('password', "Password : min 5 caractères !").isLength({ min: 5 })  
];
