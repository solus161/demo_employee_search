import React, { useState, useEffect } from "react"
import { InputText, InputEmail, InputPassword } from "./ui/Inputs"
import { Dropdown } from "./ui/Dropdown"
import { Button } from "./ui/Button"
import { DepartmentResponse, SignupFormData, SignupResponse } from "@/api/authService"


interface SignupFormProps {
  onSubmit?: (signupData: SignupFormData) => Promise<SignupResponse>
  getDepartments?: () => Promise<DepartmentResponse>
  onSuccess?: () => void
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, getDepartments, onSuccess }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')
  const [departmentList, setDepartmentList] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isFormValid, setFormValid] = useState(false)

  // Run on mount
  useEffect(() => {
    getDepartments?.().then(response => {
      setDepartmentList(response.departments)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const response = await onSubmit?.({ username, email, department, password })
    console.log('SignupForm', response)
    if (response.success) {
      setSuccess(true)
      onSuccess()
    } else {
      setError(response.detail)
    }
    setLoading(false)
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
          <InputText
            id={username}
            label='Username'
            placeholder='Enter username'
            value={username}
            onChange={(e) => {setUsername(e.target.value)}}
            disabled={isLoading} />
          
          {/* Email */}
          <InputEmail
            id={email}
            label='Email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
            disabled={isLoading} />
          
          {/* Deparment */}
          <Dropdown
            id='deparment'
            label='Department'
            placeholder='Select a department'
            value={department}
            onChange={(e) => {setDepartment(e.target.value)}}
            disabled={isLoading}
            options={departmentList}
          />

          {/* Password */}
          <InputPassword
            id='password'
            label='Password'
            showPassword={false}
            placeholder='Enter password'
            value={password}
            onChange={(e) => {setPassword(e.target.value)}}
            disabled={isLoading}
            setShowPassword={() => setShowPassword(!showPassword)}
            setValid={setFormValid}
          />

          {/* Submit button */}
          <Button 
            disabled={isLoading || !isFormValid}
            onClick={handleSubmit}
            label={isLoading ? 'Creating user ...' : 'Submit'}
          />
        </form>
      </div>
    </div>
  )
}