import { expect, Locator, Page } from '@playwright/test';

export enum ArticleType {
  ARTICLEREFERENCE = 'article-reference',
  COMMENTARY = 'commentary',
  COMMENTARYARTICLE = 'commentary-article',
  CORRECTEDARTICLE = 'corrected-article',
  RELATEDARTICLE = 'related-article',
}

export class RelatedArticles {
  private page: Page;
  readonly relatedArticles: Locator;
  readonly relatedArticle: Locator
  readonly addArticle: Locator;
  readonly modal: {
    articleDoi: Locator;
    articleType: Locator;
    done: Locator;
    cancel: Locator;
    delete: Locator;
  }


  constructor(thePage: Page) {
    this.page = thePage;
    this.relatedArticles = this.page.locator(`#realted-acticles`);
    this.relatedArticle = this.relatedArticles.locator('li');
    this.addArticle = this.page.locator('text="Add Article"');
    this.modal = {
      articleDoi: this.page.locator('[name=href]'),
      articleType: this.page.locator('.MuiSelect-select'),
      done: this.page.locator('text=DONE'),
      cancel: this.page.locator('text=CANCEL'),
      delete: this.page.locator('text=DELETE'),
    }
  }

  async addRelatedArticle(articleDoi: string, articleType: ArticleType): Promise<void> {
    await this.addArticle.click();
    await this.modal.articleDoi.fill(articleDoi);
    await this.modal.articleType.click();
    await this.page.locator(`li >> text="${articleType}"`).click();
    await this.modal.done.click();
    const expected = `doi: https://doi.org/${articleDoi} type: ${articleType}`
    const lastArticle = await this.relatedArticle.count();
    await expect(this.relatedArticle.nth(lastArticle - 1)).toContainText(expected);
  }

  async removeRelatedArticle(relatedArticleNumber: number): Promise<void> {
    const initialCount = await this.relatedArticle.count();
    await this.relatedArticle.nth(relatedArticleNumber).locator('button').click();
    await this.modal.delete.click();
    await this.page.locator('text=DELETE').last().click();
    const newCount = await this.relatedArticle.count();
    expect(newCount).toBeLessThan(initialCount);
  }

  async editRelatedArticle(relatedArticleNumber: number, articleDoi: string, articleType: ArticleType): Promise<void> {
    const relatedArticle = this.relatedArticle.nth(relatedArticleNumber);
    await relatedArticle.locator('button').click();
    await this.modal.articleDoi.fill(articleDoi);
    await this.modal.articleType.click();
    await this.page.locator(`li >> text="${articleType}"`).click();
    await this.modal.done.click();
    const expected = `doi: https://doi.org/${articleDoi} type: ${articleType}`
    await expect(relatedArticle).toContainText(expected);
  }
}

