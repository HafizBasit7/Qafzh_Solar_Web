import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI, updateApiToken } from '../services/api';
import { storage } from '../utils/storage';
import { useState, useEffect, useCallback } from 'react';

const useAuth = () => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        console.log('🔐 Initializing auth state from localStorage...');
        const token = storage.getToken();
        const storedUserData = storage.getUserData();
        
        if (token) {
          console.log('🔐 Found token in localStorage');
          updateApiToken(token);
          setIsAuthenticated(true);
          
          if (storedUserData) {
            setUserData(storedUserData);
            console.log('🔐 User data loaded from localStorage');
            
            // Update query cache with user data
            queryClient.setQueryData(['user', 'profile'], storedUserData);
          }
        } else {
          console.log('🔐 No token found in localStorage');
          setIsAuthenticated(false);
          setUserData(null);
        }
      } catch (error) {
        console.error('🔐 Error initializing auth:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [queryClient]);

  // Helper function to save auth data
  const saveAuthData = async (response) => {
    try {
      if (response?.data?.token) {
        console.log('🔐 Saving token to storage and updating API...');
        storage.setToken(response.data.token);
        updateApiToken(response.data.token);
      }
      if (response?.data?.user) {
        console.log('🔐 Saving user data to storage...');
        storage.setUserData(response.data.user);
        queryClient.setQueryData(['user', 'profile'], response.data.user);
      }
    } catch (error) {
      console.error('🔐 Error saving auth data:', error);
      throw error;
    }
  };

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data) => authAPI.register(data),
    onSuccess: (response) => {
      console.log('🔐 Registration successful:', response);
    },
    onError: (error) => {
      console.error('🔐 Registration error:', error);
    }
  });

  // Verify OTP mutation
  const verifyOTPMutation = useMutation({
    mutationFn: ({ phone, otp }) => authAPI.verifyOTP(phone, otp),
    onSuccess: async (response) => {
      try {
        console.log('🔐 OTP verification successful:', response);
        await saveAuthData(response);
        setIsAuthenticated(true);
        setUserData(response.data.user);
      } catch (error) {
        console.error('🔐 Error in OTP success handler:', error);
      }
    },
    onError: (error) => {
      console.error('🔐 OTP verification error:', error);
    }
  });

  // Request OTP mutation
  const requestOTPMutation = useMutation({
    mutationFn: (phone) => authAPI.requestOTP(phone),
    onSuccess: (response) => {
      console.log('🔐 OTP request successful:', response);
    },
    onError: (error) => {
      console.error('🔐 OTP request error:', error);
    }
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data) => authAPI.login(data),
    onSuccess: async (response) => {
      try {
        console.log('🔐 Login successful:', response);
        await saveAuthData(response);
        setIsAuthenticated(true);
        setUserData(response.data.user);
      } catch (error) {
        console.error('🔐 Error in login success handler:', error);
      }
    },
    onError: (error) => {
      console.error('🔐 Login error:', error);
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      console.log('🔐 Logout successful');
      setIsAuthenticated(false);
      setUserData(null);
      
      // Clear user data from query cache
      queryClient.removeQueries(['user']);
      
      // Invalidate all queries to force refetch when needed
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error('🔐 Logout error:', error);
      // Even if logout API fails, clear local state
      setIsAuthenticated(false);
      setUserData(null);
      queryClient.removeQueries(['user']);
    }
  });

  // Get user profile query
  const profileQuery = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => authAPI.getProfile(),
    enabled: isAuthenticated && !userData, // Only fetch if authenticated and no user data
    onSuccess: (response) => {
      console.log('🔐 Profile fetch successful:', response);
      if (response?.data) {
        setUserData(response.data);
        storage.setUserData(response.data);
      }
    },
    onError: (error) => {
      console.error('🔐 Profile fetch error:', error);
      // If unauthorized, clear auth state
      if (error?.status === 401) {
        setIsAuthenticated(false);
        setUserData(null);
        storage.clearAuthData();
        updateApiToken(null);
      }
    },
    retry: false, // Don't retry on error
  });

  // Check if user is truly authenticated (has valid token)
  const checkAuthStatus = useCallback(() => {
    const token = storage.getToken();
    const hasToken = !!token;
    
    console.log('🔐 Checking auth status:', {
      hasToken,
      isAuthenticated,
      hasUserData: !!userData
    });
    
    return hasToken && isAuthenticated;
  }, [isAuthenticated, userData]);

  // Logout function
  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return {
    isInitialized,
    isAuthenticated: checkAuthStatus(),
    userData,
    token: storage.getToken(),
    
    // Register
    register: registerMutation.mutate,
    registerLoading: registerMutation.isPending,
    registerError: registerMutation.error,
    
    // OTP
    verifyOTP: verifyOTPMutation.mutate,
    verifyOTPLoading: verifyOTPMutation.isPending,
    verifyOTPError: verifyOTPMutation.error,
    
    requestOTP: requestOTPMutation.mutate,
    requestOTPLoading: requestOTPMutation.isPending,
    requestOTPError: requestOTPMutation.error,
    
    // Login
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    
    // Logout
    logout,
    logoutLoading: logoutMutation.isPending,
    
    // Profile
    profileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,
    profileRefetch: profileQuery.refetch,
    
    // Utility
    checkAuthStatus,
  };
};

export default useAuth;