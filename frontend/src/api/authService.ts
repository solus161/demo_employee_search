import { API_CONFIG, API_ENDPOINTS } from "./configs";

export interface SignupForm {
  username: string
  password: string
  email: string
  department: string | null
}

export interface LoginCredentials {
  username: string
  password: string
}

export type SignupResponse =
  | { success: true }
  | { success: false, detail: string}

export type LoginResponse =
  | { success: true, access_token: string}
  | { success: false, detail: string }

export default class AuthService{
  static async signup(signupData: SignupForm): Promise<SignupResponse> {
    // Handle the sign up
    const formData = new FormData()
    formData.append('username', signupData.username)
    formData.append('password', signupData.password)
    formData.append('email', signupData.email)
    formData.append('department', signupData.department)

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/${API_ENDPOINTS.SIGNUP}`,
        {method: 'POST', body: formData})
      
      if (response.ok) {
        return { success: true }
      } else {
        const error = await response.json().catch(() => ({ detail: 'Signup failed' }))
        return {
          success: false,
          detail: error.detail
        }
      }
    } catch (err) {
      return {
        success: false,
        detail: err instanceof Error ? err.message : 'Network error'
      }
    }
  }

  static async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/${API_ENDPOINTS.LOGIN}`,
        { method: 'POST', body: formData }
      )

      if (response.ok) {
        const data = await response.json().catch(() => ({}))
        return {
          success: true,
          access_token: data.access_token
        }
      } else {
        const error = await response.json().catch(() => ({ detail: 'Login failed' }))
        return {
          success: false,
          detail: error.detail || 'Login failed'
        }
      }
    } catch (err) {
      return {
        success: false,
        detail: err instanceof Error ? err.message : 'Network error'
      }
    }
  }

  static saveToken(token: string): void {
    localStorage.setItem('access_token', token)
  }

  static getToken(): string | null {
    return localStorage.getItem('access_token')
  }

  static removeToken(): void {
    localStorage.removeItem('access_token')
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static validatePassword(password: string): boolean {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return pattern.test(password)
  }
}