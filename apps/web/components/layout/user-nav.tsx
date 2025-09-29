'use client'

import { LogOut, Settings, User } from 'lucide-react'
import { authClient } from '@dpin-uptime/auth/client'
import { Avatar, AvatarFallback, AvatarImage } from '@dpin-uptime/ui/components/avatar'
import { Button } from '@dpin-uptime/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@dpin-uptime/ui/components/dropdown-menu'

interface UserNavProps {
  user: {
    id: string
    email: string | null
    name?: string | null
    image?: string | null
  }
}

export function UserNav({ user }: UserNavProps) {
  const { signOut } = authClient

  const handleSignOut = async () => {
    await signOut()
  }

  // Generate initials from name or email
  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (email && email.length > 0) {
      return email[0]?.toUpperCase() || 'U'
    }
    return 'U'
  }

  // Generate a consistent avatar URL using DiceBear API
  const getAvatarUrl = (userId: string) => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${userId}&backgroundColor=3b82f6&textColor=ffffff`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user.image || getAvatarUrl(user.id)} 
              alt={user.name || user.email || 'User'} 
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || 'No email'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/dashboard/profile" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/dashboard/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
