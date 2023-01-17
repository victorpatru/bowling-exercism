export class Bowling {
  scoreArray: Array<number> = [];
  runningScore = 0;
  public roll(pins: number): void {
    this.scoreArray.push(pins);
  }

  private adjStrike(): void {
    const indexOfStrike: Array<number> = [];

    this.scoreArray.map((item, i): void => {
      if (item === 10) {
        indexOfStrike.push(i);
      }
    });

    indexOfStrike.forEach((i) => {
      if (i < 10 && this.scoreArray[i + 1] !== 10) {
        this.scoreArray[i + 1] *= 2;
        this.scoreArray[i + 2] *= 2;
      }
    });
  }

  private calcScore(): number {
    this.adjStrike();

    console.log(this.scoreArray);

    // Loop througth the game array
    for (let i = 0; i < this.scoreArray.length; i++) {
      // Check whether we have a spare
      // (eg. we managed to put all the pins down in the previous two steps)
      if (this.scoreArray[i - 2] + this.scoreArray[i - 1] === 10) {
        // Double the score of the roll precedding the spare ONLY if it's not the last one in the game
        if (i === this.scoreArray.length - 1) {
          this.runningScore += this.scoreArray[i];
        } else {
          this.runningScore += this.scoreArray[i] * 2;
        }
      }

      // Increment normally if no spare is found
      else {
        this.runningScore += this.scoreArray[i];
      }
    }

    return this.runningScore;
  }

  public score(): number {
    return this.calcScore();
  }
}
