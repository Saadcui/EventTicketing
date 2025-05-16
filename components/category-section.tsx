import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function CategorySection() {
  const categories = [
    {
      id: "music",
      name: "Music",
      image: "/placeholder.svg?height=200&width=200",
      color: "bg-red-500",
    },
    {
      id: "conferences",
      name: "Conferences",
      image: "/placeholder.svg?height=200&width=200",
      color: "bg-blue-500",
    },
    {
      id: "sports",
      name: "Sports",
      image: "/placeholder.svg?height=200&width=200",
      color: "bg-green-500",
    },
    {
      id: "arts",
      name: "Arts & Theater",
      image: "/placeholder.svg?height=200&width=200",
      color: "bg-purple-500",
    },
    {
      id: "workshops",
      name: "Workshops",
      image: "/placeholder.svg?height=200&width=200",
      color: "bg-yellow-500",
    },
    {
      id: "festivals",
      name: "Festivals",
      image: "/placeholder.svg?height=200&width=200",
      color: "bg-pink-500",
    },
  ]

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Discover events that match your interests</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/discover?category=${category.id}`} className="block">
              <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${category.color}`}>
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
