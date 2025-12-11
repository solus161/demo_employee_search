import type { Meta, StoryObj } from '@storybook/react'
import { LoginForm } from './LoginForm'

const metaLoginForm: Meta<typeof LoginForm> = {
  title: 'Auth/LoginForm',
  component: LoginForm,
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

export default metaLoginForm

type Story = StoryObj<typeof metaLoginForm>

const getDeparments = async () => {
    return {departments: ['Headquarters', 'Business Development', 'IT']}
  }

export const LoginSuccess: Story = {
  render: () => {
    return (
      <div style={{ width: '500px' }}>
        <LoginForm
          onSubmit={async (data) => {
            console.log(data)
            await new Promise(resolve => setTimeout(resolve, 1000))
            return { success: true, access_token: 'abc123' }
          }}
          onSwitchToSignup={() => {alert('Switchs to Signup')}}
          onSuccess={() => {alert('LoginSuccess')}}/>
      </div>
    )
  }
}

export const LoginFailure: Story = {
  render: () => {
    return (
      <div style={{ width: '500px' }}>
        <LoginForm
          onSubmit={async (data) => {
            console.log(data)
            await new Promise(resolve => setTimeout(resolve, 1000))
            return { success: false, detail: 'Login failed' }
          }}
          onSwitchToSignup={() => {alert('Switchs to Signup')}}
          onSuccess={() => {alert('LoginSuccess')}}/>
      </div>
    )
  }
}