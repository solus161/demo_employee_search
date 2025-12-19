import React, { useState } from "react"
import { LoginCredentials, SignupFormData, SignupResponse, LoginResponse, DepartmentResponse }
  from "@/api/authService"
import { SignupForm } from "./SignupForm"
import { LoginForm } from "./LoginForm"

interface AuthContainerProps {
  onLogin?: (credentials: LoginCredentials) => Promise<LoginResponse>
  onSignup?: (data: SignupFormData) => Promise<SignupResponse>
  onLoginSucceeds?: () => void
  getDepartments?: () => Promise<DepartmentResponse>
}

export const AuthContainer = ({
  onLogin, onSignup, onLoginSucceeds, getDepartments
}: AuthContainerProps) => {
  const [signupSwitch, toggleSignup] = useState(false)
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center bg-gray-50">
      { signupSwitch ? (
        <SignupForm 
          onSubmit={onSignup}
          getDepartments={getDepartments}
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