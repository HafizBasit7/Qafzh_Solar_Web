import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI, updateApiToken } from '../services/api';
import { storage } from '../utils/storage';
import { useState, useEffect, useCallback } from 'react';

const useAuth = () => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authError, setAuthError] = useState(null);

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
      setAuthError(null); // Clear any previous errors
      return response;
    },
    onError: (error) => {
      console.error('🔐 Registration error:', error);
      setAuthError(error);
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
        setAuthError(null); // Clear any previous errors
      } catch (error) {
        console.error('🔐 Error in OTP success handler:', error);
        setAuthError(error);
      }
    },
    onError: (error) => {
      console.error('🔐 OTP verification error:', error);
      setAuthError(error);
    }
  });

  // Request OTP mutation
  const requestOTPMutation = useMutation({
    mutationFn: (phone) => authAPI.requestOTP(phone),
    onSuccess: (response) => {
      console.log('🔐 OTP request successful:', response);
      setAuthError(null); // Clear any previous errors
    },
    onError: (error) => {
      console.error('🔐 OTP request error:', error);
      setAuthError(error);
    }
  });

  // Login mutation - FIXED VERSION
  const loginMutation = useMutation({
    mutationFn: (data) => {
      console.log('🔐 Login mutation called with:', data);
      return authAPI.login(data);
    },
    onSuccess: async (response) => {
      try {
        console.log('🔐 Login successful:', response);
        await saveAuthData(response);
        setIsAuthenticated(true);
        setUserData(response.data.user);
        setAuthError(null); // Clear any previous errors
      } catch (error) {
        console.error('🔐 Error in login success handler:', error);
        setAuthError(error);
      }
    },
    onError: (error) => {
      console.error('🔐 Login error details:', {
        error,
        status: error?.status || error?.response?.status,
        message: error?.message || error?.response?.data?.message,
        data: error?.response?.data
      });
      setAuthError(error);
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      console.log('🔐 Logout successful');
      setIsAuthenticated(false);
      setUserData(null);
      setAuthError(null);
      
      // Clear storage
      storage.clearAuthData();
      updateApiToken(null);
      
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
      setAuthError(null);
      storage.clearAuthData();
      updateApiToken(null);
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

  // Clear auth error function
  const clearAuthError = useCallback(() => {
    console.log('🔐 Clearing auth error');
    setAuthError(null);
  }, []);

  // Login function that returns a promise - FIXED VERSION
  const login = useCallback(async (data) => {
    console.log('🔐 Login function called with:', data);
    try {
      // Clear previous error before attempting login
      setAuthError(null);
      
      // Use mutateAsync to get a promise that we can await
      const response = await loginMutation.mutateAsync(data);
      console.log('🔐 Login mutateAsync response:', response);
      return response;
    } catch (error) {
      console.error('🔐 Login function error:', error);
      // The error is already set in the onError callback, just throw it
      throw error;
    }
  }, [loginMutation]);

  return {
    isInitialized,
    isAuthenticated: checkAuthStatus(),
    userData,
    token: storage.getToken(),
    authError,
    clearAuthError,
    
    // Register
    register: registerMutation.mutateAsync,
    registerLoading: registerMutation.isPending,
    registerError: registerMutation.error,
    
    // OTP
    verifyOTP: verifyOTPMutation.mutate,
    verifyOTPLoading: verifyOTPMutation.isPending,
    verifyOTPError: verifyOTPMutation.error,
    
    requestOTP: requestOTPMutation.mutate,
    requestOTPLoading: requestOTPMutation.isPending,
    requestOTPError: requestOTPMutation.error,
    
    // Login - FIXED VERSION
    login, // This now returns a promise
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