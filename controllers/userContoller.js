const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
// import modelUser pour crer un utilisateur
const UserModel = require('../models/modelUser');

// Inscription
exports.register = async (req, res) => {
    try {      
        // on va crypter le mot de passe
        const password = req.body.password;
        // géneration du "solt" pour cryptage MdP
        const salt = await bcrypt.genSalt(10);
        // Cryptage de mot de passe
        const pwdHash = await bcrypt.hash(password, salt);
        // Creation/preparation d'une instance du ModelUser 
        const doc = new UserModel({
            email : req.body.email,
            fullName: req.body.fullName,
            avatarUrl : req.body.avatarUrl,
            passwordHash: pwdHash
        });
        // Sauvegarde dans MongoDB
        const user = await doc.save();

        // Création d'un token qui va servir pour se connecter
        const token = jwt.sign(
            {
                _id: user._id 
            },
            'secret1234',      //clé de chiffrement
            {
                expiresIn: '72h'
            }
        )       
        // On veut pas afficher le "hash" du password 
        const { passwordHash, ...userData } = user._doc;
        // Si pas d'erreurs on return "user" créé
        res.json({
            ...userData,   //sans "passwordHash"
            token,
        });
    } catch( err) {
        // si au moment de creation User il y une erreur:
        console.log(err);
        res.status(500).json({
            message: "Inscription echoué !"
        })
    }   
};

// Connexion
exports.login = async (req, res) => {
    try{
        // On va rechercher si User existe dans BD
        const user = await UserModel.findOne({email : req.body.email});

        // Si User existe pas
        if( !user ) {
            return res.status(404).json({message: "Utilisateur pas trouvé !"})
        }

        // Si user existe on va vérifier si les infos coincide(mot de passe)
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if( !isValidPass ) {
            return res.status(400).json({message: "Identifiants incorrect !"})
        }

        // Création d'un token qui va servir pour se connecter
        const token = jwt.sign(
            {
                _id: user._id 
            },
            'secret1234',
            {
                expiresIn: '72h'
            }
        )

        // On veut pas afficher le "hash" du password 
        const { passwordHash, ...userData } = user._doc;

        // Si pas d'erreurs on return "user" créé
        res.json({
            ...userData,   //sans "passwordHash"
            token,
        });

    } catch (err){
        // si au moment de connexion il y a une erreur:
        console.log(err);
        res.status(500).json({
            message: "Connexion echoué !"
        })
    }
}

// Affichage d'un User
exports.getMe = async (req, res) => {

    try {
        // on va chercher User dans la BD
        const user = await UserModel.findById(req.userId)

        // Si user pas trouvé
        if( !user ) {
            return res.status(404).json({message: "Utilisateur inexistant"});
        }
     
        // Si User éxiste, on l'affiche
        // On veut pas afficher le "hash" du password 
        const { passwordHash, ...userData } = user._doc;

        // Si pas d'erreurs on return "user" créé
        res.json(userData)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Pas d'acces !"
        })
    }
}