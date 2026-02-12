export type AgeTag = "6-8" | "8-10"

export type ScienceCard = {
  id: string
  ageTag: AgeTag
  statement: string
  isTrue: boolean
  funFact: string
}

export const SCIENCE_BANK: ScienceCard[] = [
  // 6–8 (simple + friendly)
  { id: "c1", ageTag: "6-8", statement: "Plants need sunlight to grow.", isTrue: true, funFact: "Plants make food using sunlight. 🌱☀️" },
  { id: "c2", ageTag: "6-8", statement: "A whale is a fish.", isTrue: false, funFact: "Whales are mammals and breathe air. 🐋" },
  { id: "c3", ageTag: "6-8", statement: "Water can be solid, liquid, or gas.", isTrue: true, funFact: "Ice, water, and steam are all water! 💧" },
  { id: "c4", ageTag: "6-8", statement: "The Moon makes its own light.", isTrue: false, funFact: "The Moon reflects sunlight like a mirror. 🌙" },
  { id: "c5", ageTag: "6-8", statement: "Birds have feathers.", isTrue: true, funFact: "Feathers help birds fly and stay warm. 🪶" },
  { id: "c6", ageTag: "6-8", statement: "Spiders have six legs.", isTrue: false, funFact: "Spiders have eight legs! 🕷️" },
  { id: "c7", ageTag: "6-8", statement: "Sound travels through air.", isTrue: true, funFact: "Sound is made by vibrations we can hear. 🔊" },
  { id: "c8", ageTag: "6-8", statement: "All rocks are soft like pillows.", isTrue: false, funFact: "Most rocks are hard and strong. 🪨" },
  { id: "c9", ageTag: "6-8", statement: "A caterpillar can become a butterfly.", isTrue: true, funFact: "That change is called metamorphosis. 🐛➡️🦋" },
  { id: "c10", ageTag: "6-8", statement: "The Sun is a planet.", isTrue: false, funFact: "The Sun is a star! ⭐" },

  // 8–10 (slightly deeper facts)
  { id: "c11", ageTag: "8-10", statement: "Lightning is seen before thunder because light travels faster than sound.", isTrue: true, funFact: "That’s why you see ⚡ before you hear 🔊." },
  { id: "c12", ageTag: "8-10", statement: "Earth’s gravity pulls objects toward the center of Earth.", isTrue: true, funFact: "Gravity keeps us on the ground. 🌍" },
  { id: "c13", ageTag: "8-10", statement: "Humans have 2 hearts.", isTrue: false, funFact: "Humans have 1 heart. Octopuses have 3! 🐙❤️❤️❤️" },
  { id: "c14", ageTag: "8-10", statement: "Some materials are magnetic, like iron.", isTrue: true, funFact: "Magnets attract some metals. 🧲" },
  { id: "c15", ageTag: "8-10", statement: "A day on Venus is longer than a year on Venus.", isTrue: true, funFact: "Venus spins very slowly compared to its orbit. 🪐" },
  { id: "c16", ageTag: "8-10", statement: "All planets have the same number of moons.", isTrue: false, funFact: "Some have many moons, some have none. 🌙" },
  { id: "c17", ageTag: "8-10", statement: "Evaporation turns liquid water into water vapor.", isTrue: true, funFact: "That’s part of the water cycle. 💧☁️" },
  { id: "c18", ageTag: "8-10", statement: "Friction can make things slow down.", isTrue: true, funFact: "Friction happens when surfaces rub together. 🛷" },
  { id: "c19", ageTag: "8-10", statement: "Dinosaurs and humans lived at the same time.", isTrue: false, funFact: "Dinosaurs lived millions of years before humans. 🦖" },
  { id: "c20", ageTag: "8-10", statement: "Some volcano rocks form when lava cools quickly.", isTrue: true, funFact: "Fast cooling can make rocks like obsidian. 🌋🪨" },
]
