const boardSize = 10; // 보드 크기
const mineCount = 15; // 지뢰 개수
const board = [];
const gameBoard = document.getElementById("game-board");

let timerInterval; // 타이머를 위한 interval
let startTime = null; // 게임 시작 시간


// 보드 초기화
function initBoard() {
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = { mine: false, revealed: false, flagged: false };
        }
    }

    // 지뢰 배치
    let placedMines = 0;
    while (placedMines < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            placedMines++;
        }
    }
}

// 보드 그리기
function drawBoard() {
    gameBoard.innerHTML = "";
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;

            cell.addEventListener("click", () => handleLeftClick(i, j));
            cell.addEventListener("contextmenu", (e) => handleRightClick(e, i, j));

            gameBoard.appendChild(cell);
        }
    }
}

// 주변 지뢰 개수 계산
function countMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (board[newRow][newCol].mine) {
                    count++;
                }
            }
        }
    }
    return count;
}

// 셀 클릭 처리
function handleLeftClick(row, col) {
    if (board[row][col].revealed || board[row][col].flagged) return;

    board[row][col].revealed = true;
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    cell.classList.add("revealed");

    if (board[row][col].mine) {
        cell.classList.add("mine");
        alert("Game Over!");
        return;
    }

    const mineCount = countMines(row, col);
    if (mineCount > 0) {
        cell.textContent = mineCount;
    } else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    handleLeftClick(newRow, newCol);
                }
            }
        }
    }
}

// 깃발 표시
function handleRightClick(event, row, col) {
    event.preventDefault();
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    if (!board[row][col].revealed) {
        board[row][col].flagged = !board[row][col].flagged;
        cell.classList.toggle("flagged");
    }
}

// 게임 시작
function startGame() {
    initBoard();
    drawBoard();
}

// 타이머 시작
function startTimer() {
    startTime = Date.now(); // 현재 시간을 저장
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("timer").textContent = `Time: ${elapsedTime}s`;
    }, 1000); // 1초마다 갱신
}

// 타이머 종료
function stopTimer() {
    clearInterval(timerInterval); // 타이머 정지
}

function handleLeftClick(row, col) {
    if (!startTime) {
        startTimer(); // 첫 클릭 시 타이머 시작
    }

    if (board[row][col].revealed || board[row][col].flagged) return;

    board[row][col].revealed = true;
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    cell.classList.add("revealed");

    if (board[row][col].mine) {
        cell.classList.add("mine");
        stopTimer(); // 게임 종료 시 타이머 멈춤
        alert("Game Over!");
        return;
    }

    const mineCount = countMines(row, col);
    if (mineCount > 0) {
        cell.textContent = mineCount;
    } else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    handleLeftClick(newRow, newCol);
                }
            }
        }
    }

    checkWin(); // 게임 승리 조건 확인
}

function checkWin() {
    let allRevealed = true;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (!board[i][j].mine && !board[i][j].revealed) {
                allRevealed = false;
            }
        }
    }

    if (allRevealed) {
        stopTimer(); // 게임 승리 시 타이머 정지
        alert(`You Win! Time: ${Math.floor((Date.now() - startTime) / 1000)}s`);
    }
}




startGame();
