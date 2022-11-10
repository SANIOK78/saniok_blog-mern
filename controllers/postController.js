// import modelUser pour crer un article
const PostModel = require('../models/modelPost')

// affichage tous les articles
exports.getAllPosts = async (req, res) => {
    try {
        // recup des tous les articles.
        // ".populate()" va permettre de faire la liaison entre 
        // le "post" et "user" qui a créé ce post et 
        const allPosts = await PostModel.find()
        .populate("user")
        .exec();           //execution 

        res.json(allPosts);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Récupération des articles echoué !"
        });
    }
}

// affichage des tags
exports.getLastTags = async (req, res) => {
    try {
        // On recup tous les posts( 5 )
        const allPosts = await PostModel.find().limit(5).exec();
        
        //recup de chaque tags (article) de cette postage
        const tags = allPosts.map((obj) => obj.tags).flat().slice(0, 5);

        res.json(tags);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Récupération des tags echoué !"
        });
    }
}

// affichage d'un article
exports.getOnePost = async (req, res) => {
    try {
        // recup de l'ID du Post depuis la requete(body)
        const postId = req.params.id
       
        // On va chercher le "post" et en même temps mettre a
        // jour le "nb de consultation"
        // cherche moi un poste et met le a jour
        PostModel.findOneAndUpdate(
            { 
                //1. chercher d'apres la propriété "ID"
                _id : postId   
            }, {
             //2. On met a jour: increment d'un le paramétre
             // "viewsCount"
                $inc: { viewsCount : 1}
            }, {
                //3. On return ce document mit a jour
                returnDocument: 'after' 
            },
            // 4.la fonction qui va s'executer
            (err, doc) => {
                // 4.1. Vérif s'il y a une erreur
                if(err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Récupération de l'article a echoué !"
                    });
                }
                // 4.2 Verif si il y a un tel document (au cas ou il est
                // supprimé mais moi j'aissaye de le recupérer)
                if( !doc ) {    //ex : "undefined"
                    return res.status(404).json({
                        message: "L'article démandé n'est pas trouvé !"
                    })
                }
                // 4.3 L'article trouvé et pas d'erreurs: on return docs
                res.json(doc);
            }
         // On fait la liaison avec l'auteur
        ).populate("user");
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Récupération des articles echoué !"
        });
    }
}

// function CREATE postage
exports.createPost =  async (req, res) => {

    try {
        // On va créer une instance du PostModel
        const doc = new PostModel({
            title : req.body.title,
            text : req.body.text,
            imageUrl : req.body.imageUrl,
            // on va transformer la chaine de caractere
            // des "tags" en tab[]
            tags : req.body.tags.split(','),
            imageUrl : req.body.imageUrl,
            // Le User on le récupère depuis req.userId
            user : req.userId
        });

        // Création et enreistrement de l'article dans BD
        const post = await doc.save();

        // Return reponse
        res.json(post);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Création article echoué !"
        });
    }
}

// supprimer un post
exports.deleteOnePost = async (req, res) => {
    try {
        // recup de l'ID du Post depuis la requete(body)
        const postId = req.params.id
       
        //1. Chercher le doc dans BD et le supprimer
        PostModel.findOneAndDelete({ _id : postId }, (err, doc) => {
            //1.1. s'il y une erreur au moment de suppression
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Suppression de l'article echoué !"
                });
            }

            // 1.2. Si l'article n'est pas trouvé
            if( !doc ) {
                return res.status(404).json({
                    message: "L'article démandé n'est pas trouvé !"
                })
            }

            // 1.3. L'article existe, pas d'erreur, donc on le supprime
            res.json({
                message: "L'article supprimé avec succes !"
            })
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Récupération des articles echoué !"
        });
    }
}

// mise a jour du post
exports.updatePost = async (req, res) => {
    try {
        // recup de l'ID du Post depuis la requete(body)
        const postId = req.params.id

        // On va récupérer l'article
        await PostModel.updateOne(
            { _id : postId },             //recuperation grâce au ID
            {
                title: req.body.title, 
                text: req.body.text,        //ce qu'on veut mettre a jour
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
                user: req.userId
            } 
        );
        // return reponse
        res.json({
            message: "Mise a jour éffectué !"
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Mise a jour echoué !"
        })
    };
};