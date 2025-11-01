const express = require('express');
const { searchItem, getAllItems } = require('../controllers/itemControllers');
const { saveScanActivity } = require('../controllers/scanController');

const router = express.Router();

// ✅ Item Search Route
router.get('/item-search', searchItem);

// ✅ Item Report Route (Get All Items)
router.post('/item-report', getAllItems);

// ✅ Scan Activity Route
router.post('/scan-activity', saveScanActivity);

module.exports = router;
