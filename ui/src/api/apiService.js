import axios from "axios";

// Every endpoint file (authApi.js, leadApi.js, ...) calls apiService with a
// relative path like "auth/login" or "leads" — baseURL must keep the /api/
// segment or those all resolve one level too shallow.
const baseApiUrl = "http://localhost:3001/api/";
const defaultRedirectUrl = "http://localhost:8080/login";

const apiClient = axios.create({
  baseURL: baseApiUrl,
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem("authToken");
};

// Flag to prevent multiple logout redirects
let isRedirecting = false;

// Request interceptor to automatically add token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401) {
      // Prevent multiple redirects
      if (isRedirecting) {
        return Promise.reject(error);
      }

      const token = getToken();

      // Do not redirect on login/register failures
      if (url?.includes("auth/login") || url?.includes("auth/register")) {
        return Promise.reject(error);
      }

      // Token exists but is invalid/expired
      if (token) {
        isRedirecting = true;
        localStorage.clear();

        setTimeout(() => {
          window.location.href = defaultRedirectUrl;
        }, 100);
      }
    }

    return Promise.reject(error);
  },
);

const apiService = {
  // GET request
  get: async (url) => {
    const response = await apiClient.get(url);
    return response.data;
  },

  // POST request
  post: async (url, data) => {
    const headers =
      data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};

    const response = await apiClient.post(url, data, { headers });
    return response.data;
  },

  // PUT request
  put: async (url, data) => {
    const headers =
      data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};

    const response = await apiClient.put(url, data, { headers });
    return response.data;
  },

  // PATCH request
  patch: async (url, data) => {
    const headers =
      data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};

    const response = await apiClient.patch(url, data, { headers });
    return response.data;
  },

  // DELETE request
  delete: async (url) => {
    const response = await apiClient.delete(url);
    return response.data;
  },

  // GET request for a binary/file response (e.g. CSV export)
  getBlob: async (url) => {
    const response = await apiClient.get(url, { responseType: "blob" });
    return response.data;
  },
};

export default apiService;
