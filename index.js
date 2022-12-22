import express  from 'express';
// import dotenv  from 'dotenv'.config();
import cors from 'cors';
import mongoose from "mongoose";

import {loginValidation, postCreateValidation, registerValidation} from "./validation.js";

import {checkAuth, handleValidationError} from "./utils/index.js";

import {UserController, PostController} from "./controllers/index.js";

import {handler} from "./routes/aiImage.js";
import multer from "multer";

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("db ok"))
    .catch((e) => console.log("db error", e))


const port = process.env.PORT || 5000;

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
    destination: (_, __, cb) =>{
        cb(null, 'uploads')
    },
    filename: (_, file, cb) =>{
        cb(null, file.originalname)
    }
});

const upload = multer({ storage })

app.post('/openai/generate-image', handler);

app.post('/auth/login', loginValidation, handleValidationError, UserController.login);

app.post('/auth/register', registerValidation, handleValidationError, UserController.register);

app.post('/uploads', checkAuth, upload.single('image'), (req, res) =>{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);

app.get('/tags', PostController.getTags);

app.get('/posts/:id', PostController.getOne);

app.delete('/posts/:id', checkAuth, PostController.removePost);

app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationError, PostController.updatePost);

app.post('/posts', checkAuth, postCreateValidation, handleValidationError, PostController.createPost);


app.listen(port, () => console.log(`PORT:${port}`))