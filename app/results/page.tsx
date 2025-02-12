"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table"
import { Loader2 } from "lucide-react"
import { artistOrder, type Artist, allArtists } from "@/lib/artistOrder"

const criteria = ["Performance", "Outfit", "Stage Presence", "Vocal Ability", "Creativity"]
const days = ["Opening 🎆", "First Half 🌓", "Second Half 🌕", "Cover Night 🎙️", "Final 🏆"]


export default function Results() {
  const [results, setResults] = useState<Record<string, Record<string, Record<string, number>>>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [selectedCriterion, setSelectedCriterion] = useState<string>("Overall")
  const router = useRouter()

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    if (!storedUsername) {
      router.push("/signin")
    } else {
      setUsername(storedUsername)
      fetchResults(storedUsername)
    }
  }, [router])

  const fetchResults = async (username: string) => {
    try {
      const response = await fetch(`/api/scores?username=${username}`)
      if (!response.ok) {
        throw new Error("Failed to fetch scores")
      }
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error fetching results:", error)
      alert("Failed to load results. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateOverallResults = () => {
    const overallResults: Record<string, number> = {}
    Object.values(results).forEach((dayScores) => {
      Object.entries(dayScores).forEach(([artist, scores]) => {
        const artistTotalScore = Object.values(scores).reduce((a, b) => a + b, 0)
        const artistAverageScore = artistTotalScore / criteria.length
        if (!overallResults[artist]) {
          overallResults[artist] = 0
        }
        overallResults[artist] += artistAverageScore
      })
    })
    Object.keys(overallResults).forEach((artist) => {
      overallResults[artist] /= days.length
    })
    return overallResults
  }

  const calculateCriterionResults = (day: string, criterion: string) => {
    const criterionResults: Record<string, number> = {}
    const dayScores = results[day]
    if (dayScores) {
      Object.entries(dayScores).forEach(([artist, scores]) => {
        criterionResults[artist] = scores[criterion] || 0
      })
    }
    return criterionResults
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const overallResults = calculateOverallResults()

  const renderRankingTable = (scores: Record<string, number>, artists: Artist[]) => {
    const sortedArtists = artists.sort((a, b) => (scores[b.name] || 0) - (scores[a.name] || 0))

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedArtists.map((artist, index) => (
            <TableRow key={artist.name}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Image
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-[40px] h-[40px]"
                  />
                  <span>{artist.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">{(scores[artist.name] || 0).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Results for {username}</h1>
      <Tabs defaultValue="Overall">
        <TabsList>
          <TabsTrigger value="Overall">Overall 💯</TabsTrigger>
          {days.map((day) => (
            <TabsTrigger key={day} value={day}>
              {day}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="Overall">
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4">Overall Ranking</h2>
            {renderRankingTable(overallResults, allArtists)}
          </div>
        </TabsContent>
        {days.map((day, index) => (
          <TabsContent key={day} value={day}>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{days[index]} Ranking</h2>
                <Select value={selectedCriterion} onValueChange={setSelectedCriterion}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select criterion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Overall">Overall</SelectItem>
                    {criteria.map((criterion) => (
                      <SelectItem key={criterion} value={criterion}>
                        {criterion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedCriterion === "Overall"
                ? renderRankingTable(
                    Object.fromEntries(
                      Object.entries(results[`day${index + 1}`] || {}).map(([artist, scores]) => [
                        artist,
                        Object.values(scores).reduce((a, b) => a + b, 0) / criteria.length,
                      ]),
                    ),
                    artistOrder[(index + 1).toString()],
                  )
                : renderRankingTable(
                    calculateCriterionResults(`day${index + 1}`, selectedCriterion),
                    artistOrder[(index + 1).toString()],
                  )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

