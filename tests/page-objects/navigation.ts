import { expect, Locator, Page } from '@playwright/test';

export class Navigation {
  private readonly page: Page;
  private readonly nav: Locator;

  constructor(thePage: Page) {
    this.page = thePage;
    this.nav = this.page.locator('nav');
  }

  async isInViewport(element): Promise<boolean> {
    const visibleRatio: number = await new Promise(resolve => {
      const observer = new IntersectionObserver(entries => {
        resolve(entries[0].intersectionRatio);
        observer.disconnect();
      });
      observer.observe(element);
      // Firefox doesn't call IntersectionObserver callback unless
      // there are rafs.
      requestAnimationFrame(() => {});
    });
    return visibleRatio > 0;
  }

  async clickLink(link: string): Promise<void> {
    await this.nav.locator(`text=${link}`).click();
  }

  async assertTargetInViewport(locator: Locator): Promise<void> {
    expect(await locator.evaluate(this.isInViewport)).toBeTruthy();
  }
}
