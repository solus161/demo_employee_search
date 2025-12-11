import type { Meta, StoryObj } from '@storybook/react'
import { SignupForm } from '../AuthForms/SignupForm'
import React, { useState } from 'react'

const metaSignupForm: Meta<typeof SignupForm> = {
  title: 'Auth/SignupForm',
  component: SignupForm,
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

export default metaSignupForm

type Story = StoryObj<typeof metaSignupForm>

const getDeparments = async () => {
    return {departments: ['Headquarters', 'Business Development', 'IT']}
  }

export const SubmitSuceeded: Story = {
  render: () => {
    return (
      <div style={{ width: '500px' }}>
        <SignupForm
          onSubmit={async (data) => {
            console.log(data)
            await new Promise(resolve => setTimeout(resolve, 1000))
            return { success: true }
          }}
          getDepartments={getDeparments}/>
      </div>    
    )
  }
}

export const SubmitFailed: Story = {
  render: () => {
    return (
      <div style={{ width: '500px' }}>
        <SignupForm
          onSubmit={async (data) => {
            console.log(data)
            await new Promise(resolve => setTimeout(resolve, 1000))
            return { success: false, detail: 'A random error occured' }
          }}
          getDepartments={getDeparments}/>
      </div>    
    )
  }
}