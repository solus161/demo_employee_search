import type { Meta, StoryObj } from '@storybook/react'
import { SearchInput } from './SearchEmployees'
import { useState } from 'react'

const metaSearchInput: Meta<typeof SearchInput> = {
  title: 'Search/InputSearch',
  component: SearchInput,
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

export default metaSearchInput

type Story = StoryObj<typeof metaSearchInput>

export const Default: Story = {
  render: () => {
    const onSearchStrChange = async (e) => {
      const lastMessage = e.target.value
      const wait = new Promise((resolve) =>   
        setTimeout(resolve, 1000))
      wait.then(() => {
        if (lastMessage == e.target.value) {
          console.log('Searching for:', lastMessage)
        }
      })
    }
    return (
      <SearchInput onChange={(e) => {
        onSearchStrChange(e)
      }} />
    )}}