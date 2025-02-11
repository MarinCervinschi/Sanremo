"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { Loader2 } from "lucide-react"
import artistOrder from "@/lib/artistOrder"

const criteria = ["Performance", "Outfit", "Stage Presence", "Vocal Ability", "Creativity"]
const days = Array.from({ length: 5 }, (_, i) => `Day ${i + 1}`)

export default function Results() {
  const [results, setResults] = useState<Record<string, Record<string, number>>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("/api/scores")
        if (!response.ok) {
          throw new Error("Failed to fetch scores")
        }
        const data = await response.json()
        const calculatedResults = calculateResults(data)
        setResults(calculatedResults)
      } catch (error) {
        console.error("Error fetching results:", error)
        alert("Failed to load results. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [])

  const calculateResults = (data: Record<string, Record<string, Record<string, number>>>) => {
    const newResults: Record<string, Record<string, number>> = {
      Overall: {},
    }

    days.forEach((day, index) => {
      const dayNumber = (index + 1).toString()
      const dayScores = data[`day${dayNumber}`]
      if (dayScores) {
        newResults[day] = {}

        artistOrder[dayNumber].forEach((artist) => {
          if (dayScores[artist]) {
            const artistTotalScore = Object.values(dayScores[artist]).reduce((a, b) => a + b, 0)
            const artistAverageScore = artistTotalScore / criteria.length
            newResults[day][artist] = artistAverageScore

            if (!newResults.Overall[artist]) {
              newResults.Overall[artist] = 0
            }
            newResults.Overall[artist] += artistAverageScore
          }
        })
      }
    })

    // Calculate overall average
    Object.keys(newResults.Overall).forEach((artist) => {
      newResults.Overall[artist] /= days.length
    })

    return newResults
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Results</h1>
      <Tabs defaultValue="Overall">
        <TabsList>
          <TabsTrigger value="Overall">Overall</TabsTrigger>
          {days.map((day) => (
            <TabsTrigger key={day} value={day}>
              {day}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="Overall">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {Object.entries(results.Overall || {})
              .sort((a, b) => b[1] - a[1])
              .map(([artist, score]) => (
                <Card key={artist}>
                  <CardHeader>
                    <CardTitle>{artist}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{score.toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        {days.map((day, index) => (
          <TabsContent key={day} value={day}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {artistOrder[(index + 1).toString()].map((artist) => (
                <Card key={artist}>
                  <CardHeader>
                    <CardTitle>{artist}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{(results[day]?.[artist] || 0).toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

