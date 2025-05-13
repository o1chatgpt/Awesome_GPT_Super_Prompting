import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/app/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "./providers/auth-provider"
import { GuestModeBanner } from "./components/guest-mode-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Web Scraper Interface",
  description: "A powerful web scraping tool with AI analysis capabilities",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <GuestModeBanner />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
