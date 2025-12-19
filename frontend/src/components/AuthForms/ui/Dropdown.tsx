const RenderOptions = (options: string[] | object[]) => {
  if (options === null || options === undefined) return null

  if (typeof options[0] === 'string'){
    return options.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))
  } else {
    return options.map((item) => (
      <option key={item.value} value={item.value}>
        {item.label}
      </option>
    ))
  }
}

interface DropdownProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (e) => void
  disabled?: boolean
  options: string[] | object []
}

export const Dropdown = ({ 
  id, label, placeholder, value, onChange, disabled, options }: DropdownProps) => {
  return (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
      required
      disabled={disabled}>
      <option value="">{placeholder}</option>
        {RenderOptions(options)}
    </select>
  </div>
  )
}