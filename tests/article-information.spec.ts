import { test } from '@playwright/test';
import { ArticleInformation, SubjectOption } from './page-objects/article-information';

test.describe('article information', () => {
  let articleInformation: ArticleInformation;

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/?articleId=54296');
    articleInformation = new ArticleInformation(page);
  });

  test('article type is set to insight', async () => {
    await articleInformation.assertArticleType('Insight');
  })

  test('set subjects', async () => {
    await articleInformation.setSubjects(SubjectOption.Ecology, SubjectOption.ImmunologyAndInflammation);
    await articleInformation.assertSubjects(SubjectOption.Ecology, SubjectOption.ImmunologyAndInflammation);
  });

  test('set article doi', async () => {
    await articleInformation.setArticleDoi('additional001');
    await articleInformation.assertArticleDoi('additional001');
  });

  test('set publisher id', async () => {
    await articleInformation.setPublisherId('JMC');
    await articleInformation.assertPublisherId('JMC');
  });

  test('set elocation id', async () => {
    await articleInformation.setElocationId('2X4B 523P');
    await articleInformation.assertElocationId('2X4B 523P');
  });

  test('set volume', async () => {
    await articleInformation.setVolume('42');
    await articleInformation.assertVolume('42');
  });

  test('set published', async () => {
    await articleInformation.setPublished(new Date(2155, 10, 14));
    await articleInformation.assertPublished(new Date(2155, 10, 14));
  });

  test('set license type', async () => {
    await articleInformation.setLicenseType('CC-BY-4');
    await articleInformation.assertLicenseType('CC-BY-4');
  });
});
