"use client"

import { useSession } from "@/lib/auth-client"
import { MetalButton } from "@/components/ui/liquid-glass-button"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function UserNav() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth")
          router.refresh()
        },
      },
    })
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/10" />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <MetalButton 
        variant="primary"
        onClick={() => router.push("/auth")}
      >
        Connexion
      </MetalButton>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="h-8 w-8 rounded-full border border-foreground/20"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/20 bg-foreground/10">
            <span className="text-xs font-semibold text-foreground">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        )}
        <div className="hidden md:block">
          <p className="text-sm font-medium text-foreground">
            {session.user.name}
          </p>
          <p className="text-xs text-foreground/60">
            {session.user.email}
          </p>
        </div>
      </div>
      <MetalButton 
        variant="default"
        onClick={handleSignOut}
        className="text-xs"
      >
        Déconnexion
      </MetalButton>
    </div>
  )
}
