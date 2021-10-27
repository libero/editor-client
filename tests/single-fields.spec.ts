import { test } from '@playwright/test';
import { SingleTextField } from './page-objects/single-text-field';

test.describe('single fields', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/?articleId=54296');
  });

  test.describe('fields are set to correct values', () => {
    test('title', async ({ page }) => {
      const field = new SingleTextField(page, 'title');
      await field.assertField('Epigenetics: A memory of longevity');
    });

    test('abstract', async ({ page }) => {
      const field = new SingleTextField(page, 'abstract');
      await field.assertField('Worms with increased levels of the epigenetic mark H3K9me2 have a longer lifespan that can be passed down to future generations.');
    });

    test('impact statement', async ({ page }) => {
      const field = new SingleTextField(page, 'impactStatement');
      await field.assertField('Worms with increased levels of the epigenetic mark H3K9me2 have a longer lifespan that can be passed down to future generations.');
    });

    test('acknowledgements', async ({ page }) => {
      const field = new SingleTextField(page, 'acknowledgements');
      await field.assertField('Enter acknowledgements');
    });
  });

  test.describe('edit fields', () => {
    test('title', async ({ page }) => {
      const field = new SingleTextField(page, 'title');
      const content = 'Infinity welcomes careful drivers';
      await field.setField(content);
      await field.assertField(content);
    });

    test('abstract', async ({ page }) => {
      const field = new SingleTextField(page, 'abstract');
      const content = 'The first lesson Lister learned about space travel was you should never try it. But Lister didn\'t have a choice. All he remembered was going on a birthday celebration pub crawl through London. When he came to his senses again, with nothing in his pockets but a passport in the name of Emily Berkenstein.';
      await field.setField(content);
      await field.assertField(content);
    });

    test('impact statement', async ({ page }) => {
      const field = new SingleTextField(page, 'impactStatement');
      const content = 'A novel based on BBC2\'s cult comedy series written by the writers of the "Spitting Image Book". Its humour features the epic adventures of a huge clapped-out old space ship with an equally clapped-out crew.';
      await field.setField(content);
      await field.assertField(content);
    });

    test('acknowledgements', async ({ page }) => {
      const field = new SingleTextField(page, 'acknowledgements');
      const content = 'Rob Grant & Doug Naylor';
      await field.setField(content);
      await field.assertField(content);
    });
  });
});
