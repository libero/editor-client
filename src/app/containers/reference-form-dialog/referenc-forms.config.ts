import { ReferenceType } from 'app/models/reference';

export interface FormControlConfigType {
  type: string;
  label: string;
}

export const JOURNAL_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  articleTitle: { type: 'rich-text', label: 'Title' },
  source: { type: 'rich-text', label: 'Journal title' },
  volume: { type: 'number', label: 'Volume' },
  firstPage: { type: 'string', label: 'First page' },
  lastPage: { type: 'string', label: 'Last page' },
  elocationId: { type: 'string', label: 'eLocation ID' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' },
  inPress: { type: 'boolean', label: 'In press' }
};

export const PERIODICAL_FORM: Record<string, FormControlConfigType> = {
  date: { type: 'date', label: 'Date' },
  articleTitle: { type: 'rich-text', label: 'Title' },
  source: { type: 'rich-text', label: 'Periodical title' },
  volume: { type: 'number', label: 'Volume' },
  firstPage: { type: 'string', label: 'First page' },
  lastPage: { type: 'string', label: 'Last page' },
  extLink: { type: 'string', label: 'URL' }
};

export const BOOK_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  chapterTitle: { type: 'rich-text', label: 'Chapter title' },
  source: { type: 'rich-text', label: 'Book title' },
  edition: { type: 'string', label: 'Edition' },
  volume: { type: 'number', label: 'Volume' },
  firstPage: { type: 'string', label: 'First page' },
  lastPage: { type: 'string', label: 'Last page' },
  elocationId: { type: 'string', label: 'eLocation ID' },
  publisherName: { type: 'string', label: 'Publisher Name' },
  publisherLocation: { type: 'string', label: 'Publisher Location' },
  editors: { type: 'editors-list', label: '' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' },
  inPress: { type: 'boolean', label: 'In press' }
};

export const REPORT_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  source: { type: 'rich-text', label: 'Title' },
  publisherName: { type: 'string', label: 'Publisher Name' },
  doi: { type: 'string', label: 'DOI' },
  extLink: { type: 'string', label: 'URL' }
};

export const DATA_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  dataTitle: { type: 'rich-text', label: 'Data title' },
  source: { type: 'rich-text', label: 'Source' },
  version: { type: 'string', label: 'Version' },
  doi: { type: 'string', label: 'DOI' },
  accessionId: { type: 'string', label: 'Accession' },
  accessionUrl: { type: 'string', label: 'Accession URL' },
  extLink: { type: 'string', label: 'URL' },
  specificUse: { type: 'string', label: 'Specific Use' }
};

export const WEB_FORM: Record<string, FormControlConfigType> = {
  dateInCitation: { type: 'date', label: 'Date' },
  year: { type: 'number', label: 'Year' },
  articleTitle: { type: 'rich-text', label: 'Article title' },
  source: { type: 'rich-text', label: 'Source' },
  extLink: { type: 'string', label: 'URL' }
};

export const PREPRINT_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  dateInCitation: { type: 'date', label: 'Date' },
  articleTitle: { type: 'rich-text', label: 'Article title' },
  source: { type: 'rich-text', label: 'Journal title' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' },
  extLink: { type: 'string', label: 'URL' }
};

export const SOFTWARE_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  dataTitle: { type: 'rich-text', label: 'Title' },
  source: { type: 'rich-text', label: 'Source' },
  publisherName: { type: 'string', label: 'Publisher Name' },
  publisherLocation: { type: 'string', label: 'Publisher Location' },
  version: { type: 'string', label: 'Version' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' },
  extLink: { type: 'string', label: 'ext link' }
};

export const CONFPROC_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  articleTitle: { type: 'rich-text', label: 'Article title' },
  conferenceName: { type: 'string', label: 'Conference name' },
  conferenceLocation: { type: 'string', label: 'Conference location' },
  conferenceDate: { type: 'date', label: 'Conference date' },
  volume: { type: 'number', label: 'Volume' },
  firstPage: { type: 'string', label: 'First page' },
  lastPage: { type: 'string', label: 'Last page' },
  elocationId: { type: 'string', label: 'eLocation ID' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' },
  extLink: { type: 'string', label: 'ext link' }
};

export const THESIS_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  articleTitle: { type: 'rich-text', label: 'Article title' },
  publisherName: { type: 'string', label: 'Publisher Name' },
  publisherLocation: { type: 'string', label: 'Publisher Location' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' },
  extLink: { type: 'string', label: 'ext link' }
};

export const PATENT_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'number', label: 'Year' },
  articleTitle: { type: 'rich-text', label: 'Article title' },
  source: { type: 'rich-text', label: 'Source' },
  publisherName: { type: 'string', label: 'Publisher Name' },
  patent: { type: 'string', label: 'Patent' },
  doi: { type: 'string', label: 'DOI' },
  pmid: { type: 'string', label: 'PMID' },
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
