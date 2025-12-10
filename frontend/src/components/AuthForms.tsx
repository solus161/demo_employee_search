import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import AuthService from '../api/authService'



interface LoginFormProps {
  onSubmit?: (username: string, password: string) => void
  onSwitchToSignup: () => void
  onLoginSuccess?: (token: string) => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onSwitchToSignup, onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // If custom onSubmit is provided, use it
      if (onSubmit) {
        onSubmit(username, password)
        return
      }

      // Otherwise, use the default API call
      const response = await AuthService.login(username, password)

      if (response.success) {
        // TypeScript knows response has access_token here
        AuthService.saveToken(response.access_token)
        if (onLoginSuccess) {
          onLoginSuccess(response.access_token)
        }
      } else {
        // TypeScript knows response has detail here
        setError(response.detail)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          <p className="text-gray-600 mt-1">Welcome back! Please login to your account.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Switch to Signup */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

interface SignupFormProps {
  onSubmit?: (username: string, email: string, department: string, password: string) => void
  onSwitchToLogin: () => void
  onSignupSuccess?: () => void
  departments?: string[]
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  onSignupSuccess,
  departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations']
}) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      // If custom onSubmit is provided, use it
      if (onSubmit) {
        onSubmit(username, email, department, password)
        return
      }

      // Otherwise, use the default API call
      await AuthService.signup({
        username,
        email,
        password,
        department: department || null
      })

      setSuccess(true)

      if (onSignupSuccess) {
        onSignupSuccess()
      } else {
        // Auto switch to login after 2 seconds
        setTimeout(() => {
          onSwitchToLogin()
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
          <p className="text-gray-600 mt-1">Create your account to get started.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">Account created successfully! Redirecting to login...</p>
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="signup-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Choose a username"
              required
              disabled={isLoading || success}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
              required
              disabled={isLoading || success}
            />
          </div>

          {/* Department */}
          <div className="mb-4">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              required
              disabled={isLoading || success}
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Create a password"
                required
                disabled={isLoading || success}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoading || success}
              >
                {showPassword ? <BsEyeSlash className="w-5 h-5" /> : <BsEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : success ? 'Success!' : 'Sign Up'}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

interface AuthContainerProps {
  onLogin?: (username: string, password: string) => void
  onSignup?: (username: string, email: string, department: string, password: string) => void
  onLoginSuccess?: (token: string) => void
  onSignupSuccess?: () => void
  departments?: string[]
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  onLogin,
  onSignup,
  onLoginSuccess,
  onSignupSuccess,
  departments
}) => {
  const [showLogin, setShowLogin] = useState(true)

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center bg-gray-50">
      {showLogin ? (
        <LoginForm
          onSubmit={onLogin}
          onLoginSuccess={onLoginSuccess}
          onSwitchToSignup={() => setShowLogin(false)}
        />
      ) : (
        <SignupForm
          onSubmit={onSignup}
          onSignupSuccess={onSignupSuccess}
          onSwitchToLogin={() => setShowLogin(true)}
          departments={departments}
        />
      )}
    </div>
  )
}
