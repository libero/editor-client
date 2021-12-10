import { expect, Locator, Page } from '@playwright/test';

type Affiliation = {
  institution: string;
  city: string;
  country: string;
}

export class Affiliations {
  private page: Page;
  readonly addButton: Locator;
  readonly editButton: Locator;
  readonly authorAffiliations: Locator;
  readonly modal: {
    title: Locator;
    institution: Locator;
    city: Locator;
    country: Locator;
    affiliatedAuthor: Locator;
    addAuthor: Locator;
    deleteAuthor: Locator;
    done: Locator;
    delete: Locator;
  };
  readonly affiliations: Locator;

  constructor(thePage: Page) {
    this.page = thePage;
    this.addButton = this.page.locator('text=Add Affiliation');
    this.editButton = this.page.locator('#affiliations svg');
    this.authorAffiliations = this.page.locator('#authors span span sup');
    this.modal = {
      title: this.page.locator('#draggable-dialog-title'),
      institution: this.page.locator('[name="institution.name"]'),
      city: this.page.locator('[name="address.city"]'),
      country: this.page.locator('[name="country"]'),
      affiliatedAuthor: this.page.locator('.MuiSelect-select'),
      addAuthor: this.page.locator('.MuiDialog-root button:has-text("Add Author")'),
      deleteAuthor: this.page.locator('.MuiDialog-root div div div div div button'),
      done: this.page.locator('text=Done'),
      delete: this.page.locator('text=Delete'),
    };
    this.affiliations = this.page.locator('#affiliations');
  };

  async closeModal(done = true): Promise<void> {
    await this.page.click(`button:has-text("${done ? 'Done' : 'Cancel'}")`);
    const title = await this.modal.title;
    await expect(title).not.toBeVisible();
  }

  async addAffiliation({institution, city, country}: Affiliation, affiliatedAuthorName?: string): Promise<void> {
    await this.addButton.click();
    await this.modal.institution.fill(institution);
    await this.modal.city.fill(city);
    await this.modal.country.fill(country);
    if (affiliatedAuthorName) {
      await this.modal.affiliatedAuthor.click();
      await this.page.click(`text=${affiliatedAuthorName}`);
    }
    await this.closeModal();
  }

  async setInstitution(institution: string, affiliationNumber: number): Promise<void> {
    await this.editButton.nth(affiliationNumber).click();
    await this.modal.institution.fill(institution);
    await this.closeModal();
  }

  async assertInstitution(institution: string, affiliationNumber: number): Promise<void> {
    const affiliation = await this.affiliations.locator('li').nth(affiliationNumber);
    const affiliationText = await affiliation.locator('div').nth(1).textContent();
    expect(affiliationText.split(',')[0]).toBe(institution);
  }

  async setCity(city: string, affiliationNumber: number): Promise<void> {
    await this.editButton.nth(affiliationNumber).click();
    await this.modal.city.fill(city);
    await this.closeModal();
  }

  async assertCity(city: string, affiliationNumber: number): Promise<void> {
    const affiliation = await this.affiliations.locator('li').nth(affiliationNumber);
    await expect(affiliation.locator('div').nth(1)).toContainText(`, ${city}`);
  }

  async setCountry(country: string, affiliationNumber: number): Promise<void> {
    await this.editButton.nth(affiliationNumber).click();
    await this.modal.country.fill(country);
    await this.closeModal();
  }

  async assertCountry(country: string, affiliationNumber: number): Promise<void> {
    const affiliation = await this.affiliations.locator('li').nth(affiliationNumber);
    await expect(affiliation.locator('div').nth(1)).toContainText(`, ${country}`);
  }

  async assertAffiliation({ institution, city, country }: Affiliation, affiliationNumber: number): Promise<void> {
    const affiliation = await this.affiliations.locator('li').nth(affiliationNumber);
    const affiliationElement = await affiliation.locator('div').nth(1);
    await expect(affiliationElement).toHaveText(`${institution}, ${city}, ${country}`);
  }

  async addAuthor(affiliationNumber: number, authorName: string): Promise<void> {
    await this.editButton.nth(affiliationNumber).click();
    await this.modal.addAuthor.click();
    await this.modal.affiliatedAuthor.last().click();
    await this.page.locator('.MuiPopover-root li').locator(`text=${authorName}`).click();
    await this.closeModal();
  }

  async assertAuthorHasAffiliations(authorNumber: number, affiliationNumbers: number[]): Promise<void> {
    const authorAffiliations = this.authorAffiliations.nth(authorNumber);
    await expect(authorAffiliations).toHaveText(affiliationNumbers.join(','));
  }

  async deleteAuthor(affiliationNumber: number, authorNumber: number): Promise<void> {
    await this.editButton.nth(affiliationNumber).click();
    const authorName = await this.modal.affiliatedAuthor.nth(authorNumber).textContent();
    await this.modal.deleteAuthor.nth(authorNumber).click();
    await expect(this.modal.affiliatedAuthor.nth(authorNumber)).not.toHaveText(authorName);
  }

  async deleteAffiliation(affiliationNumber: number): Promise<void> {
    await this.editButton.nth(affiliationNumber).click();
    const affiliationCount = await this.affiliations.locator('li').count();
    await this.modal.delete.click();
    await this.page.click('text=Delete >> nth=1');
    const newAffiliationCount = await this.affiliations.locator('li').count();
    expect(affiliationCount).toBeGreaterThan(newAffiliationCount);
  }

  async affiliationCount(): Promise<number> {
    return this.affiliations.locator('li').count();
  }
}
