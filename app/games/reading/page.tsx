"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type ReadingQuestion =
  | {
      id: string
      type: "rhyme"
      prompt: string
      word: string
      choices: string[]
      correctIndex: number
    }
  | {
      id: string
      type: "missingLetter"
      prompt: string
      wordWithBlank: string
      choices: string[]
      correctIndex: number
    }

const RHYME_QUESTIONS = [
  { word: "cat", correct: "hat", wrong: ["sun", "book", "tree"] },
  { word: "bee", correct: "see", wrong: ["car", "fish", "moon"] },
  { word: "cake", correct: "lake", wrong: ["chair", "sock", "rain"] },
  { word: "star", correct: "car", wrong: ["leaf", "milk", "cake"] },
  { word: "boat", correct: "goat", wrong: ["door", "sand", "pen"] },
]

const MISSING_LETTER = [
  { wordWithBlank: "c_t", correct: "a", wrong: ["o", "u", "e"], answerWord: "cat" },
  { wordWithBlank: "d_g", correct: "o", wrong: ["a", "e", "i"], answerWord: "dog" },
  { wordWithBlank: "b_ll", correct: "a", wrong: ["e", "i", "o"], answerWord: "ball" },
  { wordWithBlank: "s_n", correct: "u", wrong: ["a", "e", "o"], answerWord: "sun" },
  { wordWithBlank: "f_sh", correct: "i", wrong: ["a", "e", "o"], answerWord: "fish" },
]

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function makeReadingQuestion(): ReadingQuestion {
  const pickType: ReadingQuestion["type"] = Math.random() < 0.5 ? "rhyme" : "missingLetter"

  if (pickType === "rhyme") {
    const q = RHYME_QUESTIONS[Math.floor(Math.random() * RHYME_QUESTIONS.length)]
    const choices = shuffle([q.correct, ...q.wrong]).slice(0, 4)
    const correctIndex = choices.indexOf(q.correct)
    return {
      id: crypto.randomUUID(),
      type: "rhyme",
      prompt: `Which word rhymes with "${q.word}"?`,
      word: q.word,
      choices,
      correctIndex,
    }
  }

  const q = MISSING_LETTER[Math.floor(Math.random() * MISSING_LETTER.length)]
  const choices = shuffle([q.correct, ...q.wrong]).slice(0, 4)
  const correctIndex = choices.indexOf(q.correct)

  return {
    id: crypto.randomUUID(),
    type: "missingLetter",
    prompt: `Fill the missing letter to make a real word!`,
    wordWithBlank: q.wordWithBlank,
    choices,
    correctIndex,
  }
}

export default function ReadingGamePage() {
  const TOTAL = 10

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const question = useMemo(() => makeReadingQuestion(), [index])
  const progress = Math.round((index / TOTAL) * 100)
  const isFinished = index + 1 >= TOTAL && locked

  function pick(i: number) {
    if (locked) return
    setSelected(i)
    setLocked(true)

    const correct = i === question.correctIndex
    if (correct) {
      setScore((s) => s + 10)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }
  }

  function next() {
    if (!locked) return
    if (index + 1 >= TOTAL) return
    setIndex((n) => n + 1)
    setSelected(null)
    setLocked(false)
  }

  function restart() {
    setIndex(0)
    setScore(0)
    setStreak(0)
    setSelected(null)
    setLocked(false)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Reading</h1>
            <Badge variant="secondary" className="rounded-full">Word Explorer</Badge>
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
              <CardTitle className="text-2xl">Word Explorer ✨</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">Score: {score}</Badge>
                <Badge variant="secondary" className="rounded-full">Streak: {streak}</Badge>
              </div>
            </div>
            <CardDescription>Rhymes and missing letters — quick and fun practice!</CardDescription>

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
            <div className="text-center space-y-2 py-4">
              <p className="text-lg font-semibold">{question.prompt}</p>

              {question.type === "rhyme" ? (
                <div className="text-4xl font-bold">{`"${question.word}"`}</div>
              ) : (
                <div className="text-5xl font-bold tracking-widest">{question.wordWithBlank}</div>
              )}
            </div>

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
                    onClick={() => pick(i)}
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
                <p className="text-lg font-semibold">Great job! 🎉 Your score: {score}</p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button onClick={restart}>Play Again</Button>
                  <Link href="/games/math" className="inline-flex">
                    <Button variant="outline">Try Math Quiz</Button>
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
