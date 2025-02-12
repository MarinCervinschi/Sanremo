import Link from "next/link"
import { Button } from "@components/ui/button"

const days = ["Opening 🎆", "First Half 🌓", "Second Half 🌕", "Cover Night 🎙️", "Final 🏆"]

export default function DaysList() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] text-center">
      <h1 className="text-3xl font-bold mb-6">What&apos;s goin&apos; on tonight ‼️ </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {days.map((day, index) => (
          <Link key={index} href={`/evaluate/${index + 1}`}>
            <Button variant="outline" className="w-full h-24 text-lg">
              {day.toUpperCase()}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

