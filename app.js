let typingData = [];
let difficultyIndexes = {
  easy: 0,
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
  textSection.innerHTML = typingData["easy"][0].text;

  difficultyButtons.forEach((difficulty) => {
    difficulty.addEventListener("click", traverseText);
  });

  function traverseText(e) {
    let type = e.target.dataset.difficultyType; //EAST MEDIUM HARD

    if (typingData[type]) {
      //charIndex = 0; reset index after each text
      charIndex = 0;

      //difficultyIndexes[type]; easy=-1 , medium=-1 and hard=-1
      difficultyIndexes[type] =
        (difficultyIndexes[type] + 1) % typingData[type].length;

      let text = typingData[type][difficultyIndexes[type]].text;
      let id = typingData[type][difficultyIndexes[type]].id;
      characters = text.split("");

      letters = characters.map((ch) => `<span>${ch}</span>`).join("");

      textSection.innerHTML = `${letters} ID:${id}`;
    }
  }

  document.addEventListener("keydown", (e) => {
    let ch = e.key;

    allSpanElement = textSection.querySelectorAll("span");

    allSpanElement.forEach((span) => span.classList.remove("caret"));

    if (ch === "Backspace") {
      if (charIndex > 0) {
        charIndex--;
        allSpanElement[charIndex].classList.remove("correct", "in-correct");
        allSpanElement[charIndex].classList.add("caret");
      }

      return;
    }

    e.preventDefault();

    const isAlphabet = /^[a-zA-Z0-9\s.,!?'";:()\-]$/.test(ch);

    if (charIndex < allSpanElement.length) {
      allSpanElement[charIndex + 1].classList.add("caret");
    }

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
