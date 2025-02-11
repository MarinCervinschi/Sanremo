import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const dataFilePath = path.join(process.cwd(), "data", "scores.json")

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8")
    const scores = JSON.parse(fileContents)
    return NextResponse.json(scores)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // File doesn't exist, return empty object
      return NextResponse.json({})
    }
    console.error("Error reading scores:", error)
    return NextResponse.json({ error: "Failed to read scores" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const scores = await request.json()
    await fs.writeFile(dataFilePath, JSON.stringify(scores, null, 2))
    return NextResponse.json({ message: "Scores saved successfully" })
  } catch (error) {
    console.error("Error saving scores:", error)
    return NextResponse.json({ error: "Failed to save scores" }, { status: 500 })
  }
}

