const express = require('express');
const healthController = require('../controllers/healthController.js');

const router = express.Router();


router.all('/healthz', healthController.healthCheck);

module.exports = router;
