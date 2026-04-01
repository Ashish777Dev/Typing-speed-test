let typingData = [];
let difficultyIndexes = {
  easy: -1,
  medium: -1,
  hard: -1,
};
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
      difficultyIndexes[type] =
        (difficultyIndexes[type] + 1) % typingData[type].length;

      let text = typingData[type][difficultyIndexes[type]].text;
      let id = typingData[type][difficultyIndexes[type]].id;
      textSection.innerText = `${text}   ID:${id}`;
    }
  }
}
