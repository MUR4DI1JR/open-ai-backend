import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import PostModel from "../models/Post.js";

export const register = async (req, res) =>{
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarURL: req.body.avatarURL
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id
        }, 'hitagii1', {expiresIn: '30d'});

        const {passwordHash, ...userData} = user._doc;


        res.json({
            ...userData,
            token
        });
    }catch (e){
        console.log(e);
        res.status(500).json({
            message: "don't register",
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: "dont found email"
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(404).json({
                message: "wrong password or email"
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, 'hitagii1', {expiresIn: '30d'});

        const {passwordHash, ...userData} = user._doc;


        res.json({
            ...userData,
            token
        });

    } catch (e) {
        res.status(500).json({
            message: "don't authorization",
        })
    }
}

export const getMe = async (req, res) =>{
    try{
        const user = await UserModel.findById(req.userId);
        const posts = await PostModel.find({
            user
        });

        if (!user){
            return res.status(403).json({
                message: "don't found user"
            })
        }

        const {passwordHash, ...userData} = user._doc;

        res.json({userData, posts});
    }catch (e){
        console.log(e);
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.find({
            fullName: req.params.name
        });
        const posts = await PostModel.find({
            user: user._id
        });

        if (!user){
            return res.status(403).json({
                message: "don't found users"
            })
        }


        res.json({user, posts});

    }catch (e) {
        console.log(e);
    }
}