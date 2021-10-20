import { expect, Locator, Page } from '@playwright/test';

type AuthorName = {
  firstName: string;
  lastName: string;
  suffix: string;
}

type Affiliation = {
  institution: string;
  city: string;
  country: string;
}

export class Authors {
  private page: Page;
  readonly addButton: Locator;
  readonly editButton: Locator;
  readonly authorName: Locator;
  readonly authorInformation: Locator;
  readonly modal: {
    title: Locator;
    heading: Locator;
    firstName: Locator;
    lastName: Locator;
    suffix: Locator;
    competingInterest: Locator;
    competingInterestStatement: Locator;
    competingInterestSelector: {
      hasCompetingInterest: Locator;
      noCompetingInterest: Locator;
    };
    bio: Locator;
    orcid: Locator;
    affiliation: Locator;
    addAffiliation: Locator;
    addAffiliationOption: Locator;
    newAffiliation: {
      institution: Locator;
      city: Locator;
      country: Locator;
      done: Locator;
    };
    delete: Locator;
  }

  constructor(thePage: Page) {
    this.page = thePage;
    this.addButton = this.page.locator('text=Add Author');
    this.editButton = this.page.locator('#authors svg');
    this.authorName = this.page.locator('#authors span span');
    this.authorInformation = this.page.locator('#author-details section');
    this.modal = {
      title: this.page.locator('#draggable-dialog-title'),
      heading: this.page.locator('#draggable-dialog-title h3'),
      firstName: this.page.locator('[name=firstName]'),
      lastName: this.page.locator('[name=lastName]'),
      suffix: this.page.locator('[name=suffix]'),
      competingInterest: this.page.locator('#mui-component-select-articleType'),
      competingInterestStatement: this.page.locator('[name=competingInterestStatement]'),
      competingInterestSelector: {
        hasCompetingInterest: this.page.locator('text=Has competing interest'),
        noCompetingInterest: this.page.locator('text=No competing interest'),
      },
      bio: this.page.locator('.MuiDialog-root .prosemirrorContainer [contenteditable=true]'),
      orcid: this.page.locator('[name=orcid]'),
      affiliation: this.page.locator('.makeStyles-authorAffiliationRow-110 .MuiSelect-select'),
      addAffiliation: this.page.locator('.MuiDialog-root button:has-text("Add Affiliation")'),
      addAffiliationOption: this.page.locator('text=Add new affiliation'),
      newAffiliation: {
        institution: this.page.locator('[name="institution.name"]'),
        city: this.page.locator('[name="address.city"]'),
        country: this.page.locator('[name="country"]'),
        done: this.page.locator('text=Done >> nth=1'),
      },
      delete: this.page.locator('text=Delete'),
    }
  }

  async openModal(authorNumber: number): Promise<void> {
    const editButton = this.editButton.nth(authorNumber);
    await editButton.click();
    const title = await this.modal.heading;
    await expect(title).toHaveText('Edit Author');
  }

  async closeModal(done = true): Promise<void> {
    await this.page.click(`text=${done ? 'Done' : 'Cancel'}`);
    const title = await this.modal.title;
    await expect(title).not.toBeVisible();
  }

  async addAuthor({firstName, lastName, suffix}: AuthorName): Promise<void> {
    await this.addButton.first().click();
    await this.modal.firstName.fill(firstName);
    await this.modal.lastName.fill(lastName);
    await this.modal.suffix.fill(suffix);
    await this.closeModal();
  }

  async setAuthorName({ firstName, lastName, suffix}: AuthorName, authorNumber: number): Promise<void> {
    await this.openModal(authorNumber);
    await this.modal.firstName.fill(firstName)
    await this.modal.lastName.fill(lastName)
    await this.modal.suffix.fill(suffix)
    await this.closeModal();
  }

  async assertAuthorName(authorName: string, authorNumber: number): Promise<void> {
    const author = this.authorName.nth(authorNumber);
    const authorInformationName = this.authorInformation.nth(authorNumber).locator('strong').first();
    await expect(author).toContainText(authorName);
    await expect(authorInformationName).toHaveText(authorName);
  }

  async setAuthorEmail(authorEmail: string, authorNumber: number): Promise<void> {
    await this.openModal(authorNumber);
    await this.page.fill('[name=email]', authorEmail);
    await this.closeModal();
  };

  async assertAuthorEmail(authorEmail: string, authorNumber: number): Promise<void> {
    const authorInformation = this.authorInformation.nth(authorNumber);
    const email = authorInformation.locator(`text=${authorEmail}`);
    await expect(email).toBeVisible();
  }

  async setCompetingInterest(hasCompetingInterest: boolean, authorNumber: number, competingInterestStatement?: string): Promise<void> {
    await this.openModal(authorNumber);
    const selector = await this.modal.competingInterest;
    await selector.click();
    if (hasCompetingInterest) {
      await this.modal.competingInterestSelector.hasCompetingInterest.click();
      await this.modal.competingInterestStatement.fill(competingInterestStatement);
    } else {
      await this.modal.competingInterestSelector.noCompetingInterest.click();
    }
    await this.closeModal();
  }

  async assertCompetingInterest(hasCompetingInterest: boolean, authorNumber: number, competingInterest?: string): Promise<void> {
    const authorInformation = this.authorInformation.nth(authorNumber);
    if (hasCompetingInterest) {
      const competingInterestStatement = await authorInformation.locator(`text=Competing interest: ${competingInterest}`)
      await expect(competingInterestStatement).toBeVisible();
    } else {
      const competingInterestStatement = await authorInformation.locator(':has-text("Competing interest"')
      await expect(competingInterestStatement).not.toBeVisible();
    }
  }

  async setBio(bio: string, authorNumber: number): Promise<void> {
    await this.openModal(authorNumber);
    await this.modal.bio.fill(bio);
    await this.closeModal();
  }

  async assertBio(bio: string, authorNumber: number): Promise<void> {
    await this.openModal(authorNumber);
    await expect(this.modal.bio).toHaveText(bio);
  }

  async setOrcidId(id: string, authorNumber: number): Promise<void> {
    await this.openModal(authorNumber);
    await this.modal.orcid.fill(id);
    await this.closeModal();
  }

  async assertOrcid(id: string, authorNumber: number): Promise<void> {
    const authorInformation = this.authorInformation.nth(authorNumber);
    const orcid = authorInformation.locator('a');
    await expect(orcid).toHaveText(id);
  }

  async addAffiliation({institution, city, country}: Affiliation, authorNumber: number): Promise<void> {
    await this.openModal(authorNumber);
    const affiliationCount = await this.modal.affiliation.count();
    await this.modal.addAffiliation.click()
    expect(await this.modal.affiliation.count()).toBe(affiliationCount + 1);
    await this.modal.affiliation.last().click();
    await this.modal.addAffiliationOption.click();
    await this.modal.newAffiliation.institution.fill(institution);
    await this.modal.newAffiliation.city.fill(city);
    await this.modal.newAffiliation.country.fill(country);
    await this.modal.newAffiliation.done.click();
    await this.closeModal();
  }

  async assertAffiliation({institution, city, country}: Affiliation, authorNumber: number): Promise<void> {
    const authorInformation = this.authorInformation.nth(authorNumber);
    const affiliation = authorInformation.locator(`text=${institution}, ${city}, ${country}`);
    await expect(affiliation).toBeVisible();
  }

  async setCorrespondingAuthor(isCorrespondingAuthor: boolean, authorNumber: number): Promise<void> {
    await this.openModal(authorNumber);
    await this.page.check('[name=isCorrespondingAuthor]');
    await this.closeModal();
  }

  async assertCorrespondingAuthor(isCorrespondingAuthor: boolean, authorNumber: number): Promise<void> {
    const authorInformation = this.authorInformation.nth(authorNumber);
    const correspondingAuthor = authorInformation.locator(`text=Corresponding Author: `);
    await expect(correspondingAuthor).toBeVisible();
  }

  async deleteAuthor(authorNumber: number): Promise<void> {
    const authorInformation = this.authorInformation.nth(authorNumber);
    const authorName = await authorInformation.locator('strong').first().textContent();
    await this.openModal(authorNumber);
    await this.modal.delete.click();
    await this.page.click('text=Delete >> nth=1');
    await expect(authorInformation).not.toHaveText(authorName);
  }
}
