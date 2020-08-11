import { ReferenceType } from 'app/models/reference';
import refFormGrid from './ref-form-grid.module.scss';

export interface FormControlConfigType {
  type: string;
  label: string;
  className?: string;
}

export const JOURNAL_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: refFormGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Title', className: refFormGrid.fullWidth },
  source: { type: 'rich-text', label: 'Journal title', className: refFormGrid.fullWidth },
  volume: { type: 'string', label: 'Volume', className: refFormGrid.firstCol },
  firstPage: { type: 'string', label: 'First page', className: refFormGrid.secondCol },
  lastPage: { type: 'string', label: 'Last page', className: refFormGrid.thirdCol },
  elocationId: { type: 'string', label: 'eLocation ID', className: refFormGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: refFormGrid.fullWidth },
  pmid: { type: 'string', label: 'PMID', className: refFormGrid.fullWidth },
  inPress: { type: 'boolean', label: 'In press', className: refFormGrid.inPress }
};

export const PERIODICAL_FORM: Record<string, FormControlConfigType> = {
  date: { type: 'date', label: 'Date', className: refFormGrid.dateField },
  articleTitle: { type: 'rich-text', label: 'Title', className: refFormGrid.fullWidth },
  source: { type: 'rich-text', label: 'Periodical title', className: refFormGrid.fullWidth },
  volume: { type: 'string', label: 'Volume', className: refFormGrid.firstCol },
  firstPage: { type: 'string', label: 'First page', className: refFormGrid.secondCol },
  lastPage: { type: 'string', label: 'Last page', className: refFormGrid.thirdCol },
  extLink: { type: 'string', label: 'URL', className: refFormGrid.fullWidth }
};

export const BOOK_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: refFormGrid.firstCol },
  chapterTitle: { type: 'rich-text', label: 'Chapter title', className: refFormGrid.fullWidth },
  editors: { type: 'editors-list', label: '', className: refFormGrid.fullWidth },
  source: { type: 'rich-text', label: 'Book title', className: refFormGrid.fullWidth },
  edition: { type: 'string', label: 'Edition', className: refFormGrid.fullWidth },
  volume: { type: 'string', label: 'Volume', className: refFormGrid.firstCol },
  firstPage: { type: 'string', label: 'First page', className: refFormGrid.secondCol },
  lastPage: { type: 'string', label: 'Last page', className: refFormGrid.thirdCol },
  elocationId: { type: 'string', label: 'eLocation ID', className: refFormGrid.fullWidth },
  publisherLocation: { type: 'string', label: 'Publisher Location', className: refFormGrid.fullWidth },
  publisherName: { type: 'string', label: 'Publisher Name', className: refFormGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: refFormGrid.fullWidth },
  pmid: { type: 'string', label: 'PMID', className: refFormGrid.fullWidth },
  inPress: { type: 'boolean', label: 'In press', className: refFormGrid.inPress }
};

export const REPORT_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: refFormGrid.firstCol },
  source: { type: 'rich-text', label: 'Title', className: refFormGrid.fullWidth },
  volume: { type: 'string', label: 'Volume', className: refFormGrid.firstCol },
  publisherLocation: { type: 'string', label: 'Publisher Location', className: refFormGrid.fullWidth },
  publisherName: { type: 'string', label: 'Publisher Name', className: refFormGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: refFormGrid.fullWidth },
  pmid: { type: 'string', label: 'PMID', className: refFormGrid.fullWidth },
  isbn: { type: 'string', label: 'ISBN', className: refFormGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: refFormGrid.fullWidth }
};

export const DATA_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: refFormGrid.firstCol },
  dataTitle: { type: 'rich-text', label: 'Data title', className: refFormGrid.fullWidth },
  source: { type: 'rich-text', label: 'Source', className: refFormGrid.fullWidth },
  version: { type: 'string', label: 'Version', className: refFormGrid.halfWidth },
  doi: { type: 'string', label: 'DOI', className: refFormGrid.fullWidth },
  accessionId: { type: 'string', label: 'Accession', className: refFormGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: refFormGrid.fullWidth },
  specificUse: { type: 'specific-use', label: 'Specific Use', className: refFormGrid.fullWidth }
};

export const WEB_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: refFormGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Article title', className: refFormGrid.fullWidth },
  source: { type: 'rich-text', label: 'Source', className: refFormGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: refFormGrid.fullWidth },
  dateInCitation: { type: 'date', label: 'Accessed Date', className: refFormGrid.dateField }
};

export const PREPRINT_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: refFormGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Article title', className: refFormGrid.fullWidth },
  source: { type: 'rich-text', label: 'Journal title', className: refFormGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: refFormGrid.fullWidth },
  pmid: { type: 'string', label: 'PMID', className: refFormGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: refFormGrid.fullWidth }
};

export const SOFTWARE_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: refFormGrid.firstCol },
  dataTitle: { type: 'rich-text', label: 'Title', className: refFormGrid.fullWidth },
  source: { type: 'rich-text', label: 'Source', className: refFormGrid.fullWidth },
  publisherLocation: { type: 'string', label: 'Publisher Location', className: refFormGrid.fullWidth },
  publisherName: { type: 'string', label: 'Publisher Name', className: refFormGrid.fullWidth },
  version: { type: 'string', label: 'Version', className: refFormGrid.halfWidth },
  doi: { type: 'string', label: 'DOI', className: refFormGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: refFormGrid.fullWidth }
};

export const CONFPROC_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: refFormGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Article title', className: refFormGrid.fullWidth },
  conferenceName: { type: 'rich-text', label: 'Conference name', className: refFormGrid.fullWidth },
  conferenceLocation: { type: 'string', label: 'Conference location', className: refFormGrid.fullWidth },
  conferenceDate: { type: 'date', label: 'Conference date', className: refFormGrid.dateField },
  volume: { type: 'string', label: 'Volume', className: refFormGrid.firstCol },
  firstPage: { type: 'string', label: 'First page', className: refFormGrid.secondCol },
  lastPage: { type: 'string', label: 'Last page', className: refFormGrid.thirdCol },
  elocationId: { type: 'string', label: 'eLocation ID', className: refFormGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: refFormGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: refFormGrid.fullWidth }
};

export const THESIS_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: refFormGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Article title', className: refFormGrid.fullWidth },
  publisherLocation: { type: 'string', label: 'Publisher Location', className: refFormGrid.fullWidth },
  publisherName: { type: 'string', label: 'Publisher Name', className: refFormGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: refFormGrid.fullWidth },
  pmid: { type: 'string', label: 'PMID', className: refFormGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: refFormGrid.fullWidth }
};

export const PATENT_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: refFormGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Article title', className: refFormGrid.fullWidth },
  source: { type: 'rich-text', label: 'Source', className: refFormGrid.fullWidth },
  publisherName: { type: 'string', label: 'Publisher Name', className: refFormGrid.fullWidth },
  patent: { type: 'string', label: 'Patent', className: refFormGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: refFormGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: refFormGrid.fullWidth }
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
