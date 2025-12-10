import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { PasswordAlert } from './PasswordAlert'

export const InputText = ({ id, label, placeholder, name, value, onChange, disabled }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        { label }
      </label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder={placeholder}
        required
        disabled={disabled}
      />
      </div>
    )
}

export const InputPassword = ({
  id, label, showPassword, placeholder, name, value,
  onChange, disabled, setShowPassword, showPasswordReq }) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder={placeholder}
          required
          disabled={disabled}
        />
        <button
          type="button"
          onClick={setShowPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          disabled={disabled}
        >
          {showPassword ? <BsEyeSlash className="w-5 h-5" /> : <BsEye className="w-5 h-5" />}
        </button>
      </div>
      <PasswordAlert password={value} show={showPasswordReq}/>
    </div>
  )
}