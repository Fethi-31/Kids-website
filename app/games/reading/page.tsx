"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { STORY_BANK, type Story } from "./stories"

type AgeTag = "6-8" | "8-10"
type Mode = "practice" | "daily"

const USED_KEY = (age: AgeTag) => `kidslearn_used_story_ids_${age}_v1`
const DAILY_DONE_KEY = (age: AgeTag, dateStr: string) => `kidslearn_daily_done_${age}_${dateStr}_v1`

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function todayISO(): string {
  // Use local date (user’s browser)
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function hashStringToIndex(s: string, mod: number): number {
  // simple deterministic hash
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return mod === 0 ? 0 : h % mod
}

function readJSON(key: string): any {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeJSON(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

function readUsed(age: AgeTag): string[] {
  const v = readJSON(USED_KEY(age))
  return Array.isArray(v) ? v : []
}

function writeUsed(age: AgeTag, ids: string[]) {
  writeJSON(USED_KEY(age), ids)
}

function getStoriesForAge(age: AgeTag): Story[] {
  return STORY_BANK.filter((s) => s.ageTag === age)
}

export default function ReadingGamePage() {
  const TOTAL_QUESTIONS = 10

  const [age, setAge] = useState<AgeTag>("6-8")
  const [mode, setMode] = useState<Mode>("practice")

  const [deck, setDeck] = useState<Story[]>([])
  const [storyIndex, setStoryIndex] = useState(0)
  const [qIndex, setQIndex] = useState(0)

  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const dateStr = useMemo(() => todayISO(), [])
  const storiesForAge = useMemo(() => getStoriesForAge(age), [age])

  // Build deck whenever age or mode changes
  useEffect(() => {
    if (typeof window === "undefined") return

    setScore(0)
    setStreak(0)
    setSelected(null)
    setLocked(false)
    setStoryIndex(0)
    setQIndex(0)

    if (mode === "daily") {
      // deterministic pick based on date + age
      const idx = hashStringToIndex(`${dateStr}:${age}`, storiesForAge.length)
      setDeck(storiesForAge.length ? [storiesForAge[idx]] : [])
      return
    }

    // practice mode: no-repeat until exhausted (per age group)
    const used = readUsed(age)
    const available = storiesForAge.filter((s) => !used.includes(s.id))

    if (available.length === 0) {
      // exhausted -> reset used
      writeUsed(age, [])
      setDeck(shuffle(storiesForAge))
    } else {
      setDeck(shuffle(available))
    }
  }, [age, mode, dateStr, storiesForAge])

  const currentStory = deck[storyIndex]
  const currentQuestion = currentStory?.questions[qIndex]

  const answeredCount = useMemo(() => {
    const base = storyIndex * 3 + qIndex
    return locked ? base + 1 : base
  }, [storyIndex, qIndex, locked])

  const progress = Math.min(100, Math.round((answeredCount / TOTAL_QUESTIONS) * 100))
  const isFinished = answeredCount >= TOTAL_QUESTIONS && locked

  // Mark story as used when you start it (practice mode only)
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!currentStory) return
    if (mode !== "practice") return

    const used = readUsed(age)
    if (!used.includes(currentStory.id)) {
      const next = [...used, currentStory.id]
      writeUsed(age, next)
    }
  }, [currentStory?.id, mode, age])

  function pickAnswer(i: number) {
    if (locked || !currentQuestion) return
    setSelected(i)
    setLocked(true)

    const correct = i === currentQuestion.correctIndex
    if (correct) {
      setScore((s) => s + 10)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }

    // Daily mode: mark today complete when finished
    if (mode === "daily" && currentStory) {
      const willFinish = answeredCount + 1 >= TOTAL_QUESTIONS
      if (willFinish) writeJSON(DAILY_DONE_KEY(age, dateStr), { done: true, score: score + (correct ? 10 : 0) })
    }
  }

  function next() {
    if (!locked) return
    if (isFinished) return

    const nextQ = qIndex + 1
    if (currentStory && nextQ < currentStory.questions.length) {
      setQIndex(nextQ)
      setSelected(null)
      setLocked(false)
      return
    }

    const nextS = storyIndex + 1
    if (deck && nextS < deck.length) {
      setStoryIndex(nextS)
      setQIndex(0)
      setSelected(null)
      setLocked(false)
      return
    }

    // If deck ends, reshuffle and continue (practice), or stop (daily)
    if (mode === "daily") return
    setDeck(shuffle(storiesForAge))
    setStoryIndex(0)
    setQIndex(0)
    setSelected(null)
    setLocked(false)
  }

  function newSet() {
    // practice: rebuild fresh deck from remaining unused
    // daily: just reload daily story (same)
    setMode((m) => m) // triggers nothing; we rebuild manually:
    if (typeof window === "undefined") return

    setScore(0)
    setStreak(0)
    setSelected(null)
    setLocked(false)
    setStoryIndex(0)
    setQIndex(0)

    if (mode === "daily") {
      const idx = hashStringToIndex(`${dateStr}:${age}`, storiesForAge.length)
      setDeck(storiesForAge.length ? [storiesForAge[idx]] : [])
      return
    }

    const used = readUsed(age)
    const available = storiesForAge.filter((s) => !used.includes(s.id))
    if (available.length === 0) {
      writeUsed(age, [])
      setDeck(shuffle(storiesForAge))
    } else {
      setDeck(shuffle(available))
    }
  }

  const dailyDone = useMemo(() => {
    if (typeof window === "undefined") return false
    const v = readJSON(DAILY_DONE_KEY(age, dateStr))
    return !!v?.done
  }, [age, dateStr])

  if (!currentStory || !currentQuestion) {
    return (
      <div className="min-h-screen">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Reading</h1>
              <Badge variant="secondary" className="rounded-full">Story Time</Badge>
            </div>
            <Link href="/games" className="text-sm text-muted-foreground hover:text-primary">
              ← Back to games
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Loading stories…</CardTitle>
              <CardDescription>If it stays stuck, refresh once.</CardDescription>
            </CardHeader>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Reading</h1>
            <Badge variant="secondary" className="rounded-full">Story Time</Badge>
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
              <CardTitle className="text-2xl">Story Comprehension 📚</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">Score: {score}</Badge>
                <Badge variant="secondary" className="rounded-full">Streak: {streak}</Badge>
              </div>
            </div>

            <CardDescription>
              {mode === "daily"
                ? `Daily Story (${dateStr}) — same story all day.`
                : "Practice Mode — stories won’t repeat until you finish them all."}
            </CardDescription>

            {/* Mode + Age controls */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground mr-1">Mode:</span>
              <Button
                size="sm"
                variant={mode === "practice" ? "default" : "outline"}
                onClick={() => setMode("practice")}
              >
                Practice
              </Button>
              <Button
                size="sm"
                variant={mode === "daily" ? "default" : "outline"}
                onClick={() => setMode("daily")}
              >
                Daily Story
              </Button>

              <span className="text-sm text-muted-foreground ml-4 mr-1">Age:</span>
              <Button
                size="sm"
                variant={age === "6-8" ? "default" : "outline"}
                onClick={() => setAge("6-8")}
              >
                6–8
              </Button>
              <Button
                size="sm"
                variant={age === "8-10" ? "default" : "outline"}
                onClick={() => setAge("8-10")}
              >
                8–10
              </Button>

              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={newSet}>
                  New Set
                </Button>
              </div>
            </div>

            {/* Progress */}
            <div className="pt-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Progress: {Math.min(answeredCount, TOTAL_QUESTIONS)} / {TOTAL_QUESTIONS}
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Daily done badge */}
            {mode === "daily" && dailyDone ? (
              <div className="pt-1">
                <Badge className="rounded-full" variant="secondary">
                  ✅ Daily Story completed today
                </Badge>
              </div>
            ) : null}
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Story */}
            <div className="rounded-xl border bg-background p-5 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">{currentStory.title}</h2>
                <Badge variant="secondary" className="rounded-full">
                  Ages {currentStory.ageTag}
                </Badge>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">{currentStory.text}</p>
            </div>

            {/* Question */}
            <div className="space-y-3">
              <p className="text-lg font-semibold">{currentQuestion.prompt}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.choices.map((c, i) => {
                  const isSelected = selected === i
                  const isCorrect = i === currentQuestion.correctIndex

                  let variant: "default" | "outline" | "secondary" = "outline"
                  if (locked && isCorrect) variant = "default"
                  else if (locked && isSelected && !isCorrect) variant = "secondary"

                  return (
                    <Button
                      key={i}
                      className="h-14 text-base"
                      variant={variant}
                      onClick={() => pickAnswer(i)}
                      disabled={locked}
                    >
                      {c}
                    </Button>
                  )
                })}
              </div>

              {!locked ? (
                <p className="text-sm text-muted-foreground text-center">Pick the best answer 😊</p>
              ) : isFinished ? (
                <div className="text-center space-y-2 pt-2">
                  <p className="text-lg font-semibold">Finished! 🎉 Your score: {score}</p>
                  <div className="flex justify-center gap-2 pt-2">
                    <Button onClick={newSet}>Play Again</Button>
                    <Link href="/games/science" className="inline-flex">
                      <Button variant="outline">Try Science</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center pt-2">
                  <Button onClick={next}>Next →</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
