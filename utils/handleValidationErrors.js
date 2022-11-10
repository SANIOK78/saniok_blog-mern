// Import function permettant de savoir s'il y a des erreurs
// au moment de validation infos
const { validationResult } = require('express-validator');


//Cette function (middleware) on va l'utiliser pour 
// vérifier si la validation est bien passé 

module.exports = (req, res, next) => {

    //1. Si la validation n'est pas passé
    // On dit qu'on veut avoir tous les erreurs depuis "req"
    const errors = validationResult(req)

    if( !errors.isEmpty()) {
        // on return tous les erreurs trouvé
        return res.status(400).json(errors.array())
    }

    // 2.Si pas d'erreur on passe au middleware suivant
    next();
}