import React, { useState } from "react"
import { InputText, InputPassword } from "./ui/Inputs"
import { Button } from "./ui/Button"
import { LoginCredentials, LoginResponse } from "@/api/authService"

interface LoginFormProps {
  onSubmit?: (credentials: LoginCredentials) => Promise<LoginResponse>
  onSwitchToSignup?: () => void
  onSuccess?: () => void
}

export const LoginForm = ({ onSubmit, onSwitchToSignup, onSuccess}): LoginFormProps => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isFormValid, setFormValid] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const response = await onSubmit({ username, password })
    if (response.success) {
      // Save access token, switch to another page
      await onSuccess()
    } else {
      setError(response.detail)
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
          <InputText
            id='username'
            label='Username'
            placeholder='Enter username'
            value={username}
            onChange={(e) => {setUsername(e.target.value)}}
            disabled={isLoading}
          />

          {/* Password */}
          <InputPassword
            id='password'
            label='Password'
            showPassword={showPassword}
            placeholder='Enter password'
            value={password}
            onChange={(e) => {setPassword(e.target.value)}}
            disabled={isLoading}
            setShowPassword={() => {setShowPassword(!showPassword)}}
            setValid={setFormValid}
          />

          {/* Submit Button */}
          <Button
            disabled={isLoading || !isFormValid}
            label='Login'
            onClick={handleSubmit}
          />
        </form>

        {/* Switch to Signup */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            {/* */}
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