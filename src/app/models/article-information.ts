import { EditorState } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { buildInputRules } from 'app/models/plugins/input-rules';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';

import { getTextContentFromPath, makeSchemaFromConfig } from 'app/models/utils';
import * as licenseTextConfig from 'app/models/config/license-text.config';

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
    return 'CC-BY-4';
  }
  if (href === 'http://creativecommons.org/publicdomain/zero/1.0/') {
    return 'CC0';
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

export function createArticleInfoState(doc: Document): ArticleInformation {
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

  return {
    articleType: doc.querySelector('article').getAttribute('article-type'),
    dtd: doc.querySelector('article').getAttribute('dtd-version'),
    articleDOI: getTextContentFromPath(doc, 'article-meta article-id[pub-id-type="doi"]'),
    elocationId: getTextContentFromPath(doc, 'article-meta elocation-id'),
    volume: getTextContentFromPath(doc, 'article-meta volume'),
    publisherId: getTextContentFromPath(doc, 'article-meta article-id[pub-id-type="publisher-id"]'),
    subjects: subjects,
    licenseType: getLicenseType(doc),
    copyrightStatement: getTextContentFromPath(doc, 'article-meta permissions copyright-statement'),
    licenseText: createLicenseTextState(doc.querySelector('article-meta permissions license license-p')),
    publicationDate
  };
}
