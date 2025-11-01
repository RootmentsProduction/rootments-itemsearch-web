const express = require('express');
const { loginEmployee } = require('../controllers/authControllers');
const { getAllActivities, getActivityStats, getEmployeeActivities } = require('../controllers/activityController');

const router = express.Router();

router.post('/login', loginEmployee);

// Activity tracking routes
router.get('/activities', getAllActivities);
router.get('/activities/stats', getActivityStats);
router.get('/activities/employee/:employeeId', getEmployeeActivities);

module.exports = router; // ✅ VERY IMPORTANT