import axios from 'axios';

const BASE_URL = 'https://rootments-itemsearch-web-1.onrender.com/api';

// Keep Render free tier warm — ping every 13 minutes to prevent cold starts
const pingBackend = () => axios.get(BASE_URL.replace('/api', '/')).catch(() => {});
setInterval(pingBackend, 13 * 60 * 1000);

// 🔐 Employee Login API
export const loginEmployee = (employeeId, password) => {
  return axios.post(`${BASE_URL}/auth/login`, { employeeId, password });
};

// 📊 Save Scan Activity API (fire and forget — short timeout)
export const saveScanActivity = (scanData) => {
  return axios.post(`${BASE_URL}/scan-activity`, scanData, { timeout: 3000 });
};

// ✅ GetItemSearch API
export const searchItem = (itemCode, locationId) => {
  return axios.get(`${BASE_URL}/item-search`, {
    params: { itemCode, locationId },
    timeout: 8000,
  });
};

// ✅ GetItemReport API
export const getAllItems = (locationId, userId) => {
  return axios.post(`${BASE_URL}/item-report`, {
    LocationID: locationId,
    UserID: userId
  }, { timeout: 10000 });
};

// ✅ Parallel fallback — fires both APIs at the same time, uses whichever returns data first
export const searchItemWithFallback = async (itemCode, locationId) => {
  try {
    const userId = localStorage.getItem('userId') || '7777';
    const formattedLocationId = locationId.toString().padStart(2, '0');

    // Fire both requests simultaneously
    const [searchResult, reportResult] = await Promise.allSettled([
      searchItem(itemCode, locationId),
      getAllItems(formattedLocationId, userId),
    ]);

    // Try GetItemSearch result first
    if (searchResult.status === 'fulfilled') {
      const searchData = searchResult.value.data?.dataSet?.data || [];
      if (searchData.length > 0) {
        return {
          data: { dataSet: { data: searchData }, status: true, errorDescription: '', apiUsed: 'GetItemSearch' }
        };
      }
    }

    // Fall through to GetItemReport result
    if (reportResult.status === 'fulfilled') {
      let allItems = [];
      const rd = reportResult.value.data;
      if (Array.isArray(rd)) allItems = rd;
      else if (Array.isArray(rd?.data)) allItems = rd.data;
      else if (Array.isArray(rd?.dataSet?.data)) allItems = rd.dataSet.data;

      const normalizedCode = itemCode.trim().toLowerCase();
      const filteredData = allItems.filter(item => {
        const code = (item?.itemcode || item?.ItemCode || '').toString().trim().toLowerCase();
        return code === normalizedCode;
      });

      const mappedData = filteredData.map(item => ({ ...item,
        deliveryDate: item.deliveryDate || null,
        bookingDate: item.bookingDate || null,
        returnDate: item.returnDate || null,
        description: item.description || item.itemName || '-',
        customerName: item.customerName || '-',
        phoneNo: item.phoneNo || '-',
      }));

      return {
        data: { dataSet: { data: mappedData }, status: true, errorDescription: '', apiUsed: 'GetItemReport' }
      };
    }

    // Both failed
    const err = searchResult.reason || reportResult.reason;
    throw err || new Error('Both APIs failed');

  } catch (error) {
    console.error('Search error:', error.message);
    return {
      data: { dataSet: { data: [] }, status: false, errorDescription: error.message, apiUsed: 'Error' }
    };
  }
};
