const EmployeeActivity = require('../models/employeeActivity');

// Get all employee activity logs
const getAllActivities = async (req, res) => {
  try {
    const { page = 1, limit = 50, employeeId, startDate, endDate } = req.query;
    
    // Build filter
    const filter = {};
    if (employeeId) {
      filter.employeeId = employeeId;
    }
    if (startDate || endDate) {
      filter.loginTime = {};
      if (startDate) filter.loginTime.$gte = new Date(startDate);
      if (endDate) filter.loginTime.$lte = new Date(endDate);
    }

    // Get activities with pagination
    const activities = await EmployeeActivity.find(filter)
      .sort({ loginTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const total = await EmployeeActivity.countDocuments(filter);

    res.json({
      status: 'success',
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching activities:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch activities'
    });
  }
};

// Get activity statistics
const getActivityStats = async (req, res) => {
  try {
    const totalLogins = await EmployeeActivity.countDocuments({ activityType: 'login' });
    const uniqueEmployees = await EmployeeActivity.distinct('employeeId');
    
    // Get today's activities
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogins = await EmployeeActivity.countDocuments({
      activityType: 'login',
      loginTime: { $gte: today }
    });

    // Get most used browsers
    const browserStats = await EmployeeActivity.aggregate([
      { $match: { activityType: 'login' } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get most used devices
    const deviceStats = await EmployeeActivity.aggregate([
      { $match: { activityType: 'login' } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      status: 'success',
      data: {
        totalLogins,
        uniqueEmployees: uniqueEmployees.length,
        todayLogins,
        browserStats,
        deviceStats
      }
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch statistics'
    });
  }
};

// Get employee's activity history
const getEmployeeActivities = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const activities = await EmployeeActivity.find({ employeeId })
      .sort({ loginTime: -1 })
      .limit(100)
      .lean();

    res.json({
      status: 'success',
      data: activities
    });
  } catch (error) {
    console.error('❌ Error fetching employee activities:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch employee activities'
    });
  }
};

module.exports = {
  getAllActivities,
  getActivityStats,
  getEmployeeActivities
};

