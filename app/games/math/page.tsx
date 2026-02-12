function makeMathQuestion(level: number): Question {
  // difficulty ranges
  const max = level <= 1 ? 10 : level === 2 ? 20 : 50
  const min = 1

  // Choose operators by level
  // Easy: + and - only
  // Medium: +, -, ×
  // Hard: +, -, ×, ÷ (clean division)
  const ops =
    level <= 1 ? ["+", "-"] : level === 2 ? ["+", "-", "×"] : ["+", "-", "×", "÷"]

  const op = ops[Math.floor(Math.random() * ops.length)]

  let a = 0
  let b = 0 
  let correct = 0
  let prompt = ""

  if (op === "+") {
    a = Math.floor(Math.random() * max) + min
    b = Math.floor(Math.random() * max) + min
    correct = a + b
    prompt = `${a} + ${b} = ?`
  }

  if (op === "-") {
    // ✅ force positive (or zero) result
    a = Math.floor(Math.random() * max) + min
    b = Math.floor(Math.random() * max) + min
    if (b > a) [a, b] = [b, a] // swap so a >= b
    correct = a - b
    prompt = `${a} - ${b} = ?`
  }

  if (op === "×") {
    // keep multiplication smaller for kids
    const mulMax = level <= 1 ? 10 : level === 2 ? 12 : 15
    a = Math.floor(Math.random() * mulMax) + 1
    b = Math.floor(Math.random() * mulMax) + 1
    correct = a * b
    prompt = `${a} × ${b} = ?`
  }

  if (op === "÷") {
    // ✅ clean division: a = b * k so result is integer
    const bMax = level === 3 ? 12 : 10
    b = Math.floor(Math.random() * bMax) + 1
    const kMax = level === 3 ? 12 : 10
    const k = Math.floor(Math.random() * kMax) + 1
    a = b * k
    correct = k
    prompt = `${a} ÷ ${b} = ?`
  }

  // Build multiple choice answers
  const choicesSet = new Set<number>()
  choicesSet.add(correct)

  const spread = level <= 1 ? 5 : level === 2 ? 10 : 15

  while (choicesSet.size < 4) {
    const delta = Math.floor(Math.random() * (spread * 2 + 1)) - spread // [-spread..spread]
    const candidate = correct + (delta === 0 ? 1 : delta)
    if (candidate >= 0) choicesSet.add(candidate) // keep choices non-negative too
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
