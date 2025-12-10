/**
 * USAGE EXAMPLES
 *
 * This file shows how to integrate PasswordAlert components
 * into your existing forms
 */

import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { PasswordAlert, PasswordStrengthIndicator, PasswordTooltip } from './PasswordAlert'
import AuthService from '../../../api/authService'

// ============================================
// Example 1: Full Alert (Recommended)
// ============================================

export const SignupFormWithAlert = () => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password before submitting
    if (!AuthService.validatePassword(password)) {
      setError('Password does not meet requirements')
      return
    }

    // Continue with signup...
    console.log('Password is valid, continue signup')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowAlert(true)}
              onBlur={() => setTimeout(() => setShowAlert(false), 200)}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <BsEyeSlash className="w-5 h-5" /> : <BsEye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Alert - Shows validation requirements */}
          <PasswordAlert password={password} show={showAlert} />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Sign Up
        </button>
      </div>
    </form>
  )
}

// ============================================
// Example 2: Strength Indicator Only (Minimal)
// ============================================

export const SignupFormWithStrength = () => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <BsEyeSlash className="w-5 h-5" /> : <BsEye className="w-5 h-5" />}
            </button>
          </div>

          {/* Strength Indicator - Compact bar */}
          <PasswordStrengthIndicator password={password} />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Sign Up
        </button>
      </div>
    </form>
  )
}

// ============================================
// Example 3: Tooltip Style (Hover/Focus)
// ============================================

export const SignupFormWithTooltip = () => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <form className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>

        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setTimeout(() => setShowTooltip(false), 200)}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <BsEyeSlash className="w-5 h-5" /> : <BsEye className="w-5 h-5" />}
            </button>
          </div>

          {/* Tooltip - Appears on focus */}
          <PasswordTooltip password={password} show={showTooltip} />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Sign Up
        </button>
      </div>
    </form>
  )
}

// ============================================
// Example 4: Combined (Alert + Strength)
// ============================================

export const SignupFormCombined = () => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  return (
    <form className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowAlert(true)}
              onBlur={() => setTimeout(() => setShowAlert(false), 200)}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <BsEyeSlash className="w-5 h-5" /> : <BsEye className="w-5 h-5" />}
            </button>
          </div>

          {/* Strength bar always visible */}
          <PasswordStrengthIndicator password={password} />

          {/* Detailed alert on focus */}
          <PasswordAlert password={password} show={showAlert} />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Sign Up
        </button>
      </div>
    </form>
  )
}

// ============================================
// Example 5: With Form Validation
// ============================================

export const SignupFormWithValidation = () => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [touched, setTouched] = useState(false)

  const isPasswordValid = AuthService.validatePassword(password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)

    if (!isPasswordValid) {
      return
    }

    // Continue with signup
    console.log('Password is valid!')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowAlert(true)}
              onBlur={() => {
                setTimeout(() => setShowAlert(false), 200)
                setTouched(true)
              }}
              className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 transition-colors ${
                touched && !isPasswordValid
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <BsEyeSlash className="w-5 h-5" /> : <BsEye className="w-5 h-5" />}
            </button>
          </div>

          {/* Show error if touched and invalid */}
          {touched && !isPasswordValid && !showAlert && (
            <p className="mt-2 text-sm text-red-600">
              Password does not meet requirements
            </p>
          )}

          <PasswordAlert password={password} show={showAlert} />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={touched && !isPasswordValid}
        >
          Sign Up
        </button>
      </div>
    </form>
  )
}
