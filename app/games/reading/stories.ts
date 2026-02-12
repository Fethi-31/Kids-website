export type StoryQuestion = {
  prompt: string
  choices: string[]
  correctIndex: number
}

export type Story = {
  id: string
  title: string
  text: string
  questions: StoryQuestion[]
  ageTag: "6-8" | "8-10"
}

export const STORY_BANK: Story[] = [
  {
    id: "s1",
    ageTag: "6-8",
    title: "Mila and the Lost Puppy",
    text:
      "Mila heard a tiny whimper behind a bush. She found a small puppy with a red collar. " +
      "Mila gave it water and read the tag: Buddy. She and Buddy walked door to door until they found Buddy’s home. " +
      "A boy opened the door and smiled. Mila felt proud and happy.",
    questions: [
      { prompt: "What did Mila hear?", choices: ["A tiny whimper", "A loud roar", "A song", "A bell"], correctIndex: 0 },
      { prompt: "What was the puppy’s name?", choices: ["Buddy", "Sunny", "Max", "Coco"], correctIndex: 0 },
    ],
  },
  {
    id: "s2",
    ageTag: "6-8",
    title: "The Blue Kite",
    text:
      "Sam flew a bright blue kite at the park with his sister, Lina. The kite danced in the wind. " +
      "The wind got stronger and the string slipped! Sam grabbed it and tied a small knot. “Teamwork!” Lina laughed.",
    questions: [
      { prompt: "Where did Sam fly the kite?", choices: ["Park", "School", "Store", "Kitchen"], correctIndex: 0 },
      { prompt: "What problem happened?", choices: ["String slipped", "Kite turned green", "Rain fell", "No wind"], correctIndex: 0 },
    ],
  },
  {
    id: "s3",
    ageTag: "6-8",
    title: "Tariq’s Tiny Train",
    text:
      "Tariq built a toy train track on the floor. The train kept stopping at one corner. Tariq looked closely and saw a loose piece. " +
      "He clicked it in place. The train zoomed around the track. Tariq smiled: “Fixed!”",
    questions: [
      { prompt: "What was Tariq building?", choices: ["A train track", "A cake", "A robot", "A boat"], correctIndex: 0 },
      { prompt: "Why did the train stop?", choices: ["Loose piece", "Too much wind", "No batteries", "A cat ate it"], correctIndex: 0 },
    ],
  },
  {
    id: "s4",
    ageTag: "6-8",
    title: "The Sticker Surprise",
    text:
      "Lina cleaned her room and found a lost sticker sheet under the bed. She shared stickers with her little brother. " +
      "He made a funny sticker face on a notebook. They both laughed.",
    questions: [
      { prompt: "Where did Lina find the stickers?", choices: ["Under the bed", "In the fridge", "In a shoe", "In a tree"], correctIndex: 0 },
      { prompt: "What did Lina do with the stickers?", choices: ["Shared them", "Threw them away", "Ate them", "Hid them"], correctIndex: 0 },
    ],
  },
  {
    id: "s5",
    ageTag: "6-8",
    title: "Nico and the Big Bubbles",
    text:
      "Nico dipped a bubble wand into soapy water. He blew gently and made a bubble as big as his head. " +
      "The bubble floated, shimmered, and popped with a tiny ‘plink’. Nico cheered.",
    questions: [
      { prompt: "What did Nico use?", choices: ["A bubble wand", "A pencil", "A spoon", "A shoe"], correctIndex: 0 },
      { prompt: "How did the bubble sound when it popped?", choices: ["Plink", "Boom", "Roar", "Ring"], correctIndex: 0 },
    ],
  },
  {
    id: "s6",
    ageTag: "6-8",
    title: "The Snack Swap",
    text:
      "Sara had apple slices. Omar had crackers. They decided to swap half and try something new. " +
      "Sara liked the crunch. Omar liked the sweet. They both said, “Good choice!”",
    questions: [
      { prompt: "What snack did Sara have?", choices: ["Apple slices", "Pizza", "Candy", "Soup"], correctIndex: 0 },
      { prompt: "What did they do?", choices: ["Swapped half", "Argued", "Lost lunch", "Ran away"], correctIndex: 0 },
    ],
  },
  {
    id: "s7",
    ageTag: "6-8",
    title: "The Quiet Turtle",
    text:
      "At the pond, Maya saw a turtle resting on a rock. She stayed quiet and watched from far away. " +
      "The turtle slowly slid into the water. Maya whispered, “Bye, turtle.”",
    questions: [
      { prompt: "Where was the turtle?", choices: ["On a rock", "In a tree", "On a swing", "In a box"], correctIndex: 0 },
      { prompt: "What did Maya do?", choices: ["Stayed quiet", "Chased it", "Threw stones", "Yelled"], correctIndex: 0 },
    ],
  },
  {
    id: "s8",
    ageTag: "6-8",
    title: "A Button for Grandpa",
    text:
      "Grandpa’s shirt button popped off. Aya found a small sewing kit. Grandpa showed her how to thread the needle. " +
      "Aya sewed the button back on. Grandpa smiled: “Thank you, helper.”",
    questions: [
      { prompt: "What broke on Grandpa’s shirt?", choices: ["A button", "A zipper", "A pocket", "A sleeve"], correctIndex: 0 },
      { prompt: "How did Aya help?", choices: ["Sewed it on", "Painted it", "Cut it", "Forgot it"], correctIndex: 0 },
    ],
  },
  {
    id: "s9",
    ageTag: "6-8",
    title: "The Missing Crayon",
    text:
      "Rami wanted the green crayon to draw grass. It was missing! He checked the box, then the desk, then the floor. " +
      "He found it under a paper. “There you are!” Rami said.",
    questions: [
      { prompt: "What color crayon was missing?", choices: ["Green", "Blue", "Red", "Black"], correctIndex: 0 },
      { prompt: "Where was it?", choices: ["Under a paper", "In the sink", "In a shoe", "Outside"], correctIndex: 0 },
    ],
  },
  {
    id: "s10",
    ageTag: "6-8",
    title: "The Sunny Hat",
    text:
      "It was very sunny. Hana forgot her hat at home. Her friend Ben offered a spare hat from his bag. " +
      "Hana put it on and said, “You saved my day!”",
    questions: [
      { prompt: "What was the weather?", choices: ["Sunny", "Snowy", "Stormy", "Foggy"], correctIndex: 0 },
      { prompt: "What did Ben share?", choices: ["A spare hat", "A bike", "A book", "A sandwich"], correctIndex: 0 },
    ],
  },

  // 8–10 (slightly longer, still kid-friendly)
  {
    id: "s11",
    ageTag: "8-10",
    title: "Nora’s Garden Surprise",
    text:
      "Nora planted seeds in a balcony box. Every morning she checked the soil and gave it a little water. " +
      "After a week, green sprouts appeared. Two weeks later, a bright yellow flower bloomed. " +
      "Nora realized her daily routine helped the plant grow strong.",
    questions: [
      { prompt: "What helped the plant grow?", choices: ["Daily care", "Shouting", "Ignoring it", "Snow"], correctIndex: 0 },
      { prompt: "What did Nora finally see?", choices: ["A yellow flower", "A blue car", "A big dog", "A new toy"], correctIndex: 0 },
    ],
  },
  {
    id: "s12",
    ageTag: "8-10",
    title: "The Library Helper",
    text:
      "Omar saw a sign: “Helpers Needed.” He returned books using a small cart and read shelf labels carefully. " +
      "He helped a younger kid find a dinosaur book. The librarian said, “You were kind and careful.” Omar felt proud.",
    questions: [
      { prompt: "How did Omar find the right shelf?", choices: ["He read labels", "He guessed", "He ran", "He asked a robot"], correctIndex: 0 },
      { prompt: "How did the librarian describe him?", choices: ["Kind and careful", "Lazy", "Noisy", "Sleepy"], correctIndex: 0 },
    ],
  },
  {
    id: "s13",
    ageTag: "8-10",
    title: "The Rainy Day Plan",
    text:
      "It rained all day, so Aisha made a ‘rainy day plan’: build a pillow fort, draw a comic, and bake banana muffins. " +
      "Soon the fort was cozy and the muffins smelled amazing. Aisha realized rainy days can still be great.",
    questions: [
      { prompt: "What made the day better?", choices: ["A plan", "Complaining", "Doing nothing", "Breaking things"], correctIndex: 0 },
      { prompt: "What did Aisha bake?", choices: ["Banana muffins", "Fish", "Bread only", "Ice"], correctIndex: 0 },
    ],
  },
  {
    id: "s14",
    ageTag: "8-10",
    title: "The Science Fair Poster",
    text:
      "Lea wanted her poster to be easy to read. She used big titles, neat drawings, and short bullet points. " +
      "When her friend tested it, they understood the project quickly. Lea learned: clear design helps people learn.",
    questions: [
      { prompt: "What helped people understand?", choices: ["Clear design", "Tiny text", "Messy colors", "No titles"], correctIndex: 0 },
      { prompt: "What did Lea use?", choices: ["Big titles", "Secret codes", "Invisible ink", "Only stickers"], correctIndex: 0 },
    ],
  },
  {
    id: "s15",
    ageTag: "8-10",
    title: "The Lost Homework",
    text:
      "Kai couldn’t find his homework. Instead of panicking, he made a list of places to check: backpack, desk, folder, and couch. " +
      "He found it inside a notebook. Kai learned that a calm checklist saves time.",
    questions: [
      { prompt: "What strategy helped Kai?", choices: ["A checklist", "Crying", "Running away", "Waiting"], correctIndex: 0 },
      { prompt: "Where was the homework?", choices: ["Inside a notebook", "In the fridge", "In a tree", "At the beach"], correctIndex: 0 },
    ],
  },
  {
    id: "s16",
    ageTag: "8-10",
    title: "The Team Puzzle",
    text:
      "Two friends raced to finish a 200-piece puzzle. They kept grabbing the same pieces and bumping elbows. " +
      "Then they decided: one person finds edge pieces, the other sorts colors. The puzzle went faster right away.",
    questions: [
      { prompt: "What made the puzzle faster?", choices: ["Sharing roles", "Arguing", "Hiding pieces", "Stopping"], correctIndex: 0 },
      { prompt: "What did one person collect?", choices: ["Edge pieces", "Candy", "Shoes", "Balloons"], correctIndex: 0 },
    ],
  },
  {
    id: "s17",
    ageTag: "8-10",
    title: "The Helpful Map",
    text:
      "On a class trip, the group needed the museum’s dinosaur room. Salma read the map legend and followed the arrows. " +
      "She guided her class to the right hallway. Everyone thanked her for staying focused.",
    questions: [
      { prompt: "What did Salma read?", choices: ["Map legend", "Comic book", "Recipe", "Ticket only"], correctIndex: 0 },
      { prompt: "Where were they going?", choices: ["Dinosaur room", "Swimming pool", "Cinema", "Zoo"], correctIndex: 0 },
    ],
  },
  {
    id: "s18",
    ageTag: "8-10",
    title: "The Friendly Debate",
    text:
      "In class, students debated: cats or dogs? Yuki listened first, then shared her reasons politely. " +
      "When someone disagreed, she said, “That’s a good point.” The teacher praised respectful speaking.",
    questions: [
      { prompt: "What did Yuki do first?", choices: ["Listened", "Shouted", "Laughed", "Left"], correctIndex: 0 },
      { prompt: "What did the teacher praise?", choices: ["Respectful speaking", "Being loud", "Interrupting", "Ignoring"], correctIndex: 0 },
    ],
  },
  {
    id: "s19",
    ageTag: "8-10",
    title: "The Recycling Captain",
    text:
      "Mina noticed bottles and paper mixed together. She made simple labels: Paper, Plastic, and Trash. " +
      "Soon, her family sorted waste faster. Mina felt like a ‘recycling captain’ helping the planet.",
    questions: [
      { prompt: "What did Mina create?", choices: ["Labels", "A rocket", "A new TV", "A sandwich"], correctIndex: 0 },
      { prompt: "What improved?", choices: ["Sorting waste", "Sleeping time", "Rainfall", "Video games"], correctIndex: 0 },
    ],
  },
  {
    id: "s20",
    ageTag: "8-10",
    title: "The Practice Song",
    text:
      "Rafi wanted to play a short song on the keyboard. He practiced slowly, one hand at a time. " +
      "Each day sounded a little better. After a week, he played the whole song smoothly and grinned.",
    questions: [
      { prompt: "How did Rafi practice?", choices: ["Slowly and step by step", "Only once", "Very fast", "Not at all"], correctIndex: 0 },
      { prompt: "What happened after a week?", choices: ["He played smoothly", "He forgot", "He broke it", "He stopped"], correctIndex: 0 },
    ],
  },
  {
    id: "s21",
    ageTag: "8-10",
    title: "The Mystery Footprints",
    text:
      "After rain, Tessa saw tiny footprints on the balcony. She followed them to a corner and found a small snail. " +
      "Tessa learned snails leave trails and move slowly, especially after wet weather.",
    questions: [
      { prompt: "What made the footprints?", choices: ["A snail", "A bird", "A cat", "A fish"], correctIndex: 0 },
      { prompt: "When do snails move more?", choices: ["After wet weather", "In desert heat", "Only at noon", "Never"], correctIndex: 0 },
    ],
  },
]
