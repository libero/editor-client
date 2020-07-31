import { ReferenceType } from 'app/models/reference';

interface FormControlConfigType {
  type: string;
  label: string;
}

export const JOURNAL_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  source: { type: 'rich-text', label: 'Source' },
  articleTitle: { type: 'rich-text', label: 'Title' },
  volume: { type: 'number', label: 'Volume' },
  firstPage: { type: 'string', label: 'First page' },
  lastPage: { type: 'string', label: 'Last page' },
  elocationId: { type: 'string', label: 'eLocation ID' },
  inPress: { type: 'boolean', label: 'In press' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' }
};

export const PERIODICAL_FORM: Record<string, FormControlConfigType> = {
  date: { type: 'date', label: 'Date' },
  source: { type: 'rich-text', label: 'Source' },
  articleTitle: { type: 'rich-text', label: 'Title' },
  volume: { type: 'number', label: 'Volume' },
  firstPage: { type: 'string', label: 'First page' },
  lastPage: { type: 'string', label: 'Last page' },
  extLink: { type: 'string', label: 'ext link' }
};

export const BOOK_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  chapterTitle: { type: 'rich-text', label: 'Chapter' },
  edition: { type: 'string', label: 'Edition' },
  publisherLocation: { type: 'string', label: 'Publisher Location' },
  publisherName: { type: 'string', label: 'Publisher Name' },
  source: { type: 'rich-text', label: 'Source' },
  volume: { type: 'number', label: 'Volume' },
  // editors
  firstPage: { type: 'string', label: 'First page' },
  lastPage: { type: 'string', label: 'Last page' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' },
  inPress: { type: 'boolean', label: 'In press' },
  elocationId: { type: 'string', label: 'eLocation ID' }
};

export const REPORT_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  source: { type: 'rich-text', label: 'Source' },
  publisherName: { type: 'string', label: 'Publisher Name' },
  doi: { type: 'string', label: 'DOI' },
  extLink: { type: 'string', label: 'ext link' }
};

export const DATA_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  dataTitle: { type: 'rich-text', label: 'Title' },
  source: { type: 'rich-text', label: 'Source' },
  doi: { type: 'string', label: 'DOI' },
  version: { type: 'string', label: 'Version' },
  extLink: { type: 'string', label: 'ext link' },
  accessionId: { type: 'string', label: 'Accession' },
  accessionUrl: { type: 'string', label: 'Accession URL' },
  specificUse: { type: 'string', label: 'Specific Use' }
};

export const WEB_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  source: { type: 'rich-text', label: 'Source' },
  articleTitle: { type: 'rich-text', label: 'Title' },
  extLink: { type: 'string', label: 'ext link' },
  dateInCitation: { type: 'date', label: 'Date in citation' }
};

export const PREPRINT_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  articleTitle: { type: 'rich-text', label: 'Title' },
  source: { type: 'rich-text', label: 'Source' },
  extLink: { type: 'string', label: 'ext link' },
  dateInCitation: { type: 'date', label: 'Date in citation' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' }
};

export const SOFTWARE_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  source: { type: 'rich-text', label: 'Source' },
  dataTitle: { type: 'rich-text', label: 'Title' },
  version: { type: 'string', label: 'Version' },
  publisherLocation: { type: 'string', label: 'Publisher Location' },
  publisherName: { type: 'string', label: 'Publisher Name' },
  extLink: { type: 'string', label: 'ext link' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' }
};

export const CONFPROC_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  articleTitle: { type: 'rich-text', label: 'Title' },
  conferenceName: { type: 'string', label: 'Conference name' },
  conferenceLocation: { type: 'string', label: 'Conference location' },
  conferenceDate: { type: 'date', label: 'Conference date' },
  volume: { type: 'number', label: 'Volume' },
  extLink: { type: 'string', label: 'ext link' },
  elocationId: { type: 'string', label: 'eLocation ID' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' },
  firstPage: { type: 'string', label: 'First page' },
  lastPage: { type: 'string', label: 'Last page' }
};

export const THESIS_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  articleTitle: { type: 'rich-text', label: 'Title' },
  publisherLocation: { type: 'string', label: 'Publisher Location' },
  publisherName: { type: 'string', label: 'Publisher Name' },
  extLink: { type: 'string', label: 'ext link' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' }
};

export const PATENT_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  source: { type: 'rich-text', label: 'Source' },
  articleTitle: { type: 'rich-text', label: 'Title' },
  publisherName: { type: 'string', label: 'Publisher Name' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' },
  patent: { type: 'string', label: 'Patent' },
  extLink: { type: 'string', label: 'ext link' }
};

export function getFormConfigForType(type: ReferenceType): Record<string, FormControlConfigType> {
  return {
    journal: JOURNAL_FORM,
    periodical: PERIODICAL_FORM,
    book: BOOK_FORM,
    report: REPORT_FORM,
    data: DATA_FORM,
    web: WEB_FORM,
    preprint: PREPRINT_FORM,
    software: SOFTWARE_FORM,
    confproc: CONFPROC_FORM,
    thesis: THESIS_FORM,
    patent: PATENT_FORM
  }[type];
}
