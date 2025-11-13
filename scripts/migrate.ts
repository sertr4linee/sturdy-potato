import { Pool } from "@neondatabase/serverless"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function migrate() {
  try {
    console.log("🚀 Starting database migration...")

    // Créer la table user
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" TEXT PRIMARY KEY,
        "email" TEXT UNIQUE NOT NULL,
        "emailVerified" BOOLEAN DEFAULT false,
        "name" TEXT NOT NULL,
        "image" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log("✅ Table 'user' created")

    // Créer la table session
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "token" TEXT UNIQUE NOT NULL,
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
      );
    `)
    console.log("✅ Table 'session' created")

    // Créer la table account
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "account" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "accountId" TEXT NOT NULL,
        "providerId" TEXT NOT NULL,
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "idToken" TEXT,
        "expiresAt" TIMESTAMP,
        "password" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
      );
    `)
    console.log("✅ Table 'account' created")

    // Créer la table verification
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "verification" (
        "id" TEXT PRIMARY KEY,
        "identifier" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log("✅ Table 'verification' created")

    // Créer des index pour améliorer les performances
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "session"("userId");
      CREATE INDEX IF NOT EXISTS "idx_account_userId" ON "account"("userId");
      CREATE INDEX IF NOT EXISTS "idx_verification_identifier" ON "verification"("identifier");
    `)
    console.log("✅ Indexes created")

    console.log("\n🎉 Migration completed successfully!")
    console.log("\nDatabase schema:")
    console.log("  - user (id, email, emailVerified, name, image)")
    console.log("  - session (id, userId, expiresAt, token, ipAddress, userAgent)")
    console.log("  - account (id, userId, accountId, providerId, password, ...)")
    console.log("  - verification (id, identifier, value, expiresAt)")

  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  } finally {
    await pool.end()
  }
}

migrate()
