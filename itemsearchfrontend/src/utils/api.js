import axios from 'axios';

const BASE_URL = 'https://itemsearch-q30k.onrender.com/api'; // your backend base URL

// 🔐 Employee Login API (through your backend)
export const loginEmployee = (employeeId, password) => {
  return axios.post(`${BASE_URL}/auth/login`, {
    employeeId,
    password
  });
};

// 📊 Save Scan Activity API
export const saveScanActivity = (scanData) => {
  return axios.post(`${BASE_URL}/scan-activity`, scanData, {
    timeout: 3000, // 3 second timeout - tracking shouldn't block user experience
  });
};






// export const searchItem = (itemCode, locationId) => {
//   return axios.get('https://rentalapi.rootments.live/api/ItemSearch/GetItemSearch', {
//     params: { itemCode, locationId },
//   });
// };



// ✅ Original GetItemSearch API (through local backend)
export const searchItem = (itemCode, locationId) => {
  return axios.get(`${BASE_URL}/item-search`, {
    params: { itemCode, locationId },
    timeout: 8000, // 8 second timeout for faster failure
  });
};

// ✅ GetItemReport API (through local backend)
export const getAllItems = (locationId, userId) => {
  return axios.post(`${BASE_URL}/item-report`, {
    LocationID: locationId,
    UserID: userId
  }, {
    timeout: 8000, // 8 second timeout for faster failure
  });
};

// ✅ Fallback search function - tries GetItemSearch first, then GetItemReport
export const searchItemWithFallback = async (itemCode, locationId) => {
  try {
    // Try the original GetItemSearch API first
    const searchResponse = await searchItem(itemCode, locationId);
    const searchData = searchResponse.data?.dataSet?.data || [];
    
    // If we found data, return it immediately
    if (searchData.length > 0) {
      return {
        data: {
          dataSet: { data: searchData },
          status: true,
          errorDescription: '',
          apiUsed: 'GetItemSearch'
        }
      };
    }
    
    // If no data found, try the fallback API
    const userId = localStorage.getItem('userId') || '7777';
    const formattedLocationId = locationId.toString().padStart(2, '0');
    const reportResponse = await getAllItems(formattedLocationId, userId);
    
    // Check if response.data is an array - optimized parsing
    let allItems = [];
    if (Array.isArray(reportResponse.data)) {
      allItems = reportResponse.data;
    } else if (reportResponse.data?.data && Array.isArray(reportResponse.data.data)) {
      allItems = reportResponse.data.data;
    } else if (reportResponse.data?.dataSet?.data && Array.isArray(reportResponse.data.dataSet.data)) {
      allItems = reportResponse.data.dataSet.data;
    }
    
    // Filter results by itemCode (case-insensitive, trimmed) - optimized
    const normalizedItemCode = itemCode.trim().toLowerCase();
    const filteredData = allItems.filter(item => {
      if (!item) return false;
      const itemCodeValue = (item.itemcode || item.ItemCode || '').toString().trim().toLowerCase();
      return itemCodeValue === normalizedItemCode;
    });
    
    // Map GetItemReport fields to existing table structure - optimized
    const mappedData = filteredData.map(item => ({
      deliveryDate: item.deliveryDate || null,
      bookingDate: item.bookingDate || null,
      returnDate: item.returnDate || null,
      description: item.description || item.itemName || '-',
      customerName: item.customerName || '-',
      phoneNo: item.phoneNo || '-',
      itemcode: item.itemcode,
      itemName: item.itemName,
      itemCount: item.itemCount,
      price: item.price,
      location: item.location,
      category: item.category,
      subCategory: item.subCategory,
      createdBy: item.createdBy,
      createdOn: item.createdOn,
      ...item
    }));
    
    return {
      data: {
        dataSet: { data: mappedData },
        status: true,
        errorDescription: '',
        apiUsed: 'GetItemReport'
      }
    };
    
  } catch (error) {
    console.error('Search error:', error.message);
    
    // Return empty result instead of throwing to prevent app crash
    return {
      data: {
        dataSet: { data: [] },
        status: false,
        errorDescription: error.message,
        apiUsed: 'Error'
      }
    };
  }
};
