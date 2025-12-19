import type { Meta, StoryObj } from '@storybook/react'
import { EmployeeDetailCard } from './EmployeeDetailCard'

const meta: Meta<typeof EmployeeDetailCard> = {
  title: 'Search/EmployeeDetailCard',
  component: EmployeeDetailCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof EmployeeDetailCard>

// No employee selected
export const Empty: Story = {
  args: {
    employee: null,
  },
}

// Full employee details with photo
export const FullDetails: Story = {
  args: {
    employee: {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      position: 'Senior Software Engineer',
      location: 'Office',
      city: 'San Francisco',
      state: 'CA',
      photoUrl: 'https://i.pravatar.cc/150?img=5',
      hireDate: 'January 15, 2020',
      manager: 'Michael Chen',
    },
  },
}

// Employee without photo
export const NoPhoto: Story = {
  args: {
    employee: {
      id: '2',
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 987-6543',
      department: 'Sales',
      position: 'Sales Manager',
      location: 'Remote',
      city: 'New York',
      state: 'NY',
      hireDate: 'March 10, 2019',
      manager: 'Jennifer Smith',
    },
  },
}

// Minimal details
export const MinimalDetails: Story = {
  args: {
    employee: {
      id: '3',
      name: 'Alex Martinez',
      email: 'alex.martinez@company.com',
    },
  },
}

// Employee with long email
export const LongEmail: Story = {
  args: {
    employee: {
      id: '4',
      name: 'Emily Thompson',
      email: 'emily.thompson.engineering.department@verylong-company-domain.com',
      phone: '+1 (555) 222-3333',
      department: 'Marketing',
      position: 'Marketing Director',
      location: 'Hybrid',
      city: 'Los Angeles',
      state: 'CA',
      photoUrl: 'https://i.pravatar.cc/150?img=9',
      hireDate: 'June 1, 2021',
      manager: 'David Wilson',
    },
  },
}

// Remote employee
export const RemoteEmployee: Story = {
  args: {
    employee: {
      id: '5',
      name: 'Michael Brown',
      email: 'michael.brown@company.com',
      phone: '+1 (555) 444-5555',
      department: 'Customer Support',
      position: 'Support Specialist',
      location: 'Remote',
      city: 'Austin',
      state: 'TX',
      photoUrl: 'https://i.pravatar.cc/150?img=12',
      hireDate: 'September 20, 2022',
      manager: 'Lisa Anderson',
    },
  },
}

// New employee (no manager or hire date)
export const NewEmployee: Story = {
  args: {
    employee: {
      id: '6',
      name: 'Jessica Lee',
      email: 'jessica.lee@company.com',
      phone: '+1 (555) 666-7777',
      department: 'HR',
      position: 'HR Coordinator',
      location: 'Office',
      city: 'Chicago',
      state: 'IL',
      photoUrl: 'https://i.pravatar.cc/150?img=20',
    },
  },
}
