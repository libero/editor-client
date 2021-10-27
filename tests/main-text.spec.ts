import { test } from '@playwright/test';
import { MainText } from './page-objects/main-text';

const content = `
    To Ganymede and Titan
    Yes, sir, I've been around
    But there ain't no place
    In the whole of Space
    Like that good ol' toddlin' town
    Oh! Lunar City Seven
    You're my idea of heaven
    Out of ten, you score eleven
    You good ol' Titan' town
    Oh! Lunar City Seven
    Lunar Cities One through Six
    They always get me down
    But Lunar City Seven
    You're my home town
  `;

test.describe('main-text', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/?articleId=54296');
  });

  test('edit body text', async ({ page }) => {
    const mainText = new MainText(page);
    await mainText.setText(content);
    await mainText.assertText(content);
  });
});