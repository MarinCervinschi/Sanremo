import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
const bcrypt = require("bcrypt")

const usersFilePath = path.join(process.cwd(), "data", "users.json")

async function getUsers() {
  try {
    const data = await fs.readFile(usersFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return {}
  }
}

async function saveUsers(users: any) {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2))
}

export async function POST(request: Request) {
  const { action, username, password } = await request.json()

  const users = await getUsers()

  if (action === "signup") {
    if (users[username]) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    users[username] = { password: hashedPassword }
    await saveUsers(users)

    return NextResponse.json({ message: "User created successfully" })
  } else if (action === "signin") {
    const user = users[username]
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 })
    }

    return NextResponse.json({ message: "Signed in successfully" })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

