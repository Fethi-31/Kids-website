"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type Question = {
  id: string
  prompt: string
  choices: string[]
  correctIndex: number
}

function makeMathQuestion(level: number): Question {
  // level controls difficulty a bit
  const max = level <= 1 ? 10 : level === 2 ? 20 : 50
  const a = Math.floor(Math.random() * max) + 1
  const b = Math.floor(Math.random() * max) + 1
  const op = level <= 2 ? (Math.random() < 0.5 ? "+" : "-") : (Math.random() < 0.5 ? "+" : Math.random() < 0.75 ? "-" : "×")

  let correct: number
  if (op === "+") correct = a + b
  else if (op === "-") correct = a - b
  else correct = a * b

  // Build choices
  const choicesSet = new Set<number>()
  choicesSet.add(correct)
  while (choicesSet.size < 4) {
    const delta = Math.floor(Math.random() * 11) - 5 // -5..+5
    const candidate = correct + delta + (delta === 0 ? 7 : 0)
    choicesSet.add(candidate)
  }

  const choices = Array.from(choicesSet).sort(() => Math.random() - 0.5)
  const correctIndex = choices.indexOf(correct)

  return {
    id: crypto.randomUUID(),
    prompt: `${a} ${op} ${b} = ?`,
    choices: choices.map(String),
    correctIndex,
  }
}

export default function GamesPage() {
  const TOTAL = 10

  const [level, setLevel] = useState<1 | 2 | 3>(1)
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const question = useMemo(() => makeMathQuestion(level), [qIndex, level])

  const progress = Math.round((qIndex / TOTAL) * 100)

  function resetGame(nextLevel?: 1 | 2 | 3) {
    if (nextLevel) setLevel(nextLevel)
    setQIndex(0)
    setScore(0)
    setStreak(0)
    setSelected(null)
    setLocked(false)
  }

  function choose(i: number) {
    if (locked) return
    setSelected(i)
    setLocked(true)

    const correct = i === question.correctIndex
    if (correct) {
      setScore((s) => s + 10)
      setStreak((st) => st + 1)
    } else {
      setStreak(0)
    }
  }

  function next() {
    if (!locked) return
    if (qIndex + 1 >= TOTAL) return
    setQIndex((n) => n + 1)
    setSelected(null)
    setLocked(false)
  }

  const isFinished = qIndex + 1 >= TOTAL && locked

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Games</h1>
            <Badge variant="secondary" className="rounded-full">Math Quiz</Badge>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Back home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <Card>
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl">Quick Quiz</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="rounded-full" variant="secondary">Score: {score}</Badge>
                <Badge className="rounded-full" variant="secondary">Streak: {streak}</Badge>
              </div>
            </div>
            <CardDescription>
              Answer {TOTAL} questions. Pick your level and try to beat your score.
            </CardDescription>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground mr-2">Level:</span>
              <Button
                size="sm"
                variant={level === 1 ? "default" : "outline"}
                onClick={() => resetGame(1)}
              >
                Easy
              </Button>
              <Button
                size="sm"
                variant={level === 2 ? "default" : "outline"}
                onClick={() => resetGame(2)}
              >
                Medium
              </Button>
              <Button
                size="sm"
                variant={level === 3 ? "default" : "outline"}
                onClick={() => resetGame(3)}
              >
                Hard
              </Button>

              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => resetGame()}>
                  Restart
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Question {Math.min(qIndex + 1, TOTAL)} / {TOTAL}
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-center py-6">
              {question.prompt}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.choices.map((c, i) => {
                const isSelected = selected === i
                const isCorrect = i === question.correctIndex

                // simple feedback styling
                let variant: "default" | "outline" | "secondary" = "outline"
                if (locked && isCorrect) variant = "default"
                else if (locked && isSelected && !isCorrect) variant = "secondary"

                return (
                  <Button
                    key={i}
                    className="h-14 text-lg"
                    variant={variant}
                    onClick={() => choose(i)}
                    disabled={locked}
                  >
                    {c}
                  </Button>
                )
              })}
            </div>

            {!locked ? (
              <p className="text-sm text-muted-foreground text-center">
                Choose an answer to continue.
              </p>
            ) : isFinished ? (
              <div className="text-center space-y-2 pt-2">
                <p className="text-lg font-semibold">
                  Finished! 🎉 Your score: {score}
                </p>
                <p className="text-sm text-muted-foreground">
                  Want to improve? Try Medium or Hard.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button onClick={() => resetGame()}>Play Again</Button>
                  <Link href="/lessons" className="inline-flex">
                    <Button variant="outline">Go to Lessons</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex justify-center pt-2">
                <Button onClick={next}>Next Question →</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
