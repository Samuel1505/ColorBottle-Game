import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";

describe("ColorBottleGame", function () {
  let colorBottleGame: Contract;
  let owner: any;
  let player: any;

  beforeEach(async function () {
    [owner, player] = await ethers.getSigners();

    const ColorBottleGame = await ethers.getContractFactory("ColorBottleGame");
    colorBottleGame = await ColorBottleGame.deploy(); // Deploy the contract
    await colorBottleGame.waitForDeployment(); // Wait for deployment to complete
  });

  it("Should initialize with a random bottle arrangement", async function () {
    const initialArrangement: number[] = await colorBottleGame.getCurrentArrangement();
    expect(initialArrangement.length).to.equal(5);
  });

  it("Should allow a player to make a guess and return correct matches", async function () {
    const currentArrangement: number[] = await colorBottleGame.getCurrentArrangement();
    const correctGuess = [...currentArrangement]; // Making a correct guess

    const tx = await colorBottleGame.connect(player).makeGuess(correctGuess);
    const receipt = await tx.wait();
    
    const event = receipt.logs.find((log: any) =>
      log.fragment.name === "GuessResult"
    );

    expect(event.args.correctPositions).to.equal(5);
  });

  it("Should allow multiple guesses up to 5 attempts", async function () {
    for (let i = 0; i < 5; i++) {
      const guess = [1, 2, 3, 4, 5];
      await colorBottleGame.connect(player).makeGuess(guess);
    }
    await expect(colorBottleGame.connect(player).makeGuess([1, 2, 3, 4, 5])).to.be.revertedWith("Maximum attempts reached. Game reset.");
  });

  it("Should prevent further guesses after winning", async function () {
    const correctGuess = await colorBottleGame.getCurrentArrangement();

    await colorBottleGame.connect(player).makeGuess(correctGuess);
    await expect(colorBottleGame.connect(player).makeGuess(correctGuess)).to.be.revertedWith("You have already won. Start a new game.");
  });

  it("Should reset the game and shuffle bottles after 5 attempts", async function () {
    for (let i = 0; i < 5; i++) {
      await colorBottleGame.connect(player).makeGuess([1, 2, 3, 4, 5]);
    }

    const newArrangement = await colorBottleGame.getCurrentArrangement();
    expect(newArrangement.length).to.equal(5);
  });

  it("Should allow the owner to start a new game", async function () {
    await colorBottleGame.connect(owner).startNewGame();
    const newArrangement = await colorBottleGame.getCurrentArrangement();
    expect(newArrangement.length).to.equal(5);
  });
});
