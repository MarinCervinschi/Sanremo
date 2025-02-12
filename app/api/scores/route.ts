import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const day = searchParams.get("day")
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    let query = supabase
      .from("scores")
      .select("day, artist, criterion, score, users!inner(username)")
      .eq("users.username", username)

    if (day) {
      query = query.eq("day", Number.parseInt(day))
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Transform the data into the structure expected by the frontend
    const transformedData: Record<string, Record<string, Record<string, number>>> = {}
    data.forEach((score) => {
      const dayKey = `day${score.day}`
      if (!transformedData[dayKey]) {
        transformedData[dayKey] = {}
      }
      if (!transformedData[dayKey][score.artist]) {
        transformedData[dayKey][score.artist] = {}
      }
      transformedData[dayKey][score.artist][score.criterion] = score.score
    })

    const result = day ? transformedData[`day${day}`] : transformedData
    return NextResponse.json(result ? result : {})
  } catch (error) {
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
    // Get the user ID
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single()

    if (userError || !userData) {
      throw new Error("User not found")
    }

    const userId = userData.id

    // Prepare the scores data for insertion
    const scoresToInsert = Object.entries(scores).flatMap(([artist, criteriaScores]) =>
      Object.entries(criteriaScores as Record<string, number>).map(([criterion, score]) => ({
        user_id: userId,
        day: Number.parseInt(day),
        artist,
        criterion,
        score,
      })),
    )

    // Delete existing scores for this user and day
    const { error: deleteError } = await supabase
      .from("scores")
      .delete()
      .eq("user_id", userId)
      .eq("day", Number.parseInt(day))

    if (deleteError) {
      throw deleteError
    }

    // Insert new scores
    const { error: insertError } = await supabase.from("scores").insert(scoresToInsert)

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({ message: "Scores saved successfully" })
  } catch (error) {
    console.error("Error saving scores:", error)
    return NextResponse.json({ error: "Failed to save scores" }, { status: 500 })
  }
}

