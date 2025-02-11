import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const dataFilePath = path.join(process.cwd(), "data", "scores.json")

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const day = searchParams.get("day")
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const scores = JSON.parse(fileContents)
    if (day) {
      return NextResponse.json(scores[username]?.[`day${day}`] || {})
    } else {
      return NextResponse.json(scores[username] || {})
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({})
    }
    console.error("Error reading scores:", error)
    return NextResponse.json({ error: "Failed to read scores" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { day, username, scores } = await request.json()

  if (!day || !username || !scores) {
    return NextResponse.json({ error: "Day, username, and scores are required" }, { status: 400 })
  }

  try {
    let allScores: { [key: string]: { [key: string]: any } } = {}
    try {
      const fileContents = await fs.readFile(dataFilePath, "utf8")
      allScores = JSON.parse(fileContents)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error
      }
    }

    allScores = {
      ...allScores,
      [username]: {
        ...allScores[username],
        [`day${day}`]: scores,
      },
    }

    await fs.writeFile(dataFilePath, JSON.stringify(allScores, null, 2))
    return NextResponse.json({ message: "Scores saved successfully" })
  } catch (error) {
    console.error("Error saving scores:", error)
    return NextResponse.json({ error: "Failed to save scores" }, { status: 500 })
  }
}

