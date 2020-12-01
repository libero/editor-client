import { ReferenceType } from 'app/models/reference';
import formGrid from 'app/styles/form-grid.module.scss';

export interface FormControlConfigType {
  type: string;
  label: string;
  className?: string;
}

export const JOURNAL_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: formGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Article title', className: formGrid.fullWidth },
  source: { type: 'rich-text', label: 'Journal title', className: formGrid.fullWidth },
  volume: { type: 'string', label: 'Volume', className: formGrid.firstCol },
  firstPage: { type: 'string', label: 'First page', className: formGrid.secondCol },
  lastPage: { type: 'string', label: 'Last page', className: formGrid.thirdCol },
  elocationId: { type: 'string', label: 'eLocation ID', className: formGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: formGrid.fullWidth },
  pmid: { type: 'string', label: 'PMID', className: formGrid.fullWidth },
  inPress: { type: 'boolean', label: 'In press', className: formGrid.inPress }
};

export const PERIODICAL_FORM: Record<string, FormControlConfigType> = {
  date: { type: 'date', label: 'Publication date', className: formGrid.dateField },
  articleTitle: { type: 'rich-text', label: 'Article title', className: formGrid.fullWidth },
  source: { type: 'rich-text', label: 'Periodical title', className: formGrid.fullWidth },
  volume: { type: 'string', label: 'Volume', className: formGrid.firstCol },
  firstPage: { type: 'string', label: 'First page', className: formGrid.secondCol },
  lastPage: { type: 'string', label: 'Last page', className: formGrid.thirdCol },
  extLink: { type: 'string', label: 'URL', className: formGrid.fullWidth }
};

export const BOOK_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: formGrid.firstCol },
  chapterTitle: { type: 'rich-text', label: 'Chapter title', className: formGrid.fullWidth },
  editors: { type: 'editors-list', label: '', className: formGrid.fullWidth },
  source: { type: 'rich-text', label: 'Book title', className: formGrid.fullWidth },
  edition: { type: 'string', label: 'Edition', className: formGrid.fullWidth },
  volume: { type: 'string', label: 'Volume', className: formGrid.firstCol },
  firstPage: { type: 'string', label: 'First page', className: formGrid.secondCol },
  lastPage: { type: 'string', label: 'Last page', className: formGrid.thirdCol },
  elocationId: { type: 'string', label: 'eLocation ID', className: formGrid.fullWidth },
  publisherLocation: { type: 'string', label: 'Publisher location', className: formGrid.fullWidth },
  publisherName: { type: 'string', label: 'Publisher name', className: formGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: formGrid.fullWidth },
  pmid: { type: 'string', label: 'PMID', className: formGrid.fullWidth },
  inPress: { type: 'boolean', label: 'In press', className: formGrid.inPress }
};

export const REPORT_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: formGrid.firstCol },
  source: { type: 'rich-text', label: 'Title', className: formGrid.fullWidth },
  volume: { type: 'string', label: 'Volume', className: formGrid.firstCol },
  publisherLocation: { type: 'string', label: 'Publisher location', className: formGrid.fullWidth },
  publisherName: { type: 'string', label: 'Publisher name', className: formGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: formGrid.fullWidth },
  pmid: { type: 'string', label: 'PMID', className: formGrid.fullWidth },
  isbn: { type: 'string', label: 'ISBN', className: formGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: formGrid.fullWidth }
};

export const DATA_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: formGrid.firstCol },
  dataTitle: { type: 'rich-text', label: 'Data title', className: formGrid.fullWidth },
  source: { type: 'rich-text', label: 'Database name', className: formGrid.fullWidth },
  version: { type: 'string', label: 'Version', className: formGrid.halfWidth },
  doi: { type: 'string', label: 'DOI', className: formGrid.fullWidth },
  accessionId: { type: 'string', label: 'Accession', className: formGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: formGrid.fullWidth },
  specificUse: { type: 'specific-use', label: 'Generated/Analyzed', className: formGrid.fullWidth }
};

export const WEB_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: formGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Title', className: formGrid.fullWidth },
  source: { type: 'rich-text', label: 'Website', className: formGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: formGrid.fullWidth },
  dateInCitation: { type: 'date', label: 'Accessed Date', className: formGrid.dateField }
};

export const PREPRINT_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: formGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Article title', className: formGrid.fullWidth },
  source: { type: 'rich-text', label: 'Preprint server', className: formGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: formGrid.fullWidth },
  pmid: { type: 'string', label: 'PMID', className: formGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: formGrid.fullWidth }
};

export const SOFTWARE_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: formGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Title', className: formGrid.fullWidth },
  source: { type: 'rich-text', label: 'Source', className: formGrid.fullWidth },
  publisherLocation: { type: 'string', label: 'Publisher location', className: formGrid.fullWidth },
  publisherName: { type: 'string', label: 'Publisher name', className: formGrid.fullWidth },
  version: { type: 'string', label: 'Version', className: formGrid.halfWidth },
  doi: { type: 'string', label: 'DOI', className: formGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: formGrid.fullWidth }
};

export const CONFPROC_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: formGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Article title', className: formGrid.fullWidth },
  conferenceName: { type: 'rich-text', label: 'Conference name', className: formGrid.fullWidth },
  conferenceLocation: { type: 'string', label: 'Conference location', className: formGrid.fullWidth },
  conferenceDate: { type: 'date', label: 'Conference date', className: formGrid.dateField },
  volume: { type: 'string', label: 'Volume', className: formGrid.firstCol },
  firstPage: { type: 'string', label: 'First page', className: formGrid.secondCol },
  lastPage: { type: 'string', label: 'Last page', className: formGrid.thirdCol },
  elocationId: { type: 'string', label: 'eLocation ID', className: formGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: formGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: formGrid.fullWidth }
};

export const THESIS_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: formGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Title', className: formGrid.fullWidth },
  publisherLocation: { type: 'string', label: 'Publisher location', className: formGrid.fullWidth },
  publisherName: { type: 'string', label: 'Publisher name', className: formGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: formGrid.fullWidth },
  pmid: { type: 'string', label: 'PMID', className: formGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: formGrid.fullWidth }
};

export const PATENT_FORM: Record<string, FormControlConfigType> = {
  year: { type: 'string', label: 'Year', className: formGrid.firstCol },
  articleTitle: { type: 'rich-text', label: 'Title', className: formGrid.fullWidth },
  source: { type: 'rich-text', label: 'Source', className: formGrid.fullWidth },
  publisherName: { type: 'string', label: 'Publisher name', className: formGrid.fullWidth },
  patent: { type: 'string', label: 'Patent number', className: formGrid.fullWidth },
  doi: { type: 'string', label: 'DOI', className: formGrid.fullWidth },
  extLink: { type: 'string', label: 'URL', className: formGrid.fullWidth }
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
