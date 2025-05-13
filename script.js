const vLines = document.querySelectorAll(".v-line");
const hLines = document.querySelectorAll(".h-line");
const boxes = document.querySelectorAll(".box");
const playerOneActive = document.getElementById("playerOneActive");
const playerTwoActive = document.getElementById("playerTwoActive");
const lineIndex = document.querySelectorAll(".line");
const restartBtn = document.getElementById("restartGame");
const crown = document.querySelector(".crown");
const result = document.getElementById("result");
const resultsBlocks = document.querySelectorAll(".results-row");
const winnerOne = document.querySelectorAll(".winner-one");
const winnerTwo = document.querySelectorAll(".winner-two");

const fullBoxes = [
    { top: 1, right: 5, bottom: 8, left: 4 },
    { top: 2, right: 6, bottom: 9, left: 5 },
    { top: 3, right: 7, bottom: 10, left: 6 },
    { top: 8, right: 12, bottom: 15, left: 11 },
    { top: 9, right: 13, bottom: 16, left: 12 },
    { top: 10, right: 14, bottom: 17, left: 13 },
    { top: 15, right: 19, bottom: 22, left: 18 },
    { top: 16, right: 20, bottom: 23, left: 19 },
    { top: 17, right: 21, bottom: 24, left: 20 },
];

let activePlayer = null;
let playerOnePoints = 0;
let playerTwoPoints = 0;
let currentGame = 0;
let gameWinner = null;

window.addEventListener("DOMContentLoaded", function () {
    activePlayer = playerOneActive;
    activePlayer.classList.add("active");

    [...vLines, ...hLines].forEach(line => {
        line.addEventListener("click", () => handleLineClick(line));
    });
});

function handleLineClick(line) {
    if (line.style.backgroundColor === "black") return;

    line.style.backgroundColor = "black";

    const completedBox = checkFullBox();

    if (!completedBox) {
        let nextPlayer = (activePlayer === playerOneActive) ? playerTwoActive : playerOneActive;
        nextPlayer.classList.add("active");
        activePlayer.classList.remove("active");
        activePlayer = nextPlayer;
    }

    if (isGameOver()) {
        playerOneActive.classList.remove("active");
        playerTwoActive.classList.remove("active");
        showWinner();
    }
}

function checkFullBox() {
    let boxCompleted = false;

    fullBoxes.forEach((box, index) => {
        const top = lineIndex[box.top - 1];
        const right = lineIndex[box.right - 1];
        const bottom = lineIndex[box.bottom - 1];
        const left = lineIndex[box.left - 1];

        if (
            top.style.backgroundColor === "black" &&
            right.style.backgroundColor === "black" &&
            bottom.style.backgroundColor === "black" &&
            left.style.backgroundColor === "black"
        ) {
            const boxElement = boxes[index];

            if (!boxElement.classList.contains("completed")) {
                boxElement.classList.add("completed");
                boxElement.style.backgroundColor =
                    activePlayer === playerOneActive ? "red" : "blue";

                if (activePlayer === playerOneActive) {
                    playerOnePoints += 1;
                } else {
                    playerTwoPoints += 1;
                }

                boxCompleted = true;
            }
        }
    });

    return boxCompleted;
}

function isGameOver() {
    return [...lineIndex].every(line => line.style.backgroundColor === "black");
}

function showWinner() {
    let winnerText = "";
    let winner = gameWinner;

    if (playerOnePoints > playerTwoPoints) {
        winner = playerOneActive;
        winnerText = "🏆 Player 1 won!";
    } else if (playerTwoPoints > playerOnePoints) {
        winner = playerTwoActive;
        winnerText = "🏆 Player 2 won!";
    } else {
        winnerText = "🤝 It's a draw!";
    }

    gameWinner = winner;

    result.textContent = winnerText;
    result.style.fontWeight = "bold";
    result.style.fontSize = "24px";

    setTimeout(() => restartGame(), 2000);
    setTimeout(() => showLocalStorage(), 2000);
}

function showLocalStorage() {
    if (currentGame < resultsBlocks.length) {
        resultsBlocks[currentGame].classList.remove("invisible");

        if (gameWinner === playerOneActive) {
            const crownImg = document.createElement("img");
            crownImg.src = "assets/img/crown.png";
            crownImg.classList.add("crown");
            winnerOne[currentGame].appendChild(crownImg);
        } else if (gameWinner === playerTwoActive) {
            const crownImg = document.createElement("img");
            crownImg.src = "assets/img/crown.png";
            crownImg.classList.add("crown");
            winnerTwo[currentGame].appendChild(crownImg);
        }

        currentGame++;

        if (currentGame === resultsBlocks.length) {
            setTimeout(() => {
                resultsBlocks.forEach((row, index) => {
                    row.classList.add("invisible");
                    winnerOne[index].innerHTML = "";
                    winnerTwo[index].innerHTML = "";
                });

                currentGame = 0;

            }, 1000);
        }
    }

    gameWinner = null;
}



 
function restartGame() {
    restartBtn.style.opacity = 1;
    restartBtn.addEventListener("click", () => {
        playerOnePoints = 0;
        playerTwoPoints = 0;

        
        boxes.forEach(box => {
            box.style.backgroundColor = "transparent";
            box.classList.remove("completed");
        });

        [...hLines, ...vLines].forEach(line => {
            line.style.removeProperty("background-color");
        });

        result.textContent = "";

        restartBtn.style.opacity = 0;

        activePlayer = playerOneActive;
        activePlayer.classList.add("active");
    }, {once: true});
}