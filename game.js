const prompt = require('prompt-sync')();

class Player {
    constructor(id, name, position) {
        this.id = id;
        this.name = name;
        this.position = position;

        this.playerInfo = [this.id, this.name, this.position];
    }
}

class Dice {
    constructor(noOfDice, min, max) {
        this.noOfDices = noOfDice;
        this.min = min;
        this.max = max;
    }

    roll() {
        let number = 0;
        for (let i = 0; i < this.noOfDices; i++) {
            let random = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
            number += random;
        }
        return number;
    }
}

class Jumpers {
    constructor(boardSize, snakes, ladders) {
        this.boardSize = boardSize;
        this.snakes = snakes;
        this.ladders = ladders;
    }

    snakeFunction() {
        let mpSnakes = new Map();
        const maxPosition = this.boardSize * this.boardSize;
        const minStart = 1;
        const maxStart = maxPosition - 1;

        while (mpSnakes.size < this.snakes) {
            let start = Math.floor(Math.random() * (maxStart - minStart + 1)) + minStart;
            let end = Math.floor(Math.random() * (start - 1)) + 1;

            if (start > end && !mpSnakes.has(start)) {
                mpSnakes.set(start, end);
            }
        }

        return mpSnakes;
    }

    ladderFunction() {
        let mpLadders = new Map();
        const maxPosition = this.boardSize * this.boardSize;
        const minStart = 1;
        const maxStart = maxPosition - 1;

        while (mpLadders.size < this.ladders) {
            let start = Math.floor(Math.random() * (maxStart - minStart + 1)) + minStart;
            let end = Math.floor(start / this.boardSize) * this.boardSize + this.boardSize;

            if (end > maxPosition) {
                end = maxPosition;
            }

            if (start < end && !mpLadders.has(start)) {
                mpLadders.set(start, end);
            }
        }

        return mpLadders;
    }
}

class Board {
    constructor(boardSize, players, jumper, dice) {
        this.boardSize = boardSize;
        this.players = players;
        this.jumper = jumper;
        this.dice = dice;

        this.positions = new Map();
        for (let player of this.players) {
            this.positions.set(player.id, player.position);
        }

        this.finalCell = boardSize * boardSize;

        this.snakesMap = this.jumper.snakeFunction();
        this.laddersMap = this.jumper.ladderFunction();
    }


    //Automates the game and declares the winner immediately we provide the number of players and the players' names
    // startGame() {
    //     let front = 0;
    //     let winner = null;
    
    //     while (winner == null) {
    //         let rollValue = this.dice.roll();
    
    //         // Check if the player is at the starting position and needs a 6 to start
    //         if (this.players[front].position === 1 && rollValue !== 6 * this.dice.noOfDices) {
    //             front = (front + 1) % this.players.length;
    //             continue;
    //         }
    
    //         let newPos = this.players[front].position + rollValue;
    
    //         // Ensure the new position does not exceed the final cell
    //         if (newPos > this.finalCell) {
    //             newPos = this.players[front].position;
    //         }
    
    //         // Check for snakes or ladders
    //         if (this.snakesMap.has(newPos)) {
    //             this.players[front].position = this.snakesMap.get(newPos);
    //         } else if (this.laddersMap.has(newPos)) {
    //             this.players[front].position = this.laddersMap.get(newPos);
    //         } else {
    //             this.players[front].position = newPos;
    //         }
    
    //         // Check if the player has won
    //         if (this.players[front].position === this.finalCell) {
    //             console.log(`${this.players[front].name} is the winner!`);
    //             winner = this.players[front].name;
    //             break;
    //         }
    
    //         // Move to the next player
    //         front = (front + 1) % this.players.length;
    //     }
    // }


    // this one is for manual play and slight modifications are made to the automated version code 

    startGame() {
        let front = 0;
        let winner = null;
    
        // Game loop
        while (winner == null) {
            let currentPlayer = this.players[front];
    
            console.log(`${currentPlayer.name}'s turn!`);

            let rollValue = this.dice.roll();  // You can store the roll value here
        if (currentPlayer.position === 1 && rollValue !== 6 * this.dice.noOfDices) {
            // Skip the current player's turn if they rolled anything other than the maximum value
            console.log(`${currentPlayer.name} is at position 1 and didn't roll the max value. Skipping turn.`);
            if (front === this.players.length - 1) {
                front = 0;
            } else {
                front++;
            }
            continue;
        }
    
            // Manual dice roll by the player
            let roll = prompt(`${currentPlayer.name}, press Enter to roll the dice!`);  // User presses Enter to roll
            let diceRoll = this.dice.roll();
            console.log(`${currentPlayer.name} rolled a ${diceRoll}`);
    
            // Move the player based on dice roll
            let newPos = currentPlayer.position + diceRoll;
            if (newPos > this.finalCell) {
                console.log(`${currentPlayer.name} can't move beyond the final cell! Stay at position ${currentPlayer.position}`);
            } else {
                if (this.jumper.snakeFunction().has(newPos)) {
                    currentPlayer.position -= this.jumper.snakeFunction().get(newPos);
                    console.log(`${currentPlayer.name} landed on a snake! Moving to position ${currentPlayer.position}`);
                } else if (this.jumper.ladderFunction().has(newPos)) {
                    currentPlayer.position += this.jumper.ladderFunction().get(newPos);
                    console.log(`${currentPlayer.name} climbed a ladder! Moving to position ${currentPlayer.position}`);
                } else {
                    currentPlayer.position = newPos;
                    console.log(`${currentPlayer.name} moved to position ${currentPlayer.position}`);
                }
            }
    
            // Check if the current player has reached the final cell
            if (currentPlayer.position === this.finalCell) {
                console.log(`${currentPlayer.name} is the winner!`);
                winner = currentPlayer;
            }
    
            // Move to the next player
            front = (front + 1) % this.players.length;  // Move to next player after the current turn
        }
    }
}

//though players is defined by user before starting kind of dynamic the rest like jumper, dice,  board is given fixed values in the code insted it should be dynamic by user giving input.
// let numberOfPlayers = parseInt(prompt("Enter number of players: "));
// let players = [];

// for (let i = 0; i < numberOfPlayers; i++) {
//     let name = prompt(`Enter name for Player ${i + 1}: `);
//     players.push(new Player(i + 1, name, 1));
// }

// let jumper = new Jumpers(10, 7, 7);
// let dice = new Dice(1, 1, 6);
// let board = new Board(10, players, jumper, dice);

// board.startGame();

// the below is dynamic user input for players, jumper, dice and board
// Define the Player class (you may have this already)

   

// Function to manually initialize the game
function initializeGame() {
    // Prompt for number of players and their names
    let numPlayers = parseInt(prompt("Enter the number of players:"));
    let players = [];
    for (let i = 0; i < numPlayers; i++) {
        let name = prompt(`Enter name for Player ${i + 1}:`);
        players.push(new Player(i + 1, name, 1)); // Assuming players start at position 1
    }

    // Ask for board size, number of snakes, and number of ladders
    let boardSize = parseInt(prompt("Enter the board size (e.g., 10 for 10x10):"));
    let numSnakes = parseInt(prompt("Enter the number of snakes:"));
    let numLadders = parseInt(prompt("Enter the number of ladders:"));

    // Create the jumper, dice, and board
    let jumper = new Jumpers(boardSize, numSnakes, numLadders);
    let dice = new Dice(1, 1, 6); // One dice with values from 1 to 6
    let board = new Board(boardSize, players, jumper, dice);

    // Start the game
    board.startGame();
}

// Call the initializeGame function to start the game
initializeGame();
