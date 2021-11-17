import { expect, Locator, Page } from '@playwright/test';
import moment from 'moment';

export enum SubjectOption {
  BiochemistryAndChemicalBiology = 'Biochemistry and Chemical Biology',
  CancerBiology = 'Cancer Biology',
  CellBiology = 'Cell Biology',
  ChromosomesAndGeneExpression = 'Chromosomes and Gene Expression',
  ComputationalAndSystemsBiology = 'Computational and Systems Biology',
  DevelopmentalBiology = 'Developmental Biology',
  Ecology = 'Ecology',
  EpidemiologyAndGlobalHealth = 'Epidemiology and Global Health',
  EvolutionaryBiology = 'Evolutionary Biology',
  GeneticsAndGenomics = 'Genetics and Genomics',
  Medicine = 'Medicine',
  ImmunologyAndInflammation = 'Immunology and Inflammation',
  MicrobiologyAndInfectiousDisease = 'Microbiology and Infectious Disease',
  Neuroscience = 'Neuroscience',
  PhysicsOfLivingSystems = 'Physics of Living Systems',
  PlantBiology = 'Plant Biology',
  StemCellsAndRegenerativeMedicine = 'Stem Cells and Regenerative Medicine',
  StructuralBiologyAndMolecularBiophysics = 'Structural Biology and Molecular Biophysics',
}


export class ArticleInformation {
  private page: Page;
  readonly section: Locator;
  readonly edit: Locator;
  readonly modal: {
    firstSubject: Locator;
    secondSubject: Locator;
    articleDoi: Locator;
    publisherId: Locator;
    elocationId: Locator;
    volume: Locator;
    published: Locator;
    licenseType: Locator;
    copyrightStatement: Locator;
    permissions: Locator;
    done: Locator;
    cancel: Locator;
  }

  constructor(thePage: Page) {
    this.page = thePage;
    this.section = this.page.locator(`#article-info`);
    this.edit = this.section.locator('button');
    this.modal = {
      firstSubject: this.page.locator('id=mui-component-select-subjects.0'),
      secondSubject: this.page.locator('id=mui-component-select-subjects.1'),
      articleDoi: this.page.locator('[name=articleDOI]'),
      publisherId: this.page.locator('[name=publisherId]'),
      elocationId: this.page.locator('[name=elocationId]'),
      volume: this.page.locator('[name=volume]'),
      published: this.page.locator('[name=publicationDate]'),
      licenseType: this.page.locator(`.MuiSelect-select`).last(),
      copyrightStatement: this.page.locator('text=©'),
      permissions: this.page.locator(`p:below(label:has-text("Permissions"))`).first(),
      done: this.page.locator('text=DONE'),
      cancel: this.page.locator('text=CANCEL'),
    }
  }

  async openModal(): Promise<void> {
    await this.edit.click();
    await expect(this.page.locator('h3:has-text("Article Information")')).toBeVisible();
  }

  async closeModal(done: boolean = true): Promise<void> {
    if (done) {
      await this.modal.done.click();
    } else {
      await this.modal.cancel.click();
    }
    await expect(this.section).toBeVisible();
  }

  async setSubjects(firstSubject: SubjectOption, secondSubject?: SubjectOption): Promise<void> {
    await this.openModal();
    await this.modal.firstSubject.click();
    await this.page.locator(`text=${firstSubject}`).click();
    if (secondSubject) {
      await this.modal.secondSubject.click();
      await this.page.locator(`text=${secondSubject}`).click();
    }
    await this.closeModal();
  }

  async assertSubjects(firstSubject: SubjectOption, secondSubject?: SubjectOption): Promise<void> {
    await expect(this.section.locator('div').nth(0)).toHaveText(`Subject(s): ${firstSubject}${secondSubject ? ', ' + secondSubject : ''}`);
  }

  async setArticleDoi(doi: string): Promise<void> {
    await this.openModal();
    await this.modal.articleDoi.fill(doi);
    await this.closeModal();
  }

  async assertArticleDoi(doi: string): Promise<void> {
    await expect(this.section.locator('div').nth(2)).toHaveText(`Article DOI: ${doi}`);
  }

  async setPublisherId(publisherId: string): Promise<void> {
    await this.openModal();
    await this.modal.publisherId.fill(publisherId);
    await this.closeModal();
  }

  async assertPublisherId(publisherId: string): Promise<void> {
    await expect(this.section.locator('div').nth(3)).toHaveText(`Publisher ID: ${publisherId}`);
  }

  async setElocationId(elocationId: string): Promise<void> {
    await this.openModal();
    await this.modal.elocationId.fill(elocationId);
    await this.closeModal();
  }

  async assertElocationId(elocationId: string): Promise<void> {
    await expect(this.section.locator('div').nth(4)).toHaveText(`eLocation ID: ${elocationId}`);
  }

  async setVolume(volume: string): Promise<void> {
    await this.openModal();
    await this.modal.volume.fill(volume);
    await this.closeModal();
  }

  async assertVolume(volume: string): Promise<void> {
    await expect(this.section.locator('div').nth(6)).toHaveText(`Volume: ${volume}`);
  }

  async setPublished(published: Date): Promise<void> {
    await this.openModal();
    await this.modal.published.type(moment(published).format('DDMMYYYY'), { delay: 100 });
    await this.closeModal();
  }

  async assertPublished(published: Date): Promise<void> {
    await expect(this.section.locator('div').nth(5)).toHaveText(`Year: ${published.getFullYear()}`);
    await expect(this.section.locator('div').nth(8)).toHaveText(`Published: ${moment(published).format('MMMM D, YYYY')}`);
  }

  async setLicenseType(type: 'CC-BY-4' | 'CCO'): Promise<void> {
    await this.openModal();
    await this.modal.licenseType.click();
    await this.page.locator(`text=${type}`).last().click();
    await expect(this.modal.permissions).toContainText(type === 'CC-BY-4' ? ' Creative Commons Attribution License' : 'Creative Commons CC0 public domain dedication');
    await this.closeModal();
  }

  async assertLicenseType(type: 'CC-BY-4' | 'CCO'): Promise<void> {
    if (type === 'CC-BY-4') {
      await expect(this.section.locator('div').nth(10)).toContainText('et al');
      await expect(this.section.locator('div').nth(11)).toContainText('Creative Commons Attribution License');
    } else {
      await expect(this.section.locator('div').nth(11)).toContainText('Creative Commons CC0 public domain dedication');
    }
  }

  async assertArticleType(articleType: string): Promise<void> {
    await expect(this.section.locator('div').nth(1)).toContainText(`Article type: ${articleType}`);
  }
}
