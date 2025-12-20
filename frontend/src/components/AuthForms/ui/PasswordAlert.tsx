import React, { useEffect } from 'react'
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs'

interface PasswordRequirement {
  label: string
  isValid: boolean
}

interface PasswordAlertProps {
  password: string
  setValid?: (value: boolean) => void
}

/**
 * Password validation popup that appears near the password input
 * Validates password requirements and shows visual feedback React.FC<PasswordAlertProps>
 */
export const PasswordAlert = ({ password, setValid }: PasswordAlertProps) => {
  // Password validation rules
  const requirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      isValid: password.length >= 8,
    },
    {
      label: 'Contains uppercase letter (A-Z)',
      isValid: /[A-Z]/.test(password),
    },
    {
      label: 'Contains lowercase letter (a-z)',
      isValid: /[a-z]/.test(password),
    },
    {
      label: 'Contains number (0-9)',
      isValid: /\d/.test(password),
    },
    {
      label: 'Contains special character (@$!%*?&)',
      isValid: /[@$!%*?&]/.test(password),
    },
  ]

  // if (!show) return null
  const allValid = requirements.every((req) => req.isValid)
  useEffect(() => {
    setValid?.(allValid)
  }, [setValid, allValid])

  if (!password.length || allValid) {
    return null
  }

  return (password.length && !allValid &&
    <div className="fixed z-50 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-900">Password Requirements</h4>
        <p className="text-xs text-gray-500 mt-1">
          {allValid ? 'All requirements met!' : 'Your password must contain:'}
        </p>
      </div>

      {/* Requirements List */}
      <ul className="space-y-2">
        {requirements.map((requirement, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-sm transition-colors"
          >
            {requirement.isValid ? (
              <BsCheckCircleFill className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <BsXCircleFill className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
            <span
              className={`${
                requirement.isValid ? 'text-green-700 line-through' : 'text-gray-700'
              }`}
            >
              {requirement.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Overall Status */}
      {password.length > 0 && (
        <div
          className={`mt-3 pt-3 border-t ${
            allValid ? 'border-green-200' : 'border-gray-200'
          }`}
        >
          <div
            className={`text-xs font-medium ${
              allValid ? 'text-green-600' : 'text-gray-600'
            }`}
          >
            {allValid ? '✓ Strong password' : `${requirements.filter((r) => r.isValid).length}/${requirements.length} requirements met`}
          </div>
        </div>
      )}
    </div>
  )
}