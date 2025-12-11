import type { Meta, StoryObj } from '@storybook/react'
import { InputText } from './Inputs'
import React, { useState } from 'react'

const metaInputText: Meta<typeof InputText> = {
  title: 'Auth/InputText',
  component: InputText,
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

export default metaInputText

type StoryInputText = StoryObj<typeof metaInputText>

export const UsernameInput: StoryInputText = {
  render: () => {
    const [textValue, setTextValue] = useState('')
    return (
      <InputText
        id='username'
        label='Username'
        placeholder='Enter username'
        value={textValue}
        onChange={(e: React.FormEvent) => {
          setTextValue(e.target.value);
          console.log(e.target.value)}}
        disabled={false} />)
      }
    }