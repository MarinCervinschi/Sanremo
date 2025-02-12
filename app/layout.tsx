"use client"
import './globals.css'
import { Inter, Azeret_Mono as Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@components/theme-provider"
import { ModeToggle } from "@components/mode-toggle"
import Link from "next/link"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@components/ui/button"

const geistSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [username, setUsername] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    setUsername(storedUsername)
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("userId")
    setUsername(null)
    router.push("/signin")
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <nav className="bg-background border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="text-xl font-bold">
                    Sanremo 2025
                  </Link>
                </div>
                <div className="flex items-center">
                  {username ? (
                    <>
                      <Link href="/days" className="text-sm font-medium mr-4">
                        Days
                      </Link>
                      <Link href="/results" className="text-sm font-medium mr-4">
                        Results
                      </Link>
                      <span className="mr-4">Welcome, {username}!</span>
                      <Button onClick={handleSignOut} variant="outline" size="sm">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/signin" className="text-sm font-medium mr-4">
                        Sign In
                      </Link>
                      <Link href="/signup" className="text-sm font-medium mr-4">
                        Sign Up
                      </Link>
                    </>
                  )}
                  <ModeToggle />
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}

