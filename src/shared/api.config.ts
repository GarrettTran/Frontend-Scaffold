const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const API_ENDPOINTS = {
  auth: {
    signIn: `${BASE_URL}/user/auth/sign-in`,
    signUp: `${BASE_URL}/user/auth/sign-up`,
  },

  user: {
    getMyProfile: `${BASE_URL}/user/user/me`
  }
} as const;

// Type helper for API endpoints
export type ApiEndpoint = typeof API_ENDPOINTS;

// Helper function to build URL with params
export const buildUrl = (endpoint: string, params?: Record<string, string | number>) => {
  if (!params) return endpoint;
  
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, String(value));
  });
  
  return url;
};

// Export BASE_URL for other uses
export { BASE_URL };