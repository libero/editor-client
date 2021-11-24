import { expect, Locator, Page } from '@playwright/test';

export class Keywords {
  private readonly page: Page;
  private readonly keywords: Locator;

  constructor(thePage: Page) {
    this.page = thePage;
    this.keywords = this.page.locator('section:below(label:has-text("Keywords"))');
  }

  async addKeywords(keywords: string[], keywordsNumber: 0 | 1): Promise<void> {
    for(let i = 0; i < keywords.length; i++) {
      await this.keywords.nth(keywordsNumber).locator('div[contenteditable=true]').last().type(keywords[i]);
      await this.keywords.nth(keywordsNumber).locator('div[contenteditable=true]').last().press('Enter');
    }
  }

  async assertKeywords(keywords: string[], keywordsNumber: number): Promise<void> {
    for(let i = 0; i < keywords.length; i++) {
      await expect(this.keywords.nth(keywordsNumber)).toContainText(keywords[i]);
    }
  }

  async editKeyword(existingKeyword: string, newKeyword: string, keywordsNumber: 0 | 1): Promise<void> {
    const existingLocator = this.keywords.nth(keywordsNumber).locator(`text="${existingKeyword}"`);
    await existingLocator.dblclick();
    await existingLocator.fill(newKeyword);
    await expect(this.keywords.nth(keywordsNumber).locator(`text="${newKeyword}"`)).toBeVisible();
  }

  async deleteKeyword(keywordToDelete: number, keywordsNumber: 0 | 1): Promise<void> {
    const keywords = this.keywords.nth(keywordsNumber);
    const keywordsContainer = keywords.locator('[data-test-id="keyword-container"]');
    const keywordCount = await keywordsContainer.count();
    await this.page.waitForTimeout(500);
    await keywordsContainer.nth(keywordToDelete).locator('button').click();
    const actual = await keywordsContainer.count();
    await this.page.waitForTimeout(500);
    expect(actual).toBeLessThan(keywordCount);
  }
}
