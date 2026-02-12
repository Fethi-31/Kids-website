import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function GamesMenuPage() {
  const games = [
    { title: "Math Quiz", desc: "Fast questions + score + streak", href: "/games/math" },
    { title: "Reading", desc: "Word matching and comprehension", href: "/games/reading" },
    { title: "Science", desc: "Fun facts + quick quizzes", href: "/games/science" },
  ]

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Games</h1>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((g) => (
            <Link key={g.href} href={g.href} className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{g.title}</CardTitle>
                  <CardDescription>{g.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
