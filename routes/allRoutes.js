const express = require('express');
const healthController = require('../controllers/healthController.js');
const userController = require('../controllers/userController.js')
const router = express.Router();


router.all('/healthz', healthController.healthCheck);

router.post('/v2/user', userController.createUser);
router.get('/v2/user/self', userController.getUserInfo);
router.put('/v2/user/self', userController.updateUser);
router.get('/v2/user/verify',userController.verifyToken);

module.exports = router;
