document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const restartBtn = document.getElementById('restart');
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let gameMode = 'player'; // 'player' or 'ai'

    // Winning combinations
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Initialize the game
    function initGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        status.textContent = `Player ${currentPlayer}'s Turn`;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner');
        });
    }

    // Handle cell click
    function handleCellClick(e) {
        const cell = e.target;
        const cellIndex = parseInt(cell.getAttribute('data-index'));

        // Check if cell is empty and game is active
        if (gameBoard[cellIndex] !== '' || !gameActive) return;

        // Make the move
        makeMove(cell, cellIndex);

        // Check for winner or draw
        const winner = checkWinner();
        if (winner) {
            if (winner === 'draw') {
                status.textContent = "It's a Draw!";
            } else {
                status.textContent = `Player ${winner} Wins!`;
                highlightWinningCells(winner);
            }
            gameActive = false;
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'O';
        status.textContent = `Player ${currentPlayer}'s Turn`;

        // If in AI mode and it's AI's turn
        if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
            setTimeout(makeAIMove, 500);
        }
    }

    // Make a move
    function makeMove(cell, index) {
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
    }

    // Check for winner or draw
    function checkWinner() {
        // Check for win
        for (const combination of winCombinations) {
            const [a, b, c] = combination;
            if (gameBoard[a] && 
                gameBoard[a] === gameBoard[b] && 
                gameBoard[a] === gameBoard[c]) {
                return gameBoard[a]; // Return the winner (X or O)
            }
        }

        // Check for draw
        if (!gameBoard.includes('')) {
            return 'draw';
        }

        return null; // No winner yet
    }

    // Highlight winning cells
    function highlightWinningCells(winner) {
        for (const combination of winCombinations) {
            const [a, b, c] = combination;
            if (gameBoard[a] === winner && 
                gameBoard[b] === winner && 
                gameBoard[c] === winner) {
                cells[a].classList.add('winner');
                cells[b].classList.add('winner');
                cells[c].classList.add('winner');
                break;
            }
        }
    }

    // AI move (simple implementation)
    function makeAIMove() {
        if (!gameActive) return;

        // Simple AI: find first available cell
        let emptyCells = [];
        gameBoard.forEach((cell, index) => {
            if (cell === '') emptyCells.push(index);
        });

        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const cellIndex = emptyCells[randomIndex];
            const cell = document.querySelector(`[data-index="${cellIndex}"]`);
            
            makeMove(cell, cellIndex);
            
            // Check for winner or draw
            const winner = checkWinner();
            if (winner) {
                if (winner === 'draw') {
                    status.textContent = "It's a Draw!";
                } else {
                    status.textContent = `Player ${winner} Wins!`;
                    highlightWinningCells(winner);
                }
                gameActive = false;
                return;
            }

            currentPlayer = 'X';
            status.textContent = `Player ${currentPlayer}'s Turn`;
        }
    }

    // Event Listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartBtn.addEventListener('click', initGame);

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            gameMode = button.getAttribute('data-mode');
            initGame();
        });
    });

    // Initialize the game
    initGame();
});