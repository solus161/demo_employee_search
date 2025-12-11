import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import React, { useState } from 'react'

const metaButton: Meta<typeof Button> = {
  title: 'Auth/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export default metaButton

type Story = StoryObj<typeof metaButton>

export const Default: Story = {
  render: () => {
    const [departmentValue, setDepartmentValue] = useState('')
    return (
      <Button 
        disabled={false}
        onClick={() => alert('Button clicked')}
        label={'Default button'}
      />
    )
  }
}
