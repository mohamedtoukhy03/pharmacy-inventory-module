import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Base API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers) {
      // Use Basic Auth with default credentials for development
      const basicAuth = btoa('user:admin');
      config.headers.Authorization = `Basic ${basicAuth}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Normalize error structure
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle specific status codes
      switch (status) {
        case 400:
          // Validation error - let the component handle it
          console.warn('Validation error:', data);
          break;
        case 401:
          // Unauthorized - clear token and redirect to login
          console.error('Unauthorized - redirecting to login');
          localStorage.removeItem('authToken');
          // Don't redirect during development with Basic Auth
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden: You do not have permission to access this resource');
          break;
        case 404:
          console.warn('Not Found: The requested resource does not exist');
          break;
        case 409:
          // Conflict - let the component handle it (e.g., delete with dependencies)
          console.warn('Conflict:', data);
          break;
        case 422:
          // Unprocessable Entity - validation error
          console.warn('Unprocessable Entity:', data);
          break;
        case 500:
          console.error('Internal Server Error: Please try again later');
          break;
        case 503:
          console.error('Service Unavailable: Server is temporarily unavailable');
          break;
        default:
          console.error(`Error ${status}:`, data);
      }
    } else if (error.request) {
      console.error('Network Error: No response received from server');
      console.error('Possible causes: Server is down, CORS issues, network connectivity');
    } else {
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
