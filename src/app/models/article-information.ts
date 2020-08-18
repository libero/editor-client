import { EditorState } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { buildInputRules } from 'app/models/plugins/input-rules';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';

import { getTextContentFromPath, makeSchemaFromConfig } from 'app/models/utils';
import * as licenseTextConfig from 'app/models/config/license-text.config';
import { Person } from 'app/models/person';
import moment from 'moment';

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

export interface ArticleInformation {
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
}

function getLicenseType(doc: Document): string {
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

export function createLicenseTextState(content: Element): EditorState {
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

export function getCopyrightStatement(authors: Person[], dateStr: string): string {
  const authorNamesSection =
    authors.length === 1
      ? authors[0].lastName
      : authors.length === 2
      ? `${authors[0].lastName} and ${authors[1].lastName}`
      : authors.length > 2
      ? `${authors[0].lastName} et al`
      : '';
  const date = moment(dateStr);

  return `© ${date.isValid() ? date.format('YYYY') : ''}, ${authorNamesSection}`;
}

export function createArticleInfoState(doc: Document, authors: Person[]): ArticleInformation {
  const subjects = Array.from(doc.querySelectorAll('subj-group[subj-group-type="subject"] subject')).map(
    (el: Element) => el.textContent
  );

  let publicationDate = '';
  const pubDateNode = doc.querySelector('pub-date[date-type="pub"][publication-format="electronic"]');
  if (pubDateNode) {
    publicationDate = [
      pubDateNode.querySelector('year').textContent,
      pubDateNode.querySelector('month').textContent,
      pubDateNode.querySelector('day').textContent
    ].join('-');
  }

  const copyrightStatementFromXml = getTextContentFromPath(doc, 'article-meta permissions copyright-statement');
  const licenseType = getLicenseType(doc);
  const copyrightStatement =
    copyrightStatementFromXml ||
    (licenseType === LICENSE_CC_BY_4 ? getCopyrightStatement(authors, publicationDate) : '');

  return {
    articleType: doc.querySelector('article').getAttribute('article-type'),
    dtd: doc.querySelector('article').getAttribute('dtd-version'),
    articleDOI: getTextContentFromPath(doc, 'article-meta article-id[pub-id-type="doi"]'),
    elocationId: getTextContentFromPath(doc, 'article-meta elocation-id'),
    volume: getTextContentFromPath(doc, 'article-meta volume'),
    publisherId: getTextContentFromPath(doc, 'article-meta article-id[pub-id-type="publisher-id"]'),
    subjects: subjects,
    licenseType,
    copyrightStatement,
    licenseText: createLicenseTextState(doc.querySelector('article-meta permissions license license-p')),
    publicationDate
  };
}

export function getLicenseTextEditorState(licenseType: string): EditorState {
  const paragraph = document.createElement('p');
  paragraph.innerHTML = {
    [LICENSE_CC_BY_4]: LICENSE_CC_BY_4_TEXT,
    [LICENSE_CC0]: LICENSE_CC0_TEXT
  }[licenseType];

  return createLicenseTextState(paragraph);
}
