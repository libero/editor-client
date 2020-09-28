import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { v4 as uuidv4 } from 'uuid';
import { get } from 'lodash';

import * as referenceInfoConfig from 'app/models/config/reference-info.config';
import { buildInputRules } from 'app/models/plugins/input-rules';
import { getTextContentFromPath, makeSchemaFromConfig } from 'app/models/utils';
import { SelectPlugin } from 'app/models/plugins/selection.plugin';

export type ReferenceContributor =
  | {
      firstName: string;
      lastName: string;
    }
  | {
      groupName: string;
    };

export type ReferenceInfoType =
  | JournalReference
  | BookReference
  | ConferenceReference
  | DataReference
  | PeriodicalReference
  | PrePrintReference
  | ReportReference
  | PatentReference
  | SoftwareReference
  | WebReference
  | ThesisReference;

export type ReferenceType =
  | 'journal'
  | 'periodical'
  | 'book'
  | 'report'
  | 'data'
  | 'web'
  | 'preprint'
  | 'software'
  | 'confproc'
  | 'thesis'
  | 'patent';

export interface JournalReference {
  year: string;
  source: EditorState;
  articleTitle: EditorState;
  volume: string;
  firstPage: string;
  lastPage: string;
  elocationId: string;
  inPress: boolean;
  doi: string;
  pmid: string;
}

export interface PeriodicalReference {
  date: string;
  source: EditorState;
  articleTitle: EditorState;
  volume: string;
  firstPage: string;
  lastPage: string;
  extLink: string;
}

export interface BookReference {
  year: string;
  chapterTitle: EditorState;
  edition: string;
  publisherLocation: string;
  publisherName: string;
  source: EditorState;
  volume: string;
  editors: ReferenceContributor[];
  firstPage: string;
  lastPage: string;
  doi: string;
  pmid: string;
  inPress: boolean;
  elocationId: string;
}

export interface ReportReference {
  year: string;
  source: EditorState;
  publisherName: string;
  publisherLocation: string;
  pmid: string;
  volume: string;
  isbn: string;
  doi: string;
  extLink: string;
}

export interface PatentReference {
  year: string;
  source: EditorState;
  articleTitle: EditorState;
  publisherName: string;
  doi: string;
  patent: string;
  extLink: string;
}

export interface DataReference {
  year: string;
  dataTitle: EditorState;
  source: EditorState;
  doi: string;
  version: string;
  extLink: string;
  accessionId: string;
  specificUse?: string;
}

export interface WebReference {
  year: string;
  source: EditorState;
  articleTitle: EditorState;
  extLink: string;
  dateInCitation: string;
}

export interface PrePrintReference {
  year: string;
  articleTitle: EditorState;
  source: EditorState;
  extLink: string;
  doi: string;
  pmid: string;
}

export interface ThesisReference {
  year: string;
  articleTitle: EditorState;
  publisherName: string;
  publisherLocation: string;
  extLink: string;
  doi: string;
  pmid: string;
}

export interface SoftwareReference {
  year: string;
  source: EditorState;
  dataTitle: EditorState;
  version: string;
  publisherName: string;
  publisherLocation: string;
  extLink: string;
  doi: string;
}

export interface ConferenceReference {
  year: string;
  articleTitle: EditorState;
  conferenceName: EditorState;
  conferenceLocation: string;
  conferenceDate: string;
  volume: string;
  extLink: string;
  elocationId: string;
  doi: string;
  firstPage: string;
  lastPage: string;
}

export interface Reference {
  id: string;
  authors: Array<ReferenceContributor>;
  type: ReferenceType;
  referenceInfo: ReferenceInfoType;
}

export function createBlankReference(): Reference {
  return {
    id: uuidv4(),
    authors: [],
    referenceInfo: createEmptyRefInfoByType('journal'),
    type: 'journal'
  };
}

export function createReference(xmlId: string, referenceXml: Element): Reference {
  const reference: Reference = {
    id: xmlId,
    authors: [
      ...createReferencePersonList(referenceXml, 'author'),
      ...createReferencePersonList(referenceXml, 'inventor')
    ],
    type: referenceXml.getAttribute('publication-type') as ReferenceType,
    referenceInfo: null
  };

  switch (reference.type) {
    case 'journal':
      reference.referenceInfo = createJournalReference(referenceXml);
      break;
    case 'book':
      reference.referenceInfo = createBookReference(referenceXml);
      break;
    case 'periodical':
      reference.referenceInfo = createPeriodicalReference(referenceXml);
      break;
    case 'report':
      reference.referenceInfo = createReportReference(referenceXml);
      break;
    case 'data':
      reference.referenceInfo = createDataReference(referenceXml);
      break;
    case 'web':
      reference.referenceInfo = createWebReference(referenceXml);
      break;
    case 'preprint':
      reference.referenceInfo = createPrePrintReference(referenceXml);
      break;
    case 'software':
      reference.referenceInfo = createSoftwareReference(referenceXml);
      break;
    case 'confproc':
      reference.referenceInfo = createConferenceReference(referenceXml);
      break;
    case 'thesis':
      reference.referenceInfo = createThesisReference(referenceXml);
      break;
    case 'patent':
      reference.referenceInfo = createPatentReference(referenceXml);
      break;
  }

  return reference;
}

function createReferencePersonList(referenceXml: Element, groupType: string): ReferenceContributor[] {
  const contributors = referenceXml.querySelector(`person-group[person-group-type=${groupType}]`);
  if (!contributors) {
    return [];
  }

  return Array.from(contributors.children).map((contributorXml) => {
    if (contributorXml.nodeName === 'name') {
      return {
        firstName: getTextContentFromPath(contributorXml, 'given-names') || '',
        lastName: getTextContentFromPath(contributorXml, 'surname') || ''
      };
    } else {
      return {
        groupName: contributorXml.textContent
      };
    }
  });
}

function createJournalReference(referenceXml: Element): JournalReference {
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    pmid: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '',
    elocationId: getTextContentFromPath(referenceXml, 'elocation-id') || '',
    firstPage: getTextContentFromPath(referenceXml, 'fpage'),
    lastPage: getTextContentFromPath(referenceXml, 'lpage'),
    inPress: getTextContentFromPath(referenceXml, 'comment') === 'In press',
    volume: getTextContentFromPath(referenceXml, 'volume')
  };
}

function createNewJournalReference(): JournalReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    doi: '',
    elocationId: '',
    firstPage: '',
    inPress: false,
    lastPage: '',
    pmid: '',
    source: createReferenceAnnotatedValue(),
    volume: '',
    year: ''
  };
}

function createPatentReference(referenceXml: Element): PatentReference {
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    publisherName: getTextContentFromPath(referenceXml, 'publisher-name') || '',
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || '',
    patent: getTextContentFromPath(referenceXml, 'patent') || '',
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || ''
  };
}

function createNewPatentReference(): PatentReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    doi: '',
    extLink: '',
    patent: '',
    publisherName: '',
    source: createReferenceAnnotatedValue(),
    year: ''
  };
}

function createPeriodicalReference(referenceXml: Element): PeriodicalReference {
  return {
    date: referenceXml.querySelector('string-date > year').getAttribute('iso-8601-date'),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    firstPage: getTextContentFromPath(referenceXml, 'fpage'),
    lastPage: getTextContentFromPath(referenceXml, 'lpage'),
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || '',
    volume: getTextContentFromPath(referenceXml, 'volume')
  };
}

function createNewPeriodicalReference(): PeriodicalReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    date: '',
    firstPage: '',
    lastPage: '',
    volume: '',
    extLink: '',
    source: createReferenceAnnotatedValue()
  };
}

function createReportReference(referenceXml: Element): ReportReference {
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    publisherLocation: getTextContentFromPath(referenceXml, 'publisher-loc') || '',
    publisherName: getTextContentFromPath(referenceXml, 'publisher-name') || '',
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || '',
    volume: getTextContentFromPath(referenceXml, 'volume'),
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    pmid: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '',
    isbn: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="isbn"]') || ''
  };
}

function createNewReportReference(): ReportReference {
  return {
    doi: '',
    extLink: '',
    publisherName: '',
    publisherLocation: '',
    isbn: '',
    pmid: '',
    volume: '',
    source: createReferenceAnnotatedValue(),
    year: ''
  };
}

function createSoftwareReference(referenceXml: Element): SoftwareReference {
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    dataTitle: createReferenceAnnotatedValue(referenceXml.querySelector('data-title')),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    version: getTextContentFromPath(referenceXml, 'version') || '',
    publisherLocation: getTextContentFromPath(referenceXml, 'publisher-loc') || '',
    publisherName: getTextContentFromPath(referenceXml, 'publisher-name') || '',
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || ''
  };
}

function createNewSoftwareReference(): SoftwareReference {
  return {
    dataTitle: createReferenceAnnotatedValue(),
    doi: '',
    extLink: '',
    publisherLocation: '',
    publisherName: '',
    source: createReferenceAnnotatedValue(),
    version: '',
    year: ''
  };
}

function createThesisReference(referenceXml: Element): ThesisReference {
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    publisherLocation: getTextContentFromPath(referenceXml, 'publisher-loc') || '',
    publisherName: getTextContentFromPath(referenceXml, 'publisher-name') || '',
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    pmid: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '',
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || ''
  };
}

function createNewThesisReference(): ThesisReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    doi: '',
    extLink: '',
    pmid: '',
    publisherLocation: '',
    publisherName: '',
    year: ''
  };
}

function createWebReference(referenceXml: Element): WebReference {
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || '',
    dateInCitation: referenceXml.querySelector('date-in-citation').getAttribute('iso-8601-date') || ''
  };
}

function createNewWebReference(): WebReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    dateInCitation: '',
    extLink: '',
    source: createReferenceAnnotatedValue(),
    year: ''
  };
}

function createConferenceReference(referenceXml: Element): ConferenceReference {
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    conferenceName: createReferenceAnnotatedValue(referenceXml.querySelector('conf-name')),
    conferenceLocation: getTextContentFromPath(referenceXml, 'conf-loc') || '',
    conferenceDate: getTextContentFromPath(referenceXml, 'conf-date') || '',
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || '',
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    firstPage: getTextContentFromPath(referenceXml, 'fpage'),
    lastPage: getTextContentFromPath(referenceXml, 'lpage'),
    elocationId: getTextContentFromPath(referenceXml, 'elocation-id') || '',
    volume: getTextContentFromPath(referenceXml, 'volume')
  };
}

function createNewConferenceReference(): ConferenceReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    conferenceDate: '',
    conferenceLocation: '',
    conferenceName: createReferenceAnnotatedValue(),
    doi: '',
    elocationId: '',
    extLink: '',
    firstPage: '',
    lastPage: '',
    volume: '',
    year: ''
  };
}

function createPrePrintReference(referenceXml: Element): PrePrintReference {
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    pmid: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '',
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || ''
  };
}

function createNewPrePrintReference(): PrePrintReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    year: '',
    doi: '',
    extLink: '',
    pmid: '',
    source: createReferenceAnnotatedValue()
  };
}

function createDataReference(referenceXml: Element): DataReference {
  const accessionEl = referenceXml.querySelector('pub-id[pub-id-type="accession"]');
  const specificUse = referenceXml.getAttribute('specific-use');
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    dataTitle: createReferenceAnnotatedValue(referenceXml.querySelector('data-title')),
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    accessionId: accessionEl ? accessionEl.textContent : '',
    extLink:
      getTextContentFromPath(referenceXml, 'ext-link') ||
      (referenceXml.querySelector('pub-id[pub-id-type="accession"]')
        ? referenceXml.querySelector('pub-id[pub-id-type="accession"]').getAttribute('xlink:href')
        : ''),
    version: getTextContentFromPath(referenceXml, 'version') || '',
    specificUse: ['generated', 'analyzed'].includes(specificUse) ? specificUse : undefined
  };
}

function createNewDataReference(): DataReference {
  return {
    dataTitle: createReferenceAnnotatedValue(),
    year: '',
    doi: '',
    extLink: '',
    accessionId: '',
    specificUse: undefined,
    version: '',
    source: createReferenceAnnotatedValue()
  };
}

function createBookReference(referenceXml: Element): BookReference {
  const editors: ReferenceContributor[] = createReferencePersonList(referenceXml, 'editor');
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    chapterTitle: createReferenceAnnotatedValue(referenceXml.querySelector('chapter-title')),
    publisherLocation: getTextContentFromPath(referenceXml, 'publisher-loc') || '',
    editors: editors,
    publisherName: getTextContentFromPath(referenceXml, 'publisher-name') || '',
    edition: getTextContentFromPath(referenceXml, 'edition') || '',
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    pmid: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '',
    elocationId: getTextContentFromPath(referenceXml, 'elocation-id') || '',
    firstPage: getTextContentFromPath(referenceXml, 'fpage'),
    lastPage: getTextContentFromPath(referenceXml, 'lpage'),
    inPress: getTextContentFromPath(referenceXml, 'comment') === 'In press',
    volume: getTextContentFromPath(referenceXml, 'volume')
  };
}

function createNewBookReference(): BookReference {
  return {
    chapterTitle: createReferenceAnnotatedValue(),
    edition: '',
    editors: [],
    elocationId: '',
    firstPage: '',
    inPress: false,
    lastPage: '',
    pmid: '',
    publisherLocation: '',
    publisherName: '',
    volume: '',
    year: '',
    doi: '',
    source: createReferenceAnnotatedValue()
  };
}

export function createReferenceAnnotatedValue(content?: Node): EditorState {
  const schema = makeSchemaFromConfig(
    referenceInfoConfig.topNode,
    referenceInfoConfig.nodes,
    referenceInfoConfig.marks
  );

  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), SelectPlugin]
  });
}

export function createEmptyRefInfoByType(type: ReferenceType): Reference['referenceInfo'] {
  return {
    journal: createNewJournalReference,
    periodical: createNewPeriodicalReference,
    book: createNewBookReference,
    report: createNewReportReference,
    data: createNewDataReference,
    web: createNewWebReference,
    preprint: createNewPrePrintReference,
    software: createNewSoftwareReference,
    confproc: createNewConferenceReference,
    thesis: createNewThesisReference,
    patent: createNewPatentReference
  }[type]();
}

export function getRefContributorName(contributor: ReferenceContributor): string {
  return get(contributor, 'groupName', get(contributor, 'lastName', ''));
}

export function getRefListAuthorsNames(ref: Reference): string {
  let authorNames = getRefContributorName(ref.authors[0]);
  if (ref.authors.length === 2) {
    authorNames += ` and ${getRefContributorName(ref.authors[1])}`;
  } else if (ref.authors.length > 2) {
    authorNames += ' et al.';
  }
  return authorNames;
}

export function getRefNodeText(ref: Reference): string {
  return [getRefListAuthorsNames(ref), get(ref.referenceInfo, 'year')].filter(Boolean).join(', ');
}

export function sortReferencesList(refs: Reference[]): void {
  refs.sort((ref1, ref2) => {
    const ref1LastNames = getAuthorLastNamesForSorting(ref1);
    const ref2LastNames = getAuthorLastNamesForSorting(ref2);

    if (ref1LastNames < ref2LastNames) {
      return -1;
    } else if (ref1LastNames > ref2LastNames) {
      return 1;
    } else if (get(ref1, 'referenceInfo.year', '') < get(ref2, 'referenceInfo.year', '')) {
      return -1;
    }
    return 1;
  });
}

function getAuthorLastNamesForSorting(ref: Reference): string {
  return ref.authors.length > 0
    ? ref.authors
        .map((refAuthor) => {
          return get(refAuthor, 'groupName', get(refAuthor, 'lastName'));
        })
        .join('')
    : '';
}
