'use client'

import Link from 'next/link'
import { LogOut, Settings, User } from 'lucide-react'
import { authClient } from '@dpin-uptime/auth/client'
import { Button } from '@dpin-uptime/ui/components/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@dpin-uptime/ui/components/avatar'
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
        <Button
          variant="ghost"
          className="hover:ring-primary relative h-8 w-8 rounded-full transition-all hover:ring-2 hover:ring-offset-2"
        >
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
            <p className="text-sm leading-none font-medium">
              {user.name || 'User'}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email || 'No email'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/profile"
            className="flex cursor-pointer items-center"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex cursor-pointer items-center"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
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
