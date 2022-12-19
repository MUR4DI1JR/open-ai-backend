import express  from 'express';
// import dotenv  from 'dotenv'.config();
import cors from 'cors';
import mongoose from "mongoose";

import {registerValidation} from "./validation/auth.js";
import checkAuth from "./utils/checkAuth.js";
import {register, login, getMe} from "./controllers/UserController.js";
import {handler} from "./routes/aiImage.js";

mongoose.connect("mongodb+srv://user:2107hitagii@minterest.ivqlwrr.mongodb.net/blog?retryWrites=true&w=majority")
    .then(() => console.log("db ok"))
    .catch((e) => console.log("db error", e))


const port = process.env.PORT || 5000;

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.post('/openai/generate-image', handler);

app.post('/auth/login', login);

app.post('/auth/register', registerValidation, register);

app.get('/auth/me', checkAuth, getMe)


app.listen(port, () => console.log(`PORT:${port}`))