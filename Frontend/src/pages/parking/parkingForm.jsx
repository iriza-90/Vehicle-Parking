import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiX, FiSave } from 'react-icons/fi';
import { createParkingSlot, getParkingSlots } from '../../api/parkingService';

const ParkingForm = ({ onClose, editingSlot, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    parkingName: '',
    location: '',
    availableSpaces: '',
    chargingFeePerHour: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingSlot) {
      setFormData({
        code: editingSlot.code || '',
        parkingName: editingSlot.parkingName || '',
        location: editingSlot.location || '',
        availableSpaces: editingSlot.availableSpaces || '',
        chargingFeePerHour: editingSlot.chargingFeePerHour || '',
      });
    }
  }, [editingSlot]);

  const validate = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = 'Code is required';
    if (!formData.parkingName.trim()) newErrors.parkingName = 'Parking name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.availableSpaces || isNaN(formData.availableSpaces)) newErrors.availableSpaces = 'Valid available spaces required';
    if (!formData.chargingFeePerHour || isNaN(formData.chargingFeePerHour)) newErrors.chargingFeePerHour = 'Valid fee is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await createParkingSlot(formData);
      onSave(); // Refresh the list
      onClose(); // Close modal
    } catch (error) {
      console.error('💥 Error saving parking slot:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {editingSlot ? 'Edit Parking Slot' : 'Add New Parking Slot'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'code', label: 'Code (e.g., A-101)' },
          { name: 'parkingName', label: 'Parking Name' },
          { name: 'location', label: 'Location' },
          { name: 'availableSpaces', label: 'Available Spaces' },
          { name: 'chargingFeePerHour', label: 'Charging Fee (per hour)' },
        ].map(({ name, label }) => (
          <div key={name}>
            <label htmlFor={name} className="form-label">{label}</label>
            <input
              type="text"
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={`form-input ${errors[name] ? 'border-error-500' : ''}`}
            />
            {errors[name] && <p className="form-error">{errors[name]}</p>}
          </div>
        ))}

        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center">
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                {editingSlot ? 'Update Slot' : 'Save Slot'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

ParkingForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  editingSlot: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default ParkingForm;
