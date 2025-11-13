"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    try {
      if (isLogin) {
        // Login
        const { data, error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        })

        if (error) {
          setError(error.message || "Erreur lors de la connexion")
          setIsLoading(false)
          return
        }

        // Redirection après connexion réussie
        router.push("/")
        router.refresh()
      } else {
        // Sign up
        const confirmPassword = formData.get("confirm-password") as string
        
        if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas")
          setIsLoading(false)
          return
        }

        const { data, error } = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: "/",
        })

        if (error) {
          setError(error.message || "Erreur lors de l'inscription")
          setIsLoading(false)
          return
        }

        // Redirection après inscription réussie
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite")
      setIsLoading(false)
    }
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {isLogin ? "Login to your account" : "Create an account"}
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            {isLogin
              ? "Enter your email below to login to your account"
              : "Enter your information to create an account"}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {!isLogin && (
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input 
              id="name" 
              name="name"
              type="text" 
              placeholder="John Doe" 
              required 
              disabled={isLoading}
            />
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input 
            id="email" 
            name="email"
            type="email" 
            placeholder="m@example.com" 
            required 
            disabled={isLoading}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            {isLogin && (
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            )}
          </div>
          <Input 
            id="password" 
            name="password"
            type="password" 
            required 
            disabled={isLoading}
            minLength={8}
            maxLength={128}
          />
        </Field>

        {!isLogin && (
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input 
              id="confirm-password" 
              name="confirm-password"
              type="password" 
              required 
              disabled={isLoading}
              minLength={8}
              maxLength={128}
            />
          </Field>
        )}

        <Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Chargement..." : isLogin ? "Login" : "Sign up"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" className="w-full" disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Login with GitHub
          </Button>
          <FieldDescription className="text-center">
            {isLogin ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="underline underline-offset-4"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="underline underline-offset-4"
                >
                  Login
                </button>
              </>
            )}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
