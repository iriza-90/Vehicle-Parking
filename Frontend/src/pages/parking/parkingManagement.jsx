import { useEffect, useState } from 'react';
import ParkingForm from './parkingForm';
import { getParkingSlots } from '../../api/parkingService';

export default function ParkingSlotPage() {
  const [slots, setSlots] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await getParkingSlots();
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNew = () => {
    setEditingSlot(null);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Parking Slots</h2>
        <button onClick={handleAddNew} className="btn-primary">
          + Add Slot
        </button>
      </div>

      {showForm && (
        <div className="bg-white border shadow rounded-md p-4 mb-6">
          <ParkingForm
            onClose={() => setShowForm(false)}
            editingSlot={editingSlot}
            onSave={fetchSlots}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <div key={slot.id} className="border p-4 rounded-md shadow-sm bg-white">
            <p><strong>Code:</strong> {slot.code}</p>
            <p><strong>Name:</strong> {slot.parkingName}</p>
            <p><strong>Location:</strong> {slot.location}</p>
            <p><strong>Available:</strong> {slot.availableSpaces}</p>
            <p><strong>Fee/hr:</strong> ${slot.chargingFeePerHour}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
