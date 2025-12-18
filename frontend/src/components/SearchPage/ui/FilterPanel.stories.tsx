import type { Meta, StoryObj } from '@storybook/react'
import { FilterPanel } from './FilterPanel'
import { useState } from 'react'

const meta: Meta<typeof FilterPanel> = {
  title: 'Search/FilterPanel',
  component: FilterPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof FilterPanel>

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true)
    const [department, setDepartment] = useState('')
    const [location, setLocation] = useState('')
    const [locationCity, setLocationCity] = useState('')
    const [locationState, setLocationState] = useState('')

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isOpen ? 'Hide' : 'Show'} Filters
        </button>

        <FilterPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          department={department}
          location={location}
          locationCity={locationCity}
          locationState={locationState}
          onDepartmentChange={setDepartment}
          onLocationChange={setLocation}
          onLocationCityChange={setLocationCity}
          onLocationStateChange={setLocationState}
        />

        {/* Display selected filters */}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">Selected Filters:</h4>
          <ul className="text-sm">
            <li>Department: {department || 'None'}</li>
            <li>Location Type: {location || 'None'}</li>
            <li>City: {locationCity || 'None'}</li>
            <li>State: {locationState || 'None'}</li>
          </ul>
        </div>
      </div>
    )
  },
}

export const WithPreselectedFilters: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true)
    const [department, setDepartment] = useState('Engineering')
    const [location, setLocation] = useState('Remote')
    const [locationCity, setLocationCity] = useState('San Francisco')
    const [locationState, setLocationState] = useState('CA')

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <FilterPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          department={department}
          location={location}
          locationCity={locationCity}
          locationState={locationState}
          onDepartmentChange={setDepartment}
          onLocationChange={setLocation}
          onLocationCityChange={setLocationCity}
          onLocationStateChange={setLocationState}
        />
      </div>
    )
  },
}

export const CustomOptions: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true)
    const [department, setDepartment] = useState('')
    const [location, setLocation] = useState('')
    const [locationCity, setLocationCity] = useState('')
    const [locationState, setLocationState] = useState('')

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <FilterPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          department={department}
          location={location}
          locationCity={locationCity}
          locationState={locationState}
          onDepartmentChange={setDepartment}
          onLocationChange={setLocation}
          onLocationCityChange={setLocationCity}
          onLocationStateChange={setLocationState}
          departmentOptions={['Tech', 'Business', 'Operations', 'Support']}
          locationOptions={['HQ', 'Branch Office', 'Remote', 'Field']}
          cityOptions={['Seattle', 'Austin', 'Miami', 'Denver']}
          stateOptions={['WA', 'TX', 'FL', 'CO']}
        />
      </div>
    )
  },
}

export const Closed: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [department, setDepartment] = useState('')
    const [location, setLocation] = useState('')
    const [locationCity, setLocationCity] = useState('')
    const [locationState, setLocationState] = useState('')

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Show Filters
        </button>

        <FilterPanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          department={department}
          location={location}
          locationCity={locationCity}
          locationState={locationState}
          onDepartmentChange={setDepartment}
          onLocationChange={setLocation}
          onLocationCityChange={setLocationCity}
          onLocationStateChange={setLocationState}
        />

        <p className="mt-4 text-gray-600">
          Click "Show Filters" to open the filter panel
        </p>
      </div>
    )
  },
}
