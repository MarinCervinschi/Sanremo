import fs from "fs/promises"
import path from "path"

const dataDir = path.join(process.cwd(), "data")

async function setup() {
  try {
    await fs.access(dataDir)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.mkdir(dataDir)
      console.log("Created data directory")
    } else {
      console.error("Error checking data directory:", error)
    }
  }
}

setup()

