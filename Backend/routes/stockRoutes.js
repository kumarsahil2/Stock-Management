const express = require('express');
const router = express.Router();
const { getStockData } = require('../controllers/stockController');
const auth = require('../middleware/auth');

router.get('/', auth, getStockData);

module.exports = router;
