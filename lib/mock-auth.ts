export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'organizer'
}

// Mock users database
const mockUsers: Record<string, { password: string; user: User }> = {
  'demo@example.com': {
    password: 'password',
    user: {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'organizer'
    }
  },
  'admin@example.com': {
    password: 'admin',
    user: {
      id: '2',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin'
    }
  }
}

export class MockAuth {
  private static readonly STORAGE_KEY = 'mock-auth-user'

  static async signIn(email: string, password: string): Promise<{ user: User; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockUser = mockUsers[email]
    
    if (!mockUser || mockUser.password !== password) {
      return { user: null as any, error: 'Invalid credentials' }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockUser.user))
    }
    
    return { user: mockUser.user }
  }

  static async signUp(email: string, password: string, name: string): Promise<{ user: User; error?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if user already exists
    if (mockUsers[email]) {
      return { user: null as any, error: 'User already exists' }
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user'
    }

    // Add to mock database
    mockUsers[email] = {
      password,
      user: newUser
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser))
    }
    
    return { user: newUser }
  }

  static async signOut(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  }

  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }
}
