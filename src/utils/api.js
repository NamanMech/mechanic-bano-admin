import axios from 'axios';  // Add this line

export const getApiUrl = (endpoint = '') => {
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  return `${baseUrl}/${cleanEndpoint}`;
};

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  const message = error.response?.data?.message || error.message || defaultMessage;
  console.error('API Error:', error.response?.data || error.message);
  return message;
};

export const apiRequest = async (method, endpoint, data = null) => {
  try {
    const url = getApiUrl(endpoint);
    const config = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (data) {
      config.data = data;
    }
    const response = await axios(config);
    return response.data;
  } catch (error) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};
