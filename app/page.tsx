import { Button } from "@components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { allArtists } from "@/lib/artistOrder"

export default function Home() {
  const featuredArtists = allArtists.sort(() => Math.random() - 0.5).slice(0, 5)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-6">TV Show Evaluation App</h1>
      <p className="text-xl mb-8 text-center">
        Evaluate 29 artists over 5 days based on their performance, outfit, and more.
      </p>
      <div className="grid grid-cols-5 gap-4 mb-8">
        {featuredArtists.map((artist) => (
          <div key={artist.name} className="flex flex-col items-center">
            <Image
              src={artist.image || "/placeholder.svg"}
              alt={artist.name}
              width={80}
              height={80}
              className="rounded-full mb-2 "
            />
            <p className="text-sm text-center">{artist.name.split('-')[0]}</p>
          </div>
        ))}
      </div>
      <Link href="/days">
        <Button size="lg">Start Evaluation</Button>
      </Link>
    </div>
  )
}

