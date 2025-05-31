import axios from 'axios';

export const fetchExternalAPI = async (url, method = 'GET', data = {}) => {
  try {
    const config = {
      method,
      url,
      ...(method === 'POST' ? { data } : { params: data })
    };

    const res = await axios(config);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'API fetch error');
  }
};

