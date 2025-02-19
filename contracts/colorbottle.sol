// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ColorBottleGame {
    uint256[5] private bottles;
    uint256 private attempts;
    bool private gameWon;
    address private owner;

    event GuessResult(address player, uint256 correctPositions);

    constructor() {
        owner = msg.sender;
        _shuffleBottles();
    }

    function getCurrentArrangement() public view returns (uint256[5] memory) {
        return bottles;
    }

    function makeGuess(uint256[5] calldata guess) external returns (uint256) {
        require(!gameWon, "You have already won. Start a new game.");
        require(attempts < 5, "Maximum attempts reached. Game reset.");

        uint256 correctPositions = 0;
        for (uint256 i = 0; i < 5; i++) {
            if (bottles[i] == guess[i]) {
                correctPositions++;
            }
        }

        attempts++;

        if (correctPositions == 5) {
            gameWon = true;
        } else if (attempts == 5) {
            _shuffleBottles();
            attempts = 0;
        }

        emit GuessResult(msg.sender, correctPositions);
        return correctPositions;
    }

    function startNewGame() external {
        require(msg.sender == owner, "Only owner can restart the game.");
        _shuffleBottles();
        attempts = 0;
        gameWon = false;
    }

    function _shuffleBottles() private {
        for (uint256 i = 0; i < 5; i++) {
            bottles[i] = (uint256(keccak256(abi.encodePacked(block.timestamp, i))) % 5) + 1;
        }
    }
}
