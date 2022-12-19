import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) =>{
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json(error.array());
        }

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

        if (!user){
            return res.status(403).json({
                message: "don't found user"
            })
        }

        const {passwordHash, ...userData} = user._doc;

        res.json(userData);
    }catch (e){
        console.log(e);
    }
}