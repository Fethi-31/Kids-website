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
  // Operators by level (kid-friendly)
  const ops = level <= 1 ? ["+", "-"] : level === 2 ? ["+", "-", "×"] : ["+", "-", "×", "÷"]
  const op = ops[Math.floor(Math.random() * ops.length)]

  let a = 0
  let b = 0
  let correct = 0
  let prompt = ""

  if (op === "+") {
    const max = level <= 1 ? 10 : level === 2 ? 20 : 50
    a = Math.floor(Math.random() * max) + 1
    b = Math.floor(Math.random() * max) + 1
    correct = a + b
    prompt = `${a} + ${b} = ?`
  }

  if (op === "-") {
    const max = level <= 1 ? 10 : level === 2 ? 20 : 50
    a = Math.floor(Math.random() * max) + 1
    b = Math.floor(Math.random() * max) + 1
    if (b > a) [a, b] = [b, a] // ✅ ensure non-negative result
    correct = a - b
    prompt = `${a} - ${b} = ?`
  }

  if (op === "×") {
    const mulMax = level <= 1 ? 10 : level === 2 ? 12 : 15
    a = Math.floor(Math.random() * mulMax) + 1
    b = Math.floor(Math.random() * mulMax) + 1
    correct = a * b
    prompt = `${a} × ${b} = ?`
  }

  if (op === "÷") {
    const bMax = 12
    b = Math.floor(Math.random() * bMax) + 1
    const kMax = 12
    const k = Math.floor(Math.random() * kMax) + 1
    a = b * k
    correct = k
    prompt = `${a} ÷ ${b} = ?`
  }

  // Multiple choice answers (non-negative)
  const choicesSet = new Set<number>()
  choicesSet.add(correct)

  const spread = level <= 1 ? 5 : level === 2 ? 10 : 15
  while (choicesSet.size < 4) {
    const delta = Math.floor(Math.random() * (spread * 2 + 1)) - spread
    const candidate = correct + (delta === 0 ? 1 : delta)
    if (candidate >= 0) choicesSet.add(candidate)
  }

  const choices = Array.from(choicesSet).sort(() => Math.random() - 0.5)
  const correctIndex = choices.indexOf(correct)

  return {
    id: crypto.randomUUID(),
    prompt,
    choices: choices.map(String),
    correctIndex,
  }
}

export default function MathGamePage() {
  const TOTAL = 10

  const [level, setLevel] = useState<1 | 2 | 3>(1)
  const [qIndex, setQIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const question = useMemo(() => makeMathQuestion(level), [qIndex, level])

  const answered = locked ? qIndex + 1 : qIndex
  const progress = Math.round((answered / TOTAL) * 100)
  const isFinished = answered >= TOTAL && locked

  function reset(nextLevel?: 1 | 2 | 3) {
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

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Math</h1>
            <Badge variant="secondary" className="rounded-full">Quick Quiz</Badge>
          </div>
          <Link href="/games" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to games
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl">Math Quiz 🧠</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">Score: {score}</Badge>
                <Badge variant="secondary" className="rounded-full">Streak: {streak}</Badge>
              </div>
            </div>

            <CardDescription>
              Easy: + and − | Medium: + − × | Hard: + − × ÷ (no negative answers)
            </CardDescription>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground mr-1">Level:</span>
              <Button size="sm" variant={level === 1 ? "default" : "outline"} onClick={() => reset(1)}>
                Easy
              </Button>
              <Button size="sm" variant={level === 2 ? "default" : "outline"} onClick={() => reset(2)}>
                Medium
              </Button>
              <Button size="sm" variant={level === 3 ? "default" : "outline"} onClick={() => reset(3)}>
                Hard
              </Button>

              <div className="ml-auto">
                <Button size="sm" variant="outline" onClick={() => reset()}>
                  Restart
                </Button>
              </div>
            </div>

            <div className="pt-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress: {Math.min(answered, TOTAL)} / {TOTAL}</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-center py-6">{question.prompt}</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.choices.map((c, i) => {
                const isSelected = selected === i
                const isCorrect = i === question.correctIndex

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
              <p className="text-sm text-muted-foreground text-center">Pick an answer 😊</p>
            ) : isFinished ? (
              <div className="text-center space-y-2 pt-2">
                <p className="text-lg font-semibold">Finished! 🎉 Your score: {score}</p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button onClick={() => reset()}>Play Again</Button>
                  <Link href="/games/reading" className="inline-flex">
                    <Button variant="outline">Try Reading</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex justify-center pt-2">
                <Button onClick={next}>Next →</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
