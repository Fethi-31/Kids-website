"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SCIENCE_BANK, type ScienceCard, type AgeTag } from "./facts"

type Mode = "practice" | "daily"

const USED_KEY = (age: AgeTag) => `kidslearn_used_science_ids_${age}_v1`
const DAILY_DONE_KEY = (age: AgeTag, dateStr: string) => `kidslearn_daily_science_done_${age}_${dateStr}_v1`

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function hashStringToIndex(s: string, mod: number): number {
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

function cardsForAge(age: AgeTag): ScienceCard[] {
  return SCIENCE_BANK.filter((c) => c.ageTag === age)
}

export default function ScienceGamePage() {
  const TOTAL = 10

  const [age, setAge] = useState<AgeTag>("6-8")
  const [mode, setMode] = useState<Mode>("practice")

  const [deck, setDeck] = useState<ScienceCard[]>([])
  const [index, setIndex] = useState(0)

  const [score, setScore] = useState(0)
  const [locked, setLocked] = useState(false)
  const [picked, setPicked] = useState<"true" | "false" | null>(null)
  const [lastWasCorrect, setLastWasCorrect] = useState<boolean | null>(null)

  const dateStr = useMemo(() => todayISO(), [])
  const pool = useMemo(() => cardsForAge(age), [age])

  useEffect(() => {
    if (typeof window === "undefined") return

    setIndex(0)
    setScore(0)
    setLocked(false)
    setPicked(null)
    setLastWasCorrect(null)

    if (mode === "daily") {
      const idx = hashStringToIndex(`${dateStr}:${age}`, pool.length)
      setDeck(pool.length ? [pool[idx]] : [])
      return
    }

    const used = readUsed(age)
    const available = pool.filter((c) => !used.includes(c.id))

    if (available.length === 0) {
      writeUsed(age, [])
      setDeck(shuffle(pool))
    } else {
      setDeck(shuffle(available))
    }
  }, [age, mode, dateStr, pool])

  const card = deck[index % Math.max(deck.length, 1)]
  const progress = Math.min(100, Math.round(((locked ? index + 1 : index) / TOTAL) * 100))
  const isFinished = (locked ? index + 1 : index) >= TOTAL && locked

  const dailyDone = useMemo(() => {
    if (typeof window === "undefined") return false
    const v = readJSON(DAILY_DONE_KEY(age, dateStr))
    return !!v?.done
  }, [age, dateStr])

  function answer(choice: "true" | "false") {
    if (locked || !card) return
    setPicked(choice)
    setLocked(true)

    const correct = (choice === "true") === card.isTrue
    setLastWasCorrect(correct)
    if (correct) setScore((s) => s + 10)

    // practice mode: mark used
    if (mode === "practice") {
      const used = readUsed(age)
      if (!used.includes(card.id)) writeUsed(age, [...used, card.id])
    }

    // daily mode: mark done at finish
    const willFinish = index + 1 >= TOTAL
    if (mode === "daily" && willFinish) {
      writeJSON(DAILY_DONE_KEY(age, dateStr), { done: true, score: score + (correct ? 10 : 0) })
    }
  }

  function next() {
    if (!locked) return
    if (isFinished) return

    // daily: repeat the same card but count progress
    setIndex((n) => n + 1)
    setLocked(false)
    setPicked(null)
    setLastWasCorrect(null)
  }

  function newSet() {
    // reset run (practice respects unused pool; daily remains same)
    setIndex(0)
    setScore(0)
    setLocked(false)
    setPicked(null)
    setLastWasCorrect(null)

    if (mode === "daily") {
      const idx = hashStringToIndex(`${dateStr}:${age}`, pool.length)
      setDeck(pool.length ? [pool[idx]] : [])
      return
    }

    const used = readUsed(age)
    const available = pool.filter((c) => !used.includes(c.id))
    if (available.length === 0) {
      writeUsed(age, [])
      setDeck(shuffle(pool))
    } else {
      setDeck(shuffle(available))
    }
  }

  if (!card) {
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

        <main className="container mx-auto px-4 py-10 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Loading…</CardTitle>
              <CardDescription>Add science cards to the bank.</CardDescription>
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
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl">True or False 🔥</CardTitle>
              <Badge variant="secondary" className="rounded-full">Score: {score}</Badge>
            </div>

            <CardDescription>
              {mode === "daily"
                ? `Daily Science (${dateStr}) — new card every day.`
                : "Practice Mode — cards won’t repeat until you finish them all."}
            </CardDescription>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground mr-1">Mode:</span>
              <Button size="sm" variant={mode === "practice" ? "default" : "outline"} onClick={() => setMode("practice")}>
                Practice
              </Button>
              <Button size="sm" variant={mode === "daily" ? "default" : "outline"} onClick={() => setMode("daily")}>
                Daily
              </Button>

              <span className="text-sm text-muted-foreground ml-4 mr-1">Age:</span>
              <Button size="sm" variant={age === "6-8" ? "default" : "outline"} onClick={() => setAge("6-8")}>
                6–8
              </Button>
              <Button size="sm" variant={age === "8-10" ? "default" : "outline"} onClick={() => setAge("8-10")}>
                8–10
              </Button>

              <div className="ml-auto">
                <Button size="sm" variant="outline" onClick={newSet}>
                  New Set
                </Button>
              </div>
            </div>

            <div className="pt-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress: {Math.min(locked ? index + 1 : index, TOTAL)} / {TOTAL}</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {mode === "daily" && dailyDone ? (
              <div className="pt-1">
                <Badge variant="secondary" className="rounded-full">✅ Daily Science completed today</Badge>
              </div>
            ) : null}
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <p className="text-2xl font-bold">{card.statement}</p>
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
                <p className="text-lg font-semibold">Finished! 🌟 Your score: {score}</p>
                <p className="text-sm text-muted-foreground">{card.funFact}</p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button onClick={newSet}>Play Again</Button>
                  <Link href="/games/reading" className="inline-flex">
                    <Button variant="outline">Try Reading</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 pt-2">
                <p className="text-sm font-medium">{lastWasCorrect ? "Correct! 🎉" : "Nice try! 💛"}</p>
                <p className="text-sm text-muted-foreground">{card.funFact}</p>
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
