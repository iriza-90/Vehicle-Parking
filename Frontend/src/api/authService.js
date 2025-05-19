import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
});

export const signUpAPI = (firstname, lastname, email, password) =>
  API.post('/auth/signup', { firstname, lastname, email, password });

export const verifyOTPAPI = (email, code) =>
  API.post('/auth/verify-email', { email, code });

export const loginAPI = (email, password) =>
  API.post('/auth/login', { email, password });