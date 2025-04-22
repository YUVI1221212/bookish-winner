"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { User, Lock, Mail } from "lucide-react"

interface LoginSignupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (userData: { email: string; password: string }) => void
}

export default function LoginSignupModal({ open, onOpenChange, onLogin }: LoginSignupModalProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate login process
    setTimeout(() => {
      if (loginData.email && loginData.password) {
        onLogin(loginData)
        toast({
          title: "Login successful",
          description: "Welcome back to fanC!",
        })
        onOpenChange(false)
      } else {
        toast({
          title: "Login failed",
          description: "Please enter both email and password",
          variant: "destructive",
        })
      }
      setLoading(false)
    }, 1000)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate form
    if (!signupData.name || !signupData.email || !signupData.password) {
      toast({
        title: "Signup failed",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Signup failed",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    // Simulate signup process
    setTimeout(() => {
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      })

      // Auto login after signup
      onLogin({ email: signupData.email, password: signupData.password })
      onOpenChange(false)
      setLoading(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-red-900/40 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Welcome to fanC</DialogTitle>
          <DialogDescription className="text-red-300/70">
            Login or create an account to save your preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-black/60">
            <TabsTrigger value="login" className="text-white data-[state=active]:bg-red-900/60">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-white data-[state=active]:bg-red-900/60">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-red-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="bg-black/30 border-red-900/40 text-white pl-10"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-red-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-black/30 border-red-900/40 text-white pl-10"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-xs text-red-300/70 hover:text-red-300"
                    onClick={() => setActiveTab("signup")}
                  >
                    Don't have an account? Sign up
                  </button>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">
                    Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-red-500" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your Name"
                      className="bg-black/30 border-red-900/40 text-white pl-10"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-red-500" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="bg-black/30 border-red-900/40 text-white pl-10"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-red-500" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-black/30 border-red-900/40 text-white pl-10"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-red-500" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-black/30 border-red-900/40 text-white pl-10"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-xs text-red-300/70 hover:text-red-300"
                    onClick={() => setActiveTab("login")}
                  >
                    Already have an account? Login
                  </button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
