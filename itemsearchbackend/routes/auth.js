const express = require('express');
const { loginEmployee } = require('../controllers/authControllers');

const router = express.Router();

router.post('/login', loginEmployee);

module.exports = router; // ✅ VERY IMPORTANT