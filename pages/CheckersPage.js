class CheckersPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('title');
    this.pageHeader = page.locator('div.page h1');
    this.gameWrapper = page.locator('div.gameWrapper');
    this.boardWrapper = page.locator('div.boardWrapper');
    this.message = page.locator('#message');
    this.restartLink = page.locator('p.footnote a').first();
    this.rulesLink = page.locator('p.footnote a').last();
    this.board = page.locator('#board');
    this.lines = page.locator('div.line');
  }

  getPiece(line, img) {
    return this.page.locator(`div.line:nth-child(${line}) img:nth-child(${img})`);
  }

  async waitForMovePrompt() {
    await this.page.waitForTimeout(1000); // Ensure UI is ready
    await expect(this.message).toHaveText('Make a move.');
  }

  async makeMove(fromLine, fromImg, toLine, toImg, wait, waitAfter, isInvalid = false) {
    if (!isInvalid) {
      await this.waitForMovePrompt();
    }
    await this.getPiece(fromLine, fromImg).click();
    await this.page.waitForTimeout(wait);
    await this.getPiece(toLine, toImg).click();
    await this.page.waitForTimeout(waitAfter);
  }

  async restartGame() {
    await this.restartLink.click();
    await this.page.waitForTimeout(2000);
  }

  async getBoardState(line, img) {
    const piece = this.getPiece(line, img);
    return {
      name: await piece.getAttribute('name'),
      src: await piece.getAttribute('src')
    };
  }

  async checkCapture(fromLine, fromImg, toLine, toImg, checkBlueBefore, checkBlueAfter) {
    let capture = false;
    if (checkBlueBefore && checkBlueAfter) {
      const beforeState = await this.getPiece(checkBlueBefore.line, checkBlueBefore.img).getAttribute('src');
      await this.makeMove(fromLine, fromImg, toLine, toImg, 1000, 1000, false);
      const afterState = await this.getPiece(checkBlueAfter.line, checkBlueAfter.img).getAttribute('src');
      if (beforeState === checkBlueBefore.src && afterState === checkBlueAfter.src) {
        console.log(`Capture detected: Blue piece at line ${checkBlueAfter.line}, img ${checkBlueAfter.img} taken by orange`);
        capture = true;
      }
    }
    return capture;
  }

  async checkKingPromotion(line, img, expectedSrc) {
    const state = await this.getBoardState(line, img);
    if (state.src === expectedSrc && expectedSrc === 'you2.gif') {
      console.log(`King promotion detected at line ${line}, img ${img}`);
      return true;
    }
    return false;
  }
}

module.exports = { CheckersPage };
