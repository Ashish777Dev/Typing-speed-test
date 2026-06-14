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
let timerStarted = false;
let startTimer;
const difficultyButtons = document.querySelectorAll(".difficulty-btn");
const textSection = document.querySelector(".text-section");
const modalContent = document.querySelector(".modal-content");
const startBtn = document.getElementById("start-btn");
const timerValue = document.getElementById("timer-value");
const accuracyValue = document.getElementById("accuracy-value");

const loadData = async () => {
  try {
    const res = await fetch("./data.json");

    if (!res.ok) {
      throw new Error("There was a problem while loading data!");
    }

    const data = await res.json();
    typingData = data;

    initEventListener();

    traverseText("easy");
  } catch (error) {
    throw new Error("Failed to fetch data!");
  }
};

loadData();

function addCaretToCurrentPosition() {
  let allSpan = textSection.querySelectorAll("span");
  let firstSpan = textSection.querySelector("span");

  if (firstSpan && allSpan.length > 0 && charIndex <= allSpan.length) {
    allSpan.forEach((el) => el.classList.remove("caret"));
    firstSpan.classList.add("caret");
  }
}
function initEventListener() {
  difficultyButtons.forEach((difficulty) => {
    difficulty.addEventListener("click", (e) => {
      //EAST MEDIUM HARD
      traverseText(e.target.dataset.difficultyType);
    });
  });

  document.addEventListener("keydown", handleTyping);
  textSection.addEventListener("click", () => {
    textSection.style.filter = "none";
    modalContent.style.display = "none";
  });

  startBtn.addEventListener("click", () => {
    textSection.style.filter = "none";
    modalContent.style.display = "none";

    // let firstSpan = textSection.querySelector("span");
    // let allSpanElement = textSection.querySelectorAll("span");

    // if (firstSpan) {
    //   allSpanElement[charIndex].classList.add("caret");
    // }
    addCaretToCurrentPosition();
  });
}

function traverseText(type) {
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

    // let firstSpan = textSection.querySelector("span");

    // if (firstSpan) {
    //   let span = textSection.querySelectorAll("span");

    //   //clear all the caret of previous text
    //   span.forEach((el) => el.classList.remove("caret"));

    //   firstSpan.classList.add("caret");
    // }
    addCaretToCurrentPosition();
  }
}

function handleTyping(e) {
  let ch = e.key;
  timer();

  // taking all span element
  allSpanElement = textSection.querySelectorAll("span");

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

  if (charIndex + 1 >= allSpanElement.length) {
    allSpanElement[charIndex].classList.add("caret");
    return;
  }

  //if its valid then  move caret forward or else stay on current position
  allSpanElement[isAlphabet ? charIndex + 1 : charIndex].classList.add("caret");

  if (
    allSpanElement.length > 0 &&
    charIndex < allSpanElement.length &&
    isAlphabet
  ) {
    // textSection.style.filter = isAlphabet ? "none" : "blur(1px)";
    // modalContent.style.display = isAlphabet ? "none" : "block";
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
    }
  }, 1000);
}
