import Link from "next/link"
import { Button } from "@components/ui/button"

const artists = Array.from({ length: 29 }, (_, i) => `Artist ${i + 1}`)

export default function ArtistsList() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Artists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artists.map((artist, index) => (
          <Link key={index} href={`/evaluate/${index + 1}`}>
            <Button variant="outline" className="w-full">
              {artist}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}

