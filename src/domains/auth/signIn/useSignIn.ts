import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { signInAPI, getMyProfileAPI } from './SignInService';
import { toast } from 'react-toastify';
import type { SignInCredentials } from './dto/SignInModel';

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const signInStore = useAuthStore((state) => state.signIn);

  const signIn = async (credentials: SignInCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Sign in and get tokens
      const response = await signInAPI(credentials);
      
      console.log('Sign in response:', response);

      // Step 2: Store tokens in localStorage FIRST - response.data contains token and refreshToken
      if (!response.data?.token) {
        console.error('Tokens not found in response:', response);
        throw new Error('Invalid response format from server');
      }
      
      localStorage.setItem('access_token', response.data.token);
      console.log('Tokens stored in localStorage');
      
      // Step 3: Fetch user profile using the token
      const profile = await getMyProfileAPI();
      console.log('Profile fetched:', profile);
      console.log('Profile type:', typeof profile);
      console.log('Profile keys:', Object.keys(profile));
      
      // Step 4: Update auth store with user data from profile
      signInStore(profile);
      console.log('Store updated, checking store state...');
      console.log('Current store user:', useAuthStore.getState().user);

      // Show success toast
      toast.success('Sign in successful!');

      // Navigate to dashboard
      navigate('/product-page');
    } catch (err) {
      let errorMessage = 'An error occurred during sign in';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
    error
  };
}