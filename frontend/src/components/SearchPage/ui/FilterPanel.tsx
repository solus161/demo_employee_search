import { BsX } from 'react-icons/bs'
import { BttBasic } from './Buttons'
import { Dropdown } from '../../AuthForms/ui/Dropdown'


interface FilterPanelProps {
  isOpen: boolean
  onClearFilters: () => void
  onApplyFilters: () => void
  onClose: () => void
  department: string
  location: string
  city: string
  state: string
  onDepartmentChange: (value: string) => void
  onLocationChange: (value: string) => void
  onLocationCityChange: (value: string) => void
  onLocationStateChange: (value: string) => void
  departmentOptions?: string[]
  locationOptions?: string[]
  cityOptions?: string[]
  stateOptions?: string[]
}

export const FilterPanel = ({
  isOpen,
  onClearFilters,
  onApplyFilters,
  onClose,
  department,
  location,
  city,
  state,
  onDepartmentChange,
  onLocationChange,
  onLocationCityChange,
  onLocationStateChange,
  departmentOptions = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
  locationOptions = ['Office', 'Remote', 'Hybrid'],
  cityOptions = ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Boston'],
  stateOptions = ['CA', 'NY', 'TX', 'FL', 'IL', 'MA'],
}: FilterPanelProps) => {
  if (!isOpen) return null

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
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          disabled={false}
          options={departmentOptions}
        />

        {/* Location Type Filter */}
        <Dropdown
          id="filter-location"
          label="Location Type"
          placeholder="Select Location Type"
          value={location}
          disabled={false}
          onChange={(e) => onLocationChange(e.target.value)}
          options={locationOptions}
        />

        {/* City Filter */}
        <Dropdown
          id="filter-city"
          label="City"
          placeholder='Select a city'
          value={city}
          onChange={(e) => onLocationCityChange(e.target.value)}
          disabled={false}
          options={cityOptions}
        />

        {/* State Filter */}
        <Dropdown
          id="filter-state"
          label="State"
          placeholder='Select a state'
          value={state}
          disabled={false}
          onChange={(e) => onLocationStateChange(e.target.value)}
          options={stateOptions}
        />
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <BttBasic
          onClick={onClearFilters}
          label="Clear All"/>

        <BttBasic
          onClick={onApplyFilters}
          label="Apply Filters"/>
      </div>
    </div>
  )
}
