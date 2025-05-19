import { FiPlus, FiUsers, FiCheckSquare } from 'react-icons/fi'
import { FaCar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useVehicles } from '../../contexts/VehicleContext'

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-card p-6 flex items-start">
    <div className={`rounded-full p-3 ${color} mr-4`}>
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
)

const Dashboard = () => {
  const { allVehicles, loading } = useVehicles()

  const safeVehicles = Array.isArray(allVehicles) ? allVehicles : []

  const total = safeVehicles.length
  const parked = safeVehicles.filter(v => v.status === 'parked').length
  const owners = new Set(safeVehicles.map(v => v.owner)).size

  const recentVehicles = [...safeVehicles]
    .sort((a, b) => new Date(b.timeIn) - new Date(a.timeIn))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/dashboard/vehicles" className="btn-primary flex items-center">
          <FiPlus className="mr-2" />
          Add Vehicle
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Vehicles" value={total} icon={<FaCar className="h-6 w-6 text-primary-600" />} color="bg-primary-100" />
        <StatCard title="Currently Parked" value={parked} icon={<FiCheckSquare className="h-6 w-6 text-success-600" />} color="bg-success-100" />
        <StatCard title="Vehicle Owners" value={owners} icon={<FiUsers className="h-6 w-6 text-secondary-600" />} color="bg-secondary-100" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <Link to="/dashboard/vehicles" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentVehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{vehicle.owner}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{vehicle.plate}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{vehicle.vehicleType}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(vehicle.timeIn).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vehicle.status === 'parked' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.status === 'parked' ? 'Parked' : 'Checked out'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
