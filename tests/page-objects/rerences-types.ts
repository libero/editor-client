export type Names = {
  lastName: string;
  firstName: string;
}[];

export type CommonReferenceProperties = {
  type: string;
  names: Names;
  doi?: string;
}

export type JournalReference = CommonReferenceProperties & {
  type: 'Journal Article';
  year: number;
  articleTitle: string;
  journalTitle: string;
  volume: string;
  firstPage: number;
  lastPage: number;
  eLocationId: string;
  pmid: string;
  inPress: boolean;
};

export type BookReference = CommonReferenceProperties & {
  type: 'Book';
  year: number;
  chapterTitle: string;
  editorNames: Names;
  bookTitle: string;
  edition: string;
  volume: string;
  firstPage: number;
  lastPage: number;
  eLocationId: string;
  publisherLocation: string;
  publisherName: string;
  pmid: string;
  inPress: boolean;
};

export type DataReference = CommonReferenceProperties & {
  type: 'Data';
  year: number;
  dataTitle: string;
  databaseName: string;
  version: string;
  accession: string;
  url: string;
  generatedOrAnalyzed: 'Generated' | 'Analyzed';
};

export type SoftwareReference = CommonReferenceProperties & {
  type: 'Software';
  year: number;
  title: string;
  source: string;
  publisherLocation: string;
  publisherName: string;
  version: string;
  url: string;
};

export type PreprintReference = CommonReferenceProperties & {
  type: 'Preprint';
  year: number;
  articleTitle: string;
  preprintServer: string;
  pmid: string;
  url: string;
};

export type WebArticleReference = CommonReferenceProperties & {
  type: 'Web Article';
  year: number;
  title: string;
  website: string;
  url: string;
  accessedDate: Date;
};

export type ConferenceProceedingsReference = CommonReferenceProperties & {
  type: 'Conference proceedings';
  year: number;
  articleTitle: string;
  conferenceName: string;
  conferenceLocation: string;
  conferenceDate: Date;
  volume: string;
  firstPage: number;
  lastPage: number;
  eLocationId: string;
  url: string;
};

export type ReportReference = CommonReferenceProperties & {
  type: 'Report';
  year: number;
  title: string;
  volume: string;
  publisherLocation: string;
  publisherName: string;
  pmid: string;
  isbn: string;
  url: string;
};

export type ThesisReference = CommonReferenceProperties & {
  type: 'Thesis';
  year: number;
  title: string;
  publisherLocation: string;
  publisherName: string;
  pmid: string;
  url: string;
};

export type PatentReference = CommonReferenceProperties & {
  type: 'Patent';
  year: number;
  title: string;
  source: string;
  publisherName: string;
  patentNumber: string;
  url: string;
};

export type PeriodicalArticleReference = Omit<CommonReferenceProperties, 'doi'> & {
  type: 'Periodical Article';
  publicationDate: Date;
  articleTitle: string;
  periodicalTitle: string;
  volume: string;
  firstPage: number;
  lastPage: number;
  url: string;
};

export type Reference = JournalReference |
  BookReference |
  DataReference |
  SoftwareReference |
  PreprintReference |
  WebArticleReference |
  ConferenceProceedingsReference |
  ReportReference |
  ThesisReference |
  PatentReference |
  PeriodicalArticleReference;