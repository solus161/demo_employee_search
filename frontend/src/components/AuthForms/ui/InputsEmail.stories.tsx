import type { Meta, StoryObj } from '@storybook/react'
import { InputEmail } from './Inputs'
import React, { useState } from 'react'

const metaInputEmail: Meta<typeof InputEmail> = {
  title: 'Auth/InputEmail',
  component: InputEmail,
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

export default metaInputEmail

type StoryInputText = StoryObj<typeof metaInputEmail>

export const EmailInput: StoryInputText = {
  render: () => {
    const [textValue, setTextValue] = useState('')
    return (
      <InputEmail
        id='email'
        label='Email'
        placeholder='Enter email'
        value={textValue}
        onChange={(e: React.FormEvent) => {
          setTextValue(e.target.value);
          console.log(e.target.value)}}
        disabled={false} />)
      }
    }