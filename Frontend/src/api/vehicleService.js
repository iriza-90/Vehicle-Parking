// services/vehicleService.js
import axios from 'axios';

const API_BASE = 'http://localhost:3000/vehicles';

const authHeaders = () => {
  const token = localStorage.getItem('parkAuthToken');
  console.log('Token used:', token); // Add this for debug
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

export const fetchVehicles = async () => {
  const response = await axios.get(API_BASE, authHeaders());
  console.log('Fetched vehicles:', response.data); // Debugging
  return response.data;
};

export const fetchVehicle = async (id) => {
  const { data } = await axios.get(`${API_BASE}/${id}`, authHeaders());
  return data;
};

export const createVehicle = async (vehicle) => {
  const { data } = await axios.post(`${API_BASE}/create`, vehicle, authHeaders());
  return data;
};

export const updateVehicle = async ({ id, ...updates }) => {
  const { data } = await axios.put(`${API_BASE}/update/${id}`, updates, authHeaders());
  return data;
};

export const deleteVehicle = async (id) => {
  await axios.delete(`${API_BASE}/delete/${id}`, authHeaders());
};

export const checkoutVehicle = async (id) => {
  const { data } = await axios.patch(`${API_BASE}/${id}/checkout`, null, authHeaders());
  return data;
};
