import { test } from '@playwright/test';
import { Keywords } from './page-objects/keywords';

test.describe('keywords', () => {
  let keywords: Keywords
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/?articleId=54296');
    keywords = new Keywords(page);
  });

  test('set first keywords field', async ({ page }) => {
    const testWords = ['Red Dwarf', 'Starbug', 'Blue Midget'];
    await keywords.addKeywords(testWords, 0);
    await keywords.assertKeywords(testWords, 0);
  });

  test('set second keywords field', async ({ page }) => {
    const testWords = ['Gelf', 'Emohawk', 'Siren', 'Simulant'];
    await keywords.addKeywords(testWords, 1);
    await keywords.assertKeywords(testWords, 1);
  });

  test('delete keywords', async ({ page }) => {
    await keywords.deleteKeyword(0, 0);
  });

  test('edit keyword', async ({ page }) => {
    await keywords.editKeyword(`aging`, `Red Dwarf`, 0);
    await keywords.editKeyword('C. elegans', 'Starbug', 1)
  });
});
