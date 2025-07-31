// src/utils/storage.js
export const storage = {
  setToken: (token) => {
    localStorage.setItem('qafzh_auth_token', token);
  },
  setUserData: (userData) => {
    localStorage.setItem('qafzh_user_data', JSON.stringify(userData));
  },
  clearAuthData: () => {
    localStorage.removeItem('qafzh_auth_token');
    localStorage.removeItem('qafzh_user_data');
  },
  getToken: () => localStorage.getItem('qafzh_auth_token'),
  getUserData: () => {
    const data = localStorage.getItem('qafzh_user_data');
    return data ? JSON.parse(data) : null;
  }
};