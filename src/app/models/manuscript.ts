import { EditorState, Transaction } from 'prosemirror-state';

import { Person } from './person';
import { Affiliation } from 'app/models/affiliation';
import { Reference } from 'app/models/reference';
import { RelatedArticle } from 'app/models/related-article';
import { ArticleInformation } from 'app/models/article-information';

export interface KeywordGroups {
  [keywordType: string]: {
    title: string | undefined;
    keywords: EditorState[];
    newKeyword: EditorState;
  };
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

export type ManuscriptDiff = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [path: string]: Array<any> | Record<string, any> | Transaction | undefined;
};
