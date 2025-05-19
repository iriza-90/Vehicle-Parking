import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiCheck } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const { verifyOTP, tempEmail } = useAuth()
  const inputRefs = useRef([])

  useEffect(() => {
    // Focus on first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }

    // Handle OTP paste
    const handlePaste = (e) => {
      const paste = e.clipboardData.getData('text').trim()
      if (/^\d{6}$/.test(paste)) {
        const digits = paste.split('')
        setOtp(digits)
        if (inputRefs.current[5]) inputRefs.current[5].focus()
      }
    }

    const container = inputRefs.current[0]?.parentElement
    container?.addEventListener('paste', handlePaste)

    return () => container?.removeEventListener('paste', handlePaste)
  }, [])

  useEffect(() => {
    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval)
          return 0
        }
        return prevTimer - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < otp.length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      return setError('Please enter the 6-digit verification code')
    }

    try {
      setIsLoading(true)
      await verifyOTP(otpValue)
    } catch (err) {
      setError(err.message || 'Failed to verify account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = () => {
    setTimer(60)
    // TODO: Call actual resend OTP API here
    setTimeout(() => {
      alert('New OTP has been sent to your email')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-700">
            Park<span className="text-success-600">Smart</span>
          </h1>
          <h2 className="mt-2 text-xl font-medium text-gray-900">Verify your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to {tempEmail || 'your email address'}
          </p>
        </div>

        <div className="mt-8 card">
          {error && (
            <div className="mb-4 bg-error-50 border-l-4 border-error-500 p-4 text-error-700">
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="form-label">
                Verification Code
              </label>
              <div className="mt-1 flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-medium border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex justify-center items-center"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FiCheck className="mr-2" />
                )}
                Verify Account
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive a code?{' '}
                {timer > 0 ? (
                  <span className="text-gray-500">
                    Resend code in {timer} seconds
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Resend code
                  </button>
                )}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Back to login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP
