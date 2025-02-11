import Link from "next/link"
import { Button } from "@components/ui/button"

const days = Array.from({ length: 5 }, (_, i) => `Day ${i + 1}`)

export default function DaysList() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Select a Day to Evaluate</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {days.map((day, index) => (
          <Link key={index} href={`/evaluate/${index + 1}`}>
            <Button variant="outline" className="w-full h-24 text-lg">
              {day}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

