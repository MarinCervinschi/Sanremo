import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { ModeToggle } from "@components/mode-toggle";
import { useRouter } from "next/navigation";

export default function Header() {
  const [username, setUsername] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false);
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
    <header>
      <nav className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold">
                Sanremo 2025
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {username ? (
                <>
                  <Link href="/days" className="text-sm font-medium">
                    Days
                  </Link>
                  <Link href="/results" className="text-sm font-medium">
                    Results
                  </Link>
                  <span>Welcome, {username}!</span>
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="text-sm font-medium">
                    Sign In
                  </Link>
                  <Link href="/signup" className="text-sm font-medium">
                    Sign Up
                  </Link>
                </>
              )}
              <ModeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-background border-t p-4"
          >
            <div className="flex flex-col space-y-4">
              {username ? (
                <>
                  <Link href="/days" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                    Days
                  </Link>
                  <Link href="/results" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                    Results
                  </Link>
                  <span>Welcome, {username}!</span>
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/signup" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
              <ModeToggle />
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}