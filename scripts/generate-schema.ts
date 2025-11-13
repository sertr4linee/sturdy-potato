import { auth } from "../lib/auth"

async function generateSchema() {
  try {
    console.log("Generating database schema...")
    
    // Better Auth génère automatiquement le schéma au premier démarrage
    // Cette fonction est juste pour information
    console.log(`
Database Schema will be created automatically when the server starts.

Required tables:
- user (id, email, emailVerified, name, image, createdAt, updatedAt)
- session (id, userId, expiresAt, token, ipAddress, userAgent)
- account (id, userId, accountId, providerId, accessToken, refreshToken, idToken, expiresAt, password)
- verification (id, identifier, value, expiresAt)

Make sure your DATABASE_URL is set in .env file.
    `)
  } catch (error) {
    console.error("Error:", error)
  }
}

generateSchema()
