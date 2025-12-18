import React from 'react'
import { BsX } from 'react-icons/bs'

export const Dropdown = ({ 
  id, label, placeholder, value, onChange, disabled, options }) => {
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
      {options.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  </div>
  )
}

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  // department: string
  // location: string
  // locationCity: string
  // locationState: string
  onDepartmentChange: (value: string) => void
  onLocationChange: (value: string) => void
  onLocationCityChange: (value: string) => void
  onLocationStateChange: (value: string) => void
  departmentOptions?: string[]
  locationOptions?: string[]
  cityOptions?: string[]
  stateOptions?: string[]
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  // department,
  // location,
  // locationCity,
  // locationState,
  onDepartmentChange,
  onLocationChange,
  onLocationCityChange,
  onLocationStateChange,
  departmentOptions = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
  locationOptions = ['Office', 'Remote', 'Hybrid'],
  cityOptions = ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Boston'],
  stateOptions = ['CA', 'NY', 'TX', 'FL', 'IL', 'MA'],
}) => {
  if (!isOpen) return null

  const handleClearFilters = () => {
    onDepartmentChange('')
    onLocationChange('')
    onLocationCityChange('')
    onLocationStateChange('')
  }

  return (
    <div className="absolute left-0 right-0 z-50 mx-4 mb-6 bg-white rounded-lg border border-gray-200 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close filters"
        >
          <BsX className="w-6 h-6" />
        </button>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Department Filter */}
        <Dropdown
          id="filter-department"
          label="Department"
          placeholder="Select Department"
          value={''}
          onChange={(e) => onDepartmentChange(e.target.value)}
          disabled={false}
          options={departmentOptions}
        />

        {/* Location Type Filter */}
        <Dropdown
          id="filter-location"
          label="Location Type"
          placeholder="Select Location Type"
          value={''}
          onChange={(e) => onLocationChange(e.target.value)}
          disabled={false}
          options={locationOptions}
        />

        {/* City Filter */}
        <Dropdown
          id="filter-city"
          label="City"
          placeholder='Select a city'
          value={''}
          onChange={(e) => onLocationCityChange(e.target.value)}
          disabled={false}
          options={cityOptions}
        />

        {/* State Filter */}
        <Dropdown
          id="filter-state"
          label="State"
          placeholder='Select a state'
          value={''}
          onChange={(e) => onLocationStateChange(e.target.value)}
          disabled={false}
          options={stateOptions}
        />
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}
