const mongoose = require("mongoose");

// Création de model de User
const UserSchema = new mongoose.Schema({
    // les caracteristiue du User
    fullName : {
        type : String,
        required: true,
    },
    email : {
        type: String, 
        required: true,
        unique: true
    },
    passwordHash : {
        type : String,
        required : true
    },
    avatarUrl : String,
},
{
    // la date de creation ou mise a jour
    timestamps : true, 
});

module.exports = mongoose.model('User', UserSchema);

