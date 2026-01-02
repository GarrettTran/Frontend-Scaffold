import { apiGet, apiPost } from "@/utils/https.utils";
import { API_ENDPOINTS } from "@/shared/api.config";
import type { SignInCredentials, SignInResponse } from "./dto/SignInModel";
import type { UserModel } from "./dto/SignInModel";


// Mock API call - simulates sign-in request
export async function signInAPI(credentials: SignInCredentials): Promise<SignInResponse> {
  try {
    const response = await apiPost<SignInResponse>(API_ENDPOINTS.auth.signIn, credentials);
    return response;
  } catch (err: any) {
    // Handle error response from backend
    if (err.type === 'api_error' && err.message) {
      // Backend returns { message: "...", code: 404 }
      throw new Error(err.message);
    }
    
    // Handle specific status codes
    if (err.status === 404) {
      throw new Error(err.message || 'User not found');
    } else if (err.status === 401) {
      throw new Error(err.message || 'Invalid email or password');
    } else if (err.status === 400) {
      throw new Error(err.message || 'Bad Request');
    } else if (err.status === 500) {
      throw new Error(err.message || 'Server error');
    }
    
    // Fallback for other errors
    throw new Error(err.message || 'An unexpected error occurred');
  }
}

export async function getMyProfileAPI(): Promise<UserModel> {
  try {
    const response = await apiGet<any>(API_ENDPOINTS.user.getMyProfile, {});
    console.log('Raw profile response:', response);
    
    // Check if response is wrapped in data property
    if (response.data) {
      return response.data as UserModel;
    }
    
    return response as UserModel;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to fetch profile');
  }
}