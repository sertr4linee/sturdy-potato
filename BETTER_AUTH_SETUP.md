# Better Auth - Configuration

## Installation

Les dépendances ont été installées :
```bash
bun add better-auth @neondatabase/serverless
```

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Better Auth Secret (générez une clé aléatoire sécurisée)
BETTER_AUTH_SECRET=your-secret-key-here
```

Pour générer un secret sécurisé :
```bash
openssl rand -base64 32
```

### 2. Configuration de la base de données Neon

1. Créez un compte sur [Neon](https://neon.tech)
2. Créez un nouveau projet PostgreSQL
3. Copiez la connection string et ajoutez-la dans `.env.local`

### 3. Schéma de la base de données

Better Auth créera automatiquement les tables nécessaires au premier démarrage :
- `user` - Stocke les utilisateurs
- `session` - Gère les sessions
- `account` - Stocke les comptes et mots de passe
- `verification` - Pour la vérification d'email et reset password

## Utilisation

### Inscription (Sign Up)

```tsx
import { authClient } from "@/lib/auth-client"

const { data, error } = await authClient.signUp.email({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
})
```

### Connexion (Sign In)

```tsx
import { authClient } from "@/lib/auth-client"

const { data, error } = await authClient.signIn.email({
  email: "john@example.com",
  password: "password123",
})
```

### Déconnexion (Sign Out)

```tsx
import { authClient } from "@/lib/auth-client"

await authClient.signOut()
```

### Obtenir la session active

```tsx
"use client"

import { useSession } from "@/lib/auth-client"

export function UserProfile() {
  const { data: session, isLoading } = useSession()
  
  if (isLoading) return <div>Loading...</div>
  if (!session) return <div>Not logged in</div>
  
  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      <p>{session.user.email}</p>
    </div>
  )
}
```

### Réinitialisation de mot de passe

#### 1. Demander un reset

```tsx
await authClient.requestPasswordReset({
  email: "john@example.com",
  redirectTo: "/reset-password"
})
```

#### 2. Réinitialiser le mot de passe

```tsx
await authClient.resetPassword({
  newPassword: "newpassword123",
  token: "token-from-email"
})
```

### Changer le mot de passe

```tsx
await authClient.changePassword({
  newPassword: "newpassword123",
  currentPassword: "oldpassword123",
  revokeOtherSessions: true // Optionnel
})
```

## Protection de routes

### Côté serveur (Server Component)

```tsx
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) {
    redirect("/auth")
  }
  
  return <div>Protected content</div>
}
```

### Côté client (Client Component)

```tsx
"use client"

import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedPage() {
  const { data: session, isLoading } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/auth")
    }
  }, [session, isLoading, router])
  
  if (isLoading) return <div>Loading...</div>
  if (!session) return null
  
  return <div>Protected content</div>
}
```

## Configuration avancée

### Envoi d'emails

Pour activer l'envoi d'emails (vérification et reset password), installez un service d'email :

```bash
# Exemple avec Resend
bun add resend
```

Puis dans `lib/auth.ts` :

```tsx
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  // ...
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'noreply@yourdomain.com',
        to: user.email,
        subject: 'Réinitialiser votre mot de passe',
        html: `<p>Cliquez ici pour réinitialiser : <a href="${url}">${url}</a></p>`
      })
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: 'noreply@yourdomain.com',
        to: user.email,
        subject: 'Vérifiez votre email',
        html: `<p>Cliquez ici pour vérifier : <a href="${url}">${url}</a></p>`
      })
    }
  }
})
```

## Fichiers créés

- `/lib/auth.ts` - Configuration Better Auth (serveur)
- `/lib/auth-client.ts` - Client Better Auth (frontend)
- `/app/api/auth/[...all]/route.ts` - API routes
- `/components/login-form.tsx` - Formulaire d'authentification
- `.env.example` - Template des variables d'environnement

## Documentation

- [Better Auth Documentation](https://better-auth.com)
- [Email & Password Guide](https://better-auth.com/docs/authentication/email-password)
