/**
 * API configuration for the application
 */

// Base API URL - can be overridden by environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/users/login',
  REGISTER: '/api/users/register',
  
  // Jobs endpoints
  JOBS: '/api/jobs',
  MY_JOBS: '/api/jobs/my',
  
  // Gigs endpoints
  GIGS: '/api/gigs',
  GIGS_MY: "/api/gigs/my",
  
  // Other endpoints can be added here
};

/**
 * Get the full URL for an API endpoint
 * @param endpoint The API endpoint path
 * @returns The full URL for the API endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  // If the endpoint already starts with http, return it as is
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  // If the endpoint already starts with /api, just append it to the base URL
  if (endpoint.startsWith('/api')) {
    return `${API_BASE_URL}${endpoint}`;
  }
  
  // Otherwise, append /api/ to the base URL
  return `${API_BASE_URL}/api/${endpoint}`;
};

/**
 * Create fetch options with the appropriate headers
 * @param options The fetch options
 * @returns The fetch options with the appropriate headers
 */
export const createFetchOptions = (options: RequestInit = {}): RequestInit => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  return {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
};

/**
 * Fetch data from the API
 * @param endpoint The API endpoint
 * @param options The fetch options
 * @returns The response data
 */
export const fetchApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = getApiUrl(endpoint);
  const fetchOptions = createFetchOptions(options);
  
  const response = await fetch(url, fetchOptions);
  
  // Return the JSON response even for error status codes
  // Let the calling component handle the error response
  return response.json() as Promise<T>;
};