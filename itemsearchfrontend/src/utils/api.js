import axios from 'axios';

const BASE_URL = 'https://itemsearch-1.onrender.com/api'; // your backend base URL

// 🔐 Employee Login API (through your backend)
export const loginEmployee = (employeeId, password) => {
  return axios.post(`${BASE_URL}/auth/login`, {
    employeeId,
    password
  });
};

// 📊 Save Scan Activity API
export const saveScanActivity = (scanData) => {
  return axios.post(`${BASE_URL}/scan-activity`, scanData);
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
  });
};

// ✅ GetItemReport API (through local backend)
export const getAllItems = (locationId, userId) => {
  return axios.post(`${BASE_URL}/item-report`, {
    LocationID: locationId,
    UserID: userId
  });
};

// ✅ Fallback search function - tries GetItemSearch first, then GetItemReport
export const searchItemWithFallback = async (itemCode, locationId) => {
  try {
    console.log('🔍 Trying GetItemSearch API first...');
    
    // Try the original GetItemSearch API first
    const searchResponse = await searchItem(itemCode, locationId);
    const searchData = searchResponse.data?.dataSet?.data || [];
    
    console.log('📊 GetItemSearch result:', searchData.length, 'items found');
    
    // If we found data, return it
    if (searchData.length > 0) {
      console.log('✅ Using GetItemSearch results');
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
    console.log('🔄 No data in GetItemSearch, trying GetItemReport API...');
    
    const userId = localStorage.getItem('userId') || '7777';
    // Ensure locationId is a string with leading zero if needed
    const formattedLocationId = locationId.toString().padStart(2, '0');
    console.log('📍 Original locationId:', locationId);
    console.log('📍 Formatted locationId:', formattedLocationId);
    
    const reportResponse = await getAllItems(formattedLocationId, userId);
    
    console.log('📡 GetItemReport raw response:', reportResponse);
    console.log('📊 GetItemReport response.data:', reportResponse.data);
    console.log('📋 GetItemReport response.data type:', typeof reportResponse.data);
    console.log('📋 GetItemReport dataSet:', reportResponse.data?.dataSet);
    console.log('📋 GetItemReport dataSet.data:', reportResponse.data?.dataSet?.data);
    console.log('📋 GetItemReport dataSet.data type:', typeof reportResponse.data?.dataSet?.data);
    
    // Check if response.data is an array
    let allItems = [];
    if (Array.isArray(reportResponse.data)) {
      allItems = reportResponse.data;
    } else if (reportResponse.data && Array.isArray(reportResponse.data.data)) {
      allItems = reportResponse.data.data;
    } else if (reportResponse.data && reportResponse.data.dataSet && Array.isArray(reportResponse.data.dataSet.data)) {
      allItems = reportResponse.data.dataSet.data;
    } else {
      console.log('⚠️ Unexpected response structure from GetItemReport');
      console.log('📋 Full response structure:', JSON.stringify(reportResponse.data, null, 2));
      allItems = [];
    }
    
    console.log('📋 All items array:', allItems);
    
    // Filter results by itemCode (case-insensitive, trimmed)
    const normalizedItemCode = itemCode.trim().toLowerCase();
    const filteredData = allItems.filter(item => {
      if (!item) return false;
      // Try both 'itemcode' and 'ItemCode' casing
      const itemCodeValue = item.itemcode || item.ItemCode || '';
      return itemCodeValue.toString().trim().toLowerCase() === normalizedItemCode;
    });
    
    console.log('📊 GetItemReport result:', filteredData.length, 'items found after filtering');
    if (filteredData.length === 0 && allItems.length > 0) {
      console.warn('⚠️ No items matched, sample itemCodes:', allItems.slice(0, 3).map(i => i.itemcode || i.ItemCode));
    }
    
    // Map GetItemReport fields to existing table structure
    const mappedData = filteredData.map(item => ({
      // Keep existing fields (will be empty if not provided by GetItemReport)
      deliveryDate: item.deliveryDate || null,
      bookingDate: item.bookingDate || null,
      returnDate: item.returnDate || null,
      description: item.description || item.itemName || '-', // Use itemName as fallback
      customerName: item.customerName || '-',
      phoneNo: item.phoneNo || '-',
      
      // Add new fields from GetItemReport API
      itemcode: item.itemcode,
      itemName: item.itemName,
      itemCount: item.itemCount,
      price: item.price,
      location: item.location,
      category: item.category,
      subCategory: item.subCategory,
      createdBy: item.createdBy,
      createdOn: item.createdOn,
      
      // Keep any other existing fields
      ...item
    }));
    
    console.log('📋 Mapped data for table:', mappedData);
    
    return {
      data: {
        dataSet: { data: mappedData },
        status: true,
        errorDescription: '',
        apiUsed: 'GetItemReport'
      }
    };
    
  } catch (error) {
    console.error('💥 Error in fallback search:', error);
    console.error('💥 Error details:', {
      message: error.message,
      stack: error.stack,
      itemCode,
      locationId
    });
    
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
