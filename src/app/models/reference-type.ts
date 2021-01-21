import { EditorState } from 'prosemirror-state';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';

import { ReferenceContributor } from 'app/models/reference';
import { getTextContentFromPath, makeSchemaFromConfig } from 'app/models/utils';
import * as referenceInfoConfig from 'app/models/config/reference-info.config';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { buildInputRules } from 'app/models/plugins/input-rules';
import { JSONObject } from 'app/types/utility.types';

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
  articleTitle: EditorState;
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

export function deserializeReferenceAnnotatedValue(json: JSONObject): EditorState {
  const schema = makeSchemaFromConfig(
    referenceInfoConfig.topNode,
    referenceInfoConfig.nodes,
    referenceInfoConfig.marks
  );

  return EditorState.fromJSON(
    {
      schema,
      plugins: [buildInputRules(), gapCursor(), dropCursor()]
    },
    json
  );
}

export function createJournalReferenceFromXml(referenceXml: Element): JournalReference {
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

export function createJournalReferenceFromJson(json: JSONObject): JournalReference {
  return {
    articleTitle: deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject),
    doi: json.doi as string,
    elocationId: json.elocationId as string,
    firstPage: json.firstPage as string,
    inPress: json.inPress as boolean,
    lastPage: json.lastPage as string,
    pmid: json.pmid as string,
    source: deserializeReferenceAnnotatedValue(json.source as JSONObject),
    volume: json.volume as string,
    year: json.year as string
  };
}

export function createNewJournalReference(): JournalReference {
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

export function createPatentReference(referenceXml: Element): PatentReference {
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

export function createPatentReferenceFromJson(json: JSONObject): PatentReference {
  return {
    articleTitle: deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject),
    doi: json.doi as string,
    extLink: json.extLink as string,
    patent: json.patent as string,
    publisherName: json.publisherName as string,
    source: deserializeReferenceAnnotatedValue(json.source as JSONObject),
    year: json.year as string
  };
}

export function createNewPatentReference(): PatentReference {
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

export function createPeriodicalReference(referenceXml: Element): PeriodicalReference {
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

export function createPeriodicalReferenceFromJson(json: JSONObject): PeriodicalReference {
  return {
    articleTitle: deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject),
    date: json.date as string,
    firstPage: json.firstPage as string,
    lastPage: json.lastPage as string,
    volume: json.volume as string,
    extLink: json.extLink as string,
    source: deserializeReferenceAnnotatedValue(json.source as JSONObject)
  };
}

export function createNewPeriodicalReference(): PeriodicalReference {
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

export function createReportReference(referenceXml: Element): ReportReference {
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

export function createReportReferenceFromJson(json: JSONObject): ReportReference {
  return {
    doi: json.doi as string,
    extLink: json.extLink as string,
    publisherName: json.publisherName as string,
    publisherLocation: json.publisherLocation as string,
    isbn: json.isbn as string,
    pmid: json.pmid as string,
    volume: json.volume as string,
    source: deserializeReferenceAnnotatedValue(json.source as JSONObject),
    year: json.year as string
  };
}

export function createNewReportReference(): ReportReference {
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

export function createSoftwareReference(referenceXml: Element): SoftwareReference {
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    version: getTextContentFromPath(referenceXml, 'version') || '',
    publisherLocation: getTextContentFromPath(referenceXml, 'publisher-loc') || '',
    publisherName: getTextContentFromPath(referenceXml, 'publisher-name') || '',
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || ''
  };
}

export function createSoftwareReferenceFromJson(json: JSONObject): SoftwareReference {
  return {
    articleTitle: deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject),
    doi: json.doi as string,
    extLink: json.extLink as string,
    publisherLocation: json.publisherLocation as string,
    publisherName: json.publisherName as string,
    source: deserializeReferenceAnnotatedValue(json.source as JSONObject),
    version: json.version as string,
    year: json.year as string
  };
}

export function createNewSoftwareReference(): SoftwareReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    doi: '',
    extLink: '',
    publisherLocation: '',
    publisherName: '',
    source: createReferenceAnnotatedValue(),
    version: '',
    year: ''
  };
}

export function createThesisReference(referenceXml: Element): ThesisReference {
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

export function createThesisReferenceFromJson(json: JSONObject): ThesisReference {
  return {
    articleTitle: deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject),
    doi: json.doi as string,
    extLink: json.extLink as string,
    pmid: json.pmid as string,
    publisherLocation: json.publisherLocation as string,
    publisherName: json.publisherName as string,
    year: json.year as string
  };
}

export function createNewThesisReference(): ThesisReference {
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

export function createWebReference(referenceXml: Element): WebReference {
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || '',
    dateInCitation: referenceXml.querySelector('date-in-citation').getAttribute('iso-8601-date') || ''
  };
}

export function createWebReferenceFromJson(json: JSONObject): WebReference {
  return {
    articleTitle: deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject),
    dateInCitation: json.dateInCitation as string,
    extLink: json.extLink as string,
    source: deserializeReferenceAnnotatedValue(json.source as JSONObject),
    year: json.year as string
  };
}

export function createNewWebReference(): WebReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    dateInCitation: '',
    extLink: '',
    source: createReferenceAnnotatedValue(),
    year: ''
  };
}

export function createConferenceReference(referenceXml: Element): ConferenceReference {
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

export function createConferenceReferenceFromJson(json: JSONObject): ConferenceReference {
  return {
    articleTitle: deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject),
    conferenceDate: json.conferenceDate as string,
    conferenceLocation: json.conferenceLocation as string,
    conferenceName: deserializeReferenceAnnotatedValue(json.conferenceName as JSONObject),
    doi: json.doi as string,
    elocationId: json.elocationId as string,
    extLink: json.extLink as string,
    firstPage: json.firstPage as string,
    lastPage: json.lastPage as string,
    volume: json.volume as string,
    year: json.year as string
  };
}

export function createNewConferenceReference(): ConferenceReference {
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

export function createPrePrintReference(referenceXml: Element): PrePrintReference {
  return {
    year: getTextContentFromPath(referenceXml, 'year'),
    source: createReferenceAnnotatedValue(referenceXml.querySelector('source')),
    articleTitle: createReferenceAnnotatedValue(referenceXml.querySelector('article-title')),
    doi: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="doi"]') || '',
    pmid: getTextContentFromPath(referenceXml, 'pub-id[pub-id-type="pmid"]') || '',
    extLink: getTextContentFromPath(referenceXml, 'ext-link') || ''
  };
}

export function createPrePrintReferenceFromJson(json: JSONObject): PrePrintReference {
  return {
    articleTitle: deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject),
    year: json.year as string,
    doi: json.doi as string,
    extLink: json.extLink as string,
    pmid: json.pmid as string,
    source: deserializeReferenceAnnotatedValue(json.articleTitle as JSONObject)
  };
}

export function createNewPrePrintReference(): PrePrintReference {
  return {
    articleTitle: createReferenceAnnotatedValue(),
    year: '',
    doi: '',
    extLink: '',
    pmid: '',
    source: createReferenceAnnotatedValue()
  };
}

export function createDataReference(referenceXml: Element): DataReference {
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

export function createDataReferenceFromJson(json: JSONObject): DataReference {
  return {
    dataTitle: deserializeReferenceAnnotatedValue(json.dataTitle as JSONObject),
    year: json.year as string,
    doi: json.doi as string,
    extLink: json.extLink as string,
    accessionId: json.accessionId as string,
    specificUse: json.specificUse as string,
    version: json.version as string,
    source: deserializeReferenceAnnotatedValue(json.source as JSONObject)
  };
}

export function createNewDataReference(): DataReference {
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

export function createBookReference(referenceXml: Element): BookReference {
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

export function createBookReferenceFromJson(json: JSONObject): BookReference {
  return {
    chapterTitle: deserializeReferenceAnnotatedValue(json.chapterTitle as JSONObject),
    edition: json.edition as string,
    editors: json.editors as ReferenceContributor[],
    elocationId: json.elocationId as string,
    firstPage: json.firstPage as string,
    inPress: json.inPress as boolean,
    lastPage: json.lastPage as string,
    pmid: json.pmid as string,
    publisherLocation: json.publisherLocation as string,
    publisherName: json.publisherName as string,
    volume: json.volume as string,
    year: json.year as string,
    doi: json.doi as string,
    source: deserializeReferenceAnnotatedValue(json.source as JSONObject)
  };
}

export function createNewBookReference(): BookReference {
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

export function createReferencePersonList(referenceXml: Element, groupType: string): ReferenceContributor[] {
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
