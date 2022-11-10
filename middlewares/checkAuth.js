const jwt = require('jsonwebtoken');

// Middleware qui va décider s'il peut retourner
// une infos secrete
module.exports = (req, res, next) => {

    // Récupération du token depuis "header: authorization"
    // S'il y a ou pas de token, tu remplace "bearer" par un "vide"
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '') ;

    if (token) {
       
        try {
            // Si token existe: decryptage en lui passant la clé de cryptage
            const decodedToken = jwt.verify(token, 'secret1234');

            // Si on a reussi a decoder le Token, on recupèr que le 'ID' vu
            // que c'est suffisant de comprendre si user existant ou pas
            // On le met dans "req.userId = request" pour pouvoir le sortir 
            // ou on a besoin
            req.userId = decodedToken._id

            // Il faut indiquer absolument la function "next()" pour
            // permettre d'aller a l'execution de la commande suivant
            next();

        } catch (err) {
            console.log(err);
            return res.status(403).json({message : "Pas d'authorisation !"})
        }

    } else {
       return res.status(403).json({message : "Pas d'authorisation !"})
    };

}