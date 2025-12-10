import type { Meta, StoryObj } from '@storybook/react'
import { InputPassword } from './AuthInputs'
import React, { useState } from 'react'
import AuthService from '@/api/authService'

const metaInputPassword: Meta<typeof InputPassword> = {
  title: 'Auth/InputPassword',
  component: InputPassword,
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

export default metaInputPassword

type StoryInput = StoryObj<typeof metaInputPassword>

export const PasswordInput: StoryInput = {
  render: () => {
    const [passwordValue, setPasswordValue] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    return (
      <InputPassword
        id='password'
        label='Password'
        showPassword={showPassword}
        placeholder='Enter password'
        name='password'
        value={passwordValue}
        onChange={(e: React.FormEvent) => {
          setPasswordValue(e.target.value)
          console.log(e.target.value)}}
        disabled={false}
        setShowPassword={() => {setShowPassword(!showPassword)}}
        showPasswordReq={true} />)
      }
    }
