"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { useLanguage } from "./language-provider"
import { Fan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FcGoogle } from "react-icons/fc"

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signIn, signUp, signInWithGoogle } = useAuth()
  const { t } = useLanguage()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        await signIn(email, password)
        toast({
          title: t("auth.welcome"),
          description: t("dashboard.connected"),
        })
      } else {
        await signUp(email, password, name)
        toast({
          title: t("auth.createAccount"),
          description: t("dashboard.connected"),
        })
      }
    } catch (err: any) {
      setError(err.message)
      toast({
        title: t("error.auth"),
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message)
      toast({
        title: t("error.auth"),
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-red-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Fan className="h-16 w-16 text-red-500 mx-auto mb-2" />
          <h1 className="text-4xl font-bold text-white">
            fan<span className="text-red-500">C</span>
          </h1>
          <p className="text-red-300">{t("dashboard.title")}</p>
        </div>

        <Card className="bg-black/40 backdrop-blur-md border-red-900/40 shadow-xl">
          <Tabs defaultValue="login" value={isLogin ? "login" : "signup"}>
            <TabsList className="grid w-full grid-cols-2 bg-black/60">
              <TabsTrigger
                value="login"
                onClick={() => setIsLogin(true)}
                className="text-white data-[state=active]:bg-red-900/60"
              >
                {t("auth.login")}
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                onClick={() => setIsLogin(false)}
                className="text-white data-[state=active]:bg-red-900/60"
              >
                {t("auth.signup")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className="text-white">{t("auth.login")}</CardTitle>
                  <CardDescription className="text-red-300/70">{t("auth.welcome")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="bg-red-900/40 border-red-900/60 text-white">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      {t("auth.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-black/30 border-red-900/40 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      {t("auth.password")}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-black/30 border-red-900/40 text-white"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                    {loading ? t("app.loading") : t("auth.login")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full border-red-900/40 text-white hover:bg-red-900/30 hover:text-red-300"
                  >
                    <FcGoogle className="mr-2 h-4 w-4" />
                    {t("auth.google")}
                  </Button>
                  <p className="text-sm text-red-300/70 text-center">
                    {t("auth.noAccount")}{" "}
                    <button type="button" onClick={() => setIsLogin(false)} className="text-red-400 hover:underline">
                      {t("auth.signup")}
                    </button>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className="text-white">{t("auth.signup")}</CardTitle>
                  <CardDescription className="text-red-300/70">{t("auth.createAccount")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="bg-red-900/40 border-red-900/60 text-white">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      {t("auth.name")}
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-black/30 border-red-900/40 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="text-white">
                      {t("auth.email")}
                    </Label>
                    <Input
                      id="email-signup"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-black/30 border-red-900/40 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="text-white">
                      {t("auth.password")}
                    </Label>
                    <Input
                      id="password-signup"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-black/30 border-red-900/40 text-white"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                    {loading ? t("app.loading") : t("auth.signup")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full border-red-900/40 text-white hover:bg-red-900/30 hover:text-red-300"
                  >
                    <FcGoogle className="mr-2 h-4 w-4" />
                    {t("auth.google")}
                  </Button>
                  <p className="text-sm text-red-300/70 text-center">
                    {t("auth.hasAccount")}{" "}
                    <button type="button" onClick={() => setIsLogin(true)} className="text-red-400 hover:underline">
                      {t("auth.login")}
                    </button>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
