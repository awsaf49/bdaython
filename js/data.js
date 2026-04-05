// Quiz Data — "What's in the Scoop?"
//
// Correct answers are embedded here for instant client-side scoring.
// The VISUAL reveal (which was correct) is still host-controlled —
// participants never see which ingredients were right until the host reveals.

var QUIZ_DATA = [
  {
    id: 1,
    name: "Dark Knight",
    tagline: "A brooding scoop from the shadows...",
    image: "images/dark-knight.png",
    options: [
      "Coconut Milk", "Almond Milk", "Oat Milk", "Chocolate Bar", "Vegan Butter", "Salt",
      "Cinnamon", "Vanilla Extract", "Cocoa Powder", "Coffee", "Maple Syrup", "Honey",
      "Eggs"
    ],
    correct: ["Coconut Milk", "Chocolate Bar", "Vegan Butter", "Salt", "Cinnamon", "Vanilla Extract"]
  },
  {
    id: 2,
    name: "Snow White",
    tagline: "The fairest scoop of them all...",
    image: "images/snow-white.png",
    options: [
      "Coconut Milk", "Almond Milk", "Oat Milk", "Salt", "Vanilla Extract", "Saffron",
      "Oreo", "Vegan Butter", "Cinnamon", "Honey", "Maple Syrup"
    ],
    correct: ["Coconut Milk", "Salt", "Vanilla Extract", "Saffron", "Oreo"]
  },
  {
    id: 3,
    name: "Spongebob",
    tagline: "The sunshine above the sea...",
    image: "images/sponge-bob.png",
    options: [
      "Coconut Milk", "Almond Milk", "Oat Milk", "Salt", "Vanilla Extract", "Mango",
      "Lime", "Vegan Butter", "Orange", "Lemon"
    ],
    correct: ["Oat Milk", "Salt", "Vanilla Extract", "Mango", "Lime"]
  }
];

// Scoring constants
var SCORING = {
  CORRECT_PICK: 200,
  WRONG_PICK: -100,
  TIME_BONUS_MAX: 100
};
