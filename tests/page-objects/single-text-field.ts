import { expect, Locator, Page } from '@playwright/test';

export class SingleTextField {
  private page: Page;
  readonly field: Locator;

  constructor(thePage: Page, fieldId: string) {
    this.page = thePage;
    this.field = this.page.locator(`#${fieldId}>div>div`);
  }

  async setField(content: string): Promise<void> {
    await this.field.fill(content);
  }

  async typeField(content: string): Promise<void> {
    await this.field.type(content);
  }

  async assertField(content: string): Promise<void> {
    await expect(this.field).toHaveText(content);
  }
}
