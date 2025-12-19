import type { Meta, StoryObj } from '@storybook/react'
import { Dropdown } from './Dropdown'
import React, { useState } from 'react'

const metaDropdown: Meta<typeof Dropdown> = {
  title: 'Auth/Department',
  component: Dropdown,
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

export default metaDropdown

type StoryInput = StoryObj<typeof metaDropdown>

export const ItemAsString: StoryInput = {
  render: () => {
    const [departmentValue, setDepartmentValue] = useState('')
    return (
      <Dropdown
        id='department'
        label='Department'
        placeholder='Select a department'
        value={departmentValue}
        onChange={(e) => {
          setDepartmentValue(e.target.value)
          console.log(e.target.value)}}
        disabled={false}
        options={['Headquarters', 'Business Development', 'IT']}/>)
      }
    }

export const ItemAsObject: StoryInput = {
  render: () => {
    const [departmentValue, setDepartmentValue] = useState('')
    return (
      <Dropdown
        id='department'
        label='Department'
        placeholder='Select a department'
        value={departmentValue}
        onChange={(e) => {
          setDepartmentValue(e.target.value)
          console.log(e.target.value)}}
        disabled={false}
        options={[
          {value: 0, label: 'Headquarters'},
          {value: 1, label: 'Business Development'},
          {value: 2, label: 'IT'}]}/>)
      }
    }
