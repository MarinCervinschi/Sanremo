"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@components/ui/button"
import { Label } from "@components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { artistOrder, Artist} from "@/lib/artistOrder"
import Image from "next/image"

const criteria = ["Performance", "Outfit", "Stage Presence", "Vocal Ability", "Creativity"]

export default function EvaluateDay() {
  const { day } = useParams()
  const router = useRouter()
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    if (!storedUsername) {
      router.push("/signin")
    } else {
      setUsername(storedUsername)
      fetchScores(storedUsername)
    }
  }, [router])

  const fetchScores = async (username: string) => {
    try {
      const response = await fetch(`/api/scores?day=${day}&username=${username}`)
      if (!response.ok) {
        throw new Error("Failed to fetch scores")
      }
      const data = await response.json()
      setScores(data || initializeScores())
    } catch (error) {
      console.error("Error fetching scores:", error)
      setScores(initializeScores())
    } finally {
      setIsLoading(false)
    }
  }

  const initializeScores = () => {
    const initialScores: Record<string, Record<string, number>> = {}
    artistOrder[day as string].forEach((artist) => {
      initialScores[artist.name] = {}
      criteria.forEach((criterion) => {
        initialScores[artist.name][criterion] = 0
      })
    })
    return initialScores
  }

  const handleScoreChange = (artist: string, criterion: string, value: string) => {
    setScores((prevScores) => ({
      ...prevScores,
      [artist]: {
        ...prevScores[artist],
        [criterion]: Number.parseInt(value),
      },
    }))
  }

  const handleSubmit = async () => {
    if (!username) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ day, username, scores }),
      })
      if (!response.ok) {
        throw new Error("Failed to save scores")
      }
      router.push("/days")
    } catch (error) {
      console.error("Error saving scores:", error)
      alert("Failed to save scores. Please try again.")
    } finally {
      setIsSaving(false)
    }
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
      <h1 className="text-3xl font-bold mb-6">Evaluate Day {day}</h1>
      {artistOrder[day as string].map((artist: Artist) => (
        <Card key={artist.name} className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Image
                src={artist.image || "/placeholder.svg"}
                alt={artist.name}
                width={100}
                height={100}
                className="rounded-full"
              />
              <CardTitle>{artist.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {criteria.map((criterion) => (
                <div key={criterion}>
                  <Label htmlFor={`${artist.name}-${criterion}`}>{criterion}</Label>
                  <Select
                    value={scores[artist.name]?.[criterion]?.toString() || "0"}
                    onValueChange={(value) => handleScoreChange(artist.name, criterion, value)}
                  >
                    <SelectTrigger id={`${artist.name}-${criterion}`}>
                      <SelectValue placeholder="Select a grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(11)].map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save and Return to Days"
          )}
        </Button>
      </div>
    </div>
  )
}

