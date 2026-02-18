const flipSound = new Audio("./CSS/JS/Assets/flip.mp3");
const flashSound = new Audio("./CSS/JS/Assets/flash.mp3");

flashSound.volume = 1.0;

const startBtn = document.getElementById("start-btn");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const gameBoard = document.getElementById("game-board");
const statsText = document.getElementById("stats-text");
const flashbang = document.getElementById("flashbang");

let cards = [];
let flippedCards = [];
let moves = 0;
let score = 0;
let combo = 1;
let timer = 45;
let timerInterval;

const images = [
    "img1.png","img2.png","img3.png","img4.png",
    "img5.png","img6.png","img7.png","img8.png"
];

function startGame() {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    moves = 0;
    score = 0;
    combo = 1;
    timer = 45;

    createBoard();
    startTimer();
    updateStats();
}

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timer--;
        updateStats();

        if (timer <= 0) {
            clearInterval(timerInterval);
            alert("TIME'S UP 💀");
            location.reload();
        }
    }, 1000);
}

function updateStats() {
    statsText.textContent =
        `Moves: ${moves} | Score: ${score} | Combo x${combo} | Time: ${timer}s`;
}

function createBoard() {
    gameBoard.innerHTML = "";
    cards = [...images, ...images];
    cards.sort(() => 0.5 - Math.random());

    cards.forEach(image => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-face card-front"></div>
            <div class="card-face card-back"
                style="background-image: url('./CSS/JS/Assets/${image}')">
            </div>
        `;

        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length === 2 || this.classList.contains("flip")) return;

    flipSound.currentTime = 0;
    flipSound.play();

    this.classList.add("flip");
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        checkMatch();
    }
}

function triggerFlashbang() {
    // Play sound
    flashSound.currentTime = 0;
    flashSound.play();

    flashbang.classList.remove("flash-active");
    document.body.classList.remove("flashed");

    void flashbang.offsetWidth;
    void document.body.offsetWidth;

    
    flashbang.classList.add("flash-active");
    document.body.classList.add("flashed");

    setTimeout(() => {
        flashbang.classList.remove("flash-active");
        document.body.classList.remove("flashed");
    }, 2200);
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    const img1 = card1.querySelector(".card-back").style.backgroundImage;
    const img2 = card2.querySelector(".card-back").style.backgroundImage;

    if (img1 === img2) {
        score += 20 * combo;
        combo++;
        flippedCards = [];
    } else {
        score -= 10;
        combo = 1;

        triggerFlashbang();

        setTimeout(() => {
            card1.classList.remove("flip");
            card2.classList.remove("flip");
            flippedCards = [];
        }, 600);
    }

    updateStats();
}

startBtn.addEventListener("click", startGame);






