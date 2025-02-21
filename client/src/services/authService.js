import axios from 'axios';
const API_URL = 'http://localhost:8080/api/users';

const register = async (userData) => {
  const response = await axios.post(API_URL, userData);
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');
};

const getToken = () => {
  return localStorage.getItem('token');
};

const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

const authService = {
  register,
  login,
  logout,
  getToken,
  getUserInfo,
};

export { register, login, logout, getToken, getUserInfo };
export default authService;