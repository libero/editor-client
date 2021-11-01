import { test } from '@playwright/test';
import { MainText } from './page-objects/main-text';

const content = `
    To Ganymede and Titan
    Yes, sir, I've been around
    But there ain't no place
    In the whole of Space
    Like that good ol' toddlin' town
    Oh! Lunar City Seven
    You're my idea of heaven
    Out of ten, you score eleven
    You good ol' Titan' town
    Oh! Lunar City Seven
    Lunar Cities One through Six
    They always get me down
    But Lunar City Seven
    You're my home town
  `;

const formatAndAssert  = async (mainText: MainText, format: string, tags: string): Promise<void> => {
  const text = 'To Ganymede and Titan';
  await mainText.selectText(text);
  await mainText.formatText(format);
  await mainText.assertTextTags(tags, text);
}

const setHeadingAndAssert  = async (mainText: MainText, heading: string, tags: string): Promise<void> => {
  const text = 'To Ganymede and Titan';
  await mainText.selectText(text);
  await mainText.setTextHeading(heading);
  await mainText.assertTextTags(tags, text);
}

test.describe('main-text', () => {
  let mainText: MainText;
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/?articleId=54296');
    mainText = new MainText(page);
  });

  test('edit body text', async () => {
    await mainText.setText(content);
    await mainText.assertText(content);
  });

  test.describe('figures', () => {
    test('figure is loaded', async () => {
      await mainText.assertFigureNumber('Figure 1.');
      await mainText.assertFigureImageVisible();
      await mainText.assertFigureTitle('Certain epigenetic changes are linked to the inheritance of extended lifespans in worms.');
      await mainText.assertFigureLegend('Top: The WDR-5 enzyme helps to place the H3K4me mark (green), which promotes gene expression, on proteins called histones (brown circle) that package DNA (grey ribbon). In parallel, the MET-2 enzyme places the H3K9me2 mark (red), which represses gene expression. The two marks functionally antagonize each other. An enzyme called JHDM-1 is predicted to remove H3K9me2. Bottom: Worms with mutations in wdr-5 or jhdm-1 (left) that have low levels of H3K4me (green arrow), also show higher levels of H3K9me2 (red arrow) and an increased lifespan (grey arrow). When these long-lived mutants are mated to wild-type worms with a normal lifespan, their genetically wild-type offspring (right) are still long-lived for several generations (grey arrow). These worms show normal levels of H3K4me mark (green square) and regions of sustained increase in H3K9me2 (red arrow) inherited from their mutant ancestors.');
      await mainText.assertFigureAttribution('Image credit: Cheng-Lin Li.');
    });

    test('figure number is editable', async () => {
      const figureNumberText = 'Figure 6000';
      await mainText.setFigureNumber(figureNumberText);
      await mainText.assertFigureNumber(figureNumberText);
    });

    test('figure title is editable', async () => {
      const figureTitle = 'Space Hazards: White Hole';
      await mainText.setFigureTitle(figureTitle);
      await mainText.assertFigureTitle(figureTitle);
    });

    test('figure legend is editable', async () => {
      const figureLegend = 'Every action has an equal and opposite reaction. A black hole sucks time and matter out of the Universe; a white hole returns it';
      await mainText.setFigureLegend(figureLegend);
      await mainText.assertFigureLegend(figureLegend);
    });

    test('figure attribution is editable', async () => {
      const figureAttribution = 'The Junior Colour Encyclopedia of Space';
      await mainText.setFigureAttribution(figureAttribution);
      await mainText.assertFigureAttribution(figureAttribution);
    });

    test.describe('licence', () => {
      test('add licence', async () => {
        await mainText.addLicence();
      });

      test('edit licence type', async () => {
        await mainText.addLicence();
        await mainText.setLicenceType('CC0', 0);
        await mainText.assertLicenceType('CC0', 0);
      })

      test('edit licence year', async () => {
        await mainText.addLicence();
        const year = '2155';
        await mainText.setLicenceYear(year, 0);
        await mainText.assertLicenceYear(year, 0);
      })

      test('edit licence statement', async () => {
        await mainText.addLicence();
        const statement = 'If a jobs worth doing, its worth doing well, if its not worth doing give it to Rimmer';
        await mainText.setLicenceStatement(statement, 0);
        await mainText.assertLicenceStatement(statement, 0);
      })

      test('edit licence licence', async () => {
        await mainText.addLicence();
        await mainText.setLicenceLicence(content, 0);
        await mainText.assertLicenceLicence(content, 0);
      })

      test('edit licence holder', async () => {
        await mainText.addLicence();
        const holder = 'Dave Lister';
        await mainText.setLicenceHolder(holder, 0);
        await mainText.assertLicenceHolder(holder, 0);
      })
    });
  });

  test.describe('format text', () => {
    test.beforeEach(async () => {
      await mainText.setText(content);
    });
    
    test('bold text', async () => {
      await formatAndAssert(mainText, 'Bold', 'strong');
    });

    test('italic text', async () => {
      await formatAndAssert(mainText, 'Italics', 'em');
    });

    test('subscript text', async () => {
      await formatAndAssert(mainText, 'Subscript', 'sub');
    });

    test('superscript text', async () => {
      await formatAndAssert(mainText, 'Superscript', 'sup');
    });

    test('underline text', async () => {
      await formatAndAssert(mainText, 'Underline', 'u');
    });

    test('strikethrough text', async () => {
      await formatAndAssert(mainText, 'Strike Through', 'strike');
    });

    test('combined format text', async () => {
      const text = 'To Ganymede and Titan';
      await mainText.selectText(text);
      await mainText.formatText('Bold');
      await mainText.formatText('Italics');
      await mainText.assertTextTags('em strong', text);
    });
  });

  test.describe('headings', () => {
    test.beforeEach(async () => {
      await mainText.setText(content);
    });

    test('heading 1', async () => {
      await setHeadingAndAssert(mainText, 'Heading 1', 'h1');
    });

    test('heading 2', async () => {
      await setHeadingAndAssert(mainText, 'Heading 2', 'h2');
    });

    test('heading 3', async () => {
      await setHeadingAndAssert(mainText, 'Heading 3', 'h3');
    });

    test('heading 4', async () => {
      await setHeadingAndAssert(mainText, 'Heading 4', 'h4');
    });

    test('Bulleted list', async () => {
      await setHeadingAndAssert(mainText, 'Bulleted List', 'ul li p');
    });

    test('Numbered list', async () => {
      await setHeadingAndAssert(mainText, 'Numbered List', 'ol li p');
    });

    test('revert to paragraph', async () => {
      const text = 'To Ganymede and Titan';
      await mainText.selectText(text);
      await mainText.setTextHeading('Heading 1');
      await mainText.assertTextTags('h1', text);
      await mainText.setTextHeading('Paragraph', 'HEADING 1');
      await mainText.assertTextTags('p', text);
    });
  });
});