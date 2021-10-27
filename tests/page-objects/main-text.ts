import { expect, Locator, Page } from '@playwright/test';

export class MainText {
  private page: Page;
  readonly mainTextInput: Locator;

  constructor(thePage: Page) {
    this.page = thePage;
    this.mainTextInput = this.page.locator(`#mainText>div>div`);
  }

  async setText(content: string): Promise<void> {
    await this.mainTextInput.fill(content);
  }

  async assertText(content: string): Promise<void> {
    await expect(this.mainTextInput).toHaveText(content);
  }
}
