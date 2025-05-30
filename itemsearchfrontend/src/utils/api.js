import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; // your backend base URL (still used for login)

// 🔐 Employee Login API (through your backend)
export const loginEmployee = (employeeId, email) => {
  return axios.post(`${BASE_URL}/auth/login`, {
    employeeId,
    email
  });
};

// 🔍 Item Search API (directly calling Rootments API)
export const searchItem = (itemCode, locationId) => {
  return axios.get('https://rentalapi.rootments.live/api/ItemSearch/GetItemSearch', {
    params: {
      ItemCode: itemCode,
      LocationID: locationId
    }
  });
};

