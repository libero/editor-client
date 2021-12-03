import { test } from '@playwright/test';
import { Keywords } from './page-objects';

test.describe('keywords', () => {
  let keywords: Keywords
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/?articleId=54296');
    keywords = new Keywords(page);
    await page.waitForSelector('#title')
  });

  test('set first keywords field', async () => {
    const testWords = ['Red Dwarf', 'Starbug', 'Blue Midget'];
    await keywords.addKeywords(testWords, 0);
    await keywords.assertKeywords(testWords, 0);
  });

  test('set second keywords field', async () => {
    const testWords = ['Gelf', 'Emohawk', 'Siren', 'Simulant'];
    await keywords.addKeywords(testWords, 1);
    await keywords.assertKeywords(testWords, 1);
  });

  test('delete keywords', async () => {
    await keywords.deleteKeyword(0, 0);
  });

  test('edit keyword', async () => {
    await keywords.editKeyword(`aging`, `Red Dwarf`, 0);
    await keywords.editKeyword('C. elegans', 'Starbug', 1);
  });
});
