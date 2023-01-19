export class Bowling {
  private runningScore = 0;
  private multiplierNext = 0;
  private multiplierNextNext = 0;
  private frame = 1;
  private runningFrame: Array<number> = [];

  private validateRoll(pins: number): void {
    if (pins < 0) {
      throw new Error("Negative roll is invalid");
    }
    if (pins > 10) {
      throw new Error("Pin count exceeds pins on the lane");
    }

    if (this.frame > 10 && this.multiplierNext === 0) {
      throw new Error("Cannot roll after game is over");
    }
  }

  static validateFrame(frame: Array<number>): void {
    if (frame.reduce((acc, val) => acc + val, 0) > 10) {
      throw new Error("Pin count exceeds pins on the lane");
    }
  }

  private validateScore(): void {
    if (
      this.frame < 10 ||
      (this.frame === 10 && this.runningFrame.length > 0) ||
      (this.frame > 10 && this.multiplierNext > 0)
    ) {
      throw new Error("Score cannot be taken until the end of the game");
    }
  }

  public roll(pins: number): void {
    // Checking that the number of pins is valid
    this.validateRoll(pins);

    // Create the current frame of [6], [4] => [6, 4]
    this.runningFrame = this.runningFrame.concat(pins);

    // Ensure that our current frame is a valid one
    Bowling.validateFrame(this.runningFrame);
    // "this.frame" here outputs 1, 1, 2, 2, 3, 3 etc...
    const filler = this.frame > 10 ? 1 : 0; // filler here is a boolean to represent whether we're still playing
    // "this.runningScore" === 6, 16, 16 ... 16
    // "this.multiplierNext" and "this.multiplierNextNext" allows us to keep track of the points we need to award to the current frame based on whether it was
    // eg. strike in the current frame => multiplierNext === 1 and multiplierNextNext === 1 as soon as we close the frame with the strike both multiplierNext === 0; multiplierNextNext === 0
    this.runningScore =
      this.runningScore + (1 + this.multiplierNext - filler) * pins;
    this.multiplierNext = this.multiplierNextNext;
    this.multiplierNextNext = 0;
    // -----

    // Calculate pins that were knocked eg. Frame 1 has 6 for the first roll and 4 for the second roll, it means that the frameTotal is 10
    const frameTotal = this.runningFrame.reduce((acc, val) => acc + val, 0);
    // Frame is complete only if we get a strike in the first roll of the frame OR we get to the end of the rolls of the frame (max 2 unless special case)
    if (frameTotal === 10 || this.runningFrame.length === 2) {
      // Strike
      // Can only happen whenever we're on the first roll of the frame
      // Allows us track of what we need to add to the frame with the
      if (this.runningFrame.length === 1) {
        if (this.frame < 11) {
          this.multiplierNextNext++;
        }
      }

      // Spare
      if (frameTotal === 10) {
        if (this.frame < 11) {
          this.multiplierNext++;
        }
      }

      // Reset Frame
      this.runningFrame = [];
      this.frame++;
    }
  }

  public score(): number {
    this.validateScore();
    return this.runningScore;
  }
}
