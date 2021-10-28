import { EditorState } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { buildInputRules } from './plugins/input-rules';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';

import { getTextContentFromPath, makeSchemaFromConfig } from './utils';
import * as licenseTextConfig from './config/license-text.config';
import { Person } from './person';
import moment from 'moment';
import { BackmatterEntity } from './backmatter-entity';
import { JSONObject } from '../types/utility.types';

export const LICENSE_CC_BY_4 = 'CC-BY-4';
export const LICENSE_CC0 = 'CC0';

const LICENSE_CC_BY_4_TEXT = `This article is distributed under the terms of the 
    <ext-link ext-link-type="uri" xlink:href="http://creativecommons.org/licenses/by/4.0/">
        Creative Commons Attribution License</ext-link>, which permits unrestricted use and redistribution provided that the original author 
    and source are credited.`;

const LICENSE_CC0_TEXT = `This is an open-access article, free of all copyright, and may be freely reproduced, 
    distributed, transmitted, modified, built upon, or otherwise used by anyone for any lawful purpose.
    The work is made available under the
    <ext-link ext-link-type="uri" xlink:href="http://creativecommons.org/publicdomain/zero/1.0/">Creative Commons CC0 public domain dedication</ext-link>.`;

export class ArticleInformation extends BackmatterEntity {
  public static getLicenseText(licenseType: string): EditorState {
    const paragraph = document.createElement('p');
    paragraph.innerHTML = {
      [LICENSE_CC_BY_4]: LICENSE_CC_BY_4_TEXT,
      [LICENSE_CC0]: LICENSE_CC0_TEXT
    }[licenseType];

    return ArticleInformation.createLicenseEditorState(paragraph);
  }

  public static createLicenseEditorState(content?: Element): EditorState {
    const schema = makeSchemaFromConfig(licenseTextConfig.topNode, licenseTextConfig.nodes, licenseTextConfig.marks);
    const xmlContentDocument = document.implementation.createDocument('', '', null);

    if (content) {
      xmlContentDocument.appendChild(content);
    }

    return EditorState.create({
      doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
      schema,
      plugins: [buildInputRules(), gapCursor(), dropCursor()]
    });
  }

  articleType: string;
  dtd: string;
  articleDOI: string;
  publisherId: string;
  volume: string;
  elocationId: string;
  subjects: Array<string>;
  publicationDate: string;
  licenseType: string;
  copyrightStatement: string;
  licenseText: EditorState;

  constructor(data?: JSONObject | Element, authors?: Person[]) {
    super();
    this.createEntity(data);
    if (data instanceof Element && authors) {
      this.updateCopyrightStatementFromXml(data, authors);
    }
  }

  public clone(): ArticleInformation {
    const newArticleInformation = new ArticleInformation();
    newArticleInformation.articleType = this.articleType;
    newArticleInformation.dtd = this.dtd;
    newArticleInformation.articleDOI = this.articleDOI;
    newArticleInformation.elocationId = this.elocationId;
    newArticleInformation.volume = this.volume;
    newArticleInformation.publisherId = this.publisherId;
    newArticleInformation.subjects = [...this.subjects];
    newArticleInformation.copyrightStatement = this.copyrightStatement;
    newArticleInformation.licenseType = this.licenseType;
    newArticleInformation.publicationDate = this.publicationDate;
    newArticleInformation.licenseText = this.licenseText;

    return newArticleInformation;
  }

  public updateCopyrightStatement(authors: Person[]): void {
    if (this.licenseType === LICENSE_CC_BY_4) {
      const authorNamesSection =
        authors.length === 1
          ? authors[0].lastName
          : authors.length === 2
          ? `${authors[0].lastName} and ${authors[1].lastName}`
          : authors.length > 2
          ? `${authors[0].lastName} et al`
          : '';
      const date = moment(this.publicationDate);

      this.copyrightStatement = `© ${date.isValid() ? date.format('YYYY') : ''}, ${authorNamesSection}`;
    } else {
      this.copyrightStatement = '';
    }
  }

  protected fromXML(xmlNode: Element): void {
    this.articleType = getTextContentFromPath(xmlNode, 'article-meta subj-group[subj-group-type="heading"]');
    const articleEl = xmlNode.querySelector('article');
    this.dtd = articleEl ? articleEl.getAttribute('dtd-version') : '';
    this.articleDOI = getTextContentFromPath(xmlNode, 'article-meta article-id[pub-id-type="doi"]');
    this.elocationId = getTextContentFromPath(xmlNode, 'article-meta elocation-id');
    this.volume = getTextContentFromPath(xmlNode, 'article-meta volume');
    this.publisherId = getTextContentFromPath(xmlNode, 'article-meta article-id[pub-id-type="publisher-id"]');
    this.subjects = Array.from(xmlNode.querySelectorAll('subj-group[subj-group-type="major-subject"] subject')).map(
      (el: Element) => el.textContent
    );

    this.licenseType = this.getLicenseTypeFromXml(xmlNode);
    this.publicationDate = this.getPublicationDateFromXml(xmlNode);
    this.licenseText = ArticleInformation.createLicenseEditorState(
      xmlNode.querySelector('article-meta permissions license license-p')
    );
  }

  protected fromJSON(json: JSONObject): void {
    this.articleType = json.articleType as string;
    this.dtd = json.dtd as string;
    this.articleDOI = json.articleDOI as string;
    this.elocationId = json.elocationId as string;
    this.volume = json.volume as string;
    this.publisherId = json.publisherId as string;
    this.subjects = (json.subjects as string[]) || [];

    this.licenseType = json.licenseType as string;
    this.publicationDate = json.publicationDate as string;
    const emptyEditorState = ArticleInformation.createLicenseEditorState();
    this.licenseText = EditorState.fromJSON(
      {
        schema: emptyEditorState.schema,
        plugins: emptyEditorState.plugins
      },
      json.licenseText as JSONObject
    );
  }

  protected createBlank(): void {
    this.articleType = '';
    this.dtd = '';
    this.articleDOI = '';
    this.elocationId = '';
    this.volume = '';
    this.publisherId = '';
    this.subjects = [];

    this.licenseType = '';
    this.publicationDate = '';
    this.licenseText = ArticleInformation.createLicenseEditorState();
  }

  private getLicenseTypeFromXml(doc: Element): string {
    const licenseEl = doc.querySelector('article-meta permissions license');
    if (!licenseEl) {
      return '';
    }
    const href = licenseEl.getAttribute('xlink:href');
    if (href === 'http://creativecommons.org/licenses/by/4.0/') {
      return LICENSE_CC_BY_4;
    }
    if (href === 'http://creativecommons.org/publicdomain/zero/1.0/') {
      return LICENSE_CC0;
    }
  }

  private getPublicationDateFromXml(xmlNode: Element): string {
    let publicationDate = '';
    const pubDateNode = xmlNode.querySelector('pub-date[date-type="pub"][publication-format="electronic"]');
    if (pubDateNode) {
      publicationDate = [
        pubDateNode.querySelector('year')?.textContent,
        pubDateNode.querySelector('month')?.textContent,
        pubDateNode.querySelector('day')?.textContent
      ].join('-');
    }

    return publicationDate;
  }

  private updateCopyrightStatementFromXml(xmlNode: Element, authors: Person[]): void {
    const copyrightStatementFromXml = getTextContentFromPath(xmlNode, 'article-meta permissions copyright-statement');
    if (copyrightStatementFromXml) {
      this.copyrightStatement = copyrightStatementFromXml;
    } else {
      this.updateCopyrightStatement(authors);
    }
  }
}
