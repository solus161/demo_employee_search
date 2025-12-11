import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { LoginForm, SignupForm, AuthContainer } from './AuthForms'

// ============================================
// LoginForm Stories
// ============================================

const metaLogin: Meta<typeof LoginForm> = {
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

export default metaLogin

type StoryLogin = StoryObj<typeof metaLogin>

// Default login form
export const Default: StoryLogin = {
  args: {
    onSwitchToSignup: () => console.log('Switch to signup clicked'),
    onLoginSuccess: (token) => console.log('Login successful! Token:', token),
  },
}

// Login form with custom submit handler
export const WithCustomSubmit: StoryLogin = {
  args: {
    onSubmit: (username: string, password: string) => {
      console.log('Custom login handler:', { username, password })
      alert(`Custom login: ${username}`)
    },
    onSwitchToSignup: () => console.log('Switch to signup'),
  },
}

// Interactive example showing all states
export const InteractiveStates: StoryLogin = {
  render: () => {
    const [showLogin, setShowLogin] = useState(true)

    return (
      <div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Try logging in! (username: demo, password: password123)
          </p>
        </div>
        {showLogin ? (
          <LoginForm
            onSubmit={(username, password) => {
              if (username === 'demo' && password === 'password123') {
                alert('✅ Login successful!')
              } else {
                alert('❌ Invalid credentials')
              }
            }}
            onSwitchToSignup={() => setShowLogin(false)}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => setShowLogin(true)}
            onSubmit={(username, email, department, password) => {
              alert(`✅ Account created for ${username}`)
              setShowLogin(true)
            }}
          />
        )}
      </div>
    )
  },
}

// ============================================
// SignupForm Stories
// ============================================

export const SignupDefault: StoryObj<typeof SignupForm> = {
  render: () => (
    <div style={{ width: '500px' }}>
      <SignupForm
        onSwitchToLogin={() => console.log('Switch to login')}
        onSignupSuccess={() => console.log('Signup successful!')}
      />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
}

export const SignupCustomDepartments: StoryObj<typeof SignupForm> = {
  render: () => (
    <div style={{ width: '500px' }}>
      <SignupForm
        departments={['Engineering', 'Product', 'Design', 'Data Science']}
        onSwitchToLogin={() => console.log('Switch to login')}
        onSignupSuccess={() => console.log('Signup successful!')}
      />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
}

export const SignupWithCustomSubmit: StoryObj<typeof SignupForm> = {
  render: () => (
    <div style={{ width: '500px' }}>
      <SignupForm
        onSubmit={(username: string, email: string, department: string, password: string) => {
          console.log('Custom signup:', { username, email, department, password })
          alert(`Custom signup for ${username}`)
        }}
        onSwitchToLogin={() => console.log('Switch to login')}
      />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
}

// ============================================
// AuthContainer Stories
// ============================================

export const FullAuthFlow: StoryObj<typeof AuthContainer> = {
  render: () => (
    <AuthContainer
      onLoginSuccess={(token) => {
        console.log('Login successful! Token:', token)
        alert('✅ Logged in successfully!')
      }}
      onSignupSuccess={() => {
        console.log('Signup successful!')
        alert('✅ Account created! Please login.')
      }}
    />
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

export const AuthContainerCustomDepartments: StoryObj<typeof AuthContainer> = {
  render: () => (
    <AuthContainer
      departments={['Engineering', 'Product', 'Design', 'Marketing', 'Sales']}
      onLoginSuccess={(token) => console.log('Logged in with token:', token)}
      onSignupSuccess={() => console.log('Signup successful!')}
    />
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

// ============================================
// Dark Mode Example (if you have dark mode support)
// ============================================

export const DarkModeExample: StoryObj<typeof AuthContainer> = {
  render: () => (
    <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <AuthContainer
        onLoginSuccess={(token) => console.log('Logged in:', token)}
        onSignupSuccess={() => console.log('Signup successful')}
      />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
}
