import type { Meta, StoryObj } from '@storybook/react'
import { EmployeeTable } from './TblEmployee'
import { useEffect, useState } from 'react'

const metaEmployeeTabale: Meta<typeof EmployeeTable> = {
  title: 'Search/EmployeeTable',
  component: EmployeeTable,
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

export default metaEmployeeTabale

type Story = StoryObj<typeof metaEmployeeTabale>

export const Default: Story = {
  render: () => {
    // const onSearchStrChange = async (e) => {
    //   const lastMessage = e.target.value
    //   const wait = new Promise((resolve) =>   
    //     setTimeout(resolve, 1000))
    //   wait.then(() => {
    //     if (lastMessage == e.target.value) {
    //       console.log('Searching for:', lastMessage)
    //     }
    //   })
    // }
    
    return (
      <EmployeeTable 
        columns={['ID', 'Name', 'Department', 'Location']} 
        data={[
          { id: 1, Name: 'John Doe', Department: 'Engineering', Location: 'New York' },
          { id: 2, Name: 'Jane Smith', Department: 'Marketing', Location: 'San Francisco' },
          { id: 3, Name: 'Sam Johnson', Department: 'Sales', Location: 'Chicago' },
        ]} 
      />
    )}}

export const MoreColumns: Story = {
  render: () => {
    // const onSearchStrChange = async (e) => {
    //   const lastMessage = e.target.value
    //   const wait = new Promise((resolve) =>   
    //     setTimeout(resolve, 1000))
    //   wait.then(() => {
    //     if (lastMessage == e.target.value) {
    //       console.log('Searching for:', lastMessage)
    //     }
    //   })
    // }
    
    return (
      <EmployeeTable 
        columns={['ID', 'Name', 'Department', 'Location', 'Email', 'Phone']} 
        data={[
          { id: 1, Name: 'John Doe', Department: 'Engineering', Location: 'New York', Email: 'john.doe@example.com', Phone: '123-456-7890' },
          { id: 2, Name: 'Jane Smith', Department: 'Marketing', Location: 'San Francisco', Email: 'jane.smith@example.com', Phone: '098-765-4321' },
          { id: 3, Name: 'Sam Johnson', Department: 'Sales', Location: 'Chicago', Email: 'sam.johnson@example.com', Phone: '555-123-4567' },
        ]} 
      />
    )}}