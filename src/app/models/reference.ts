import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { v4 as uuidv4 } from 'uuid';

import * as referenceInfoConfig from 'app/models/config/reference-info.config';
import { buildInputRules } from 'app/models/plugins/input-rules';
import { getTextContentFromPath, makeSchemaFromConfig } from 'app/models/utils';

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
  year: number;
  source: EditorState;
  articleTitle: EditorState;
  volume: number;
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
  volume: number;
  firstPage: string;
  lastPage: string;
  extLink: string;
}

export interface BookReference {
  year: number;
  chapterTitle: EditorState;
  edition: string;
  publisherLocation: string;
  publisherName: string;
  source: EditorState;
  volume: number;
  editors: ReferenceContributor[];
  firstPage: string;
  lastPage: string;
  doi: string;
  pmid: string;
  inPress: boolean;
  elocationId: string;
}

export interface ReportReference {
  year: number;
  source: EditorState;
  publisherName: string;
  doi: string;
  extLink: string;
}

export interface PatentReference {
  year: number;
  source: EditorState;
  articleTitle: EditorState;
  publisherName: string;
  doi: string;
  pmid: string;
  patent: string;
  extLink: string;
}

export interface DataReference {
  year: number;
  dataTitle: EditorState;
  source: EditorState;
  doi: string;
  version: string;
  extLink: string;
  accessionId: string;
  accessionUrl: string;
  specificUse: string;
}

export interface WebReference {
  year: number;
  source: EditorState;
  articleTitle: EditorState;
  extLink: string;
  dateInCitation: string;
}

export interface PrePrintReference {
  year: number;
  articleTitle: EditorState;
  source: EditorState;
  extLink: string;
  doi: string;
  pmid: string;
}

export interface ThesisReference {
  year: number;
  articleTitle: EditorState;
  publisherName: string;
  publisherLocation: string;
  extLink: string;
  doi: string;
  pmid: string;
}

export interface SoftwareReference {
  year: number;
  source: EditorState;
  dataTitle: EditorState;
  version: string;
  publisherName: string;
  publisherLocation: string;
  extLink: string;
  doi: string;
  pmid: string;
}

export interface ConferenceReference {
  year: number;
  articleTitle: EditorState;
  conferenceName: EditorState;
  conferenceLocation: string;
  conferenceDate: string;
  volume: number;
  extLink: string;
  elocationId: string;
  doi: string;
  pmid: string;
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
    authors: [{ firstName: '', lastName: '' }],
    referenceInfo: undefined,
    type: undefined
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
    year: parseInt(referenceXml.querySelector('year').textContent),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    pmid: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '',
    elocationId: getTextContentFromPath(referenceXml, 'elocation-id') || '',
    firstPage: getTextContentFromPath(referenceXml, 'fpage'),
    lastPage: getTextContentFromPath(referenceXml, 'lpage'),
    inPress: getTextContentFromPath(referenceXml, 'comment') === 'In press',
    volume: parseInt(getTextContentFromPath(referenceXml, 'volume') || '0')
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
    volume: 0,
    year: 1900
  };
}

function createPatentReference(referenceXml: Element): PatentReference {
  return {
    year: parseInt(referenceXml.querySelector('year').textContent),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    publisherName: getTextContentFromPath(referenceXml, 'publisher-name') || '',
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || '',
    patent: getTextContentFromPath(referenceXml, 'patent') || '',
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    pmid: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || ''
  };
}

function createNewPatentReference(): PatentReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    doi: '',
    extLink: '',
    patent: '',
    publisherName: '',
    pmid: '',
    source: createReferenceAnnotatedValue(),
    year: 1900
  };
}

function createPeriodicalReference(referenceXml: Element): PeriodicalReference {
  const day = getTextContentFromPath(referenceXml, 'string-date > day');
  const month = getTextContentFromPath(referenceXml, 'string-date > month');
  const year = getTextContentFromPath(referenceXml, 'string-date > year');

  return {
    date: `${year}-${month}-${day}`,
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    firstPage: getTextContentFromPath(referenceXml, 'fpage'),
    lastPage: getTextContentFromPath(referenceXml, 'lpage'),
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || '',
    volume: parseInt(getTextContentFromPath(referenceXml, 'volume') || '0')
  };
}

function createNewPeriodicalReference(): PeriodicalReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    date: '',
    firstPage: '',
    lastPage: '',
    volume: 0,
    extLink: '',
    source: createReferenceAnnotatedValue()
  };
}

function createReportReference(referenceXml: Element): ReportReference {
  return {
    year: parseInt(referenceXml.querySelector('year').textContent),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    publisherName: getTextContentFromPath(referenceXml, 'publisher-name') || '',
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || '',
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || ''
  };
}

function createNewReportReference(): ReportReference {
  return {
    doi: '',
    extLink: '',
    publisherName: '',
    source: createReferenceAnnotatedValue(),
    year: 1900
  };
}

function createSoftwareReference(referenceXml: Element): SoftwareReference {
  return {
    year: parseInt(referenceXml.querySelector('year').textContent),
    dataTitle: createReferenceAnnotatedValue(referenceXml.querySelector('data-title')),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    version: getTextContentFromPath(referenceXml, 'version') || '',
    publisherLocation: getTextContentFromPath(referenceXml, 'publisher-loc') || '',
    publisherName: getTextContentFromPath(referenceXml, 'publisher-name') || '',
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    pmid: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '',
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || ''
  };
}

function createNewSoftwareReference(): SoftwareReference {
  return {
    dataTitle: createReferenceAnnotatedValue(),
    doi: '',
    extLink: '',
    pmid: '',
    publisherLocation: '',
    publisherName: '',
    source: createReferenceAnnotatedValue(),
    version: '',
    year: 1900
  };
}

function createThesisReference(referenceXml: Element): ThesisReference {
  return {
    year: parseInt(referenceXml.querySelector('year').textContent),
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
    year: 1900
  };
}

function createWebReference(referenceXml: Element): WebReference {
  return {
    year: parseInt(referenceXml.querySelector('year').textContent),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || '',
    dateInCitation: getTextContentFromPath(referenceXml, 'date-in-citation') || ''
  };
}

function createNewWebReference(): WebReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    dateInCitation: '',
    extLink: '',
    source: createReferenceAnnotatedValue(),
    year: 1900
  };
}

function createConferenceReference(referenceXml: Element): ConferenceReference {
  return {
    year: parseInt(referenceXml.querySelector('year').textContent),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    conferenceName: createReferenceAnnotatedValue(referenceXml.querySelector('conf-name')),
    conferenceLocation: getTextContentFromPath(referenceXml, 'conf-loc') || '',
    conferenceDate: getTextContentFromPath(referenceXml, 'conf-date') || '',
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || '',
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    pmid: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '',
    firstPage: getTextContentFromPath(referenceXml, 'fpage'),
    lastPage: getTextContentFromPath(referenceXml, 'lpage'),
    elocationId: getTextContentFromPath(referenceXml, 'elocation-id') || '',
    volume: parseInt(getTextContentFromPath(referenceXml, 'volume') || '0')
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
    pmid: '',
    volume: 0,
    year: 1900
  };
}

function createPrePrintReference(referenceXml: Element): PrePrintReference {
  return {
    year: parseInt(referenceXml.querySelector('year').textContent),
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
    year: 1900,
    doi: '',
    extLink: '',
    pmid: '',
    source: createReferenceAnnotatedValue()
  };
}

function createDataReference(referenceXml: Element): DataReference {
  const accessionEl = referenceXml.querySelector('pub-id[pub-id-type="accession"]');
  return {
    year: parseInt(referenceXml.querySelector('year').textContent),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    dataTitle: createReferenceAnnotatedValue(referenceXml.querySelector('data-title')),
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    accessionId: accessionEl ? accessionEl.textContent : '',
    accessionUrl: accessionEl ? accessionEl.getAttribute('href') : '',
    extLink:
      getTextContentFromPath(referenceXml, 'ext-link') ||
      (referenceXml.querySelector('pub-id[pub-id-type="accession"]')
        ? referenceXml.querySelector('pub-id[pub-id-type="accession"]').getAttribute('xlink:href')
        : ''),
    version: getTextContentFromPath(referenceXml, 'version') || '',
    specificUse: referenceXml.getAttribute('specific-use')
  };
}

function createNewDataReference(): DataReference {
  return {
    dataTitle: createReferenceAnnotatedValue(),
    year: 1900,
    doi: '',
    extLink: '',
    accessionId: '',
    accessionUrl: '',
    specificUse: '',
    version: '',
    source: createReferenceAnnotatedValue()
  };
}

function createBookReference(referenceXml: Element): BookReference {
  const editors: ReferenceContributor[] = createReferencePersonList(referenceXml, 'editor');
  return {
    year: parseInt(referenceXml.querySelector('year').textContent),
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
    volume: parseInt(getTextContentFromPath(referenceXml, 'volume') || '0')
  };
}

function createNewBookReference(): BookReference {
  return {
    chapterTitle: undefined,
    edition: '',
    editors: [],
    elocationId: '',
    firstPage: '',
    inPress: false,
    lastPage: '',
    pmid: '',
    publisherLocation: '',
    publisherName: '',
    volume: 0,
    year: 1900,
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
    plugins: [buildInputRules(), gapCursor(), dropCursor()]
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
