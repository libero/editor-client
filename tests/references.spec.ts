import { test } from '@playwright/test';
import { References } from './page-objects/references';

test.describe('references', () => {
  let references: References;
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/?articleId=54296');
    references = new References(page);
  });

  test('add journal article reference', async () => {
    const reference = {
      type: 'Journal Article' as const,
      names: [
        { firstName: 'Dave', lastName: 'Lister' },
        { firstName: 'The', lastName: 'Cat' },
        { firstName: 'Arnold', lastName: 'Rimmer' },
      ],
      year: 3000000,
      articleTitle: 'Salt: An epicure\'s delight',
      journalTitle: 'Up, Up, And Away',
      volume: "42",
      firstPage: 1,
      lastPage: 6000,
      eLocationId: '2X4B 523P',
      doi: 'additional001',
      pmid: 'RD 52 169',
      inPress: false,
    };
    await references.addJournalReference(reference);
    await references.assertJournalReference(reference, 8);
  });

  test('add book reference', async () => {
    const reference = {
      type: 'Book' as const,
      names: [
        { firstName: 'Dave', lastName: 'Lister' },
        { firstName: 'The', lastName: 'Cat' },
        { firstName: 'Arnold', lastName: 'Rimmer' },
      ],
      editorNames: [
        {firstName: 'Todd', lastName: 'Hunter'},
      ],
      year: 3000000,
      chapterTitle: 'Salt: An epicure\'s delight',
      bookTitle: 'Up, Up, And Away',
      volume: "42",
      firstPage: 1,
      lastPage: 6000,
      eLocationId: '2X4B 523P',
      publisherLocation: 'Titan',
      publisherName: 'JMC',
      edition: '25',
      doi: 'additional001',
      pmid: 'RD 52 169',
      inPress: false,
    };
    await references.addBookReference(reference);
    await references.assertBookReference(reference, 8);
  });

  test('add data reference', async () => {
    const reference = {
      type: 'Data' as const,
      names: [
        { firstName: 'Dave', lastName: 'Lister' },
        { firstName: 'The', lastName: 'Cat' },
        { firstName: 'Arnold', lastName: 'Rimmer' },
      ],
      year: 3000000,
      dataTitle: 'Salt: An epicure\'s delight',
      databaseName: 'Up, Up, And Away',
      version: "42",
      doi: 'additional001',
      accession: 'RD 52 169',
      url: 'starbug.com',
      generatedOrAnalyzed: 'Generated' as const,
    };
    await references.addDataReference(reference);
    await references.assertDataReference(reference, 8);
  });

  test('add software reference', async () => {
    const reference = {
      type: 'Software' as const,
      names: [
        { firstName: 'Dave', lastName: 'Lister' },
        { firstName: 'The', lastName: 'Cat' },
        { firstName: 'Arnold', lastName: 'Rimmer' },
      ],
      year: 3000000,
      title: 'Dove Program',
      source: 'Existence',
      publisherLocation: 'Starbug',
      publisherName: 'Kryten',
      version: "1",
      doi: 'additional001',
      url: 'starbug.com',
    };
    await references.addSoftwareReference(reference);
    await references.assertSoftwareReference(reference, 8);
  });

  test('add preprint reference', async () => {
    const reference = {
      type: 'Preprint' as const,
      names: [
        { firstName: 'Dave', lastName: 'Lister' },
        { firstName: 'The', lastName: 'Cat' },
        { firstName: 'Arnold', lastName: 'Rimmer' },
      ],
      year: 3000000,
      articleTitle: 'Salt: An epicure\'s delight',
      preprintServer: 'Up, Up, And Away',
      doi: 'additional001',
      pmid: 'RD 52 169',
      url: 'starbug.com',
    };
    await references.addPreprintReference(reference);
    await references.assertPreprintReference(reference, 8);
  });

  test('add web article reference', async () => {
    const reference = {
      type: 'Web Article' as const,
      names: [
        { firstName: 'Dave', lastName: 'Lister' },
        { firstName: 'The', lastName: 'Cat' },
        { firstName: 'Arnold', lastName: 'Rimmer' },
      ],
      year: 3000000,
      title: 'Salt: An epicure\'s delight',
      website: 'Up, Up, And Away',
      url: 'starbug.com',
      accessedDate: new Date(2155, 10, 14),
    };
    await references.addWebArticleReference(reference);
    await references.assertWebArticleReference(reference, 8);
  });

  test('add conference proceedings reference', async () => {
    const reference = {
      type: 'Conference proceedings' as const,
      names: [
        { firstName: 'Dave', lastName: 'Lister' },
        { firstName: 'The', lastName: 'Cat' },
        { firstName: 'Arnold', lastName: 'Rimmer' },
      ],
      year: 3000000,
      articleTitle: 'Salt: An epicure\'s delight',
      conferenceName: 'Up, Up, And Away',
      conferenceLocation: 'Red Dwarf',
      conferenceDate: new Date(2155, 10, 14),
      volume: "42",
      firstPage: 1,
      lastPage: 6000,
      eLocationId: '2X4B 523P',
      doi: 'additional001',
      url: 'starbug.com'
    };
    await references.addConferenceProceedingsReference(reference);
    await references.assertConferenceProceedingsReference(reference, 8);
  });

  test('add report reference', async () => {
    const reference = {
      type: 'Report' as const,
      names: [
        { firstName: 'Dave', lastName: 'Lister' },
        { firstName: 'The', lastName: 'Cat' },
        { firstName: 'Arnold', lastName: 'Rimmer' },
      ],
      year: 3000000,
      title: 'Salt: An epicure\'s delight',
      volume: "42",
      publisherLocation: 'Starbug',
      publisherName: 'Kryten',
      doi: 'additional001',
      pmid: 'RD 52 169',
      isbn: '2X4B 523P',
      url: 'starbug.com'
    };
    await references.addReportReference(reference);
    await references.assertReportReference(reference, 8);
  });

  test('add thesis reference', async () => {
    const reference = {
      type: 'Thesis' as const,
      names: [
        { firstName: 'Dave', lastName: 'Lister' },
        { firstName: 'The', lastName: 'Cat' },
        { firstName: 'Arnold', lastName: 'Rimmer' },
      ],
      year: 3000000,
      title: 'Salt: An epicure\'s delight',
      publisherLocation: 'Starbug',
      publisherName: 'Kryten',
      doi: 'additional001',
      pmid: 'RD 52 169',
      url: 'starbug.com'
    };
    await references.addThesisReference(reference);
    await references.assertThesisReference(reference, 8);
  });

  test('add patent reference', async () => {
    const reference = {
      type: 'Patent' as const,
      names: [
        { firstName: 'Dave', lastName: 'Lister' },
        { firstName: 'The', lastName: 'Cat' },
        { firstName: 'Arnold', lastName: 'Rimmer' },
      ],
      year: 3000000,
      title: 'Tension Sheet',
      source: 'ketchup',
      publisherName: 'JMC',
      patentNumber: '007',
      doi: 'additional001',
      url: 'starbug.com'
    };
    await references.addPatentReference(reference);
    await references.assertPatentReference(reference, 8);
  });

  test('add periodical article reference', async () => {
    const reference = {
      type: 'Periodical Article' as const,
      names: [
        { firstName: 'Dave', lastName: 'Lister' },
        { firstName: 'The', lastName: 'Cat' },
        { firstName: 'Arnold', lastName: 'Rimmer' },
      ],
      publicationDate: new Date(2155, 10, 14),
      articleTitle: 'Salt: An epicure\'s delight',
      periodicalTitle: 'Up, Up, And Away',
      volume: "42",
      firstPage: 1,
      lastPage: 6000,
      url: 'starbug.com'
    };
    await references.addPeriodicalArticleReference(reference);
    await references.assertPeriodicalArticleReference(reference, 8);
  });

  test('delete reference', async () => {
    await references.deleteReference(0);
  })
});
