import React from 'react'
import { AuthContainer } from '../components/AuthForms'

/**
 * Example 1: Simple usage with automatic backend integration
 * The forms will automatically call your backend API endpoints
 */
export function SimpleAuthExample() {
  const handleLoginSuccess = (token: string) => {
    console.log('Login successful! Token:', token)
    // Redirect to dashboard or home page
    window.location.href = '/dashboard'
  }

  const handleSignupSuccess = () => {
    console.log('Signup successful!')
    // The form will automatically switch to login after 2 seconds
  }

  return (
    <AuthContainer
      onLoginSuccess={handleLoginSuccess}
      onSignupSuccess={handleSignupSuccess}
    />
  )
}

/**
 * Example 2: Custom department list
 */
export function CustomDepartmentsExample() {
  const customDepartments = ['Engineering', 'Product', 'Design', 'Data Science']

  return (
    <AuthContainer
      onLoginSuccess={(token) => {
        console.log('Logged in with token:', token)
      }}
      departments={customDepartments}
    />
  )
}

/**
 * Example 3: Custom handlers (override default API calls)
 */
export function CustomHandlersExample() {
  const handleLogin = async (username: string, password: string) => {
    console.log('Custom login logic:', { username, password })
    // Add your custom logic here
  }

  const handleSignup = async (
    username: string,
    email: string,
    department: string,
    password: string
  ) => {
    console.log('Custom signup logic:', { username, email, department, password })
    // Add your custom logic here
  }

  return (
    <AuthContainer
      onLogin={handleLogin}
      onSignup={handleSignup}
    />
  )
}

/**
 * Example 4: Using individual forms separately
 */
import { LoginForm, SignupForm } from '../components/AuthForms'

export function SeparateFormsExample() {
  const [showLogin, setShowLogin] = React.useState(true)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {showLogin ? (
        <LoginForm
          onLoginSuccess={(token) => {
            console.log('Token received:', token)
            // Handle successful login
          }}
          onSwitchToSignup={() => setShowLogin(false)}
        />
      ) : (
        <SignupForm
          onSignupSuccess={() => {
            console.log('Signup successful')
            setShowLogin(true)
          }}
          onSwitchToLogin={() => setShowLogin(true)}
        />
      )}
    </div>
  )
}
