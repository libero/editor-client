import { expect, Locator, Page } from '@playwright/test';
import moment from 'moment';
import {
  BookReference, ConferenceProceedingsReference, DataReference, JournalReference,
  Names, PatentReference, PeriodicalArticleReference,
  PreprintReference,
  Reference, ReportReference,
  SoftwareReference, ThesisReference,
  WebArticleReference
} from './rerences-types';

export class References {
  private page: Page;
  private readonly referencesBox: Locator;
  private readonly reference: Locator;
  private readonly modal: {
    type: Locator;
    authorLastName: Locator;
    authorFirstName: Locator;
    editorLastName: Locator;
    editorFirstName: Locator;
    addAuthor: Locator;
    publicationDate: Locator;
    year: Locator;
    title: Locator;
    articleTitle: Locator;
    periodicalTitle: Locator;
    journalTitle: Locator;
    dataTitle: Locator;
    preprintServer: Locator;
    databaseName: Locator;
    conferenceName: Locator;
    conferenceLocation: Locator;
    conferenceDate: Locator;
    source: Locator;
    version: Locator;
    accession: Locator;
    website: Locator;
    isbn: Locator;
    url: Locator;
    accessedDate: Locator;
    generatedOrAnalyzed: Locator;
    volume: Locator;
    firstPage: Locator;
    lastPage: Locator;
    eLocationId: Locator;
    doi: Locator;
    pmid: Locator;
    inPress: Locator;
    chapterTitle: Locator;
    bookTitle: Locator;
    edition: Locator;
    publisherLocation: Locator;
    publisherName: Locator;
    patentNumber: Locator;
    addEditor: Locator;
    delete: Locator;
    cancel: Locator;
    done: Locator;
  };
  private readonly addReference: Locator;

  constructor(thePage: Page) {
    this.page = thePage;
    this.referencesBox = this.page.locator(`#references`);
    this.reference = this.referencesBox.locator('li');
    this.addReference = this.page.locator('text=Add Reference');
    const getContentEditableFieldByLabel = (name: string): Locator => this.page.locator(`div:below(label:has-text("${name}"))`).locator('[contenteditable=true]').first();
    this.modal = {
      type: this.page.locator('#mui-component-select-type'),
      authorLastName: this.page.locator('[name=lastName]'),
      authorFirstName: this.page.locator('[name=firstName]'),
      editorLastName: this.page.locator('[name=lastName]'),
      editorFirstName: this.page.locator('[name=firstName]'),
      addAuthor: this.page.locator('text=Add Author').last(),
      addEditor: this.page.locator('text=Add Editor'),
      publicationDate: this.page.locator('[name=date]'),
      year: this.page.locator('[name=year]'),
      title: this.page.locator('.MuiDialogContent-root div:below(label:has-text("Title"))').locator('[contenteditable=true]').first(),
      articleTitle: getContentEditableFieldByLabel('Article title'),
      periodicalTitle: getContentEditableFieldByLabel('Periodical title'),
      journalTitle: getContentEditableFieldByLabel('Journal title'),
      dataTitle: getContentEditableFieldByLabel('Data title'),
      preprintServer: getContentEditableFieldByLabel('Preprint server'),
      databaseName: getContentEditableFieldByLabel('Database name'),
      conferenceName: getContentEditableFieldByLabel('Conference name'),
      conferenceLocation: this.page.locator('[name=conferenceLocation]'),
      conferenceDate: this.page.locator('[name=conferenceDate]'),
      source: getContentEditableFieldByLabel('Source'),
      version: this.page.locator('[name=version]'),
      volume: this.page.locator('[name=volume]'),
      firstPage: this.page.locator('[name=firstPage]'),
      lastPage: this.page.locator('[name=lastPage]'),
      eLocationId: this.page.locator('[name=elocationId]'),
      doi: this.page.locator('[name=doi]'),
      accession: this.page.locator('[name=accessionId]'),
      website: getContentEditableFieldByLabel('Website'),
      isbn: this.page.locator('[name=isbn]'),
      url: this.page.locator('[name=extLink]'),
      accessedDate: this.page.locator('[name=dateInCitation]'),
      generatedOrAnalyzed: this.page.locator('#mui-component-select-specificUse'),
      pmid: this.page.locator('[name=pmid]'),
      inPress: this.page.locator('[name=inPress]'),
      chapterTitle: getContentEditableFieldByLabel('Chapter title'),
      bookTitle: getContentEditableFieldByLabel('Book title'),
      edition: this.page.locator('[name=edition]'),
      publisherLocation: this.page.locator('[name=publisherLocation]'),
      publisherName: this.page.locator('[name=publisherName]'),
      patentNumber: this.page.locator('[name=patent]'),
      delete: this.page.locator('.MuiDialogContent-root').locator('text=DELETE'),
      cancel: this.page.locator('text=CANCEL'),
      done: this.page.locator('text=DONE'),
    };
  }

  private async addAuthors(names: Names): Promise<void> {
    for (let i = 0; i < names.length; i++) {
      await this.modal.addAuthor.click();
      await this.modal.authorLastName.nth(i).fill(names[i].lastName);
      await this.modal.authorFirstName.nth(i).fill(names[i].firstName);
    }
  }

  private static async assertNames(names: Names, ref: Locator): Promise<void> {
    for (let i = 0; i < names.length; i++) {
      const { firstName, lastName } = names[i];
      await expect(ref).toContainText(`${lastName} ${firstName}`);
    }
  }

  private async addEditors(names: Names): Promise<void> {
    for (let i = 0; i < names.length; i++) {
      await this.modal.addEditor.click();
      await this.modal.editorLastName.last().fill(names[i].lastName);
      await this.modal.editorFirstName.last().fill(names[i].firstName);
    }
  }

  private async addReferenceAndSetCommonProperties(reference: Reference): Promise<void> {
    await this.addReference.click();
    await this.modal.type.click();
    await this.page.locator(`text=${reference.type}`).last().click();
    await this.addAuthors(reference.names);
  }

  private async addPageNumbersAndVolume(firstPage: number, lastPage: number, volume: string): Promise<void> {
    await this.modal.firstPage.fill(String(firstPage));
    await this.modal.lastPage.fill(String(lastPage));
    await this.modal.volume.fill(volume);
  }

  private async setInPress(inPress: boolean): Promise<void> {
    if (inPress) {
      await this.modal.inPress.check();
    } else {
      await this.modal.inPress.uncheck();
    }
  }

  async countReferences(): Promise<number> {
    return this.reference.count();
  }

  async deleteReference(referenceNumber: number): Promise<void> {
    const referenceText = await this.reference.nth(referenceNumber).innerText();
    await this.reference.nth(referenceNumber).locator('svg').click();
    await this.modal.delete.click();
    await this.page.locator('text=Delete').last().click();
    await expect(this.reference.nth(referenceNumber)).not.toContainText(referenceText);
  }

  async addJournalReference(reference: JournalReference): Promise<void> {
    await this.addReferenceAndSetCommonProperties(reference);
    await this.modal.year.fill(String(reference.year));
    await this.modal.articleTitle.fill(reference.articleTitle);
    await this.modal.journalTitle.fill(reference.journalTitle);
    await this.addPageNumbersAndVolume(reference.firstPage, reference.lastPage, reference.volume);
    await this.modal.eLocationId.fill(reference.eLocationId);
    await this.modal.doi.fill(reference.doi);
    await this.modal.pmid.fill(reference.pmid);
    await this.setInPress(reference.inPress)
    await this.modal.done.click();
  }

  async assertJournalReference(reference: JournalReference, referenceNumber: number): Promise<void> {
    const ref = this.reference.nth(referenceNumber);
    await References.assertNames(reference.names, ref);
    await expect(ref).toContainText(reference.articleTitle);
    await expect(ref).toContainText(reference.journalTitle);
    await expect(ref).toContainText(String(reference.year));
    await expect(ref).toContainText(`${reference.volume}:${reference.firstPage}-${reference.lastPage}`);
    await expect(ref).toContainText(`doi: https://doi.org/${reference.doi}`);
    await expect(ref).toContainText(`pmid: ${reference.pmid}`);
  }

  async addBookReference(reference: BookReference): Promise<void> {
    await this.addReferenceAndSetCommonProperties(reference);
    await this.modal.year.fill(String(reference.year));
    await this.modal.chapterTitle.fill(reference.chapterTitle);
    await this.addEditors(reference.editorNames);
    await this.modal.bookTitle.fill(reference.bookTitle);
    await this.modal.edition.fill(reference.edition);
    await this.addPageNumbersAndVolume(reference.firstPage, reference.lastPage, reference.volume);
    await this.modal.eLocationId.fill(reference.eLocationId);
    await this.modal.publisherLocation.fill(reference.publisherLocation);
    await this.modal.publisherName.fill(reference.publisherName);
    await this.modal.doi.fill(reference.doi);
    await this.modal.pmid.fill(reference.pmid);
    await this.setInPress(reference.inPress)
    await this.modal.done.click();
  }

  async assertBookReference(reference: BookReference, referenceNumber: number): Promise<void> {
    const ref = this.reference.nth(referenceNumber);
    await References.assertNames(reference.names, ref);
    await References.assertNames(reference.editorNames, ref);
    await expect(ref).toContainText(reference.chapterTitle);
    await expect(ref).toContainText(reference.bookTitle);
    await expect(ref).toContainText(reference.volume);
    await expect(ref).toContainText(reference.edition);
    await expect(ref).toContainText(reference.publisherLocation);
    await expect(ref).toContainText(reference.publisherName);
    await expect(ref).toContainText(String(reference.year));
    await expect(ref).toContainText(`${reference.firstPage}-${reference.lastPage}`);
    await expect(ref).toContainText(`doi: https://doi.org/${reference.doi}`);
    await expect(ref).toContainText(`pmid: ${reference.pmid}`);
  }

  async addDataReference(reference: DataReference): Promise<void> {
    await this.addReferenceAndSetCommonProperties(reference);
    await this.modal.year.fill(String(reference.year));
    await this.modal.dataTitle.fill(reference.dataTitle);
    await this.modal.databaseName.fill(reference.databaseName);
    await this.modal.version.fill(reference.version);
    await this.modal.doi.fill(reference.doi);
    await this.modal.accession.fill(reference.accession);
    await this.modal.url.fill(reference.url);
    await this.modal.generatedOrAnalyzed.click();
    await this.page.locator(`text=${reference.generatedOrAnalyzed}`).last().click();
    await this.modal.done.click();
  }

  async assertDataReference(reference: DataReference, referenceNumber: number): Promise<void> {
    const ref = this.reference.nth(referenceNumber);
    await References.assertNames(reference.names, ref);
    await expect(ref).toContainText(String(reference.year));
    await expect(ref).toContainText(reference.dataTitle);
    await expect(ref).toContainText(reference.databaseName);
    await expect(ref).toContainText(reference.version);
    await expect(ref).toContainText(`doi: https://doi.org/${reference.doi}`);
    await expect(ref).toContainText(reference.accession);
    await expect(ref).toContainText(reference.url);
    await expect(ref).toContainText(reference.generatedOrAnalyzed);
  }

  async addSoftwareReference(reference: SoftwareReference): Promise<void> {
    await this.addReferenceAndSetCommonProperties(reference);
    await this.modal.year.fill(String(reference.year));
    await this.modal.title.fill(reference.title);
    await this.modal.source.fill(reference.source);
    await this.modal.publisherLocation.fill(reference.publisherLocation);
    await this.modal.publisherName.fill(reference.publisherName);
    await this.modal.version.fill(reference.version);
    await this.modal.doi.fill(reference.doi);
    await this.modal.url.fill(reference.url);
    await this.modal.done.click();
  }

  async assertSoftwareReference(reference: SoftwareReference, referenceNumber: number): Promise<void> {
    const ref = this.reference.nth(referenceNumber);
    await References.assertNames(reference.names, ref);
    await expect(ref).toContainText(String(reference.year));
    await expect(ref).toContainText(reference.title);
    await expect(ref).toContainText(reference.source);
    await expect(ref).toContainText(reference.publisherLocation);
    await expect(ref).toContainText(reference.publisherName);
    await expect(ref).toContainText(reference.url);
    await expect(ref).toContainText(`doi: https://doi.org/${reference.doi}`);
  }

  async addPreprintReference(reference: PreprintReference): Promise<void> {
    await this.addReferenceAndSetCommonProperties(reference);
    await this.modal.year.fill(String(reference.year));
    await this.modal.articleTitle.fill(reference.articleTitle);
    await this.modal.preprintServer.fill(reference.preprintServer);
    await this.modal.doi.fill(reference.doi);
    await this.modal.pmid.fill(reference.pmid);
    await this.modal.url.fill(reference.url);
    await this.modal.done.click();
  }

  async assertPreprintReference(reference: PreprintReference, referenceNumber: number): Promise<void> {
    const ref = this.reference.nth(referenceNumber);
    await References.assertNames(reference.names, ref);
    await expect(ref).toContainText(String(reference.year));
    await expect(ref).toContainText(reference.articleTitle);
    await expect(ref).toContainText(reference.preprintServer);
    await expect(ref).toContainText(reference.pmid);
    await expect(ref).toContainText(reference.url);
    await expect(ref).toContainText(`doi: https://doi.org/${reference.doi}`);
  }

  async addWebArticleReference(reference: WebArticleReference): Promise<void> {
    await this.addReferenceAndSetCommonProperties(reference);
    await this.modal.year.fill(String(reference.year));
    await this.modal.title.fill(reference.title);
    await this.modal.website.fill(reference.website);
    await this.modal.url.fill(reference.url);
    await this.modal.accessedDate.type(moment(reference.accessedDate).format('DDMMYYYY'), { delay: 100 });
    await this.modal.done.click();
  }

  async assertWebArticleReference(reference: WebArticleReference, referenceNumber: number): Promise<void> {
    const ref = this.reference.nth(referenceNumber);
    await References.assertNames(reference.names, ref);
    await expect(ref).toContainText(String(reference.year));
    await expect(ref).toContainText(reference.title);
    await expect(ref).toContainText(reference.website);
    await expect(ref).toContainText(reference.url);
    const accessedMoment = moment(reference.accessedDate);
    await expect(ref).toContainText(accessedMoment.format('MMMM D, YYYY'));
  }

  async addConferenceProceedingsReference(reference: ConferenceProceedingsReference): Promise<void> {
    await this.addReferenceAndSetCommonProperties(reference);
    await this.modal.year.fill(String(reference.year));
    await this.modal.articleTitle.fill(reference.articleTitle);
    await this.modal.conferenceName.fill(reference.conferenceName);
    await this.modal.conferenceLocation.fill(reference.conferenceLocation);
    await this.modal.conferenceDate.type(moment(reference.conferenceDate).format('DDMMYYYY'), { delay: 100 });
    await this.addPageNumbersAndVolume(reference.firstPage, reference.lastPage, reference.volume);
    await this.modal.eLocationId.fill(reference.eLocationId);
    await this.modal.doi.fill(reference.doi);
    await this.modal.url.fill(reference.url);
    await this.modal.done.click();
  }

  async assertConferenceProceedingsReference(reference: ConferenceProceedingsReference, referenceNumber: number): Promise<void> {
    const ref = this.reference.nth(referenceNumber);
    await References.assertNames(reference.names, ref);
    await expect(ref).toContainText(String(reference.year));
    await expect(ref).toContainText(reference.articleTitle);
    await expect(ref).toContainText(reference.conferenceName);
    await expect(ref).toContainText(reference.conferenceLocation);
    await expect(ref).toContainText(moment(reference.conferenceDate).format('YYYY-MM-DD'));
    await expect(ref).toContainText(reference.volume);
    await expect(ref).toContainText(`${reference.firstPage}-${reference.lastPage}`);
    await expect(ref).toContainText(`doi: https://doi.org/${reference.doi}`);
    await expect(ref).toContainText(reference.url);
  }

  async addReportReference(reference: ReportReference): Promise<void> {
    await this.addReferenceAndSetCommonProperties(reference);
    await this.modal.year.fill(String(reference.year));
    await this.modal.title.fill(reference.title);
    await this.modal.volume.fill(reference.volume);
    await this.modal.publisherLocation.fill(reference.publisherLocation);
    await this.modal.publisherName.fill(reference.publisherName);
    await this.modal.doi.fill(reference.doi);
    await this.modal.pmid.fill(reference.pmid);
    await this.modal.isbn.fill(reference.isbn);
    await this.modal.url.fill(reference.url);
    await this.modal.done.click();
  }

  async assertReportReference(reference: ReportReference, referenceNumber: number): Promise<void> {
    const ref = this.reference.nth(referenceNumber);
    await References.assertNames(reference.names, ref);
    await expect(ref).toContainText(String(reference.year));
    await expect(ref).toContainText(reference.title);
    await expect(ref).toContainText(reference.volume);
    await expect(ref).toContainText(reference.publisherLocation);
    await expect(ref).toContainText(reference.publisherName);
    await expect(ref).toContainText(`doi: https://doi.org/${reference.doi}`);
    await expect(ref).toContainText(reference.pmid);
    await expect(ref).toContainText(reference.isbn);
    await expect(ref).toContainText(reference.url);
  }

  async addThesisReference(reference: ThesisReference): Promise<void> {
    await this.addReferenceAndSetCommonProperties(reference);
    await this.modal.year.fill(String(reference.year));
    await this.modal.title.fill(reference.title);
    await this.modal.publisherLocation.fill(reference.publisherLocation);
    await this.modal.publisherName.fill(reference.publisherName);
    await this.modal.doi.fill(reference.doi);
    await this.modal.pmid.fill(reference.pmid);
    await this.modal.url.fill(reference.url);
    await this.modal.done.click();
  }

  async assertThesisReference(reference: ThesisReference, referenceNumber: number): Promise<void> {
    const ref = this.reference.nth(referenceNumber);
    await References.assertNames(reference.names, ref);
    await expect(ref).toContainText(String(reference.year));
    await expect(ref).toContainText(reference.title);
    await expect(ref).toContainText(reference.publisherLocation);
    await expect(ref).toContainText(reference.publisherName);
    await expect(ref).toContainText(`doi: https://doi.org/${reference.doi}`);
    await expect(ref).toContainText(reference.pmid);
  }

  async addPatentReference(reference: PatentReference): Promise<void> {
    await this.addReferenceAndSetCommonProperties(reference);
    await this.modal.year.fill(String(reference.year));
    await this.modal.title.fill(reference.title);
    await this.modal.source.fill(reference.source);
    await this.modal.publisherName.fill(reference.publisherName);
    await this.modal.patentNumber.fill(reference.patentNumber);
    await this.modal.doi.fill(reference.doi);
    await this.modal.url.fill(reference.url);
    await this.modal.done.click();
  }

  async assertPatentReference(reference: PatentReference, referenceNumber: number): Promise<void> {
    const ref = this.reference.nth(referenceNumber);
    await References.assertNames(reference.names, ref);
    await expect(ref).toContainText(String(reference.year));
    await expect(ref).toContainText(reference.title);
    await expect(ref).toContainText(reference.source);
    await expect(ref).toContainText(reference.publisherName);
    await expect(ref).toContainText(reference.patentNumber);
    await expect(ref).toContainText(`doi: https://doi.org/${reference.doi}`);
    await expect(ref).toContainText(reference.url);
  }

  async addPeriodicalArticleReference(reference: PeriodicalArticleReference): Promise<void> {
    await this.addReferenceAndSetCommonProperties(reference);
    await this.modal.publicationDate.type(moment(reference.publicationDate).format('DDMMYYYY'), { delay: 100 });
    await this.modal.articleTitle.fill(reference.articleTitle);
    await this.modal.periodicalTitle.fill(reference.periodicalTitle);
    await this.addPageNumbersAndVolume(reference.firstPage, reference.lastPage, reference.volume);
    await this.modal.url.fill(reference.url);
    await this.modal.done.click();
  }

  async assertPeriodicalArticleReference(reference: PeriodicalArticleReference, referenceNumber: number): Promise<void> {
    const ref = this.reference.nth(referenceNumber);
    await References.assertNames(reference.names, ref);
    await expect(ref).toContainText(reference.articleTitle);
    await expect(ref).toContainText(reference.periodicalTitle);
    await expect(ref).toContainText(`${reference.volume}:${reference.firstPage}-${reference.lastPage}`);
    await expect(ref).toContainText(reference.url);
  }
}
