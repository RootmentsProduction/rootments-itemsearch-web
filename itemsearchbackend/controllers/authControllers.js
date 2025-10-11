
// ✅ backend/api/loginEmployee.js
const axios = require('axios');

const loginEmployee = async (req, res) => {
  const { employeeId, password } = req.body;

  console.log('📥 Received from frontend:', req.body);

  try {
    const response = await axios.post(
      'https://rootments.in/api/verify_employee',
      { employeeId, password },
      {
        headers: {
          Authorization: 'Bearer RootX-production-9d17d9485eb772e79df8564004d4a4d4',
        },
      }
    );

    console.log('✅ API Response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('❌ Login error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    res.status(500).json({
      status: 'error',
      message: 'Login failed.',
      debug: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      },
    });
  }
};

module.exports = { loginEmployee };

