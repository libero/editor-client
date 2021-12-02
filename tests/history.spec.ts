import { expect, test } from '@playwright/test';
import { Affiliations, History, MainText, References, SingleTextField } from './page-objects';

test.describe('history', () => {
  let history: History;

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/?articleId=54296');
    history = new History(page);
    await page.waitForSelector('#title');
  });

  test.describe('undo', () => {
    test('undo title changes', async ({ page }) => {
      const field = new SingleTextField(page, 'title');
      const content = 'Infinity welcomes careful drivers';
      await field.setField('');
      await field.typeField(content);
      await field.assertField(content);
      await history.undoNTimes(10);
      await field.assertField('Infinity welcomes caref');
    });

    test('undo adding affiliation', async ({ page }) => {
      const affiliations = new Affiliations(page);
      await affiliations.addAffiliation({ institution: 'JMC', city: 'Ganymede', country: 'Jupiter' });
      const initialCount = await affiliations.affiliationCount();
      await history.undoNTimes(2);
      const newCount = await affiliations.affiliationCount();
      expect(newCount).toBe(initialCount - 1);
    });

    test('undo main text changes', async ({ page }) => {
      const mainText = new MainText(page);
      await mainText.setText('');
      await mainText.typeText('I didnt come here lookin for trouble; I just came to do the Red Dwarf Shuffle');
      await history.undoNTimes(10);
      await mainText.assertText('I didnt come here lookin for trouble; I just came to do the Red Dwa');
    });

    test('undo adding a reference', async ({ page }) => {
      const references = new References(page);
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
      const initialRefs = await references.countReferences();
      await history.undoNTimes(1);
      const result = await references.countReferences();
      expect(result).toBeLessThan(initialRefs);
    });
  });

  test.describe('redo', () => {
    test('redo title changes', async ({ page }) => {
      const field = new SingleTextField(page, 'title');
      const content = 'Infinity welcomes careful drivers';
      await field.setField('');
      await field.typeField(content);
      await field.assertField(content);
      await history.undoNTimes(10);
      await field.assertField('Infinity welcomes caref');
      await history.redoNTimes(5);
      await field.assertField('Infinity welcomes careful dr');
    });

    test('undo adding affiliation', async ({ page }) => {
      const affiliations = new Affiliations(page);
      await affiliations.addAffiliation({ institution: 'JMC', city: 'Ganymede', country: 'Jupiter' });
      const initialCount = await affiliations.affiliationCount();
      await history.undoNTimes(2);
      const newCount = await affiliations.affiliationCount();
      expect(newCount).toBe(initialCount - 1);
      await history.redoNTimes(1);
      const redoCount = await affiliations.affiliationCount();
      expect(redoCount).toBe(initialCount);
    });

    test('redo main text changes', async ({ page }) => {
      const mainText = new MainText(page);
      await mainText.setText('');
      await mainText.typeText('I didnt come here lookin for trouble; I just came to do the Red Dwarf Shuffle');
      await history.undoNTimes(10);
      await mainText.assertText('I didnt come here lookin for trouble; I just came to do the Red Dwa');
      await history.redoNTimes(5);
      await mainText.assertText('I didnt come here lookin for trouble; I just came to do the Red Dwarf Sh');
    });

    test('redo adding a reference', async ({ page }) => {
      const references = new References(page);
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
      const initialRefs = await references.countReferences();
      await history.undoNTimes(1);
      const result = await references.countReferences();
      expect(result).toBeLessThan(initialRefs);
      await history.redoNTimes(1);
      const redoCount = await references.countReferences();
      expect(redoCount).toBe(initialRefs);
    });
  });
});
