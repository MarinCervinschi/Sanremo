import { Button } from "@components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { allArtists } from "@/lib/artistOrder"

export default function Home() {
  const featuredArtists = allArtists.sort(() => Math.random() - 0.5).slice(0, 6)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold mb-6 sm:text-3xl md:text-4xl px-2">
        🎶 Sanremo 2025 <br className="flex sm:hidden" /> Artist Evaluator 🎶
      </h1>
      <p className="text-md sm:text-lg mb-8 text-center">
        Welcome to the ultimate Sanremo Festival 2025 rating experience!
        ⭐ Dive into the world of music and become the judge—rate each artist based on their performance, outfit, vocal ability, stage presence, and creativity.
      </p>
      <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8 ">
        {featuredArtists.map((artist) => (
          <div key={artist.name} className="flex flex-col items-center w-[125px]">
            <Image
              src={artist.image || "/placeholder.svg"}
              alt={artist.name}
              width={80}
              height={80}
              className="rounded-full object-cover w-[80px] h-[80px] shadow-lg border-2 border-white dark:border-gray-800 hover:scale-105 transition-transform"
              />
            <p className="text-sm text-center">{artist.name.split('-')[0]}</p>
          </div>
        ))}
      </div>
      <p className="text-md sm:text-lg mb-8 text-center">
        Get ready to watch, evaluate, and share your rankings in real-time. Let the best artist shine! ✨🎤
      </p>
      <Link href="/days">
        <Button size="lg">Start Evaluation</Button>
      </Link>
    </div>
  )
}