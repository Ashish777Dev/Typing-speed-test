let typingData = [];

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
}
