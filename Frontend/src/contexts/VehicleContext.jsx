import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const VehicleContext = createContext();

export const useVehicles = () => useContext(VehicleContext);

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 10;

const fetchVehicles = useCallback(async () => {
  setLoading(true);

  try {
    const token = localStorage.getItem('parkAuthToken');
    const res = await axios.get('/vehicles', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Vehicle API response:', res.data.vehicles);

    // Ensure response is an array before setting it
  if (Array.isArray(res.data?.vehicles)) {
  setVehicles(res.data.vehicles);
} else {
  console.error('Expected array but got:', res.data);
  toast.error('Unexpected vehicle data format.');
  setVehicles([]);

} 
  } catch (err) {
    console.error('Error fetching vehicles:', err.response?.data || err.message);
    toast.error('Failed to fetch vehicles.');
    setVehicles([]); // fallback on error
  } finally {
    setLoading(false);
  }
}, []);



  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const addVehicle = async (vehicleData) => {
    try {
      const token = localStorage.getItem('parkAuthToken');
      const res = await axios.post('/vehicles/create', vehicleData, {
      headers: { Authorization: `Bearer ${token}` },
     });
  
      setVehicles(prev => [res.data, ...prev]);
      toast.success('Vehicle added!');
    } catch (err) {
      toast.error('Failed to add vehicle.');
    }
  };

  const updateVehicle = async (id, vehicleData) => {
    try {
      const token = localStorage.getItem('parkAuthToken');
      const res = await axios.put(`/vehicles/update/${id}`, vehicleData, {
      headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(prev => prev.map(v => (v.id === id ? res.data : v)));
      toast.success('Vehicle updated!');
    } catch {
      toast.error('Failed to update vehicle.');
    }
  };

  const deleteVehicle = async (id) => {
    try {
      const token = localStorage.getItem('parkAuthToken');
      await axios.delete(`/vehicles/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast.success('Vehicle deleted!');
    } catch {
      toast.error('Failed to delete vehicle.');
    }
  };

  const checkoutVehicle = async (id) => {
  try {
    const token = localStorage.getItem('parkAuthToken');
    const res = await axios.put(`/vehicles/${id}/checkout`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 👇 Update only the specific vehicle, keeping the rest intact
    setVehicles(prev => prev.map(v => (v.id === id ? res.data.vehicle : v)));

    toast.success('Vehicle checked out!');
  } catch (err) {
    toast.error('Checkout failed.');
    console.error('Checkout error:', err.response?.data || err.message);
  }
};
  const filteredVehicles = vehicles.filter(v =>
    v.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * vehiclesPerPage,
    currentPage * vehiclesPerPage
  );

  return (
    <VehicleContext.Provider
      value={{
        vehicles: paginatedVehicles,
        loading,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        vehiclesPerPage,
        totalVehicles: filteredVehicles.length,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        checkoutVehicle,
        allVehicles: vehicles, // for dashboard stats
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};
