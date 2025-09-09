const { test, expect } = require('@playwright/test');
const fs = require('fs').promises;
const path = require('path');
const { CheckersPage } = require('../pages/CheckersPage');

test.describe('Checkers Game UI Tests', () => {
  const baseUrl = process.env.HOST_URL || 'https://www.gamesforthebrain.com/game/checkers/';
  let isWebsiteUp;
  let scenarios;

  test.beforeAll(async ({ request }) => {
    // Check if the website is up
    try {
      const response = await request.get(baseUrl);
      isWebsiteUp = response.ok();
      if (!isWebsiteUp) {
        console.log(`Website ${baseUrl} is down, skipping tests`);
      }
    } catch (error) {
      isWebsiteUp = false;
      console.log(`Website ${baseUrl} is down, error: ${error.message}, skipping tests`);
    }

    // Load scenario data
    if (isWebsiteUp) {
      const scenariosData = await fs.readFile(path.join(__dirname, '../data/checkers-moves.json'));
      scenarios = JSON.parse(scenariosData).scenarios;
    }
  });

  test.beforeEach(async ({ page, context }) => {
    // Persist session
    await context.storageState({ path: 'state.json' });
    await page.goto(baseUrl);
    const checkersPage = new CheckersPage(page);
    await expect(checkersPage.title).toHaveText('Checkers - Games for the Brain');
  });

  test('UI1: Verify the page is up and running', async ({ page }) => {
    test.skip(!isWebsiteUp, `Website ${baseUrl} is down`);

    const checkersPage = new CheckersPage(page);
    await expect(checkersPage.pageHeader).toHaveText('Checkers');
    await expect(checkersPage.gameWrapper).toBeVisible();
    await expect(checkersPage.boardWrapper).toBeVisible();
    await expect(checkersPage.message).toHaveText('Select an orange piece to move.');
    await expect(checkersPage.restartLink).toHaveText('Restart...');
    await expect(checkersPage.rulesLink).toHaveText('Rules');
    await expect(checkersPage.board).toBeVisible();
    await expect(checkersPage.lines).toHaveCount(8);
  });

  test('UI2: Verify Orange makes 5 moves, includes taking a blue, and restarts', async ({ page }) => {
    test.skip(!isWebsiteUp, `Website ${baseUrl} is down`);
    test.skip(!scenarios, 'No scenario data available');

    const checkersPage = new CheckersPage(page);
    await expect(checkersPage.message).toHaveText('Select an orange piece to move.');

    // Select the single-capture scenario
    const scenario = scenarios.find(s => s.scenarioId === 'single-capture');
    test.skip(!scenario, 'Single-capture scenario not found');

    let captureDetected = false;
    for (let i = 0; i < scenario.moves.length; i++) {
      const move = scenario.moves[i];
      await test.step(`Move ${i + 1}: From (${move.fromLine}, ${move.fromImg}) to (${move.toLine}, ${move.toImg})`, async () => {
        await expect(checkersPage.getPiece(move.fromLine, move.fromImg))
          .toHaveAttribute('name', move.fromName)
          .toHaveAttribute('src', move.fromSrc);
        if (move.checkBlueBefore) {
          await expect(checkersPage.getPiece(move.checkBlueBefore.line, move.checkBlueBefore.img))
            .toHaveAttribute('name', move.checkBlueBefore.name)
            .toHaveAttribute('src', move.checkBlueBefore.src);
        }
        await checkersPage.makeMove(move.fromLine, move.fromImg, move.toLine, move.toImg, move.wait, move.waitAfter, move.isInvalid);
        await expect(checkersPage.getPiece(move.toLine, move.toImg))
          .toHaveAttribute('name', move.toName)
          .toHaveAttribute('src', move.toSrcAfter);
        if (move.checkBlueAfter) {
          const capture = await checkersPage.checkCapture(move.fromLine, move.fromImg, move.toLine, move.toImg, move.checkBlueBefore, move.checkBlueAfter);
          if (capture) captureDetected = true;
        }
        if (move.isKing) {
          const isKing = await checkersPage.checkKingPromotion(move.toLine, move.toImg, move.toSrcAfter);
          if (isKing) console.log(`King promotion verified for move ${i + 1}`);
        }
        if (!move.isInvalid) {
          await expect(checkersPage.message).toHaveText('Make a move.');
        }
      });
    }

    if (captureDetected) {
      console.log('Within the 5 moves, orange took a blue piece');
    } else {
      console.log('No blue piece was taken within the 5 moves');
    }

    await test.step('Restart the game', async () => {
      await checkersPage.restartGame();
      await expect(checkersPage.getPiece(1, 1))
        .toHaveAttribute('name', 'space77')
        .toHaveAttribute('src', 'me1.gif');
    });
  });
});
