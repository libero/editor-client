import { Locator, Page } from '@playwright/test';

export class History {
  private readonly page: Page;
  private readonly undo: Locator;
  private readonly redo: Locator;

  constructor(thePage: Page) {
    this.page = thePage;
    this.undo = this.page.locator('#undo');
    this.redo = this.page.locator('#redo');
  }

  async undoNTimes(actionsToUndo: number): Promise<void> {
    for(let i = 0; i < actionsToUndo; i++) {
      await this.undo.click();
    }
  }

  async redoNTimes(actionsToRedo: number): Promise<void> {
    for(let i = 0; i < actionsToRedo; i++) {
      await this.redo.click();
    }
  }
}
