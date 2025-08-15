const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  username: string
  email: string
  password: string
  role: string
}

interface ApiResponse<T = any> {
  message: string
  success: boolean
  data?: T
  token?: string
  user?: any
}

interface AuthResponse {
  message: string
  token: string
  user: {
    id: string
    username: string
    email: string
    role: string
    isOnline?: boolean
  }
}

interface User {
  _id: string
  username: string
  email: string
  role: string
  isOnline: boolean
  lastSeen: string
}

interface Message {
  _id: string
  content: string
  sender: string | User
  conversation: string
  timestamp: string
  createdAt: string
}

interface Conversation {
  _id: string
  participants: User[]
  lastMessage?: Message
  createdAt: string
  updatedAt: string
}

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      return { success: response.ok, ...result }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      return { success: response.ok, ...result }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  }

  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const conversations = await response.json()
        return { success: true, message: "Conversations fetched", data: conversations }
      } else {
        const error = await response.json()
        return { success: false, message: error.message || "Failed to fetch conversations" }
      }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  }

  async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${conversationId}`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const messages = await response.json()
        return { success: true, message: "Messages fetched", data: messages }
      } else {
        const error = await response.json()
        return { success: false, message: error.message || "Failed to fetch messages" }
      }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  }

  async sendMessage(conversationId: string, content: string): Promise<ApiResponse<Message>> {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ conversationId, content }),
      })

      if (response.ok) {
        const message = await response.json()
        return { success: true, message: "Message sent", data: message }
      } else {
        const error = await response.json()
        return { success: false, message: error.message || "Failed to send message" }
      }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const users = await response.json()
        return { success: true, message: "Users fetched", data: users }
      } else {
        const error = await response.json()
        return { success: false, message: error.message || "Failed to fetch users" }
      }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  }

  async createConversation(participantId: string): Promise<ApiResponse<Conversation>> {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ participantId }),
      })

      if (response.ok) {
        const conversation = await response.json()
        return { success: true, message: "Conversation created", data: conversation }
      } else {
        const error = await response.json()
        return { success: false, message: error.message || "Failed to create conversation" }
      }
    } catch (error) {
      return { success: false, message: "Network error" }
    }
  }
}

export const apiClient = new ApiClient()
export type { User, Message, Conversation, AuthResponse }
