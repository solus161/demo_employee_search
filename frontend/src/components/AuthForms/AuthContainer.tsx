import React, { useState } from "react"
import { LoginCredentials, SignupFormData, SignupResponse, LoginResponse, DepartmentResponse }
  from "@/api/authService"
import { SignupForm } from "./SignupForm"
import { LoginForm } from "./LoginForm"

interface AuthContainerProps {
  onLogin?: (credentials: LoginCredentials) => Promise<LoginResponse>
  onSignup?: (data: SignupFormData) => Promise<SignupResponse>
  onLoginSucceeds?: () => void
  getDeparments?: () => Promise<DepartmentResponse>
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  onLogin, onSignup, onLoginSucceeds, getDeparments
}) => {
  const [signupSwitch, toggleSignup] = useState(false)
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center bg-gray-50">
      { signupSwitch ? (
        <SignupForm 
          onSubmit={onSignup}
          getDepartments={getDeparments}
          onSuccess={() => {toggleSignup(false)}}
        />
      ) : ( 
        <LoginForm
          onSubmit={onLogin}
          onSwitchToSignup={() => {toggleSignup(true)}}
          onSuccess={onLoginSucceeds}
        />
      )}
    </div>
  )
}