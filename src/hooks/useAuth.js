import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI, updateApiToken } from '../services/api';
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
        const token = localStorage.getItem('qafzh_auth_token');
        const storedUserData = localStorage.getItem('qafzh_user_data');
        
        if (token) {
          console.log('🔐 Found token in localStorage');
          updateApiToken(token);
          setIsAuthenticated(true);
          
          if (storedUserData) {
            try {
              const parsedUserData = JSON.parse(storedUserData);
              setUserData(parsedUserData);
              console.log('🔐 User data loaded from localStorage');
              
              // Update query cache with user data
              queryClient.setQueryData(['user', 'profile'], parsedUserData);
            } catch (parseError) {
              console.error('🔐 Error parsing user data:', parseError);
              localStorage.removeItem('qafzh_user_data');
            }
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

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data) => authAPI.register(data),
    onSuccess: (response) => {
      console.log('🔐 Registration successful:', response);
    },
  });

  // Verify OTP mutation
  const verifyOTPMutation = useMutation({
    mutationFn: ({ phone, otp }) => authAPI.verifyOTP(phone, otp),
    onSuccess: (response) => {
      console.log('🔐 OTP verification successful:', response);
      
      if (response?.data?.token) {
        updateApiToken(response.data.token);
        setIsAuthenticated(true);
      }
      
      if (response?.data?.user) {
        setUserData(response.data.user);
        queryClient.setQueryData(['user', 'profile'], response.data.user);
      }
    },
  });

  // Request OTP mutation
  const requestOTPMutation = useMutation({
    mutationFn: (phone) => authAPI.requestOTP(phone),
    onSuccess: (response) => {
      console.log('🔐 OTP request successful:', response);
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data) => authAPI.login(data),
    onSuccess: (response) => {
      console.log('🔐 Login successful:', response);
      
      if (response?.data?.token) {
        updateApiToken(response.data.token);
        setIsAuthenticated(true);
      }
      
      if (response?.data?.user) {
        setUserData(response.data.user);
        queryClient.setQueryData(['user', 'profile'], response.data.user);
      }
    },
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
        localStorage.setItem('qafzh_user_data', JSON.stringify(response.data));
      }
    },
    onError: (error) => {
      console.error('🔐 Profile fetch error:', error);
      // If unauthorized, clear auth state
      if (error?.status === 401) {
        setIsAuthenticated(false);
        setUserData(null);
        localStorage.removeItem('qafzh_auth_token');
        localStorage.removeItem('qafzh_user_data');
        updateApiToken(null);
      }
    },
    retry: false, // Don't retry on error
  });

  // Logout function
  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return {
    isInitialized,
    isAuthenticated,
    userData,
    register: registerMutation.mutate,
    registerLoading: registerMutation.isPending,
    registerError: registerMutation.error,
    verifyOTP: verifyOTPMutation.mutate,
    verifyOTPLoading: verifyOTPMutation.isPending,
    verifyOTPError: verifyOTPMutation.error,
    requestOTP: requestOTPMutation.mutate,
    requestOTPLoading: requestOTPMutation.isPending,
    requestOTPError: requestOTPMutation.error,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
    logoutLoading: logoutMutation.isPending,
    profileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,
    profileRefetch: profileQuery.refetch,
  };
};

export default useAuth;