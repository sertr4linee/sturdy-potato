"use client"

import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import Link from "next/link"

export default function AccountPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth")
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) return null

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      <div className="fixed inset-0 z-0">
        <Shader className="h-full w-full">
          <Swirl
            colorA="#00f5ff"
            colorB="#a855f7"
            speed={0.8}
            detail={0.8}
            blend={50}
            coarseX={40}
            coarseY={40}
            mediumX={40}
            mediumY={40}
            fineX={40}
            fineY={40}
          />
          <ChromaFlow
            baseColor="#00f5ff"
            upColor="#00f5ff"
            downColor="#a855f7"
            leftColor="#ff007a"
            rightColor="#4d3dff"
            intensity={0.9}
            radius={1.8}
            momentum={25}
            maskType="alpha"
            opacity={0.97}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10">
        <nav className="flex items-center justify-between px-6 py-6 md:px-12">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <span className="font-momo text-3xl font-bold tracking-tight text-foreground">Finexia</span>
          </Link>
        </nav>

        <div className="container mx-auto px-6 py-12 md:px-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <h1 className="mb-2 text-4xl font-bold text-foreground">Account Settings</h1>
              <p className="text-foreground/70">Manage your account information</p>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-background/40 p-8 backdrop-blur-xl">
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground/90">Name</label>
                  <div className="rounded-lg border border-foreground/20 bg-background/60 px-4 py-3 text-foreground">
                    {session.user.name}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground/90">Email</label>
                  <div className="rounded-lg border border-foreground/20 bg-background/60 px-4 py-3 text-foreground">
                    {session.user.email}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground/90">User ID</label>
                  <div className="rounded-lg border border-foreground/20 bg-background/60 px-4 py-3 font-mono text-sm text-foreground">
                    {session.user.id}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground/90">Email Verified</label>
                  <div className="rounded-lg border border-foreground/20 bg-background/60 px-4 py-3 text-foreground">
                    {session.user.emailVerified ? "Yes" : "No"}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground/90">Account Created</label>
                  <div className="rounded-lg border border-foreground/20 bg-background/60 px-4 py-3 text-foreground">
                    {new Date(session.user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
