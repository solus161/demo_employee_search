import type { Meta, StoryObj } from '@storybook/react'
import { SearchPage } from './SearchPage'
import { SearchParams, EmployeeSearchResponse }  from '@/api/dbService'
import { useEffect, useState } from 'react'

const metaSearchPage: Meta<typeof SearchPage> = {
  title: 'Search/SearchPage',
  component: SearchPage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '1000px' }}>
        <Story />
      </div>
    ),
  ],
}

export default metaSearchPage

type Story = StoryObj<typeof metaSearchPage>

const mockFetchDataSuccess = async (params): Promise<EmployeeSearchResponse> => {
  console.log('Mock search called with params', params)
  const data: EmployeeSearchResponse = {
    success: true,
    detail: {
      totalCount: 150,
      totalPage: 4,
      currentPage: 1,
      pageSize: 50,
      columns: ['ID', 'Name', 'Department', 'Location'],
      dataEmployee: [
        { id: '1', name: 'John Doe', department: 'Engineering', location: 'New York' },
        { id: '2', name: 'Jane Smith', department: 'Marketing', location: 'San Francisco' },
        { id: '3', name: 'Sam Johnson', department: 'Sales', location: 'Chicago' },
      ]
    }
  }
  return data
}

const mockFetchDataError = async (params): Promise<EmployeeSearchResponse> => {
  console.log('Mock search called with params', params)
  const data: EmployeeSearchResponse = {
    success: false,
    detail: 'Mock error: Unable to fetch employee data'
  }
  return data
}

export const Default: Story = {
  render: () => {
    return (
      <SearchPage 
        onSearch = {mockFetchDataSuccess}
        onAddEmployee = {() => alert('Add Employee clicked')}
        onImport = {() => alert('Import clicked')}
        onExport = {() => alert('Export clicked')}  
      />
    )}}

export const FetchError: Story = {
  render: () => {
    return (
      <SearchPage 
        onSearch = {mockFetchDataError}
        onAddEmployee = {() => alert('Add Employee clicked')}
        onImport = {() => alert('Import clicked')}
        onExport = {() => alert('Export clicked')}  
      />
    )}}