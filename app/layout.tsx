"use client"

import './globals.css'
import { Inter, Azeret_Mono as Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@components/theme-provider"
import { useState, useEffect } from "react"
import type React from "react"
import Header from './components/Header'
import Footer from './components/Footer'
import Loader from './components/Loader'

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
}: Readonly<{ children: React.ReactNode }>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased felx flex-col items-center justify-between`}>
        {mounted ? (
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
            <Footer />
          </ThemeProvider>
        ) : (
          <div className="opacity-0">{children}</div> // Prevent flashing
        )}
      </body>
    </html>
  )
}