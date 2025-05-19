import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  signUpAPI,
  verifyOTPAPI,
  loginAPI,
} from '../api/authService' // adjust path if needed

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [tempEmail, setTempEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const navigate = useNavigate()

  // Load from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('parkUserData')
    const token = localStorage.getItem('parkAuthToken')

    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser)
        setCurrentUser(userData)
        setIsAuthenticated(false)
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('parkUserData')
        localStorage.removeItem('parkAuthToken')
      }
    }

    setIsLoading(false)
  }, [])

  // SIGN UP
  const signUp = async (firstname, lastname, email, password) => {
    try {
      const res = await signUpAPI(firstname, lastname,email, password)
      setTempEmail(email)

      toast.success(res.data?.message || 'OTP sent to your email')
      navigate('/Verify-otp')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed')
      throw error
    }
  }

  // VERIFY OTP
  const verifyOTP = async (otp) => {
  try {
    const res = await verifyOTPAPI(tempEmail, otp)

    toast.success('Account verified successfully')
    navigate('/login') // Now user is NOT logged in yet

  } catch (error) {
    toast.error(error.response?.data?.message || 'OTP verification failed')
    throw error
  }
}
  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await loginAPI(email, password)
      const user = res.data?.user
      const token = res.data?.token

      setCurrentUser(user)
      setIsAuthenticated(true)
      localStorage.setItem('parkUserData', JSON.stringify(user))
      localStorage.setItem('parkAuthToken', token)

      toast.success('Logged in successfully')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('parkUserData')
    localStorage.removeItem('parkAuthToken')
    setCurrentUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const value = {
    currentUser,
    isLoading,
    isAuthenticated,
    tempEmail,
    signUp,
    verifyOTP,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
