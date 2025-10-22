const express = require('express');
const { searchItem, getAllItems } = require('../controllers/itemControllers');

const router = express.Router();

// ✅ Item Search Route
router.get('/item-search', searchItem);

// ✅ Item Report Route (Get All Items)
router.post('/item-report', getAllItems);

module.exports = router;
