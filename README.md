# Color Bottle Game

## Overview
The **Color Bottle Game** is a simple smart contract implemented in Solidity. The contract generates a random arrangement of five numbered bottles and allows players to guess the correct order within five attempts. If the correct order is guessed, the game is won; otherwise, the game resets after five failed attempts.

## Features
- Randomly shuffles bottles at the start of a game.
- Players can guess the arrangement and receive feedback on how many positions are correct.
- Maximum of five attempts per game before resetting.
- The game owner can restart the game manually.

## Contract Details

### State Variables
- `bottles`: Stores the current shuffled bottle arrangement.
- `attempts`: Tracks the number of guesses made.
- `gameWon`: Indicates if the game has been won.
- `owner`: Stores the address of the contract deployer.

### Events
- `GuessResult(address player, uint256 correctPositions)`: Emitted after each guess, showing how many positions were correct.

### Functions

#### `getCurrentArrangement() → uint256[5] memory`
Returns the current shuffled bottle arrangement.

#### `makeGuess(uint256[5] calldata guess) → uint256`
- Players submit a guess of five numbers.
- Compares the guess with the actual arrangement.
- Returns the number of correctly positioned bottles.
- Emits `GuessResult` event.
- If the correct order is guessed, `gameWon` is set to true.
- If maximum attempts (5) are reached, the game resets.

#### `startNewGame()`
- Can only be called by the owner.
- Resets the game state and shuffles bottles.

#### `_shuffleBottles()` (Private Function)
- Randomly shuffles the bottles using a pseudo-random hash based on `block.timestamp`.

## Deployment & Usage
1. Deploy the `ColorBottleGame` contract.
2. Call `getCurrentArrangement()` to see the shuffled order.
3. Players can call `makeGuess()` with a five-number array to attempt guessing the order.
4. If a player correctly guesses the order, the game ends.
5. If all five attempts are used without success, the game resets.
6. The contract owner can call `startNewGame()` to reset manually.

## Security Considerations
- The `_shuffleBottles()` function uses `block.timestamp`, which is not fully random and can be influenced in certain scenarios.
- The contract does not have a way to prevent replay attacks or enforce turn-based participation.

## Future Improvements
- Implement Chainlink VRF for better randomness.
- Introduce multi-player competition.
- Add rewards or incentives for correct guesses.

