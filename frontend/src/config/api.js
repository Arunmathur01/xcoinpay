// API Configuration for Production
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://xcoinpay.org/api'  // Change this to your actual domain
    : 'http://localhost:5000');

export default API_BASE_URL;
