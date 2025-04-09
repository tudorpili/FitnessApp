// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Your backend API URL

export const signUpUser = async (data) => {
  const response = await axios.post(`${API_URL}/signup`, data);
  return response.data; // Assuming the server returns a success message or token
};

export const loginUser = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data.token; // Assuming the server returns a JWT token
};
