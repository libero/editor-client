import { test } from '@playwright/test';
import { ArticleType, RelatedArticles } from './page-objects/related-articles';


test.describe('related articles', () => {
  let relatedArticles: RelatedArticles;

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/?articleId=54296');
    relatedArticles = new RelatedArticles(page);
    await page.waitForSelector('#title');
  });

  test('add a related article', async () => {
    await relatedArticles.addRelatedArticle('Salt: An epicure\'s delight', ArticleType.COMMENTARYARTICLE);
  });

  test('remove a related article', async () => {
    await relatedArticles.removeRelatedArticle(0);
  });

  test('edit a related article', async () => {
    await relatedArticles.editRelatedArticle(0, 'Salt: An epicure\'s delight', ArticleType.CORRECTEDARTICLE);
  });
});
