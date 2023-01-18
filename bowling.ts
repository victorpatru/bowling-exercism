const MAX_FRAME = 10;
const MAX_PINS = 10;

type ScoreModifier = {
  totalModifier: number;
  roundModifier: number;
};

export class Bowling {
  #_score: number;
  // Roll within our frame
  #_currentThrow: 1 | 2;
  #_currentFrame: number;
  #_currentRemainingPins: number;
  #_maxFillBall: 0 | 1 | 2;
  #_currentFillBall: number;
  #_scoreModifier: ScoreModifier;

  constructor() {
    this.#_score = 0;
    this.#_currentThrow = 1;
    this.#_currentFrame = 1;
    this.#_currentRemainingPins = MAX_PINS;
    this.#_scoreModifier = {
      totalModifier: 0,
      roundModifier: 0,
    };

    this.#_currentFillBall = 1;
    this.#_maxFillBall = 0;
  }

  private checkGameRules(pins: number): void {
    if (
      this.#_currentFrame > MAX_FRAME &&
      this.#_currentFillBall > this.#_maxFillBall
    ) {
      throw new Error("Cannot roll after game is over");
    }

    if (pins < 0) {
      throw new Error("Negative roll is invalid");
    }

    if (pins > MAX_PINS || pins > this.#_currentRemainingPins) {
      throw new Error("Pin count exceeds pins on the lane");
    }
  }

  private startNewFrame(): void {
    this.#_currentThrow = 1;
    this.#_currentFrame += 1;
    this.#_currentRemainingPins = MAX_PINS;
  }

  private progressCurrentFrame(pins: number): void {
    this.#_currentThrow = 2;
    this.#_currentRemainingPins = MAX_PINS - pins;
  }

  private checkIsStrike(pins: number): boolean {
    return pins === MAX_PINS && this.#_currentThrow === 1;
  }

  private checkIsSpare(pins: number): boolean {
    return pins === this.#_currentRemainingPins && this.#_currentThrow === 2;
  }

  private isFillBallFrame(): boolean {
    return this.#_maxFillBall > 0;
  }

  private handleSettingUpFillBall(params: {
    isStrike: boolean;
    isSpare: boolean;
  }): void {
    const { isStrike, isSpare } = params;
    this.#_maxFillBall += Number(isStrike) * 2 + Number(isSpare);
  }

  private increaseModifier(params: {
    isStrike: boolean;
    isSpare: boolean;
  }): void {
    const { isStrike, isSpare } = params;

    const strikePoint = Number(isStrike);
    const sparePoint = Number(isSpare);
    const totalModifierIncrement = strikePoint * 2 + sparePoint;
    const roundModifierIncrement = strikePoint + sparePoint;
    this.#_scoreModifier.totalModifier += totalModifierIncrement;
    this.#_scoreModifier.roundModifier += roundModifierIncrement;
  }

  private decreaseModifier(): void {
    const { totalModifier, roundModifier } = this.#_scoreModifier;
    const currentTotalModifier = totalModifier - roundModifier;
    this.#_scoreModifier = {
      totalModifier: currentTotalModifier,
      roundModifier:
        currentTotalModifier <= 1 || currentTotalModifier % 2 === 0
          ? currentTotalModifier
          : currentTotalModifier - 1,
    };
  }

  private isFinalFrame(): boolean {
    return this.#_currentFrame === MAX_FRAME;
  }

  private settlingCurrentFrame(params: {
    isStrike: boolean;
    isSpare: boolean;
    pins: number;
  }): void {
    const { isStrike, isSpare, pins } = params;
    this.decreaseModifier();

    if (this.isFillBallFrame()) {
      this.#_currentFillBall += 1;
    }

    if (this.isFinalFrame()) {
      this.handleSettingUpFillBall({
        isStrike,
        isSpare,
      });
    }

    if (isStrike || this.#_currentThrow === 2) {
      this.startNewFrame();
      if ((isStrike || isSpare) && !this.isFillBallFrame()) {
        this.increaseModifier({
          isStrike,
          isSpare,
        });
      }
    } else {
      this.progressCurrentFrame(pins);
    }
  }

  private calculateScore(pins: number): number {
    const { roundModifier } = this.#_scoreModifier;

    this.#_score = this.#_score + pins + roundModifier * pins;
    return this.#_score;
  }

  public roll(pins: number): number {
    this.checkGameRules(pins);
    const isStrike = this.checkIsStrike(pins);
    const isSpare = this.checkIsSpare(pins);

    this.calculateScore(pins);

    this.settlingCurrentFrame({
      isStrike,
      isSpare,
      pins,
    });

    return this.#_score;
  }

  private checkFetchingScoreAbility(): void {
    if (
      !(
        this.#_currentFrame > MAX_FRAME &&
        this.#_currentFillBall > this.#_maxFillBall
      )
    ) {
      throw new Error("Score cannot be taken until the end of the game");
    }
  }

  public score(): number {
    this.checkFetchingScoreAbility();
    return this.#_score;
  }
}
