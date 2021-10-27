import { test } from '@playwright/test';
import { Affiliations } from './page-objects/affiliations';

const affiliation = {
  institution: 'Jupiter Mining Corporation',
  city: 'Io',
  country: 'Jupiter',
};

test.describe('affiliations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/?articleId=54296');
  });

  test('affiliations are set to correct values', async ({ page }) => {
    const affiliations = new Affiliations(page);
    await affiliations.assertAffiliation({
      institution: 'Biomedical and Biological Sciences Program, Cornell University',
      city: 'Ithaca',
      country: 'United States',
    }, 0);
  });

  test('add an affiliation', async ({ page }) => {
    const affiliations = new Affiliations(page);
    await affiliations.addAffiliation(affiliation);
    await affiliations.assertAffiliation(affiliation, 2);
  })

  test('edit institution', async ({ page }) => {
    const affiliations = new Affiliations(page);
    await affiliations.setInstitution(affiliation.institution, 0);
    await affiliations.assertInstitution(affiliation.institution, 0);
  });

  test('edit city', async ({ page }) => {
    const affiliations = new Affiliations(page);
    await affiliations.setCity(affiliation.city, 0);
    await affiliations.assertCity(affiliation.city, 0);
  })

  test('edit country', async ({ page }) => {
    const affiliations = new Affiliations(page);
    await affiliations.setCountry(affiliation.country, 0);
    await affiliations.assertCountry(affiliation.country, 0);
  })

  test('add an author', async ({ page }) => {
    const affiliations = new Affiliations(page);
    await affiliations.addAuthor(0, 'Cheng-Lin Li');
    await affiliations.assertAuthorHasAffiliations(0, [1,2]);
  })

  test('delete an author', async ({ page }) => {
    const affiliations = new Affiliations(page);
    await affiliations.deleteAuthor(1, 0);
  })

  test('delete an affiliation', async ({ page }) => {
    const affiliations = new Affiliations(page);
    await affiliations.deleteAffiliation(0);
  })
});
