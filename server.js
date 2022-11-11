const express = require("express");
const multer = require("multer");
const cors = require("cors");
// require('dotenv').config();
const mongoose = require("mongoose");
const checkAuth = require('./middlewares/checkAuth');

// Import méthode validation données utilisateur
const { registerValidation, loginValidation } = require("./validations/validAuthUser");
const { postCreateValidation } = require("./validations/validDataPost");

const { createPost, getAllPosts, getLastTags,
    getOnePost, deleteOnePost, updatePost 
} = require("./controllers/postController");

// Import méthodes d'inscription, connexion, affichage user
const { register, login, getMe } = require("./controllers/userContoller");
const path = require("path");
const handleValidationErrors = require("./utils/handleValidationErrors");

// connexion a MongoDb
mongoose
// .connect('mongodb+srv://saniok:Sashaà124@cluster0.1cvhxnj.mongodb.net/blogAndrei?retryWrites=true&w=majority')
.connect(process.env.MONGODB_URI)
.then(() => {
    console.log(" Connexion a MongoDB réussi !")
})
.catch((err) => console.log('Connexion a MongoDB échoué !', err));

// création application express
const app = express();

// MULTER: on va créer un endroit pour stocker les images
const storage = multer.diskStorage({
    //1. destination
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// On indique a notre app qu'il faut utiliser le package
// "express.json() pour lire le format JSON
app.use(express.json());

// On indique qu'on accept les requêtes depuis tous les origine
app.use(cors())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static("uploads"))

app.post("/auth/login", loginValidation, handleValidationErrors, login )
app.post("/auth/register", registerValidation, handleValidationErrors, register );
app.get("/auth/me", checkAuth, getMe );

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    });
});

app.get("/tags", getLastTags );

// Route post
app.get("/posts", getAllPosts );
app.get("/posts/tags", getLastTags );
app.get("/posts/:id", getOnePost );
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, createPost );

// modification du post
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, updatePost);

app.delete("/posts/:id", checkAuth, deleteOnePost);

app.listen(process.env.PORT || 4444, (err) => {
    if(err){
        console.log(err);
    }
    console.log("Serveur tourne sur le Port 4444");
})
