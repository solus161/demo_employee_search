import React, { useState } from "react"
import { LoginCredentials, SignupForm } from "@/api/authService"

interface AuthContainerProps {
  onLogin?: (credentials: LoginCredentials) => void
  onSignup?: (data: SignupForm) => void
  onLoginSucceeds?: (token: string) => void
  onSignupSucceeds?: () => void
  deparments?: string[]
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  onLogin, onSignup, onLoginSucceeds, onSignupSucceeds, deparments
}) => {
  const [signupSwitch, toggleSignUp] = useState(false)
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center bg-gray-50">
      { signupSwitch ? (
        // show sign up form
      ) : ( 
        // show login form
      )}
    </div>
  )
}