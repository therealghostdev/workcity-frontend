"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, MessageCircle } from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  role: string
}

interface UserDiscoveryProps {
  onConversationCreated: () => void
}

const roleColors = {
  customer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  agent: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  designer: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  merchant: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function UserDiscovery({ onConversationCreated }: UserDiscoveryProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingConversation, setCreatingConversation] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      const result = await apiClient.getUsers()
      if (result.success && Array.isArray(result)) {
        setUsers(result)
      } else {
        // Demo users for testing
        const demoUsers: User[] = [
          { id: "demo-agent-1", username: "Sarah Johnson", email: "sarah@workcity.com", role: "agent" },
          { id: "demo-designer-1", username: "Mike Chen", email: "mike@workcity.com", role: "designer" },
          { id: "demo-merchant-1", username: "Lisa Rodriguez", email: "lisa@workcity.com", role: "merchant" },
          { id: "demo-admin-1", username: "David Kim", email: "david@workcity.com", role: "admin" },
        ]
        setUsers(demoUsers)
      }
      setLoading(false)
    }

    loadUsers()
  }, [])

  const handleStartConversation = async (userId: string) => {
    setCreatingConversation(userId)
    const result = await apiClient.createConversation(userId)
    if (result.success) {
      onConversationCreated()
    }
    setCreatingConversation(null)
  }

  if (loading) {
    return <div className="p-4 text-center">Loading users...</div>
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5" />
        <h3 className="font-semibold">Start New Conversation</h3>
      </div>

      <ScrollArea className="h-64">
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{user.username}</p>
                  <Badge className={`text-xs ${roleColors[user.role as keyof typeof roleColors]}`}>{user.role}</Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStartConversation(user.id)}
                disabled={creatingConversation === user.id}
              >
                {creatingConversation === user.id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <MessageCircle className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
