"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type StoryQuestion = {
  prompt: string
  choices: string[]
  correctIndex: number
}

type Story = {
  id: string
  title: string
  text: string
  questions: StoryQuestion[]
  ageTag?: "6-8" | "8-10" | "10-12"
}

const STORY_BANK: Story[] = [
  {
    id: "s1",
    title: "Mila and the Lost Puppy",
    ageTag: "6-8",
    text:
      "Mila was walking home when she heard a tiny whimper. Behind a bush, she found a small puppy with a red collar. " +
      "The puppy looked hungry and a little scared. Mila gave it some water and gently said, “It’s okay.” " +
      "She checked the collar tag and saw the name “Buddy.” Mila and Buddy walked door to door until they found Buddy’s home. " +
      "A boy opened the door and smiled. “Buddy! I’ve been looking everywhere!” Mila felt proud and happy.",
    questions: [
      {
        prompt: "What did Mila hear behind the bush?",
        choices: ["A tiny whimper", "A loud roar", "A song", "A car horn"],
        correctIndex: 0,
      },
      {
        prompt: "What was the puppy’s name?",
        choices: ["Sunny", "Buddy", "Max", "Coco"],
        correctIndex: 1,
      },
      {
        prompt: "How did Mila help Buddy get home?",
        choices: ["She ran away", "She asked a teacher", "She walked door to door", "She built a house"],
        correctIndex: 2,
      },
    ],
  },
  {
    id: "s2",
    title: "The Blue Kite",
    ageTag: "6-8",
    text:
      "Sam had a bright blue kite. On a windy day, he went to the park with his sister, Lina. " +
      "Sam held the kite high while Lina held the string. “Ready?” Lina asked. Sam nodded, and Lina ran. " +
      "The kite lifted into the sky and danced above the trees. Suddenly, the wind got stronger and the string slipped! " +
      "Sam grabbed it quickly and tied a small knot. “Teamwork!” Lina laughed. The kite flew even higher.",
    questions: [
      {
        prompt: "Where did Sam fly the kite?",
        choices: ["At the beach", "In the park", "In a classroom", "In a store"],
        correctIndex: 1,
      },
      {
        prompt: "What problem happened while flying the kite?",
        choices: ["The kite turned green", "The wind stopped forever", "The string slipped", "It started raining candy"],
        correctIndex: 2,
      },
      {
        prompt: "What helped Sam and Lina succeed?",
        choices: ["Teamwork", "Luck only", "A robot", "A magic spell"],
        correctIndex: 0,
      },
    ],
  },
  {
    id: "s3",
    title: "Nora’s Garden Surprise",
    ageTag: "8-10",
    text:
      "Nora planted tiny seeds in a small garden box on her balcony. Every morning, she checked the soil and gave it a little water. " +
      "After a week, she noticed small green sprouts. She felt excited and kept taking care of them. " +
      "Two weeks later, the sprouts became leafy plants. One day, Nora saw a bright yellow flower blooming! " +
      "She realized her careful daily routine helped the plant grow strong.",
    questions: [
      {
        prompt: "What did Nora plant?",
        choices: ["Stones", "Seeds", "Cookies", "Shells"],
        correctIndex: 1,
      },
      {
        prompt: "What did Nora do every morning?",
        choices: ["She ignored the garden", "She sang to the balcony", "She checked the soil and watered", "She painted the plants"],
        correctIndex: 2,
      },
      {
        prompt: "What lesson does the story teach?",
        choices: ["Don’t try new things", "Daily care helps things grow", "Flowers grow instantly", "Only rain helps plants"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "s4",
    title: "The Library Helper",
    ageTag: "8-10",
    text:
      "Omar loved books. At the library, he saw a sign: “Helpers Needed.” He asked the librarian if he could help. " +
      "The librarian smiled and gave him a small cart. Omar returned books to the correct shelves by reading the labels. " +
      "A younger kid couldn’t find a dinosaur book, so Omar walked with them and found it. " +
      "At the end of the day, the librarian said, “You were kind and careful.” Omar felt proud.",
    questions: [
      {
        prompt: "What did Omar use to return books?",
        choices: ["A skateboard", "A small cart", "A bicycle", "A backpack only"],
        correctIndex: 1,
      },
      {
        prompt: "How did Omar find the correct shelf?",
        choices: ["He guessed", "He read the labels", "He asked a robot", "He used a map of space"],
        correctIndex: 1,
      },
      {
        prompt: "Why did Omar feel proud?",
        choices: ["He broke a rule", "He was kind and careful", "He made the library messy", "He ran away"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "s5",
    title: "The Rainy Day Plan",
    ageTag: "8-10",
    text:
      "It rained all day, so Aisha couldn’t play outside. She felt bored at first. Then she had an idea. " +
      "She made a ‘rainy day plan’ list: build a pillow fort, draw a comic, and bake banana muffins with her dad. " +
      "Soon, the living room became a cozy fort. The comic was funny, and the muffins smelled amazing. " +
      "Aisha realized a rainy day could still be a great day.",
    questions: [
      {
        prompt: "Why couldn’t Aisha play outside?",
        choices: ["It was too hot", "It was raining", "It was nighttime", "She lost her shoes"],
        correctIndex: 1,
      },
      {
        prompt: "What was one thing on Aisha’s rainy day plan?",
        choices: ["Swim in the ocean", "Build a pillow fort", "Climb a mountain", "Fly a plane"],
        correctIndex: 1,
      },
      {
        prompt: "How did Aisha feel at the end?",
        choices: ["Happy", "Angry", "Sleepy only", "Confused"],
        correctIndex: 0,
      },
    ],
  },
]

// localStorage keys
const USED_STORIES_KEY = "kidslearn_used_story_ids_v1"

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function safeReadUsed(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(USED_STORIES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function safeWriteUsed(ids: string[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(USED_STORIES_KEY, JSON.stringify(ids))
}

export default function ReadingComprehensionPage() {
  const TOTAL_QUESTIONS = 10

  const [usedStoryIds, setUsedStoryIds] = useState<string[]>([])
  const [deck, setDeck] = useState<Story[]>([])
  const [storyIndex, setStoryIndex] = useState(0)
  const [qIndex, setQIndex] = useState(0)

  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  // Load used story IDs and build a fresh deck (no repeats until exhausted)
  useEffect(() => {
    const used = safeReadUsed()
    setUsedStoryIds(used)

    const available = STORY_BANK.filter((s) => !used.includes(s.id))
    const nextDeck = available.length > 0 ? shuffle(available) : shuffle(STORY_BANK)

    // If we had exhausted all stories, reset used list
    if (available.length === 0) {
      setUsedStoryIds([])
      safeWriteUsed([])
    }

    setDeck(nextDeck)
    setStoryIndex(0)
    setQIndex(0)
    setScore(0)
    setStreak(0)
    setSelected(null)
    setLocked(false)
  }, [])

  const currentStory = deck[storyIndex]
  const currentQuestion = currentStory?.questions[qIndex]

  // Count progress by questions answered (across stories)
  const answeredCount = useMemo(() => {
    // Each time we lock an answer, that question counts as answered.
    // We'll compute based on (storyIndex * questionsPerStory + qIndex), but stories have same length (3).
    // To keep it simple and safe, track by "virtual index":
    const base = storyIndex * 3 + qIndex
    return locked ? base + 1 : base
  }, [storyIndex, qIndex, locked])

  const progress = Math.min(100, Math.round((answeredCount / TOTAL_QUESTIONS) * 100))
  const isFinished = answeredCount >= TOTAL_QUESTIONS && locked

  function ensureMarkStoryUsed(storyId: string) {
    // Mark story used once we start it (so it won't appear again next time)
    setUsedStoryIds((prev) => {
      if (prev.includes(storyId)) return prev
      const next = [...prev, storyId]
      safeWriteUsed(next)
      return next
    })
  }

  // Mark story used when it becomes the current story (first time)
  useEffect(() => {
    if (currentStory?.id) ensureMarkStoryUsed(currentStory.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStory?.id])

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
  }

  function next() {
    if (!locked) return
    if (isFinished) return

    // move to next question in same story if possible
    const nextQ = qIndex + 1
    if (currentStory && nextQ < currentStory.questions.length) {
      setQIndex(nextQ)
      setSelected(null)
      setLocked(false)
      return
    }

    // otherwise move to next story
    const nextS = storyIndex + 1
    if (deck && nextS < deck.length) {
      setStoryIndex(nextS)
      setQIndex(0)
      setSelected(null)
      setLocked(false)
      return
    }

    // If deck ends (rare), reshuffle everything and continue
    const reshuffled = shuffle(STORY_BANK)
    setDeck(reshuffled)
    setStoryIndex(0)
    setQIndex(0)
    setSelected(null)
    setLocked(false)
  }

  function restart() {
    // Restart quiz run but keep "used stories" to prevent repetition
    const available = STORY_BANK.filter((s) => !usedStoryIds.includes(s.id))
    const nextDeck = available.length > 0 ? shuffle(available) : shuffle(STORY_BANK)

    if (available.length === 0) {
      setUsedStoryIds([])
      safeWriteUsed([])
    }

    setDeck(nextDeck)
    setStoryIndex(0)
    setQIndex(0)
    setScore(0)
    setStreak(0)
    setSelected(null)
    setLocked(false)
  }

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

  const correctIndex = currentQuestion.correctIndex

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
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl">Story Comprehension 📚</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">Score: {score}</Badge>
                <Badge variant="secondary" className="rounded-full">Streak: {streak}</Badge>
              </div>
            </div>
            <CardDescription>Read a short story, then answer questions.</CardDescription>

            <div className="pt-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Progress: {Math.min(answeredCount + (locked ? 0 : 0), TOTAL_QUESTIONS)} / {TOTAL_QUESTIONS}
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge className="rounded-full" variant="secondary">
                Story {storyIndex + 1}
              </Badge>
              <Badge className="rounded-full" variant="secondary">
                Question {qIndex + 1} / {currentStory.questions.length}
              </Badge>

              <div className="ml-auto">
                <Button size="sm" variant="outline" onClick={restart}>
                  New Set
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Story */}
            <div className="rounded-xl border bg-background p-5 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold">{currentStory.title}</h2>
                {currentStory.ageTag ? (
                  <Badge variant="secondary" className="rounded-full">
                    Ages {currentStory.ageTag}
                  </Badge>
                ) : null}
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">{currentStory.text}</p>
            </div>

            {/* Question */}
            <div className="space-y-3">
              <p className="text-lg font-semibold">{currentQuestion.prompt}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.choices.map((c, i) => {
                  const isSelected = selected === i
                  const isCorrect = i === correctIndex

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
                  <p className="text-sm text-muted-foreground">
                    Want more? Click “New Set” to get fresh stories.
                  </p>
                  <div className="flex justify-center gap-2 pt-2">
                    <Button onClick={restart}>Play Again</Button>
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

        <p className="text-xs text-muted-foreground text-center">
          No-repeat rule: stories won’t repeat until you finish all stories (saved in your browser).
        </p>
      </main>
    </div>
  )
}
