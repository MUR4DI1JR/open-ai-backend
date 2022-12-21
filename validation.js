import {body} from 'express-validator';

export const loginValidation = [
    body('email', "invalid mail format").isEmail(),
    body('password', "password must be at least 4 characters").isLength({min: 4}),
]

export const registerValidation = [
    body('email', "invalid mail format").isEmail(),
    body('password', "password must be at least 4 characters").isLength({min: 4}),
    body('fullName', "Enter your name").isLength({min: 3}),
    body('avatarURL', "Enter your URL").optional().isURL()
]

export const postCreateValidation = [
    body('title', "Enter title post").isLength({min: 3}).isString(),
    body('text', "Enter text gor post").isLength({min: 3}).isString(),
    body('tags', "Enter tags(collection)").optional().isArray(),
    body('imageURL', "Enter your URL image").optional().isString()
]