import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FiX, FiSave } from 'react-icons/fi'
import { useVehicles } from '../../contexts/VehicleContext'

const VehicleForm = ({ onClose, editingVehicle }) => {
  const [formData, setFormData] = useState({
    owner: '',
    plate: '',
    vehicleType: '',
    color: '',
    slotAssigned: '',
    status: 'parked',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { addVehicle, updateVehicle } = useVehicles()

  const vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Motorcycle', 'Van', 'Bus', 'Other']
  const colors = ['Black', 'White', 'Red', 'Blue', 'Silver', 'Green', 'Yellow', 'Gray', 'Other']

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        owner: editingVehicle.owner || '',
        plate: editingVehicle.plate || '',
        vehicleType: editingVehicle.vehicleType || '',
        color: editingVehicle.color || '',
        slotAssigned: editingVehicle.slotAssigned || '',
        status: editingVehicle.status || 'parked',
      })
    }
  }, [editingVehicle])

  const validate = () => {
    const newErrors = {}
    if (!formData.owner.trim()) newErrors.owner = 'Owner name is required'
    if (!formData.plate.trim()) newErrors.plate = 'Plate number is required'
    if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required'
    if (!formData.color) newErrors.color = 'Color is required'
    if (!formData.slotAssigned.trim()) newErrors.slotAssigned = 'Slot assignment is required'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setIsSubmitting(true)
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, formData)
      } else {
        await addVehicle({
  ...formData,
  timeIn: new Date().toISOString(), // MUST be injected here
})
      }
      onClose()
    } catch (error) {
      if (error.response) {
        console.error('💥 Error saving vehicle - response:', error.response.data)
      } else if (error.request) {
        console.error('💥 No response received:', error.request)
      } else {
        console.error('💥 Error setting up request:', error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">

          <div>
            <label htmlFor="owner" className="form-label">Owner Name</label>
            <input
              type="text"
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              className={`form-input ${errors.owner ? 'border-error-500' : ''}`}
            />
            {errors.owner && <p className="form-error">{errors.owner}</p>}
          </div>

          <div>
            <label htmlFor="plate" className="form-label">License Plate</label>
            <input
              type="text"
              id="plate"
              name="plate"
              value={formData.plate}
              onChange={handleChange}
              className={`form-input ${errors.plate ? 'border-error-500' : ''}`}
            />
            {errors.plate && <p className="form-error">{errors.plate}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vehicleType" className="form-label">Vehicle Type</label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className={`form-input ${errors.vehicleType ? 'border-error-500' : ''}`}
              >
                <option value="">Select vehicle type</option>
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.vehicleType && <p className="form-error">{errors.vehicleType}</p>}
            </div>

            <div>
              <label htmlFor="color" className="form-label">Color</label>
              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className={`form-input ${errors.color ? 'border-error-500' : ''}`}
              >
                <option value="">Select color</option>
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
              {errors.color && <p className="form-error">{errors.color}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="slotAssigned" className="form-label">Parking Slot</label>
            <input
              type="text"
              id="slotAssigned"
              name="slotAssigned"
              value={formData.slotAssigned}
              onChange={handleChange}
              className={`form-input ${errors.slotAssigned ? 'border-error-500' : ''}`}
              placeholder="A-101"
            />
            {errors.slotAssigned && <p className="form-error">{errors.slotAssigned}</p>}
          </div>

          {editingVehicle && (
            <div>
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="parked">Parked</option>
                <option value="checked-out">Checked Out</option>
              </select>
            </div>
          )}

        </div>

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
                {editingVehicle ? 'Update Vehicle' : 'Save Vehicle'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

VehicleForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  editingVehicle: PropTypes.object,
}

export default VehicleForm
