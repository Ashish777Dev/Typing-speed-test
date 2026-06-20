let typingData = [];
let difficultyIndexes = {
  easy: -1,
  medium: -1,
  hard: -1,
};
let characters = [];
let letters;
let charIndex = 0;
let timerStarted = false;
let startTimer;
let gameIsRunning = false;
const difficultyButtons = document.querySelectorAll(".difficulty-btn");
const textSection = document.querySelector(".text-section");
const modalContent = document.querySelector(".modal-content");
const modal = document.querySelector(".modal");
const startBtn = document.getElementById("start-btn");
const timerValue = document.getElementById("timer-value");
const accuracyValue = document.getElementById("accuracy-value");

console.log(modal);
const loadData = async () => {
  try {
    const res = await fetch("./data.json");

    if (!res.ok) {
      throw new Error("There was a problem while loading data!");
    }

    const data = await res.json();
    typingData = data;

    traverseText("easy");
  } catch (error) {
    throw new Error("Failed to fetch data!");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  loadData();

  // Put your initEventListener() call here to ensure elements exist first
  initEventListener();
});

function addCaretToCurrentPosition() {
  let allSpan = textSection.querySelectorAll("span");
  let firstSpan = textSection.querySelector("span");

  if (firstSpan && allSpan.length > 0 && charIndex <= allSpan.length) {
    allSpan.forEach((el) => el.classList.remove("caret"));
    firstSpan.classList.add("caret");
  }
}

function startGame() {
  modalContent.style.display = "none";

  gameIsRunning = true;

  addCaretToCurrentPosition();
}

function initEventListener() {
  difficultyButtons.forEach((difficulty) => {
    difficulty.addEventListener("click", (e) => {
      //EAST MEDIUM HARD
      traverseText(e.target.dataset.difficultyType);
    });
  });

  document.addEventListener("keydown", handleTyping);
  modalContent.addEventListener("click", startGame);
  startBtn.addEventListener("click", startGame);
}

function traverseText(type) {
  //if typing game started disable traverse text
  if (gameIsRunning) return;

  //defaults to 'easy' type='easy'
  if (typingData[type]) {
    //charIndex = 0; reset index after each text
    charIndex = 0;

    //difficultyIndexes[type]; easy=-1 , medium=-1 and hard=-1
    difficultyIndexes[type] =
      (difficultyIndexes[type] + 1) % typingData[type].length;

    //         typingData['easy'][0].text
    let text = typingData[type][difficultyIndexes[type]].text;
    // let id = typingData[type][difficultyIndexes[type]].id;

    // split text and assign to a characters array
    characters = text.split("");

    //wraping each characters into a span element
    letters = characters.map((ch) => `<span>${ch}</span>`).join("");

    textSection.innerHTML = `${letters} `;

    addCaretToCurrentPosition();
  }
}

function handleTyping(e) {
  let ch = e.key;
  timer();

  // taking all span element
  const allSpanElement = textSection.querySelectorAll("span");

  //removing the previous 'caret' class of span element only one character should have blinking cursor caret
  allSpanElement.forEach((span) => span.classList.remove("caret"));

  //charIndex is greatet then 1 run if block else it will fall back to else block
  if (ch === "Backspace" && charIndex >= 1) {
    charIndex--;
    //reset visual state of each characters
    allSpanElement[charIndex].classList.remove("correct", "in-correct");
    allSpanElement[charIndex].classList.add("caret");

    return;
  }

  e.preventDefault();

  //check if user is typing alphabet or not
  const isAlphabet = /^[a-zA-Z0-9\s.,!?'";:()\-]$/.test(ch);

  //prevent caret to move out of bound
  if (charIndex + 1 >= allSpanElement.length) {
    allSpanElement[charIndex].classList.add("caret");
    return;
  }

  //if its valid then  move caret forward or else stay on current position
  allSpanElement[isAlphabet ? charIndex + 1 : charIndex].classList.add("caret");

  //if user has pressed the valid key then start the game and set modalContent display to none
  if (isAlphabet) {
    modalContent.style.display = "none";
    if (ch === allSpanElement[charIndex].innerText) {
      allSpanElement[charIndex].classList.add("correct");
      allSpanElement[charIndex].classList.remove("in-correct");
    } else {
      allSpanElement[charIndex].classList.add("in-correct");
      allSpanElement[charIndex].classList.remove("correct");
    }
    charIndex++;
  }
}

function timer() {
  if (timerStarted) return;
  timerStarted = true;

  let sec = 60;

  startTimer = setInterval(() => {
    sec--;
    timerValue.innerText = `00:${sec < 10 ? "0" + sec : sec}`;

    if (sec <= 0) {
      clearInterval(startTimer);
      gameIsRunning = false;
    }
  }, 1000);
}
