import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
const bcrypt = require("bcrypt")

export async function POST(request: Request) {
  const { action, username, password } = await request.json()

  if (action === "signup") {
    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase.from("users").insert({ username, password: hashedPassword }).select()

    if (error) {
      if (error.code === "23505") {
        // unique_violation
        return NextResponse.json({ error: "Username already exists" }, { status: 400 })
      }
      return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 })
    }

    return NextResponse.json({ message: "User created successfully" })
  } else if (action === "signin") {
    const { data: user, error } = await supabase.from("users").select("id, password").eq("username", username).single()

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 })
    }

    return NextResponse.json({ message: "Signed in successfully", userId: user.id })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

