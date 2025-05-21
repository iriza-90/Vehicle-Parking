import axios from 'axios';

const API_URL = 'http://localhost:3000/api/parking';

export const createParkingSlot = async (data) => {
  try {
    console.log('Sending data to backend:', data);
    const response = await axios.post(API_URL, data); 
    return response.data;
  } catch (error) {
    console.error('❌ API ERROR:', error?.response?.data || error.message);
    throw error;
  }
};

export const getParkingSlots = () => axios.get(API_URL);
