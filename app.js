let typingData = [];
let difficultyIndexes = {
  easy: -1,
  medium: -1,
  hard: -1,
};
let characters = [];
let allSpanElement;
let letters;
let charIndex = 0;
const difficultyButtons = document.querySelectorAll(".difficulty-btn");
const textSection = document.querySelector(".text-section");

const loadData = async () => {
  try {
    const res = await fetch("./data.json");
    const data = await res.json();

    if (!res.ok) {
      throw new Error("There was a problem while loading data!");
    }

    typingData = data;

    startGame();
  } catch (error) {
    throw new Error("Failed to fetch data!");
  }
};

loadData();

function startGame() {
  console.log(typingData);
  difficultyButtons.forEach((difficulty) => {
    difficulty.addEventListener("click", traverseText);
  });

  function traverseText(e) {
    let type = e.target.dataset.difficultyType; //EAST MEDIUM HARD

    if (typingData[type]) {
      //difficultyIndexes[type]; easy=-1 , medium=-1 and hard=-1
      difficultyIndexes[type] =
        (difficultyIndexes[type] + 1) % typingData[type].length;

      let text = typingData[type][difficultyIndexes[type]].text;
      characters = text.split("");

      letters = characters.map((ch) => `<span>${ch}</span>`).join("");

      textSection.innerHTML = letters;
    }
  }

  document.addEventListener("keydown", (e) => {
    let ch = e.key;

    if (ch === "Backspace") {
      if (charIndex > 0) {
        charIndex--;
        allSpanElement[charIndex].classList.remove("correct", "in-correct");
      }

      return;
    }

    e.preventDefault();

    allSpanElement = textSection.querySelectorAll("span");
    const isAlphabet = /^[a-zA-Z0-9\s.,!?'";:()\-]$/.test(ch);

    if (charIndex < allSpanElement.length && isAlphabet) {
      if (ch === allSpanElement[charIndex].innerText) {
        allSpanElement[charIndex].classList.add("correct");
        allSpanElement[charIndex].classList.remove("in-correct");
      } else {
        allSpanElement[charIndex].classList.add("in-correct");
        allSpanElement[charIndex].classList.remove("correct");
      }
      charIndex++;
    }
  });
}
