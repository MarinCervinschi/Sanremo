import { Button } from "@components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-6">Sanremo 2025 App</h1>
      <p className="text-xl mb-8 text-center">
        Evaluate 29 artists over 5 days based on their performance, outfit, and more.
      </p>
      <Link href="/days">
        <Button size="lg">Start Evaluation</Button>
      </Link>
    </div>
  )
}

