const mongoose = require("mongoose");

// Création de model de User
const PostSchema = new mongoose.Schema({
    // les caracteristique du Post
    title : {
        type : String,
        required: true,
    },
    text : {
        type: String, 
        required: true,
        unique: true
    },
    tags : {
        type : Array,
        // si pas des tag on met tab vide
        default: []
    },
    // Le post aura aussi des visites
    viewsCount: {
        type: Number,
        default: 0
    },
    // Chaqu post aura un auteur
    user: {
        // on fait la liaison entre user/auteur et post
        type: mongoose.Schema.Types.ObjectId, 
        // et fait referance au "User"
        ref: "User",
        required: true,
    },
    imageUrl : String,
},
{
    // la date de creation ou mise a jour
    timestamps : true, 
});

module.exports = mongoose.model('Post', PostSchema);
