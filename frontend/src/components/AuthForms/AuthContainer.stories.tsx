import type { Meta, StoryObj } from '@storybook/react'
import { AuthContainer } from './AuthContainer'
import { LoginCredentials, SignupFormData, LoginResponse, SignupResponse } from '@/api/authService'


const metaAuthContainer: Meta<typeof AuthContainer> = {
  title: 'Auth/AuthMain',
  component: AuthContainer,
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

export default metaAuthContainer

type Story = StoryObj<typeof metaAuthContainer>

const getDeparments = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {departments: ['Headquarters', 'Business Development', 'IT']}
  }

const mockLogin = async (credentials: LoginCredentials):Promise<LoginResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  if (credentials.username == 'user01' && credentials.password == 'Minhh@m1') {
    return { success: true, access_token: '123'}
  } else {
    return { success: false, detail: 'Invalid credential'}
  }
}

const mockSignup = async (signupData: SignupFormData):Promise<SignupResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('mockSignup', signupData)
  if (signupData.username != 'user01') {
    return { success: true }
  } else {
    return { success: false, detail: 'Username realdy exists'}
  }
}

const mockLoginSuccess = async () => {
  alert('Login succeeses')
}

export const Default: Story = {
  render: () => {
    return (
      <div style={{ width: '500px' }}>
        <span>username: user01, password: Minhh@m1</span>
        <AuthContainer
          onLogin={mockLogin}
          onSignup={mockSignup}
          onLoginSucceeds={mockLoginSuccess}
          getDeparments={getDeparments}
        />       
      </div>
    )
  }
}