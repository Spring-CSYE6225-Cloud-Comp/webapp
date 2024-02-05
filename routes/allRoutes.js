const express = require('express');
const healthController = require('../controllers/healthController.js');
const userController = require('../controllers/userController.js')
const router = express.Router();


router.all('/healthz', healthController.healthCheck);

router.post('/v1/user', userController.createUser);

module.exports = router;
