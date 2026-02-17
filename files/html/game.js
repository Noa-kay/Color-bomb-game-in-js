const board = document.getElementById('game-board');
const width = 8;
const colors = ['peach', 'mint', 'lavender', 'lemon', 'pink', 'skyblue'];
let boxes = [];
let selectedBox = null;
let moves = 0;
let score = 0;

const movesDisplay = document.getElementById('moves');
const scoreDisplay = document.getElementById('score');
const matchSound = document.getElementById('match-sound');

const urlParams = new URLSearchParams(window.location.search);
const levelParam = urlParams.get('level');

function getLevelNumber(value) {
    if (!value) return 1;
    const normalized = String(value).toLowerCase();
    if (normalized === 'easy') return 1;
    if (normalized === 'medium') return 2;
    if (normalized === 'hard') return 3;

    const parsed = parseInt(normalized, 10);
    if (Number.isNaN(parsed)) return 1;
    return Math.min(3, Math.max(1, parsed));
}

let level = getLevelNumber(levelParam);

let bombCount = 0;

console.log("Level is:", level, "Type:", typeof level);

switch (level) {
    case 1:
        bombCount = 3;
        moves = 15;
        break;
    case 2:
        bombCount = 5;
        moves = 10;
        break;
    case 3:
        bombCount = 7;
        moves = 12;
        break;
}


console.log("Level:", level, "Bombs:", bombCount, "Moves:", moves);

function createBoard() {
    const bombIndexes = [];
    while (bombIndexes.length < bombCount) {
        const randomIndex = Math.floor(Math.random() * width);
        if (!bombIndexes.includes(randomIndex)) {
            bombIndexes.push(randomIndex);
        }
    }
    for (let i = 0; i < width * width; i++) {
        const box = document.createElement('div');
        box.classList.add('box');

        if (i < width) {
            if (bombIndexes.includes(i)) {
                const bomb = document.createElement('img');
                bomb.src = '../../Extras/images/bomb.png';
                bomb.classList.add('bomb');
                box.appendChild(bomb);
                box.dataset.hasBomb = "true";
            } else {
                box.classList.add('empty');
            }
        } else {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            box.classList.add(randomColor);
        }

        box.dataset.index = i;
        box.addEventListener('click', handleBoxClick);
        board.appendChild(box);
        boxes.push(box);
    }
    preventInitialMatches();
    calculateMoves();
}

function calculateMoves() {
    document.getElementById('moves').textContent = moves;
}

// let totalBombs = 0;

function updateMovesDisplay() {
    document.getElementById('moves').textContent = moves;
}
calculateMoves();

function preventInitialMatches() {
    let hasMatch = true;
    while (hasMatch) {
        hasMatch = false;
        for (let i = width; i < boxes.length; i++) {
            const color = boxes[i].classList.contains('empty') ? null : boxes[i].classList[1];
            if (!color) continue;
            let rowMatch = [i];
            for (let j = i + 1; j % width !== 0 && boxes[j] && !boxes[j].classList.contains('empty') && boxes[j].classList[1] === color; j++) {
                rowMatch.push(j);
            }
            let colMatch = [i];
            for (let j = i + width; j < boxes.length && !boxes[j].classList.contains('empty') && boxes[j].classList[1] === color; j += width) {
                colMatch.push(j);
            }
            if (rowMatch.length >= 3 || colMatch.length >= 3) {
                hasMatch = true;
                break;
            }
        }
        if (hasMatch) {
            resetBoard();
        }
    }
}

function resetBoard() {
    for (let i = width; i < boxes.length; i++) {
        if (!boxes[i].classList.contains('empty')) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            boxes[i].classList.replace(boxes[i].classList[1], randomColor);
        }
    }
}

function handleBoxClick(event) {
    const clickedBox = event.currentTarget;

    if (!clickedBox) {
        return;
    }

    if (selectedBox !== null) {
        selectedBox.classList.remove('selected');
    }

    if (selectedBox === null) {
        selectedBox = clickedBox;
        selectedBox.classList.add('selected');
    } else {
        if (selectedBox === clickedBox) {
            selectedBox = null;
            return;
        }

        if (isAdjacent(selectedBox, clickedBox)) {
            const previousSelected = selectedBox;
            swapBoxes(previousSelected, clickedBox);
            fillEmptySpaces();
            selectedBox.classList.remove('selected');
            selectedBox = null;

            moves--;
            updateMovesDisplay();

            setTimeout(() => {
                if (checkForMatches()) {
                    updateBoard();
                } else {
                    checkEndOfTurnResult();
                }
            }, 300);
        } else {
            selectedBox = clickedBox;
            selectedBox.classList.add('selected');
        }
    }
}

function hasVisibleBombs() {
    return boxes.some(box => box && box.querySelector('img.bomb'));
}

function checkEndOfTurnResult() {
    if (moves > 0) {
        return;
    }

    if (hasVisibleBombs()) {
        window.location.href = 'game-over.html';
    } else {
        window.location.href = 'winner.html';
    }
}


function isAdjacent(box1, box2) {
    const index1 = parseInt(box1.dataset.index);
    const index2 = parseInt(box2.dataset.index);

    const row1 = Math.floor(index1 / width);
    const col1 = index1 % width;
    const row2 = Math.floor(index2 / width);
    const col2 = index2 % width;

    return (Math.abs(row1 - row2) === 1 && col1 === col2) || (Math.abs(col1 - col2) === 1 && row1 === row2);
}

function swapBoxes(box1, box2) {
    if (!box1 || !box2) return;

    if (box1.classList.contains('empty') || box2.classList.contains('empty')) {
        let emptyBox = box1.classList.contains('empty') ? box1 : box2;
        let coloredBox = box1.classList.contains('empty') ? box2 : box1;

        let color = coloredBox.classList[1];

        coloredBox.classList.remove(color);
        coloredBox.classList.add('empty');

        emptyBox.classList.remove('empty');
        emptyBox.classList.add(color);
    } else {
        let color1 = box1.classList[1];
        let color2 = box2.classList[1];

        box1.classList.replace(color1, color2);
        box2.classList.replace(color2, color1);
    }

    const bomb1 = box1.querySelector('img.bomb');
    const bomb2 = box2.querySelector('img.bomb');

    if (bomb1) {
        box1.removeChild(bomb1);
        box2.appendChild(bomb1);
    }
    if (bomb2) {
        box2.removeChild(bomb2);
        box1.appendChild(bomb2);
    }
    checkIfWin();
}


function checkForMatches() {
    let matchesFound = false;

    for (let i = width; i < boxes.length; i++) {
        if (boxes[i].classList.contains('empty')) continue;
        const color = boxes[i].classList[1];
        if (!color) continue;

        let rowMatch = [i];
        for (let j = i + 1; j % width !== 0 && boxes[j] && boxes[j].classList[1] === color; j++) {
            rowMatch.push(j);
        }

        let colMatch = [i];
        for (let j = i + width; j < boxes.length && boxes[j].classList[1] === color; j += width) {
            colMatch.push(j);
        }

        if (rowMatch.length >= 3) {
            rowMatch.forEach(index => boxes[index].classList.add('disappearing'));
            matchesFound = true;
            score += rowMatch.length;
            playMatchSound();
        }
        if (colMatch.length >= 3) {
            colMatch.forEach(index => boxes[index].classList.add('disappearing'));
            matchesFound = true;
            score += colMatch.length;
            playMatchSound();
        }
    }
    scoreDisplay.textContent = score;
    return matchesFound;
}

function playMatchSound() {
    matchSound.play().catch(err => {
        console.error('Failed to play match sound:', err);
    });
}

function playBombSound() {
    const bombSound = document.getElementById('bomb-sound');
    bombSound.currentTime = 0;
    bombSound.play().then(() => {
        console.log('Bomb sound played');
    }).catch(err => {
        console.error('Failed to play bomb sound:', err);
    });
}

function fillEmptySpaces() {
    for (let col = 0; col < width; col++) {
        for (let row = width - 1; row > 0; row--) {
            let index = row * width + col;
            if (boxes[index].classList.contains('empty')) {
                for (let r = row - 1; r >= 0; r--) {
                    let aboveIndex = r * width + col;
                    if (!boxes[aboveIndex].classList.contains('empty')) {
                        const color = boxes[aboveIndex].classList[1];

                        if (color) {
                            boxes[index].classList.remove('empty');
                            boxes[index].classList.add(color);
                            boxes[aboveIndex].classList.remove(color);
                        }
                        boxes[aboveIndex].classList.add('empty');
                        break;
                    }
                }
            }
        }
    }
}

function dropBomb() {
    let bombFalling = true;
    let bombRemoved = false;
    while (bombFalling) {
        bombFalling = false;
        for (let i = width * (width - 1) - 1; i >= 0; i--) {
            const bomb = boxes[i].querySelector('img.bomb');
            if (!bomb) continue;
            const row = Math.floor(i / width);
            if (row >= width - 2) {
                boxes[i].removeChild(bomb);
                playBombSound();
                bombRemoved = true;
            } else if (boxes[i + width] && boxes[i + width].classList.contains('empty')) {
                boxes[i].removeChild(bomb);
                boxes[i + width].appendChild(bomb);
                bombFalling = true;
            }
        }
    }

    if (bombRemoved) {
        checkIfWin();
    }
}

window.onload = () => {
    const audio = document.getElementById('background-music');
    const clickSound = document.getElementById('click-sound');

    document.body.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                console.log('Background music playing');
            }).catch(err => {
                console.error('Failed to play background music:', err);
            });
        }
        clickSound.play().catch(err => {
            console.error('Failed to play click sound:', err);
        });
    });
};

function createExplosionEffect(box) {
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.style.left = `${box.offsetLeft}px`;
    explosion.style.top = `${box.offsetTop}px`;
    board.appendChild(explosion);
    setTimeout(() => {
        explosion.remove();
    }, 500);
}

function removeBombAndCheckIfWin(box) {
    const bomb = box.querySelector('img.bomb');
    if (bomb) {
        box.removeChild(bomb);
        box.classList.remove('bomb');
        checkIfWin();
    }
}

function checkIfWin() {
    if (!hasVisibleBombs()) {
        window.location.href = 'winner.html';
    }
}

function updateBoard() {
    boxes.forEach(box => {
        if (box && box.classList.contains('disappearing')) {
            const bomb = box.querySelector('img.bomb');
            if (bomb) {
                const explosion = document.createElement('div');
                explosion.classList.add('bomb-explosion');

                const bombRect = bomb.getBoundingClientRect();
                explosion.style.left = `${bombRect.left + window.scrollX}px`;
                explosion.style.top = `${bombRect.top + window.scrollY}px`;

                document.body.appendChild(explosion);
                playBombSound();
                setTimeout(() => {
                    explosion.remove();
                    box.removeChild(bomb);
                    checkIfWin();
                }, 500);
            }
        }
        if (box && box.classList.contains('disappearing') && !box.querySelector('img.bomb')) {
            setTimeout(() => {
                box.classList.remove(box.classList[1]);
                box.classList.remove('disappearing');
                box.classList.add('empty');
            }, 500);
        }
    });
    setTimeout(() => {
        fillEmptySpaces();
        dropBomb();

        setTimeout(() => {
            if (checkForMatches()) {
                updateBoard();
            } else {
                checkEndOfTurnResult();
            }
        }, 300);
    }, 600);
}

createBoard();