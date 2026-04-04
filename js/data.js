// Quiz Data — "What's in the Scoop?"
//
// Correct answers are embedded here for instant client-side scoring.
// The VISUAL reveal (which was correct) is still host-controlled —
// participants never see which ingredients were right until the host reveals.

var QUIZ_DATA = [
  {
    id: 1,
    name: "The Dark Knight",
    tagline: "A brooding scoop from the shadows...",
    image: "images/dark-knight.png",
    options: [
      "Coconut Milk", "Chocolate Bar", "Vegan Butter", "Salt",
      "Cinnamon", "Vanilla Extract", "Cocoa Powder", "Heavy Cream",
      "Sugar", "Coffee", "Condensed Milk", "Maple Syrup"
    ],
    correct: ["Coconut Milk", "Chocolate Bar", "Vegan Butter", "Salt", "Cinnamon", "Vanilla Extract"]
  },
  {
    id: 2,
    name: "Snow White",
    tagline: "The fairest scoop of them all...",
    image: "images/snow-white.png",
    options: [
      "Coconut Milk", "Salt", "Vanilla Extract", "Saffron",
      "Oreo", "Heavy Cream", "Sugar", "Vegan Butter",
      "Cinnamon", "Condensed Milk", "Almond Milk", "Honey"
    ],
    correct: ["Coconut Milk", "Salt", "Vanilla Extract", "Saffron", "Oreo"]
  },
  {
    id: 3,
    name: "Spongebob",
    tagline: "Who lives in a pineapple under the sea...",
    image: "images/sponge-bob.png",
    options: [
      "Oat Milk", "Salt", "Vanilla Extract", "Mango",
      "Lime", "Coconut Milk", "Sugar", "Coconut Cream",
      "Passion Fruit", "Lemon", "Condensed Milk", "Vegan Butter"
    ],
    correct: ["Oat Milk", "Salt", "Vanilla Extract", "Mango", "Lime"]
  }
];

// Scoring constants
var SCORING = {
  CORRECT_PICK: 100,
  WRONG_PICK: -50,
  TIME_BONUS_MAX: 500
};
