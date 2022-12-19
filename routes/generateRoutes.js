const express = require('express');
const {handler} = require('./aiImage');
const router = express.Router();

router.post('/generate-image', handler);

module.exports = router;