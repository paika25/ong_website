export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // En réalité, vous feriez un appel à votre API
      // const response = await $fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: credentials
      // })

      // Simulation de réponse
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          createdAt: new Date().toISOString()
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      }

      // Stocker le token
      if (process.client) {
        const storage = credentials.rememberMe ? localStorage : sessionStorage
        storage.setItem('auth-token', mockResponse.token)
        storage.setItem('refresh-token', mockResponse.refreshToken)
      }

      return mockResponse
    } catch (error) {
      throw new Error('Erreur de connexion')
    }
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // En réalité, vous feriez un appel à votre API
      // const response = await $fetch('/api/auth/signup', {
      //   method: 'POST',
      //   body: data
      // })

      // Simulation de réponse
      const mockResponse: AuthResponse = {
        user: {
          id: Math.random().toString(36).substr(2, 9),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'user',
          createdAt: new Date().toISOString()
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      }

      // Stocker le token
      if (process.client) {
        localStorage.setItem('auth-token', mockResponse.token)
        localStorage.setItem('refresh-token', mockResponse.refreshToken)
      }

      return mockResponse
    } catch (error) {
      throw new Error('Erreur d\'inscription')
    }
  },

  async logout(): Promise<void> {
    try {
      // Appel API pour invalider le token côté serveur
      // await $fetch('/api/auth/logout', { method: 'POST' })

      // Nettoyer le stockage local
      if (process.client) {
        localStorage.removeItem('auth-token')
        sessionStorage.removeItem('auth-token')
        localStorage.removeItem('refresh-token')
        sessionStorage.removeItem('refresh-token')
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = process.client ? 
        localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token') : 
        null

      if (!token) return null

      // En réalité, vous décoderiez le JWT ou feriez un appel API
      // const response = await $fetch('/api/auth/me', {
      //   headers: { Authorization: `Bearer ${token}` }
      // })

      // Simulation
      return {
        id: '1',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        createdAt: new Date().toISOString()
      }
    } catch (error) {
      return null
    }
  },

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = process.client ? 
        localStorage.getItem('refresh-token') || sessionStorage.getItem('refresh-token') : 
        null

      if (!refreshToken) return null

      // Appel API pour rafraîchir le token
      // const response = await $fetch('/api/auth/refresh', {
      //   method: 'POST',
      //   body: { refreshToken }
      // })

      // Simulation
      const newToken = 'new-mock-jwt-token'
      
      if (process.client) {
        localStorage.setItem('auth-token', newToken)
      }

      return newToken
    } catch (error) {
      return null
    }
  }
}