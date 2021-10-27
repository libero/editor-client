import { test } from '@playwright/test';
import { Authors } from './page-objects/authors';

test.describe('authors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/?articleId=54296');
  });

  test('authors are set to correct values', async ({ page }) => {
    const authors = new Authors(page);
    await authors.assertAuthorName('Felicity Emerson', 0);
    await authors.assertAuthorName('Cheng-Lin Li', 1);
    await authors.assertAuthorName('Siu Sylvia Lee', 2);
  });

  test.describe('edit author', () => {
    test('Open and close modal', async ({ page }) => {
      const authors = new Authors(page);
      await authors.openModal(0);
      await authors.closeModal(false);
    });

    test('edit the name fields', async ({ page }) => {
      const authors = new Authors(page);
      await authors.setAuthorName({
        firstName: 'Arnold',
        lastName: 'Rimmer',
        suffix: 'Technician, Second Class'
      }, 0);
      await authors.assertAuthorName('Arnold Rimmer Technician, Second Class', 0);
    });

    test('edit the email field', async ({ page }) => {
      const authors = new Authors(page);
      await authors.setAuthorEmail('foo@foo.com', 0);
      await authors.assertAuthorEmail('foo@foo.com', 0);
    });

    test('edit competing interest fields', async ({ page }) => {
      const authors = new Authors(page);
      await authors.setCompetingInterest(true, 0, 'foo');
      await authors.assertCompetingInterest(true, 0 , 'foo');
    });

    const bio = 'In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.';
    test('edit the bio field', async ({ page }) => {
      const authors = new Authors(page);
      await authors.setBio(bio, 0);
      await authors.assertBio(bio, 0);
    });

    test('edit the orcid field', async ({ page }) => {
      const authors = new Authors(page);
      await authors.setOrcidId('12345', 0);
      await authors.assertOrcid('12345', 0);
    });

    test('add an affiliation', async ({ page }) => {
      const authors = new Authors(page);
      const affiliation = {
        institution: 'Jupiter Mining Corporation',
        city: 'Io',
        country: 'Jupiter',
      };
      await authors.addAffiliation(affiliation, 0);
      await authors.assertAffiliation(affiliation, 0);
    });

    test('edit corresponding author field', async ({ page }) => {
      const authors = new Authors(page);
      await authors.setCorrespondingAuthor(true, 0);
      await authors.assertCorrespondingAuthor(true, 0);
    });
  });

  test('add author', async ({ page }) => {
    const authors = new Authors(page);
    await authors.addAuthor({
      firstName: 'Arnold',
      lastName: 'Rimmer',
      suffix: 'Technician, Second Class'
    });
    await authors.assertAuthorName('Arnold Rimmer Technician, Second Class', 3);
  })

  test('delete author', async ({ page }) => {
    const authors = new Authors(page);
    await authors.deleteAuthor(0);
  });
});
