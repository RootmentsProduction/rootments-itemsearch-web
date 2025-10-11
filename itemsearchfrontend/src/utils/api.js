import axios from 'axios';

const BASE_URL = 'https://itemsearch-1.onrender.com/api'; // your backend base URL (still used for login)

// 🔐 Employee Login API (through your backend)
export const loginEmployee = (employeeId, password) => {
  return axios.post(`${BASE_URL}/auth/login`, {
    employeeId,
    password
  });
};






// export const searchItem = (itemCode, locationId) => {
//   return axios.get('https://rentalapi.rootments.live/api/ItemSearch/GetItemSearch', {
//     params: { itemCode, locationId },
//   });
// };



// ✅ Correct param is locCode
export const searchItem = (itemCode, locationId) => {
  return axios.get('https://rentalapi.rootments.live/api/ItemSearch/GetItemSearch', {
    params: { itemCode, locationId },
  });
};
