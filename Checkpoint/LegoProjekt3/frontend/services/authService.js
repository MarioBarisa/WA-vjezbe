// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3005'; 

export const authService = {
  // registracija
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'korisnik' 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Greška pri registraciji' };
    }
  },

  // prijava
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: credentials.username,
        password: credentials.password
      });
      
      // spremanje JWT
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.korisnik));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Greška pri prijavi' };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },


  getToken() {
    return localStorage.getItem('token');
  }
};
