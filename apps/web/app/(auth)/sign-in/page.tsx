'use client'

import { z } from 'zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { Variants, motion } from 'motion/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@dpin-uptime/auth/client'
import { Input } from '@dpin-uptime/ui/components/input'
import { toast } from '@dpin-uptime/ui/components/sonner'
import { passwordSchema } from '@dpin-uptime/common/index'
import { Button } from '@dpin-uptime/ui/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@dpin-uptime/ui/components/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@dpin-uptime/ui/components/card'

const formSchema = z.object({
  email: z
    .email({
      message: 'Please enter a valid email address.',
    })
    .trim()
    .toLowerCase(),
  password: passwordSchema,
  rememberMe: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: '/dashboard',
        rememberMe: values.rememberMe,
      })
      if (error) {
        if (error.status === 400) {
          toast.error('Not connected to the internet')
          return
        }
        toast.error(error.message)
      }
      if (data) {
        toast.success('Signed in successfully')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="focus-visible:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="focus-visible:ring-primary pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="border-border text-primary focus:ring-primary h-4 w-4 rounded focus:ring-offset-0"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Remember me
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
              onClick={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className="flex flex-col space-y-2 text-center text-sm">
              <Link
                href="/forgot-password"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot your password?
              </Link>
              <div className="text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  href="/sign-up"
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="border-border w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  authClient.signIn.social({
                    provider: 'google',
                    callbackURL: '/dashboard',
                  })
                }
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  authClient.signIn.social({
                    provider: 'github',
                    callbackURL: '/dashboard',
                    errorCallbackURL: '/sign-in',
                  })
                }
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.312-.623-.312-1.544c0-1.448.839-2.529 1.884-2.529.888 0 1.317.664 1.317 1.460 0 .889-.567 2.219-.858 3.449-.244 1.013.507 1.839 1.506 1.839 1.808 0 3.200-1.907 3.200-4.665 0-2.44-1.753-4.147-4.258-4.147-2.905 0-4.612 2.181-4.612 4.436 0 .878.337 1.819.759 2.332.083.101.095.189.070.293-.077.315-.249 1.011-.283 1.152-.043.181-.141.219-.326.132-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.287-1.155l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017.001z" />
                </svg>
                GitHub
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
