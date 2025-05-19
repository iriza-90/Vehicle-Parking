import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/routing/PrivateRoute'
import PublicRoute from './components/routing/PublicRoute'

import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import VerifyOTP from './pages/auth/VerifyOTP'
import Dashboard from './pages/dashboard/Dashboard'
import VehicleManagement from './pages/vehicles/VehicleManagement'
import Layout from './components/layout/Layout'

function App() {
  const { isLoading } = useAuth()

  useEffect(() => {
    document.title = 'Park Smart - Parking Management System'
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute />}>
        <Route index element={<Navigate replace to="/login" />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="verify-otp" element={<VerifyOTP />} />
      </Route>

      {/* Protected routes */}
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="vehicles" element={<VehicleManagement />} />
        </Route>
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default App