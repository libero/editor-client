import { expect, Locator, Page } from '@playwright/test';

export class MainText {
  private page: Page;
  readonly mainTextInput: Locator;
  readonly figure: {
    number: Locator;
    image: Locator;
    title: Locator;
    legend: Locator;
    attribution: Locator;
    licence: {
      add: Locator;
      type: Locator;
      year: Locator;
      statement: Locator;
      licence: (licenceNumber: number) => Locator;
      holder: Locator;
    };
  };

  constructor(thePage: Page) {
    this.page = thePage;
    this.mainTextInput = this.page.locator(`#mainText>div>div`);
    this.figure = {
      number: this.mainTextInput.locator('section [name="figureNumber"]'),
      image: this.mainTextInput.locator('section img'),
      title: this.mainTextInput.locator('div:below(label:has-text("Title"))'),
      legend: this.mainTextInput.locator('div:below(label:has-text("Legend"))'),
      attribution: this.mainTextInput.locator('div:below(label:has-text("Attribution"))'),
      licence: {
        add: this.mainTextInput.locator('button:has-text("Add Licence")'),
        type: this.mainTextInput.locator('#mui-component-select-licenseType'),
        year: this.mainTextInput.locator('[name="copyrightYear"]'),
        statement: this.mainTextInput.locator('[name="copyrightStatement"]'),
        licence: (licenceNumber: number) => this.mainTextInput.locator(`div:below(label:has-text("License ${licenceNumber + 1}"))`),
        holder: this.mainTextInput.locator('[name="copyrightHolder"]'),
      }
    }
  }

  async setText(content: string): Promise<void> {
    await this.mainTextInput.fill(content);
  }

  async assertText(content: string): Promise<void> {
    await expect(this.mainTextInput).toHaveText(content);
  }

  async setFigureNumber(figureNumberText: string, figureNumber: number = 0): Promise<void> {
    await this.figure.number.nth(figureNumber).fill(figureNumberText);
  }

  async assertFigureNumber(figureNumberText: string, figureNumber: number = 0): Promise<void> {
    await expect(this.figure.number.nth(figureNumber)).toHaveValue(figureNumberText);
  }

  async assertFigureImageVisible(figureNumber: number = 0): Promise<void> {
    await expect(this.figure.image.nth(figureNumber)).toBeVisible();
  }

  async setFigureTitle(figureTitle: string, figureNumber: number = 0): Promise<void> {
    await this.figure.title.nth(figureNumber).locator('[contenteditable=true]').fill(figureTitle);
  }

  async assertFigureTitle(figureTitle: string, figureNumber: number = 0): Promise<void> {
    await expect(this.figure.title.nth(figureNumber)).toHaveText(figureTitle);
  }

  async setFigureLegend(figureLegend: string, figureNumber: number = 0): Promise<void> {
    await this.figure.legend.nth(figureNumber).locator('[contenteditable=true]').fill(figureLegend);
  }

  async assertFigureLegend(figureLegend: string, figureNumber: number = 0): Promise<void> {
    await expect(this.figure.legend.nth(figureNumber)).toHaveText(figureLegend);
  }

  async setFigureAttribution(figureAttribution: string, figureNumber: number = 0): Promise<void> {
    await this.figure.attribution.nth(figureNumber).locator('[contenteditable=true]').fill(figureAttribution);
  }

  async assertFigureAttribution(figureAttribution: string, figureNumber: number = 0): Promise<void> {
    await expect(this.figure.attribution.nth(figureNumber)).toHaveText(figureAttribution);
  }

  async addLicence(): Promise<void> {
    const licenceCount = await this.figure.licence.type.count();
    await this.figure.licence.add.click();
    const newLicenceCount = await this.figure.licence.type.count();
    expect(newLicenceCount).toBeGreaterThan(licenceCount);
  }

  async setLicenceType(type: string, licenceNumber: number = 0): Promise<void> {
    await this.figure.licence.type.nth(licenceNumber).click();
    await this.page.locator('.MuiPopover-root li').locator(`text=${type}`).click();
  }

  async assertLicenceType(type: string, licenceNumber: number = 0): Promise<void> {
    await expect(this.figure.licence.type.nth(licenceNumber)).toHaveText(type);
  };

  async setLicenceYear(year: string, licenceNumber: number = 0): Promise<void> {
    await this.figure.licence.year.nth(licenceNumber).fill(year);
  };

  async assertLicenceYear(year: string, licenceNumber: number = 0): Promise<void> {
    await expect(this.figure.licence.year.nth(licenceNumber)).toHaveValue(year);
  };

  async setLicenceStatement(statement: string, licenceNumber: number = 0): Promise<void> {
    await this.figure.licence.statement.nth(licenceNumber).fill(statement);
  };

  async assertLicenceStatement(statement: string, licenceNumber: number = 0): Promise<void> {
    await expect(this.figure.licence.statement.nth(licenceNumber)).toHaveValue(statement);
  };

  async setLicenceLicence(licence: string, licenceNumber: number = 0): Promise<void> {
    await this.figure.licence.licence(licenceNumber).locator('[contenteditable=true]').first().fill(licence);
  };

  async assertLicenceLicence(licence: string, licenceNumber: number = 0): Promise<void> {
    await expect(this.figure.licence.licence(licenceNumber).first()).toHaveText(licence);
  };

  async setLicenceHolder(holder: string, licenceNumber: number = 0): Promise<void> {
    await this.figure.licence.holder.nth(licenceNumber).fill(holder);
  };

  async assertLicenceHolder(holder: string, licenceNumber: number = 0): Promise<void> {
    await expect(this.figure.licence.holder.nth(licenceNumber)).toHaveValue(holder);
  };

  async selectText(text: string): Promise<void> {
    await this.mainTextInput.locator(`text="${text}"`).selectText();
  }

  async formatText(format: string): Promise<void> {
    await this.page.click('text="FORMAT"');
    await this.page.click(`text="${format}"`);
  }

  async assertTextTags(formatTag: string, text: string): Promise<void> {
    const formattedElement = await this.mainTextInput.locator(`${formatTag}:has-text("${text}")`);
    await expect(formattedElement).toBeVisible();
  }

  async setTextHeading(heading: string, currentHeading: string = 'PARAGRAPH'): Promise<void> {
    await this.page.click(`text="${currentHeading}"`);
    await this.page.click(`text="${heading}"`);
  }
}

