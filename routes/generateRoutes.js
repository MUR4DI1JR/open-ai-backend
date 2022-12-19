import express from 'express'
import {handler} from './aiImage'
const router = express.Router();

export const generateImage = router.post('/generate-image', handler);
