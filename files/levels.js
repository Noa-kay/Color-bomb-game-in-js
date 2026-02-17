document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".level-button");
    if (buttons.length) {
        buttons.forEach(button => {
            button.addEventListener("click", function () {
                const level = this.textContent.trim().toLowerCase();
                localStorage.setItem("difficulty", level);
                localStorage.setItem("currentLevel", 1);
                localStorage.setItem("remainingBombs", getLevelSettings(level, 1).bombCount);
                window.location.href = `./game.html?level=${level}`;
            });
        });
    } else {
        // startGame();
    }
});

// function startGame() {
//     let difficulty = localStorage.getItem("difficulty") || "medium";
//     let currentLevel = parseInt(localStorage.getItem("currentLevel")) || 1;
//     let settings = getLevelSettings(difficulty, currentLevel);

//     let maxMoves = settings.maxMoves;
//     let remainingBombs = parseInt(localStorage.getItem("remainingBombs")) || settings.bombCount;

//     document.body.innerHTML = `
//         <h1>משחק התאמות - שלב ${currentLevel}</h1>
//         <p>מהלכים שנותרו: <span id="moves">${maxMoves}</span></p>
//         <p>פצצות שנותרו: <span id="bombs">${remainingBombs}</span></p>
//         <button onclick="makeMove()">בצע מהלך</button>
//         <button onclick="useBomb()">השתמש בפצצה</button>
//         <button onclick="window.location.href='index.html'">חזור לבחירת רמה</button>
//     `;

//     localStorage.setItem("maxMoves", maxMoves);
// }

function getLevelSettings(difficulty, level) {
    let baseMoves = difficulty === "easy" ? 30 : difficulty === "medium" ? 20 : 10;
    let baseBombs = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 5;

    return {
        maxMoves: Math.max(5, baseMoves - (level - 1) * 2),
        bombCount: baseBombs + Math.floor(level / 2)
    };
}

function makeMove() {
    let moves = parseInt(localStorage.getItem("maxMoves")) || 0;
    if (moves > 1) {
        moves--;
        localStorage.setItem("maxMoves", moves);
        document.getElementById("moves").textContent = moves;
    } else {
        checkGameOver();
    }
}

function useBomb() {
    let bombs = parseInt(localStorage.getItem("remainingBombs")) || 0;
    if (bombs > 0) {
        bombs--;
        localStorage.setItem("remainingBombs", bombs);
        document.getElementById("bombs").textContent = bombs;
    }
    checkWin();
}

function checkGameOver() {
    let bombs = parseInt(localStorage.getItem("remainingBombs")) || 0;
    if (bombs > 0) {
        window.location.href = "game-over.html";
    }
}

function checkWin() {
    let bombs = parseInt(localStorage.getItem("remainingBombs")) || 0;
    if (bombs === 0) {
        window.location.href = "winner.html";
    }
}
