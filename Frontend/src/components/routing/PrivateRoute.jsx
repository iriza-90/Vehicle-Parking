import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { VehicleProvider } from '../../contexts/VehicleContext'

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return isAuthenticated ? (
    <VehicleProvider>
      <Outlet />
    </VehicleProvider>
  ) : (
    <Navigate to="/login" replace />
  )
}

export default PrivateRoute
