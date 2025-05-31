const axios = require('axios');

const loginEmployee = async (req, res) => {
  const { employeeId, email } = req.body;

  try {
    const response = await axios.post(
      'https://script.google.com/macros/s/AKfycbxbG3Zrp8cuGmVMUtH3MB5JIOulR2nZ7dc81d67toYJNIupxuxjtdJAPGYmTgWs9dLT/exec',
      { employeeId, email }
    );

    res.json(response.data); // Return to frontend
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

module.exports = { loginEmployee };