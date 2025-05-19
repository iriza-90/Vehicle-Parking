import { useState } from 'react'
import { FiPlus, FiSearch, FiRefreshCw, FiEdit, FiTrash2, FiLogOut } from 'react-icons/fi'
import { useVehicles } from '../../contexts/VehicleContext'
import VehicleForm from './VehicleForm'
import Pagination from '../../components/common/Pagination'

const VehicleManagement = () => {
  const {
  vehicles,
  loading,
  totalVehicles,
  currentPage,
  vehiclesPerPage,
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  deleteVehicle,
  checkoutVehicle,
} = useVehicles();


  //  Prevent .map crash
  const safeVehicles = Array.isArray(vehicles) ? vehicles : []

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleAddNew = () => {
    setEditingVehicle(null)
    setShowAddForm(true)
  }

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle)
    setShowAddForm(true)
  }

  const handleFormClose = () => {
    setShowAddForm(false)
    setEditingVehicle(null)
  }

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await deleteVehicle(id)
    }
  }

  const handleCheckoutVehicle = async (id) => {
    if (window.confirm('Are you sure you want to check out this vehicle?')) {
      await checkoutVehicle(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Vehicle
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by owner, plate number, vehicle type..."
              className="form-input pl-10"
            />
          </div>
          <div className="flex-shrink-0">
            <button 
              onClick={() => setSearchTerm('')}
              className="btn-outline flex items-center"
            >
              <FiRefreshCw className="mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Vehicle Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <VehicleForm 
              onClose={handleFormClose} 
              editingVehicle={editingVehicle} 
            />
          </div>
        </div>
      )}
      
      {/* Vehicle Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                  </td>
                </tr>
              ) : safeVehicles.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                    No vehicles found. Please add a new vehicle or adjust your search.
                  </td>
                </tr>
              ) : (
                safeVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{vehicle.owner}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.plate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.vehicleType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: vehicle.color.toLowerCase() }}
                        ></span>
                        <span className="text-sm text-gray-900">{vehicle.color}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(vehicle.timeIn).toISOString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {vehicle.timeOut ? new Date(vehicle.timeOut).toISOString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.slotAssigned}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${vehicle.status === 'parked' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'}`}>
                        {vehicle.status === 'parked' ? 'Parked' : 'Checked out'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(vehicle)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        {vehicle.status === 'parked' && (
                          <button
                            onClick={() => handleCheckoutVehicle(vehicle.id)}
                            className="text-secondary-600 hover:text-secondary-900"
                            title="Check Out"
                          >
                            <FiLogOut size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="text-error-600 hover:text-error-900"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && safeVehicles.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalVehicles}
            itemsPerPage={vehiclesPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}

export default VehicleManagement
