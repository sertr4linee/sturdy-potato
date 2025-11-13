# 🚀 Démarrage rapide - Better Auth

## Étapes pour commencer

### 1. Configurer la base de données Neon

1. Allez sur [https://neon.tech](https://neon.tech)
2. Créez un compte et un nouveau projet
3. Copiez la connection string PostgreSQL

### 2. Configurer les variables d'environnement

Créez un fichier `.env.local` :

```bash
# Copiez votre connection string de Neon
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Générez un secret avec: openssl rand -base64 32
BETTER_AUTH_SECRET=votre_secret_genere_ici
```

### 3. Démarrer l'application

```bash
bun run dev
```

### 4. Tester l'authentification

1. Ouvrez `http://localhost:3000/auth`
2. Créez un compte (Sign up)
3. Connectez-vous (Login)

## 📋 Schéma de base de données

Better Auth créera automatiquement ces tables :

```sql
-- Table user
CREATE TABLE user (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  emailVerified BOOLEAN DEFAULT false,
  name TEXT,
  image TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table session
CREATE TABLE session (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  token TEXT UNIQUE NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);

-- Table account (stocke les mots de passe)
CREATE TABLE account (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  accessToken TEXT,
  refreshToken TEXT,
  idToken TEXT,
  expiresAt TIMESTAMP,
  password TEXT,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);

-- Table verification (pour email et reset password)
CREATE TABLE verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt TIMESTAMP NOT NULL
);
```

## 🎯 Exemples d'utilisation

### Inscription
```tsx
import { authClient } from "@/lib/auth-client"

await authClient.signUp.email({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
})
```

### Connexion
```tsx
await authClient.signIn.email({
  email: "john@example.com",
  password: "password123"
})
```

### Obtenir la session
```tsx
const { data: session } = useSession()
console.log(session?.user)
```

## 🔒 Protection de routes

```tsx
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session) redirect("/auth")
  
  return <div>Protected!</div>
}
```

## ✅ Checklist

- [ ] Créer un compte Neon DB
- [ ] Copier la connection string
- [ ] Créer `.env.local` avec les variables
- [ ] Générer un `BETTER_AUTH_SECRET`
- [ ] Lancer `bun run dev`
- [ ] Tester l'inscription sur `/auth`
- [ ] Tester la connexion

## 📚 Plus d'infos

Voir `BETTER_AUTH_SETUP.md` pour la documentation complète.
