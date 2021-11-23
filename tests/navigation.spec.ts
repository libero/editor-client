import { test, Page } from '@playwright/test';
import { MainText } from './page-objects/main-text';
import { Navigation } from './page-objects/navigation';

const setHeadingAndTestNavigation = async (page: Page, navigation: Navigation, heading: string): Promise<void> => {
  const mainText = new MainText(page);
  const text = 'To Ganymede and Titan';
  await mainText.setText(text);
  await mainText.selectText(text);
  await mainText.setTextHeading(heading);
  await navigation.clickLink(text);
  await navigation.assertTargetInViewport(page.locator(`#mainText>div>div`).locator(`text="${text}"`));
}

test.describe('navigation', () => {
  let navigation: Navigation;
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/?articleId=54296');
    navigation = new Navigation(page);
  });

  test('title', async ({ page }) => {
    await navigation.clickLink('Title');
    await navigation.assertTargetInViewport(page.locator('#title'));
  });

  test('authors', async ({ page }) => {
    await navigation.clickLink('Authors');
    await navigation.assertTargetInViewport(page.locator('#authors'));
  });

  test('affiliations', async ({ page }) => {
    await navigation.clickLink('Affiliations');
    await navigation.assertTargetInViewport(page.locator('#affiliations'));
  });

  test('abstract', async ({ page }) => {
    await navigation.clickLink('Abstract');
    await navigation.assertTargetInViewport(page.locator('#abstract'));
  });

  test('impact statement', async ({ page }) => {
    await navigation.clickLink('Impact statement');
    await navigation.assertTargetInViewport(page.locator('#impactStatement'));
  });

  test('acknowledgements', async ({ page }) => {
    await navigation.clickLink('Acknowledgements');
    await navigation.assertTargetInViewport(page.locator('#acknowledgements'));
  });

  test('references', async ({ page }) => {
    await navigation.clickLink('References');
    await navigation.assertTargetInViewport(page.locator('#references'));
  });

  test('author information', async ({ page }) => {
    await navigation.clickLink('Author information');
    await navigation.assertTargetInViewport(page.locator('#author-details'));
  });

  test('article info', async ({ page }) => {
    await navigation.clickLink('Article information');
    await navigation.assertTargetInViewport(page.locator('#article-info'));
  });

  test('related articles', async ({ page }) => {
    await navigation.clickLink('Related articles');
    await navigation.assertTargetInViewport(page.locator('#realted-acticles'));
  });

  test.describe('dynamic main text headings', () => {
    test('heading 1', async ({ page }) => {
      await setHeadingAndTestNavigation(page, navigation, 'Heading 1');
    });

    test('heading 2', async ({ page }) => {
      await setHeadingAndTestNavigation(page, navigation, 'Heading 2');
    });

    test('heading 3', async ({ page }) => {
      await setHeadingAndTestNavigation(page, navigation, 'Heading 3');
    });

    test('heading 4', async ({ page }) => {
      await setHeadingAndTestNavigation(page, navigation, 'Heading 4');
    });
  });
});