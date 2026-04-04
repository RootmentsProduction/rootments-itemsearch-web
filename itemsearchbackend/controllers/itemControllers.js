const axios = require('axios');

// ✅ Item Search Controller
const searchItem = async (req, res) => {
  const { itemCode, locationId } = req.query;

  console.log('🔍 Item Search Request:', { itemCode, locationId });

  try {
    const response = await axios.get(
      'https://rentalapi.rootments.live/api/ItemSearch/GetItemSearch',
      {
        params: { itemCode, locationId },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('✅ Item Search API Response Status:', response.status);
    console.log('✅ Item Search Response Data Keys:', Object.keys(response.data || {}));
    
    // Log the structure to understand better
    if (response.data?.dataSet?.data) {
      console.log(`✅ Item Search found ${response.data.dataSet.data.length} items`);
    } else {
      console.log('⚠️ Item Search response structure:', JSON.stringify(response.data, null, 2).substring(0, 500));
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('❌ Item Search error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    res.status(500).json({
      status: 'error',
      message: 'Item search failed.',
      debug: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      },
    });
  }
};

// ✅ Item Report Controller (Get All Items)
const getAllItems = async (req, res) => {
  const { LocationID, UserID } = req.body;

  console.log('📊 Item Report Request Body:', req.body);
  console.log('📊 Item Report Request:', { LocationID, UserID });

  try {
    const response = await axios.post(
      'https://rentalapi.rootments.live/api/Reports/GetItemReport',
      {
        LocationID,
        UserID
      },
      { timeout: 10000 }
    );

    console.log('✅ Item Report API Response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('❌ Item Report error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    res.status(500).json({
      status: 'error',
      message: 'Item report failed.',
      debug: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      },
    });
  }
};

module.exports = { searchItem, getAllItems };
