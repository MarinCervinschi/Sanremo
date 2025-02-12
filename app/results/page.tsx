"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { Loader2 } from "lucide-react"
import { artistOrder } from "@/lib/artistOrder"

const criteria = ["Performance", "Outfit", "Stage Presence", "Vocal Ability", "Creativity"]
const days = Array.from({ length: 5 }, (_, i) => `Day ${i + 1}`)

export default function Results() {
    const [results, setResults] = useState<Record<string, Record<string, Record<string, number>>>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [username, setUsername] = useState<string | null>(null)
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    const overallResults = calculateOverallResults()

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Results for {username}</h1>
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
                        {Object.entries(overallResults)
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
                            {artistOrder[(index + 1).toString()]
                                .sort((a, b) => {
                                    const dayScoresA = results[`day${index + 1}`]?.[a.name] || {}
                                    const dayScoresB = results[`day${index + 1}`]?.[b.name] || {}
                                    const averageScoreA = Object.values(dayScoresA).reduce((acc, score) => acc + score, 0) / criteria.length
                                    const averageScoreB = Object.values(dayScoresB).reduce((acc, score) => acc + score, 0) / criteria.length
                                    return averageScoreB - averageScoreA
                                })
                                .map((artist) => {
                                    const dayScores = results[`day${index + 1}`]?.[artist.name]
                                    const averageScore = dayScores
                                        ? Object.values(dayScores).reduce((a, b) => a + b, 0) / criteria.length
                                        : 0
                                    return (
                                        <Card key={artist.name}>
                                            <CardHeader>
                                                <CardTitle>{artist.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">{averageScore.toFixed(2)}</p>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

