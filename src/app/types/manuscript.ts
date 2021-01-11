import { EditorState, Transaction } from 'prosemirror-state';

import { Person } from 'app/models/person';
import { Affiliation } from 'app/models/affiliation';
import { Reference } from 'app/models/reference';
import { RelatedArticle } from 'app/models/related-article';
import { ArticleInformation } from 'app/models/article-information';

export interface Keyword {
  id: string;
  content: EditorState;
}

export interface KeywordGroup {
  title: string | undefined;
  keywords: Keyword[];
  newKeyword: Keyword;
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

export type ManuscriptDiffValues = Manuscript extends Record<string, infer T>
  ? T extends EditorState
    ? Transaction
    : T extends KeywordGroups
    ? KeywordGroup
    : T extends Array<infer V>
    ? V | Array<V>
    : T
  : never;

export type ManuscriptDiff = {
  [path: string]: ManuscriptDiffValues;
} & {
  _timestamp: number;
};
