import {body} from 'express-validator';

export const registerValidation = [
    body('email', "invalid mail format").isEmail(),
    body('password', "password must be at least 4 characters").isLength({min: 4}),
    body('fullName', "Enter your name").isLength({min: 3}),
    body('avatarURL', "Enter your URL").optional().isURL()
]