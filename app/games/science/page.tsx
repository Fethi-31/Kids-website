"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type ScienceQ = {
  id: string
  statement: string
  isTrue: boolean
  funFact: string
}

const QUESTIONS: ScienceQ[] = [
  {
    id: "1",
    statement: "Plants need sunlight to grow.",
    isTrue: true,
    funFact: "Plants make their own food using sunlight. 🌱☀️",
  },
  {
    id: "2",
    statement: "A whale is a fish.",
    isTrue: false,
    funFact: "Whales are mammals — they breathe air like us! 🐋",
  },
  {
    id: "3",
    statement: "Water can be solid, liquid, or gas.",
    isTrue: true,
    funFact: "Ice = solid, water = liquid, steam = gas! 💧",
  },
  {
    id: "4",
    statement: "The Moon makes its own light.",
    isTrue: false,
    funFact: "The Moon reflects sunlight — like a mirror in space. 🌙",
  },
  {
    id: "5",
    statement: "Some rocks are made from volcano lava.",
    isTrue: true,
    funFact: "When lava cools down, it becomes rock! 🌋🪨",
  },
  {
    id: "6",
    statement: "Humans have 2 hearts.",
    isTrue: false,
    funFact: "Humans have 1 heart — but octopuses have 3! 🐙❤️",
  },
  {
    id: "7",
    statement: "Sound travels faster than light.",
    isTrue: false,
    funFact: "Light is super fast — that’s why we see lightning before thunder. ⚡🔊",
  },
  {
    id: "8",
    statement: "Earth is the only planet with rain.",
    isTrue: false,
    funFact: "Other planets can have strange rain, like methane rain! 🪐",
  },
]

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function ScienceGamePage() {
  const TOTAL = 10
  const deck = useMemo(() => shuffle(QUESTIONS), []) // shuffle once

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [locked, setLocked] = useState(false)
  const [picked, setPicked] = useState<"true" | "false" | null>(null)
  const [lastWasCorrect, setLastWasCorrect] = useState<boolean | null>(null)

  const q = deck[index % deck.length]
  const progress = Math.round((index / TOTAL) * 100)
  const isFinished = index + 1 >= TOTAL && locked

  function answer(choice: "true" | "false") {
    if (locked) return
    setPicked(choice)
    setLocked(true)

    const correct = (choice === "true") === q.isTrue
    setLastWasCorrect(correct)
    if (correct) setScore((s) => s + 10)
  }

  function next() {
    if (!locked) return
    if (index + 1 >= TOTAL) return
    setIndex((n) => n + 1)
    setLocked(false)
    setPicked(null)
    setLastWasCorrect(null)
  }

  function restart() {
    setIndex(0)
    setScore(0)
    setLocked(false)
    setPicked(null)
    setLastWasCorrect(null)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Science</h1>
            <Badge variant="secondary" className="rounded-full">Science Sparks</Badge>
          </div>
          <Link href="/games" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to games
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <Card>
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl">Science Sparks 🔥</CardTitle>
              <Badge variant="secondary" className="rounded-full">Score: {score}</Badge>
            </div>
            <CardDescription>True or False — then learn a fun fact!</CardDescription>

            <div className="pt-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Question {Math.min(index + 1, TOTAL)} / {TOTAL}
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <p className="text-2xl font-bold">{q.statement}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                className="h-14 text-lg"
                variant={locked && picked === "true" ? (lastWasCorrect ? "default" : "secondary") : "outline"}
                onClick={() => answer("true")}
                disabled={locked}
              >
                ✅ True
              </Button>

              <Button
                className="h-14 text-lg"
                variant={locked && picked === "false" ? (lastWasCorrect ? "default" : "secondary") : "outline"}
                onClick={() => answer("false")}
                disabled={locked}
              >
                ❌ False
              </Button>
            </div>

            {!locked ? (
              <p className="text-sm text-muted-foreground text-center">Pick True or False 😊</p>
            ) : isFinished ? (
              <div className="text-center space-y-2 pt-2">
                <p className="text-lg font-semibold">
                  Finished! 🌟 Your score: {score}
                </p>
                <p className="text-sm text-muted-foreground">{q.funFact}</p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button onClick={restart}>Play Again</Button>
                  <Link href="/games/reading" className="inline-flex">
                    <Button variant="outline">Try Reading</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 pt-2">
                <p className="text-sm font-medium">
                  {lastWasCorrect ? "Correct! 🎉" : "Nice try! 💛"}
                </p>
                <p className="text-sm text-muted-foreground">{q.funFact}</p>
                <div className="flex justify-center pt-2">
                  <Button onClick={next}>Next →</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
