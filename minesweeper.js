class Cell {
            constructor(row, col) {
                this.row = row;
                this.col = col;
                this.isMine = false;
                this.isRevealed = false;
                this.isFlagged = false;
                this.adjacentMines = 0;
            }
        }

        class Board {
            constructor(rows, cols, numMines) {
                this.rows = rows;
                this.cols = cols;
                this.numMines = numMines;
                this.grid = [];
                this.gameOver = false;

                this.initializeBoard();
                this.placeMines();
                this.calculateAdjacentMines();
            }

            initializeBoard() {
                for (let i = 0; i < this.rows; i++) {
                    this.grid[i] = [];
                    for (let j = 0; j < this.cols; j++) {
                        this.grid[i][j] = new Cell(i, j);
                    }
                }
            }

            placeMines() {
                let minesPlaced = 0;
                while (minesPlaced < this.numMines) {
                    const row = Math.floor(Math.random() * this.rows);
                    const col = Math.floor(Math.random() * this.cols);
                    if (!this.grid[row][col].isMine) {
                        this.grid[row][col].isMine = true;
                        minesPlaced++;
                    }
                }
            }

            calculateAdjacentMines() {
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.cols; j++) {
                        if (!this.grid[i][j].isMine) {
                            let count = 0;
                            for (let di = -1; di <= 1; di++) {
                                for (let dj = -1; dj <= 1; dj++) {
                                    const ni = i + di;
                                    const nj = j + dj;
                                    if (ni >= 0 && ni < this.rows && nj >= 0 && nj < this.cols && this.grid[ni][nj].isMine) {
                                        count++;
                                    }
                                }
                            }
                            this.grid[i][j].adjacentMines = count;
                        }
                    }
                }
            }

            revealCell(row, col) {
                if (row < 0 || row >= this.rows || col < 0 || col >= this.cols || this.grid[row][col].isRevealed || this.grid[row][col].isFlagged) {
                    return;
                }

                this.grid[row][col].isRevealed = true;

                if (this.grid[row][col].isMine) {
                    this.gameOver = true;
                    return;
                }

                if (this.grid[row][col].adjacentMines === 0) {
                    for (let di = -1; di <= 1; di++) {
                        for (let dj = -1; dj <= 1; dj++) {
                            this.revealCell(row + di, col + dj);
                        }
                    }
                }
            }

            toggleFlag(row, col) {
                if (!this.grid[row][col].isRevealed) {
                    this.grid[row][col].isFlagged = !this.grid[row][col].isFlagged;
                }
            }

            checkWin() {
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.cols; j++) {
                        if (!this.grid[i][j].isMine && !this.grid[i][j].isRevealed) {
                            return false;
                        }
                    }
                }
                this.gameOver = true;
                return true;
            }
        }

        let board;

        function startGame() {
            const rows = parseInt(document.getElementById('rows').value);
            const cols = parseInt(document.getElementById('cols').value);
            const mines = parseInt(document.getElementById('mines').value);

            board = new Board(rows, cols, mines);
            renderBoard();
        }

        function restartGame() {
            if (board) {
                startGame();
            }
        }

        function renderBoard() {
            const boardElement = document.getElementById('board');
            boardElement.innerHTML = '';
            boardElement.style.setProperty('--cols', board.cols);

            for (let i = 0; i < board.rows; i++) {
                for (let j = 0; j < board.cols; j++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.row = i;
                    cell.dataset.col = j;
                    cell.addEventListener('click', handleLeftClick);
                    cell.addEventListener('contextmenu', handleRightClick);
                    boardElement.appendChild(cell);
                }
            }
        }

        function handleLeftClick(event) {
            if (board.gameOver) return;

            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);

            board.revealCell(row, col);
            updateBoard();

            if (board.gameOver) {
                revealAllMines();
                alert('Game Over!');
            } else if (board.checkWin()) {
                revealAllMines();
                alert('Congratulations! You won!');
            }
        }

        function handleRightClick(event) {
            event.preventDefault();
            if (board.gameOver) return;

            const row = parseInt(event.target.dataset.row);
            const col = parseInt(event.target.dataset.col);

            board.toggleFlag(row, col);
            updateBoard();
        }

        function updateBoard() {
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                const gridCell = board.grid[row][col];

                cell.className = 'cell';
                cell.textContent = '';

                if (gridCell.isRevealed) {
                    cell.classList.add('revealed');
                    if (gridCell.isMine) {
                        cell.classList.add('mine');
                        cell.textContent = '💣';
                    } else if (gridCell.adjacentMines > 0) {
                        cell.textContent = gridCell.adjacentMines;
                    }
                } else if (gridCell.isFlagged) {
                    cell.classList.add('flagged');
                }
            });
        }

        function revealAllMines() {
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                const gridCell = board.grid[row][col];

                if (gridCell.isMine) {
                    cell.classList.add('revealed', 'mine');
                    cell.textContent = '💣';
                }
            });
        }

        startGame();
