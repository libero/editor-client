import { EditorState, Transaction } from 'prosemirror-state';

import { Person } from './person';
import { Affiliation } from 'app/models/affiliation';
import { Reference } from 'app/models/reference';
import { RelatedArticle } from 'app/models/related-article';
import { ArticleInformation } from 'app/models/article-information';

interface KeywordGroup {
  title: string | undefined;
  keywords: EditorState[];
  newKeyword: EditorState;
}

export interface KeywordGroups {
  [keywordType: string]: KeywordGroup;
}

interface JournalMeta {
  publisherName: string;
  issn: string;
}

export type Manuscript = {
  journalMeta: JournalMeta;
  title: EditorState;
  articleInfo: ArticleInformation;
  authors: Person[];
  affiliations: Affiliation[];
  abstract: EditorState;
  impactStatement: EditorState;
  body: EditorState;
  acknowledgements: EditorState;
  keywordGroups: KeywordGroups;
  references: Reference[];
  relatedArticles: RelatedArticle[];
};

export interface TOCEntry {
  id?: string;
  title: string;
  level: number;
}

export type TableOfContents = Array<TOCEntry>;

type ManuscriptDiffInferedType<T> = T extends Record<string, infer T>
  ? T extends EditorState
    ? Transaction
    : T extends KeywordGroups
    ? KeywordGroup
    : T
  : T;

export type ManuscriptDiffValues = ManuscriptDiffInferedType<Manuscript> | number | string | Person;

export type ManuscriptDiff = {
  [path: string]: ManuscriptDiffValues;
  _timestamp: number;
};
