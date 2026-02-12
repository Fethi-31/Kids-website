"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Star, Trophy, Sparkles, Rocket, Brain, Music, Palette } from "lucide-react"

interface Subject {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  progress: number
  lessons: number
}

export default function HomePage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const router = useRouter()

  // ✅ Go to lessons page and pass selected subject as query
  const handleSubjectClick = (subjectId: string) => {
    setSelectedSubject(subjectId)
    router.push(`/lessons?subject=${subjectId}`)
  }

  // ✅ Navigate instead of alert
  const handleStartLearning = () => router.push("/lessons")
  const handlePlayGames = () => router.push("/games")
  const handleChallenge = () => router.push("/progress")

  const subjects: Subject[] = [
    {
      id: "math",
      name: "Math",
      icon: <Brain className="w-8 h-8" />,
      color: "bg-primary text-primary-foreground",
      progress: 65,
      lessons: 24,
    },
    {
      id: "science",
      name: "Science",
      icon: <Rocket className="w-8 h-8" />,
      color: "bg-secondary text-secondary-foreground",
      progress: 45,
      lessons: 18,
    },
    {
      id: "reading",
      name: "Reading",
      icon: <BookOpen className="w-8 h-8" />,
      color: "bg-accent text-accent-foreground",
      progress: 80,
      lessons: 32,
    },
    {
      id: "art",
      name: "Art",
      icon: <Palette className="w-8 h-8" />,
      color: "bg-chart-4 text-white",
      progress: 30,
      lessons: 15,
    },
    {
      id: "music",
      name: "Music",
      icon: <Music className="w-8 h-8" />,
      color: "bg-chart-5 text-white",
      progress: 55,
      lessons: 20,
    },
  ]

  const achievements = [
    { title: "5 Day Streak!", icon: <Star className="w-5 h-5" />, color: "text-yellow-500" },
    { title: "Math Master", icon: <Trophy className="w-5 h-5" />, color: "text-orange-500" },
    { title: "Speed Reader", icon: <Sparkles className="w-5 h-5" />, color: "text-blue-500" },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">KidsLearn</h1>
          </div>

          {/* ✅ Real links */}
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-foreground hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link href="/lessons" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Lessons
            </Link>
            <Link href="/games" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Games
            </Link>
            <Link href="/progress" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Progress
            </Link>
          </nav>

          {/* ✅ Profile navigates */}
          <Button className="rounded-full" onClick={() => router.push("/profile")}>
            My Profile
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="rounded-full px-6 py-2 text-base" variant="secondary">
              Welcome Back!
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-balance">
              Ready to Learn Something <span className="text-primary">Amazing</span> Today?
            </h2>
            <p className="text-xl text-muted-foreground text-balance">
              Explore fun lessons, play educational games, and become a super learner!
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button size="lg" className="rounded-full text-lg px-8" onClick={handleStartLearning}>
                Start Learning
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full text-lg px-8 bg-transparent"
                onClick={handlePlayGames}
              >
                Play Games
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Banner */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 bg-background px-6 py-3 rounded-full">
                <span className={achievement.color}>{achievement.icon}</span>
                <span className="font-semibold">{achievement.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-3">Choose Your Subject</h3>
            <p className="text-lg text-muted-foreground">Pick a subject and start your learning adventure!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg overflow-hidden"
                onClick={() => handleSubjectClick(subject.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-16 h-16 rounded-2xl ${subject.color} flex items-center justify-center`}>
                      {subject.icon}
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      {subject.lessons} lessons
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{subject.name}</CardTitle>
                  <CardDescription className="text-base">Continue your learning journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Progress</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Challenge */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 border-white/20 text-primary-foreground">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-8 h-8" />
                  <Badge variant="secondary" className="rounded-full">
                    Daily Challenge
                  </Badge>
                </div>
                <CardTitle className="text-3xl">Complete Today&apos;s Math Challenge!</CardTitle>
                <CardDescription className="text-primary-foreground/80 text-base">
                  Solve 10 problems and earn bonus stars
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" variant="secondary" className="rounded-full" onClick={handleChallenge}>
                    Start Challenge
                  </Button>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                    <span>Win 50 bonus stars!</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-3">Did You Know?</h3>
            <p className="text-lg text-muted-foreground">Learn something new every day!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 mx-auto rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mb-4">
                  <Rocket className="w-10 h-10" />
                </div>
                <CardTitle className="text-xl">Space Fact</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  A day on Venus is longer than a year on Venus!
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 mx-auto rounded-full bg-accent text-accent-foreground flex items-center justify-center mb-4">
                  <Brain className="w-10 h-10" />
                </div>
                <CardTitle className="text-xl">Brain Fact</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Your brain uses 20% of your body&apos;s energy but weighs only 2% of your body!
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10" />
                </div>
                <CardTitle className="text-xl">Fun Fact</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Honey never spoils! Archaeologists found 3000-year-old honey that&apos;s still edible!
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">KidsLearn</span>
            </div>
            <p className="text-sm text-muted-foreground">Making learning fun for kids everywhere!</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
