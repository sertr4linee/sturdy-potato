import { betterAuth } from "better-auth"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Nécessaire pour Neon
  },
})

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false, // Changez à true si vous voulez activer la vérification d'email
    sendResetPassword: async ({ user, url, token }, request) => {
      // TODO: Implémentez votre logique d'envoi d'email ici
      console.log(`Reset password URL for ${user.email}: ${url}`)
      console.log(`Token: ${token}`)
      
      // Exemple avec Resend, SendGrid, ou autre service d'email
      // await sendEmail({
      //   to: user.email,
      //   subject: "Réinitialiser votre mot de passe",
      //   html: `<p>Cliquez sur ce lien pour réinitialiser votre mot de passe: <a href="${url}">Réinitialiser</a></p>`,
      // })
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password reset for user: ${user.email}`)
      // Logique additionnelle après la réinitialisation du mot de passe
    },
  },
  // emailVerification: {
  //   sendVerificationEmail: async ({ user, url, token }, request) => {
  //     // TODO: Implémentez votre logique d'envoi d'email de vérification
  //     console.log(`Verification URL for ${user.email}: ${url}`)
  //     console.log(`Token: ${token}`)
  //   },
  // },
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],
})
