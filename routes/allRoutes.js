const express = require('express');
const healthController = require('../controllers/healthController.js');
const userController = require('../controllers/userController.js')
const router = express.Router();


router.all('/healthz', healthController.healthCheck);

router.post('/v1/user', userController.createUser);
router.get('/v1/user/self', userController.getUserInfo);
router.put('/v1/user/self', userController.updateUser);

module.exports = router;
