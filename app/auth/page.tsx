"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { LoginForm } from "@/components/login-form"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"

export default function AuthPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const shaderContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <CustomCursor />

      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Left side - Form with solid background */}
        <div className="flex flex-col gap-4 p-6 md:p-10 bg-background relative z-10">
          <GrainOverlay />
          <div className="flex justify-center gap-2 md:justify-start">
            <Link 
              href="/" 
              aria-label="home" 
              className="flex gap-2 items-center transition-transform hover:scale-105"
            >
              <span className="font-momo text-3xl font-bold tracking-tight text-foreground">
                Finexia
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>

        {/* Right side - Shader background */}
        <div className="relative hidden lg:block overflow-hidden">
          <div
            ref={shaderContainerRef}
            className={`absolute inset-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ contain: "strict" }}
          >
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
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center space-y-4 px-8">
              <h2 className="text-4xl font-bold text-foreground">
                Bienvenue sur Finexia
              </h2>
              <p className="text-lg text-foreground/70">
                Votre plateforme de trading intelligent avec IA
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
